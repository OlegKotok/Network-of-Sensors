/*********************** device server *********************** */
var net = require('net');

var PORT = 5050;
var dataCounter = 0;
const maxMessageInStoragePerClient = 100;
var currentConnections = 0;

var dataStorage = new Map();

function AddMessageToStorage(msg)
{    
    if (!dataStorage.has(msg.Client)) {
        //create empty client-record if not exist
        let arr = new Array(maxMessageInStoragePerClient);
        var record = {
            ClientId: msg.Client,
            currentIndex: 0,
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
}

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('Sensor CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    currentConnections++;

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        dataCounter++;
        // Write the data back to the socket, the client will receive it as data from the server
        sock.write('You said "' + data + '"');

        try {
            AddMessageToStorage(JSON.parse(data));
        } catch(e) {
            console.log('Incoming data JSON error parsing : ' + data);
        }
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
        console.log('RECIVED DATA: ' + dataCounter);
        currentConnections--;
    });

}).listen(PORT, () => {
    console.log('Device server listening on port ' + PORT);
});
/*********************** device server *********************** */




/*********************** WEB server *********************** */
const express = require('express')
var http = require('http')
const app = express()
const port = 3000
// Start the server with http
http.createServer(app).listen(port, () => {
    console.log(`Web server listening at http://localhost:${port}`)
  })

  /**** main page ****/
  app.get('/', (req, res) => {
    let content = `<H1>Sensor monitor</H1>
<hr>
<h3>Active Connections:     \t${currentConnections}</h3>
<h3>Data Recived:           \t${dataCounter}</h3>
<h3>Clients logged:         \t${dataStorage.size}</h3>
<hr>
<a href="/sensors">view log<a>\n`
    res.send(content);
  })
  /**** main page ****/

  app.get('/sensors', (req, res) => {
    var content = (dataStorage.size === 0)?'List is empty':"";
    for (let sensorName of dataStorage.keys()) {
        content += `  <a href="/sensors/${sensorName}">${sensorName}</a>  `;
    }
    res.send(content);
  })

  app.get('/sensors/:id', (req, res) => {
    if (!dataStorage.has(req.params.id)) {
        res.send("record not found");
    }
    res.send(dataStorage.get(req.params.id).messages);
  })
  /*********************** WEB server *********************** */
