mqtt2chrome
===========

by @bordignon
Feb 2014

  You can do what you want with the code as long as you provide attribution back to me and don’t hold me liable!
  
  This is an example of using the MQTT javascript library, websockets and chrome extensions.
  
  This extension will connect to a MQTT broker using websockets and then subscribe to a topic. 
  When a message is received it will then display the notification using chrome's built-in notifications function.
  
  Requires "notifications" permission.

*Screenshot of what the notification looks like.*
*(Note: the messagebox in bottom right and also the connection icon near the address bar, this will change color 
if the connection is lost.)*
![notification box](https://raw.github.com/matbor/mqtt2chrome/master/screenshots/message%20recieved.png)


##Installation;
1. download all the files to a directory.
2. edit the background.js file and change the three variables **broker, broker port and topic**
3. in chrome, goto tools -> extenstions
4. tick the 'developer mode' box, then click 'load unpacked extension'
5. select the directory where you have download and edited the extension
6. it should automatically connect!

*Screenshot shows where the options are to install the extension in developer mode.*
![example of install](https://raw.github.com/matbor/mqtt2chrome/master/screenshots/howto%20load.png)


##Optional;
If you want you can send a JSON formated payload to the topic you are subscribing too, it has to be sent in this format;

    { "sub": "", "txt": "", "img": ""}
    sub = subject
    txt = message body (NOTE: if you can put a web url in here as well!!)
    img = imagefile location in the thumbnails directory of this extension, example try alert.png
      
example message to send to your broker; (clicking on the notification will open the URL in a new tab)

    {"sub": "thanks for trying mqtt2chrome","txt":"Check out more at http://twitter.com/bordignon","img":"alert.png"}

![message](https://raw.github.com/matbor/mqtt2chrome/master/screenshots/message.png)
      
##Todo/fix;
  * fix the notification history so you can open older ones. 
  * add the settings to another page, so you don't have to edit this page