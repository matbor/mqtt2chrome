mqtt2chrome
===========

--
Please NOTE this extension isn't maintained anymore, please use at own risk.
--

by @bordignon, and with help from @clawsicus

You can do what you want with the code as long as you provide attribution back to me and don’t hold me liable!

##Overview

This extension connects to a MQTT broker using websockets and displays any received messages using Chrome's built-in notifications function.

Requires chrome "notifications" permission.

Tested on Windows, Linux and OSX.

Currently doesn't support TLS, will except pull requests for it. It does however support username/password, but until I fix it the password is stored in the extenstions localstorage but in an unencrypted format. (ie. it is stored in clear text! You have been warned.)

*Screenshot of what the notification looks like. Observe the notification box in bottom right and also the connection icon near the address bar. The connection icon will change if the connection is lost.*
![notification box](https://raw.github.com/matbor/mqtt2chrome/master/screenshots/message%20recieved.png)


##Installation

**Option-A**

We are now in the 'chrome web store', but check the version as it might be behind. Simply visit the chrome webstore and search for mqtt2chrome [or click here](https://chrome.google.com/webstore/detail/mqtt2chrome/jfcmchhmjkddfoekjbkljcfpdjnpailh)


**Option-B** *(Below is if you are running from the source from github)*

1. Download all the files to a directory.
2. In Chrome, goto Tools -> Extenstions.
3. Tick the 'Developer mode' box, then click 'Load unpacked extension...'
4. Select the directory where you have downloaded the extension.
5. The extension will automatically load and connect using the default settings.
6. The settings page will open allowing you to change them to suit your configuration.
7. Click Save & Close. Note: if you changed the broker, port or subtopic settings you need to click the MQTT2Chrome toolbar to trigger a reconnect.

*Screenshot shows where the options are to install the extension in developer mode.*
![example of install](https://raw.github.com/matbor/mqtt2chrome/master/screenshots/howto%20load.png)


##Usage

This extension expects to receive a specific JSON formatted message payload:

    { "sub": "", "txt": "", "img": "", "url":""}

Where:

  * sub (required) - represents the notification heading used in the notification.
  * txt (required) - represents the text used in the notification. If you put a url in here it can be opened by clicking on the notification box.
  * img (optional) - represents the image filename from within the 'thumbnails/' directory of the extension. For example; alert.png, warning.png, etc. NOTE; it looks like Chrome doesn't let you add your own images anymore into the thumbnails directory if you are using the version from the chrome store (Option-A for install).  If you are running a unpacked version (option-B for install) from github here you wont have that problem.
  * url (optional) - NEW!! this is a url to a webpage. When you click on the notification it will open the URL in a new tab.

Example:

    {"sub": "thanks for trying mqtt2chrome","txt":"Check out more at http://twitter.com/bordignon","img":"alert.png","url":" http://twitter.com/bordignon"}

![message](https://raw.github.com/matbor/mqtt2chrome/master/screenshots/message.png)

##Additional
Check out the following projects that this works well with;
* https://github.com/matbor/twitter2mqtt
* https://github.com/jpmens/mqttwarn  <<< HIGHLY recommend!
* https://github.com/openhab/openhab/
