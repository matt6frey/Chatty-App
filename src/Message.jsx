import React, { Component } from "react";

class Message extends Component {
  constructor (props) {
    super(props);
    this.detectImage = this.detectImage.bind(this);
  }

  detectImage (content) {
    // Url RE
    const RE = /(https|http){0,1}(\:\/\/){1}([\.a-zA-Z0-9]){1,}[\/a-zA-Z0-9?_#&-]{1,}(.){1}(jpeg|jpg|gif|png){1}/g;
    if(String(content).search(RE) !== -1) {
      console.log("Match present");
      const start = content.search(/(https|http){1}/); // Start of URL
      const end = content.search(/(png|gif|jpg|jpeg)/); // End of URL
      const url = content.slice(start, end+4).trim(); // Substring.
      content = content.replace(url, '');
      return [content, url];
    }
    return false;
  }

  render () {
    const messages = this.props.messages;
    const detectImage = this.detectImage;
    const msgFeed = messages.map( function (msg) {
      if(msg.type === 'incomingNotification') {
        // Show notification
        return <div key={msg.id} className="message system">
                { msg.content }
              </div>;
      } else {
        let msgContent = msg.content;
        let hasImage = detectImage(msgContent);
        // Where the magic happens.
        const message = (hasImage !== false) ? (
            <span className="message-content">
               {hasImage[0]}<br/>
               <img src={hasImage[1]} style={ { width: '100%', maxWidth: '60%', marginTop: '10px'} } />
            </span>
          ) : (
            <span className="message-content">
               {msg.content}
            </span>
          );

        return <div key={msg.id} className="message">
                <span className="message-username" style={ { color: msg.color } }>{msg.username}</span>
                {message}
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

export default Message;