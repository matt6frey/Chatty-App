Chatty App
=====================

This is a real-time messaging APP, much like Skype, Instagram's messenger or Facebook's messenger. The message data is not persistent so when the final user leaves the chat room, all of the messages are lost.

### Run the Demo

1. Fork and Clone this repo.
2. Run `npm init` in the main directory & ws-server directory.
3. Run `npm start` in 1 terminal in the main directory & `npm start` in a separate ws-server.
4. Navigate to `localhost:3000` in 2 separate browsers.
5. Experiment with Change user names and sending messages.

### Screenshots

<div>
<img src="https://github.com/matt6frey/Chatty-App/blob/master/docs/chatty1.png" width="100%" height="auto" style="width: 100%;">
<img src="https://github.com/matt6frey/Chatty-App/blob/master/docs/chatty2.png" width="100%" height="auto"  style="width:100%;">
</div>

### Dependencies

* Express
* React
* React-Dom
* UUID
* WS (WebSockets)

### Future Features

* Users can post image URLs into the message box and the feed will display the image.