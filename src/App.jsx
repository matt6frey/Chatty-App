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

    const makeId = () => {
      // Need to keep for new msg's
      const vowels = ['a','e','i','o','u'];
      let i = 0;
      let id = '';
      while (i < 6) {
        id += Math.ceil(Math.random()*9).toString() + vowels[Math.ceil(Math.random()*4)];
        i++;
      }
      return id;
    };

    const msgFeed = this.props.messages.map( function (msg) {
      let id = makeId();
      // Need to reconfigure this.
      if(msg.type === 'incomingNotification') {
        return <div key={id} className="message system">
                {msg.content}
              </div>;
      } else {
        return <div key={id} className="message">
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
  }

  addMessage (name, msg, server = false) {
    // Set to anonynous if name is empty
    if(name === '') { name = "Anonymous" }
    // Add message if message isn't empty
    if(msg !== '') {
        const newMessage = {username: name, content: msg, type: "incomingMessage"};
        let messages = this.state.messages;
        messages = messages.concat(newMessage);
        this.setState({messages: messages});
        if(!server) { this.socket.send(JSON.stringify(newMessage)); }
    } else {
      return false;
    }
  };

  Notification (oldName, newName, server = false, content = '') {
    // Check for old vs new name or if it's another user notification: show notification.
    if(newName !== oldName || server) {
    const newMessage = (!server) ? { username: newName, content: `${oldName} changed their name to ${newName}.`, type: "incomingNotification"} : {username: newName, content: content, type: "incomingNotification"} ;
    let messages = this.state.messages;
    messages = messages.concat(newMessage);
    this.setState({user: newName, messages: messages});
    //Is it local or remote changes?
    if (!server) { this.socket.send(JSON.stringify(newMessage)); }

    }
  }

  componentDidMount() {
    // Connect to WS
    let Notification = this.Notification;
    let addMessage = this.addMessage;
    this.socket = new WebSocket('ws:localhost:3001/ws', 'protocolOne');
    this.socket.onopen = (e) => {
      console.log('Connected To Chatty server');
    }
    this.socket.addEventListener('message', function (event) {
      let data = JSON.parse(event.data);
      if(data.type === "incomingNotification") {
        Notification('',data.username, true, data.content);
      } else {
        addMessage(data.username, data.content, true);
      }

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