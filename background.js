/*
  by @bordignon
  October 2013
  You can do what you want with the code as long as you provide attribution
  back to me and don't hold me liable.

  This Chrome extension will connect to a MQTT broker using websockets and
  then subscribe to a topic. When a message is received it will be displayed
  using Chrome's built-in notifications function.

  This extension expects to receive a specific JSON payload formatted as
  follows:
      { "sub": "", "txt": "", "img": ""}
  Where:
      'sub' represents the notification heading used in the notification.
      'txt' represents the text used in the notification.
      'img' represents the image filename from within the thumbnails directory.
      For example; alert.png, warning.png, etc.

  This extension requires "notifications" permission.

  Changelog:
  v4 -- Jan 2014 -- upgraded to newer chrome notifications, removed webkit
  support.

  Todo:
   * fix the notification history so you can open older messages with URL's,
     currently will only open current messages
*/

// This variable is used when generating unique notification identifiers.
var notificationId = 0;

if (window.localStorage == null) {
  alert("LocalStorage must be enabled to store MQTT2Chrome options.");
  return;
}

/*
Conditionally initialize the options to reasonable defaults and
open the options in a new tab for the user to configure appropriately.
*/
if (!localStorage.isInitialized)
{
  // Initialize extension options to sane default values.
  localStorage.broker = "test.mosquitto.org";       // broker websocket address
  localStorage.port = "80";                         // broker websocket port
  localStorage.username = "";                       // broker username, leave blank for none
  localStorage.password = "";                       // broker password, leave blank for none  
  localStorage.subtopic = "/mqtt2chrome/messages";  // subtopic to subscribe to
  localStorage.reconnectTimeout = "10";             // Reconnect to broker after this many seconds
  localStorage.clearNotifications = true;           // Enable automatic clearing of notifications
  localStorage.notificationTimeout = "1800";          // Automatically clear notifications after this many seconds
  localStorage.isInitialized = true;                // Only initialise once

  chrome.tabs.create({url: chrome.extension.getURL('options.html')});
}


//connect to the broker function
function connect()
{
  console.log("Connecting to `" + localStorage.broker + "` on port `" + localStorage.port + "`");
  var clientId = "myclientid_" + parseInt(Math.random() * 100, 10);

  client = new Messaging.Client(localStorage.broker,
                                parseInt(localStorage.port),
                                clientId);
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect({
    userName:localStorage.username,
    password:localStorage.password,
    onSuccess:onConnect,
  });
}

// Clear the popupNotification
function clearNotification(notificationId)
{
  chrome.notifications.clear(notificationId, clearedCallback);
}

//not sure what to do with this yet!
function createdCallback(n_id) {
  console.log("Succesfully created " + n_id + " notification");
}

function clearedCallback(wasCleared) {
  console.log("Succesfully cleared notification: " + wasCleared);
}

// create the popupNotification in Chrome
function popupNotification(poptitle, popmessage, popicon)
{
  options = {
    type : "basic",
    title: poptitle,
    message: popmessage,
    iconUrl: popicon,
    priority: 2
  };
  var n_id = "id" + notificationId++;
  chrome.notifications.create(n_id, options, createdCallback);

  if (JSON.parse(localStorage.clearNotifications))
  {
    // discard notification after timeout period
    window.setTimeout(function() {clearNotification(n_id)},
                      parseInt(localStorage.notificationTimeout) * 1000);
  }
}

/*
Once connected to the broker, subscribe to the subtopic.
*/
function onConnect()
{
  console.log("Connected to broker, subscribing for subtopic: " + localStorage.subtopic);
  client.subscribe(localStorage.subtopic);
  chrome.browserAction.setIcon({path:"icon.png"});
  popupNotification("MQTT Broker connected","","icon.png");

  /*
  //uncomment the below if you want to publish to a topic on connect
  message = new Messaging.Message("Hello");
  message.destinationName = "/World";
  client.send(message);
  */
};

/*
If the connection has been lost, display a notification, change icon
and wait `reconnectTimeout` secs before trying to connect again.
*/
function onConnectionLost(responseObject)
{
  if (responseObject.errorCode !== 0)
  {
    console.log("Connection to broker lost:"+responseObject.errorMessage);
    chrome.browserAction.setIcon({path:"icon_noconnection.png"});
    popupNotification("MQTT Broker disconneced","Reason: "+responseObject.errorMessage,"icon_noconnection.png");
    if (localStorage.reconnectTimeout !== 0)
    {
      window.setTimeout(connect, parseInt(localStorage.reconnectTimeout, 10) * 1000); //wait X seconds before trying to connect again.
    }
  }
};

/*
Upon receipt of a message from the broker, display the message
as a Chrome notification.
*/
function onMessageArrived(message) {
  //console.log("New Message has Arrived: "+message.destinationName + " " + message.payloadString);
  try
  {
    var msg = JSON.parse(message.payloadString);
    //console.log(msg.sub);
    //console.log(msg.txt);
    //console.log(msg.img);
    var thumbnail = 'thumbnails/' + msg.img;
    popupNotification(msg.sub,msg.txt,thumbnail);
  }
  catch (e)
  {
    // Invalid JSON format in message, display the message anyway.
    console.log('Invalid JSON message format, displaying message anyway!');
    popupNotification(message.destinationName,message.payloadString,"icon.png");
  }
};

//used for when you click the MQTT extension icon in the menu bar
//it will disconnect the broker and then reconnect
chrome.browserAction.onClicked.addListener(function ()
{
  console.log('MQTT extension icon clicked, disconnect and reconnect to broker in progress');
  try
  {
    client.disconnect();
    chrome.browserAction.setIcon({path:"icon_noconnection.png"});

  }
  catch (e)
  {
    console.log(e);
  };

  // Clicking the button is a explicit user action, so reconnect after only
  // a very short delay. There is no need to wait for the time specified in
  // localStorage.reconnectTimeout as that is intended to be used for normal
  // runtime intermittant connectivity issues.
  window.setTimeout(connect, 2000);
});


//we use this regex to find the http in a message, so we can display it
String.prototype.parseURL = function() {
  return this.match(/\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi, function(url) {
    return url;
  });
};

// this doesn't seem to be working with OLDER notifications, only works with ones that are just recieved
// the idea is if you click on a notification and it has a URL in the message it will open the URL in a
// new tab
function notificationClicked(n_id) {
  console.log("The notification '" + n_id + "' was clicked" );
  console.log('Notification - title :'+options.title + ' |Message: '+options.message +options.notID);
  var newURL = options.message.parseURL([0]);
  var newURLstr = newURL.toString();
  //console.log('parsed results: '+newURL);
  //console.log('converted to string: '+newURLstr);

  console.log(newURLstr.substring(0,4));
  if (newURLstr.substring(0,4) == "http") {//test for http before opening new tab
    console.log('http found, opening url in new tab: '+ newURLstr);
    chrome.tabs.create({ url: newURLstr });
  }
  else{
    console.log('no url to open, ignoring click');
  }
}

window.addEventListener("load", function() {
  chrome.notifications.onClicked.addListener(notificationClicked);
});

//check notification permission is there before we connect to the broker
chrome.notifications.getPermissionLevel(
  function(permissionLevel) {
    console.log('Noification Permission: ' + permissionLevel);
    if (permissionLevel == 'granted')
    {
      connect();
    }
    else if (permissionLevel == 'denied')
    {
      console.log('check your notifications permission level');
    }
  }
);
