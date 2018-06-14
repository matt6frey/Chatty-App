import React, { Component } from "react";

class MessageList extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    const messages = this.props.messages;
    const msgFeed = messages.map( function (msg) {
      if(msg.type === 'incomingNotification') {
        return <div key={msg.id} className="message system">
                { msg.content }
              </div>;
      } else {
        return <div key={msg.id} className="message">
                <span className="message-username" style={ { color: msg.color } }>{msg.username}</span>
                <span className="message-content">
                   {msg.content}
                </span>
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

export default MessageList;