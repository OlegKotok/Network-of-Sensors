var net = require('net');

var HOST = '127.0.0.1';
var PORT = 5050;
var dataCounter = 0;
const maxMessageInStoragePerClient = 100;

var dataStorage = new Map();

function AddMessageToStorage(msg)
{
    console.log('New message : {0}', msg);
    
    if (!dataStorage.has(msg.Client)) {
        //create empty client-record if not exist
        let arr = new Array(maxMessageInStoragePerClient);
        var record = {
            ClientId: msg.Client,
            currentIndex: 1,
            messageLimit: maxMessageInStoragePerClient,
            messages: arr
        }
        dataStorage.set(msg.Client, record);
    } else {
        var record = dataStorage.get(msg.Client);
    }

    //start to store data in beginer of buffer, if full
    if (record.currentIndex > record.messageLimit)  record.currentIndex = 0;
    
    //push new data
    record.messages[record.currentIndex] = msg;
    record.currentIndex++;

    //test
    console.log(msg.Client, dataStorage.get(msg.Client).messages.length);
}

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        dataCounter++;
        // Write the data back to the socket, the client will receive it as data from the server
        sock.write('You said "' + data + '"');

        AddMessageToStorage(JSON.parse(data));
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
        console.log('RECIVED DATA: ' + dataCounter);
    });

}).listen(PORT, HOST);

console.log('Sensor server listening on ' + HOST +':'+ PORT);



// Web server
const express = require('express')
var http = require('http')
const app = express()
const port = 3000
// Start the server with http
http.createServer(app, (req, res) => {
    console.log("New web request " + req.url);
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
}).listen(port, () => {
    console.log(`Web server listening at http://localhost:${port}`)
  })

  app.get('/', (req, res) => {
    let json = JSON.stringify([...dataStorage]);
    res.send(json)
  })