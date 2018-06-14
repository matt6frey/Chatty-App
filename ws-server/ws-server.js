const express = require('express');
const WebSockets = require('ws');
const SocketServer = WebSockets.Server;
const uuid = require('uuid');
// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Sends total users online to Clients
function userCounts() {
  let totalUsers = wss.clients.size;
  let action = {total:totalUsers};
  wss.clients.forEach( (client) => {
    // Show Total Users WebSockets server
    client.send(JSON.stringify(action));
  });
}

// Assign a color to each user name.
function chooseColor(pos) {
  const colors = ['darkOrange', 'Thistle', 'DarkSlateBlue', 'orange', 'Plum', 'Purple', 'Violet', 'bloodOrange', 'Orchid', 'Fuchsia', 'Magenta', 'MediumOrchid', 'MediumPurple', 'BlueViolet', 'DarkViolet', 'DarkOrchid', 'DarkMagenta', 'Indigo', 'SlateBlue', 'MediumSlateBlue'];
  if(pos > colors.length) { pos = pos % colors.length; }
  return colors[pos];
}

const onlineUsers = [];
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  userCounts();

  ws.onmessage = (e) => {
    data = JSON.parse(e.data);
    const actionID = uuid(); // ID for notification or post.
    // New Object with all data updating all feeds.
    if(onlineUsers.indexOf(ws) < 0) {
      onlineUsers.push(ws);
      // console.log(onlineUsers);
    }
    const color = chooseColor(onlineUsers.indexOf(ws)); // Keep User name colors consistent
    const action = Object.assign({}, { id: actionID, color: color, username: data.username, content: data.content, type: data.type });
    if(data.type === 'incomingMessage') {
      console.log(data.username, ` says "${data.content}"`);
    } else {
      console.log(data.content);
    }
    wss.clients.forEach( (client) => {
      // Show on WebSockets server
      client.send(JSON.stringify(action));
    });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    userCounts();
  });
  };
});

