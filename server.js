var net = require('net');

var HOST = '127.0.0.1';
var PORT = 5050;
var dataCounter = 0;

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
http.createServer((req, res) => {
    console.log("New web request " + req.url);
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
}).listen(port, () => {
    console.log(`Web server listening at http://localhost:${port}`)
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })