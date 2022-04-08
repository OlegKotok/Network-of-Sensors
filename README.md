Network of Sensors
================

test task


## Task description

 
Your task is to implement a simulated network of sensors. The network should consist of N sensors that emit/publish data and the main node that listens to them. The sensors should send the data to the main node.
Preferably, the sensors and the main node should be represented as separate processes but using threads only is also acceptable. Remember that if you decide to use threads rather than processes, make sure that the architecture of your system is prepared to be migrated into separate processes.
 
The main node should use a CYCLIC BUFFER whose size should be configurable by the user. After exceeding the size of the buffer, old messages/data should be overwritten by the newest messages/data.
 
The main node should provide an interface that would allow the user to listen to the incoming data. The user should be notified about all the incoming messages/data that were received since the last notification. You can specify the time interval by yourself.
You should demonstrate the usage of the system by providing logs or graphical visualizations.
 
Making the system configurable in the runtime will be a plus.
 
Make sure to focus on the system architecture, using best programming practices such as SOLID, Clean Code, DRY and making the platform open for extensions.
 
Remember to attach the information on how to use your application.
 
All libraries are allowed.

### _Estimation time_

5 hours

## Solution

Microservice architecture.

![Application Architecture](./solution.png?raw=true)

Each client is written in native C++, which allows to run it on a set of embedded sensor devices with limited resources, like Raspberry Pi - the real physical device. Connection to the server via tcp-sockets. The server is realized on NodeJs, which allows good performance for multiple one-time connections, stability, and scalability.

An application available web interface, that would allow the user to get stat of connections and listen to the incoming data. Real-time logs and graphical visualizations can be implemented on Android/iOS or Qt Desktop applications using WebSockets, which allows two-way communication and good performance for real-time applications with low latency. TBD.



