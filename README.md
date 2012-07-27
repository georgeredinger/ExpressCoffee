# Monitor the office coffee pot with express web framework 

### What/How:

* electric coffee pot's current draw is measured with a current transformer
* current transformer turns on a transistor which turns on a reed relay
* reed relay is wired across the right mouse button switch of a wireless mouse
* when coffee pot draws current (<20 seconds) for a short time, it's heating
* when coffee pot has a lot of heating cycles between brews (> 20 cycles?) it's old coffee
* when coffee pot draw current for a long time (>240 seconds) it's brewing
* when coffee pot draws no current for a long time (> 300 seconds) it's off
* wireless mouse's RX dongle pluged into Linux server's usb port in the server room
* express (nodejs) app watches for mouse button down and up clicks 
* configure udev permissions on mouse input devices (/dev/input/event?) so node process has read permissions

### TODO:

* Detect mouse(s) and associate with sensors, possibly with a config file
* Serve the pots status via a http server
* Tweet coffee done (new)
* Tweet coffee old
* Control X10 devices to indicate coffee done and age
* detect pot brew, heating and off states
* use events module such that mouse events are converted to coffee events
  such as brewing, heating, brew done, off, on and are forwared to socket.io listeners. event history should be kept even when there are not listeners and listeners receive recent coffee event history on socket.io connet

### Maybe:

* Cream and sugar vs black? A switch on the fridge door + movement of the pot might indicate cream and/or sugar vs just pot movement. 
* the mouse and relay use batteries, devise a circit to detect and signal low battery


