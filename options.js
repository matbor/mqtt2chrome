
//var broker = document.getElementById("broker");
//var port = document.getElementById("port");
//var subtopic = document.getElementById("subtopic");
//var reconnect_timeout = document.getElementById("reconnectTimeout");
//var clear_notifications = document.getElementById("clearNotifications");
//var notification_timeout = document.getElementById("notificationTimeout");

// Returns the id of an element
function $(id) {
  return document.getElementById(id);
}

// grays out the timeout selector
// function disableNotifyTimeout(isDisabled) {
//   //var options = document.getElementById("options");
//   document.getElementById("notificationTimeout").style.color = isDisabled ? 'graytext' : 'black'; // The label color.
//   document.getElementById("notificationTimeout").disabled = isDisabled; // control selector.
// }

// Reset options to sane default values.
function resetOptions()
{
  localStorage.broker = "test.mosquitto.org";       // broker websocket address
  localStorage.port = 80;                           // broker websocket port
  localStorage.username = "";                       // broker username, leave blank for none
  localStorage.password = "";                       // broker password, leave blank for none  
  localStorage.subtopic = "/mqtt2chrome/messages";  // topic to subscribe to
  localStorage.reconnectTimeout = 10;               // Clear notifications after this many seconds
  localStorage.clearNotifications = true;           // Enable automatic clearing of notifications
  localStorage.notificationTimeout = 10;            // Clear notifications after this many seconds
}

// Restores options from localStorage.
function restoreOptions()
{
  console.log("Restoring options");
  if (!localStorage.isInitialized)
  {
    resetOptions();
    localStorage.isInitialized = true;
  }

  console.log("retrieving options from local storage");
  document.getElementById("broker").value = localStorage.broker;
  document.getElementById("port").value = localStorage.port;
  document.getElementById("username").value = localStorage.username;
  document.getElementById("password").value = localStorage.password;
  document.getElementById("reconnectTimeout").value = localStorage.reconnectTimeout;
  document.getElementById("subtopic").value = localStorage.subtopic;
  document.getElementById("clearNotifications").checked = JSON.parse(localStorage.clearNotifications);
  document.getElementById("notificationTimeout").value = localStorage.notificationTimeout;

  // if (!document.getElementById("clearNotifications").value)
  // {
  //   disableNotifyTimeout(true);
  // }

  // document.getElementById("clearNotifications").onchange = function() {
  //   disableNotifyTimeout(!document.getElementById("clearNotifications").checked);
  // };

}

// Saves options to localStorage.
function saveOptions()
{
  console.log("saving options");

  localStorage.broker = document.getElementById("broker").value;
  localStorage.port = document.getElementById("port").value;
  localStorage.username = document.getElementById("username").value;
  localStorage.password = document.getElementById("password").value;
  localStorage.reconnectTimeout = document.getElementById("reconnectTimeout").value;
  localStorage.subtopic = document.getElementById("subtopic").value;
  localStorage.clearNotifications = document.getElementById("clearNotifications").checked;
  localStorage.notificationTimeout = document.getElementById("notificationTimeout").value;
}

function saveAndClose()
{
  saveOptions();
  // Now close the tab
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.remove(tab.id);
  });
  //disconenct and re-connect with new settings
}

function init()
{
  console.log("initializing options");
  restoreOptions();
  document.querySelector('#save').addEventListener('click', saveAndClose);
}

document.addEventListener('DOMContentLoaded', init);
