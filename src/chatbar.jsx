import React, {Component} from 'react';


class Chatbar extends Component {
  constructor(props) {
    super(props);
    let currentUser =  props.user;
    this.state = { user: currentUser, addMessage: props.addMessage, Notification: props.Notification };
  }

  render() {
  const addMessage = this.state.addMessage;
  const Notification = this.state.Notification;
  const user = this.props.user;
    return (
      <footer className="chatbar" onKeyUp={ (e) => {
        if (e.key === 'Enter') {
          // get info from Chat Box
          let name = (e.target.className.search('username') != -1) ? e.target.value : e.target.parentNode.children[0].value;
          let msg = (e.target.className.search('message') != -1) ? e.target.value : e.target.parentNode.children[1].value;
          let msgInput = (e.target.className.search('message') != -1) ? e.target : e.target.parentNode.children[1];
          let type = (name === name) ? "incomingMessage" : "incomingNotification";
          addMessage(name, msg);
          msgInput.value = '';
        } } }>
        <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={ this.state.user } onBlur={
          (e) => { Notification(user, e.target.value); } } />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }
}

export default Chatbar;