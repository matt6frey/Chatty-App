import React, { Component } from "react";
import Message from './Message.jsx';

class MessageList extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const messages = this.props.messages;
    return (
      <main className="messages">
          <Message messages={messages} />
      </main>
    );
  }
}

export default MessageList;