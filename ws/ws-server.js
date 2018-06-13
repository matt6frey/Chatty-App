const express = require('express');
const WebSockets = require('ws');
const SocketServer = WebSockets.Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.onmessage = (e) => {
    data = JSON.parse(e.data);
    if(data.type === 'incomingMessage') {
      console.log(data.username, ` says "${data.content}"`);
    } else {
      console.log(data.content);
    }
    wss.clients.forEach( (client) => {
      console.log ("DOES CLIENT = WS? ", client === ws);
      if(client !== ws && client.readyState === WebSockets.OPEN) {
        // Show on WebSockets server
        client.send(e.data);
      }
    });


// Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
  };
});

