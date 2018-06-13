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
    this.state = { user: 'Anonymous', messages: msg };
    this.addMessage = this.addMessage.bind(this);
    this.Notification = this.Notification.bind(this);
  }

  addMessage (name, msg) {
    // Set to anonynous if name is empty
    if(name === '') { name = "Anonymous" }
    // Add message if message isn't empty
    if(msg !== '') {
        const newMessage = {username: name, content: msg, type: "incomingMessage"};
        let messages = this.state.messages;
        messages = messages.concat(newMessage);
        this.setState({messages: messages});
        this.socket.send(JSON.stringify(newMessage));
    } else {
      return false;
    }
  };

  Notification (oldName, newName) {
    // Check for old vs new name, if different: show notification.
    if(newName !== oldName) {
    const newMessage = {username: name, content: `${oldName} changed their name to ${newName}.`, type: "incomingNotification"};
    let messages = this.state.messages;
    this.socket.send(JSON.stringify(newMessage));
    messages = messages.concat(newMessage);
    this.setState({user: newName, messages: messages});

    }
  }

  componentDidMount() {
    // Connect to WS
    this.socket = new WebSocket('ws:localhost:3001/ws', 'protocolOne');
    this.socket.onopen = () => {
      console.log('Connected To Chatty server');
    }
  }


  render() {
    const data = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    };

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