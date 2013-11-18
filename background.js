/*
  by @bordignon
  October 2013
  You can do what you want with the code as long as you provide attribution back to me and don�t hold me liable.
  
  An example of using the MQTT javascript library, websockets and chrome extensions.
  This extension will connect to a MQTT broker using websockets and then subscribe to a topic. 
  When a message is received it will then display the notification using chrome's built-in notifications function.
  
  Requires "notifications" permission.
*/

// SETTINGS BEGIN HERE
var broker = "test.mosquitto.org"; //broker websocket address
var broker_port = 80; //broker websocket port
var subtopic = "/test/helloworld" //topic to subscribe to

var notifyTimeout = 60 //notification window timeout in seconds
//SETTINGS END HERE

function connect() {
  client = new Messaging.Client(broker, broker_port, "myclientid_" + parseInt(Math.random() * 100, 10)); // connect to broker, uses random clientid
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect({onSuccess:onConnect});
}

function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe(subtopic);
  chrome.browserAction.setIcon({path:"icon.png"})
  
  //uncomment the below if you want to publish to a topic on connect
  //message = new Messaging.Message("Hello"); 
  //message.destinationName = "/World";
  //client.send(message); 
};

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0)
    console.log("onConnectionLost:"+responseObject.errorMessage);
    chrome.browserAction.setIcon({path:"icon_noconnection.png"})
    alert("Connection failed, reload plugin to reconnect: " + responseObject.errorMessage);
};

function onMessageArrived(message) {
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
 
};	

// Test for notification support.
if (window.webkitNotifications) {
  //if support, let's conenct to the broker
  connect();

};

//when you click on the icon on the extension bar it will disconnect/reconnect
chrome.browserAction.onClicked.addListener(function () {
  console.log('we will try to disconnect and reconnect');
  try{
        client.disconnect();
        }
  catch (e) {
        console.log(e);
        };
  connect();
});

