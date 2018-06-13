import React, { Component } from "react";
import { render } from "react-dom";
import Nav from './nav.jsx';
import msg from './messagelist.js';
import Chatbar from './chatbar.jsx';

class Main extends Component {
  constructor (props) {
    super(props);
  }

  render() {

    const msgFeed = this.props.messages.map( function (msg) {
      if(msg.type === 'incomingNotification') {
        return <div key={msg.id} className="message system">
                {msg.content}
              </div>;
      } else {
        return <div key={msg.id} className="message">
                <span className="message-username">{msg.username}</span>
                <span className="message-content">{msg.content}</span>
              </div>;
      }
    });


    return (
      <main className="messages">
          {msgFeed}
      </main>
    );
  }
}

class App extends Component {
  constructor (props) {
    super(props);
    this.state = { user: 'Anonymous', messages: [] };
    this.addMessage = this.addMessage.bind(this);
    this.Notification = this.Notification.bind(this);
    this.appendContent = this.appendContent.bind(this);
  }

  addMessage (name, msg, server = false) {
    // Set to anonynous if name is empty
    if(name === '') { name = "Anonymous" }
    // Add message if message isn't empty
    if(msg !== '') {
        const newMessage = {username: name, content: msg, type: "incomingMessage"};
        this.socket.send(JSON.stringify(newMessage));
    } else {
      return false;
    }
  };

  Notification (oldName, newName) {
    // Check for old vs new name or if it's another user notification: show notification.
    if(newName !== oldName) {
    const newMessage = { username: newName, content: `${oldName} changed their name to ${newName}.`, type: "incomingNotification"};
    this.setState({ user: newName });
    this.socket.send(JSON.stringify(newMessage));
    }
  }

  appendContent (data) {
    // append action (notification|message) to messages
    const content = { id:data.id, username: data.username, content: data.content, type: data.type };
    let messages = this.state.messages;
    messages = messages.concat(content);
    this.setState({ messages: messages });

  }

  componentDidMount() {
    // Connect to WS
    const appendContent = this.appendContent;
    this.socket = new WebSocket('ws:localhost:3001/ws', 'protocolOne');
    this.socket.onopen = (e) => {
      console.log('Connected To Chatty server');
    }
    this.socket.addEventListener('message', function (event) {
      let data = JSON.parse(event.data); // Make it usable
      appendContent(data); // Add to messages array.
    });
  }

  render() {
    return (
      <div>
        <Nav />
        <Main messages={ this.state.messages } />
        <Chatbar user={ this.state.user } addMessage={ this.addMessage.bind(this) } Notification={ this.Notification.bind(this) } />
      </div>
    );
  }
}

export default App;