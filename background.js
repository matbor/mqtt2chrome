/*
  by @bordignon
  October 2013
  You can do what you want with the code as long as you provide attribution back to me and don�t hold me liable.
  
  An example of using the MQTT javascript library, websockets and chrome extensions.
  This extension will connect to a MQTT broker using websockets (works perfectly with HiveMQ!!) and then subscribe to a topic. 
  When a message is received it will then display the notification using chrome's built-in notifications function.
  
  If you want to use the JSON payload method, it has to be sent in this format;
      { "sub": "", "txt": "", "img": ""}
      sub = subject
      txt = message body
      img = imagefile location in the thumbnails directory of this extension, example try alert.png

  Requires "notifications" permission.
  Done:
  v4 -- Jan 2014 -- upgraded to newer chrome notifications, removed webkit support
  Todo:
   * fix the notification history so you can open older messages with URL's, currently will only open current messages
   * add the settings to another page, so you don't have to edit this page
*/

// SETTINGS BEGIN HERE
var broker = "test.mosquitto.org"; //broker websocket address
var broker_port = 80; //broker websocket port
<<<<<<< HEAD
var subtopic = "/test/helloworld" //topic to subscribe to

var notifyTimeout = 60 //notification window timeout in seconds
=======
var subtopic = "/mqtt2chrome/messages" //topic to subscribe to
>>>>>>> Updated to v4
//SETTINGS END HERE

var notID = 0;

window.addEventListener("load", function() {
  chrome.notifications.onClicked.addListener(notificationClicked);
});

//connect to the broker function
function connect() {
  console.log("Connect to Broker: "+broker +" Port: "+ broker_port+ " topic: "+subtopic)
  client = new Messaging.Client(broker, broker_port, "myclientid_" + parseInt(Math.random() * 100, 10)); // connect to broker, uses random clientid

  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect({onSuccess:onConnect});
}

//create the popupNotification in Chrome
function popupNotification(poptitle, popmessage, popicon) {
  options = {
    type : "basic",
    title: poptitle,
    message: popmessage,
    iconUrl: popicon,
    priority: 2
      };
  chrome.notifications.create("id"+notID++, options, creationCallback);
}

//subscribe to the topic once we have successfully connected to the broker
function onConnect() {
  console.log("Connected to broker");
  client.subscribe(subtopic);
  chrome.browserAction.setIcon({path:"icon.png"}); //changes the icon for the extension
  popupNotification("MQTT Connected","...waiting for next message...","icon.png");

/*
  //uncomment the below if you want to publish to a topic on connect
  message = new Messaging.Message("Hello"); 
  message.destinationName = "/World";
  client.send(message); 
*/
};

//If the connection has been lost, display notification, change icon and wait 20secs and try again
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0)
<<<<<<< HEAD
    console.log("onConnectionLost:"+responseObject.errorMessage);
    chrome.browserAction.setIcon({path:"icon_noconnection.png"})
    alert("Connection failed, reload plugin to reconnect: " + responseObject.errorMessage);
=======
    console.log("Connection to broker lost:"+responseObject.errorMessage);
    chrome.browserAction.setIcon({path:"icon_noconnection.png"}); //changes the icon for the extension
    
    popupNotification("Connection lost to MQTT server","...retrying...please wait. Reason: "+responseObject.errorMessage,"icon_noconnection.png");

    window.setTimeout(connect,20000); //wait 20seconds before trying to connect again.
};

//we use this regex to find the http in a message, so we can display it
String.prototype.parseURL = function() {
  return this.match(/\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi, function(url) {
    return url;
  });
>>>>>>> Updated to v4
};

//when we recieve a message from the broker, display the message
function onMessageArrived(message) {
<<<<<<< HEAD
  //console.log("onMessageArrived:"+message.destinationName + " " + message.payloadString);
  var havePermission = window.webkitNotifications.checkPermission();
	if (havePermission == 0) {
	// 0 is PERMISSION_ALLOWED
	var notification = window.webkitNotifications.createNotification(
	  'https://si0.twimg.com/profile_images/1512652562/mqtticon-large_bigger.png',
	  'Topic: '+message.destinationName,
	  'Message: '+message.payloadString
	);
	notification.show();
	setTimeout( function() { notification.cancel(); }, notifyTimeout * 1000 ); //notification window timeout
	} else {
	  window.webkitNotifications.requestPermission();
	};
=======
  //console.log("New Message has Arrived: "+message.destinationName + " " + message.payloadString);
  try {
      var myJSON = JSON.parse(message.payloadString);
      //console.log(myJSON.sub); 
      //console.log(myJSON.txt);
      //console.log(myJSON.img);
      
      var thumbnail='thumbnails/'+myJSON.img
      
      popupNotification(myJSON.sub,myJSON.txt,thumbnail);
        
        }
   catch (e) {
        //display the message anyway, just incase it is a message without valid json content
        console.log('not valid json message format, displaying message anyway!');
        popupNotification(message.destinationName,message.payloadString,"icon.png");
        }
>>>>>>> Updated to v4
 
};  

<<<<<<< HEAD
// Test for notification support.
if (window.webkitNotifications) {
  //if support, let's conenct to the broker
  connect();

};

//when you click on the icon on the extension bar it will disconnect/reconnect
chrome.browserAction.onClicked.addListener(function () {
  console.log('we will try to disconnect and reconnect');
  try{
=======
//check notification permission is there before we connect to the broker
chrome.notifications.getPermissionLevel(
  function(permissionLevel) {
    console.log('Noification Permission: '+permissionLevel);
    if (permissionLevel == 'granted') {
      connect();
    }
    else if (permissionLevel == 'denied') {
      console.log('check your notifications permission level')
    }
  });

//used for when you click the MQTT extension icon in the menu bar
//it will disconnect the broker and then reconnect
chrome.browserAction.onClicked.addListener(function () {
  console.log('we will try to disconnect and reconnect');
  try{
        console.log('MQTT externsion icon clicked, disconnect and reconnect to broker in progress')
>>>>>>> Updated to v4
        client.disconnect();
        }
  catch (e) {
        console.log(e);
        };
<<<<<<< HEAD
  connect();
});

=======
  window.setTimeout(connect,20000);
});

//not sure what to do with this yet!
function creationCallback(notID) {
  console.log("Succesfully created " + notID + " notification");
}

// this doesn't seem to be working with OLDER notifications, only works with ones that are just recieved
// the idea is if you click on a notification and it has a URL in the message it will open the URL in a
// new tab
function notificationClicked(notID) {
  console.log("The notification '" + notID + "' was clicked" );
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


>>>>>>> Updated to v4
