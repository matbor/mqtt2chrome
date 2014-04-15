mqtt2chrome
===========

by @bordignon, Feb 2014 and with help from @clawsicus

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

We are now in the 'chrome web store'. Simply visit the chrome webstore and search for mqtt2chrome


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


##Optional-1

This extension expects to receive a specific JSON formatted message payload:

    { "sub": "", "txt": "", "img": ""}

Where:

  * sub - represents the notification heading used in the notification.
  * txt - represents the text used in the notification. If you put a url in here it can be opened by clicking on the notification box.
  * img - represents the image filename from within the thumbnails directory. For example; alert.png, warning.png, etc.

Example:

    {"sub": "thanks for trying mqtt2chrome","txt":"Check out more at http://twitter.com/bordignon","img":"alert.png"}

![message](https://raw.github.com/matbor/mqtt2chrome/master/screenshots/message.png)

##Optional-2
Check out the following projects that this works well with;
* https://github.com/matbor/twitter2mqtt
* https://github.com/jpmens/mqttwarn  <<< HIGHLY recommend!
* https://github.com/openhab/openhab/
