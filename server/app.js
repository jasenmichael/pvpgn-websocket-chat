const express = require('express')
const app = require('express')();
const server = require('http').createServer(app);
// const io = require('socket.io')(server);

const users = require('./utils/users')();
const Message = require('./utils/message')();


app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// io.on('connection', socket => {
//   console.log('user connected')
//   console.log('#####')
//   socket.on("createUser", (user, cb) => {
//     console.log('created user', user)
//     console.log('#####')
//     users.addUser({
//       ...user,
//       id: socket.id
//     })
//     cb({
//       id: socket.id
//     })
//   });

//   socket.on("joinRoom", user => {
//     console.log('user joined room', user)
//     socket.join(user.room);
//     io.to(user.room).emit('updateUsers', users.getUsersByRoom(user.room));
//     socket.emit('newMessage', new Message('admin', `Wazzuuh "${user.name}" don't be a pussy..`));
//     socket.broadcast
//       .to(user.room)
//       .emit('newMessage', new Message('admin', `${user.name} connected to chat, make sure to talk shit..`));
//   });

//   socket.on('createMessage', (data, cb) => {
//     console.log('user created message', data)
//     const user = users.getUser(data.id);
//     if (user) {
//       io.to(user.room).emit('newMessage', new Message(user.name, data.text, data.id, data.time))
//     }
//     cb()
//   });

//   socket.on('leftChat', (cb) => {
//     const id = socket.id;
//     const user = users.getUser(id);
//     if (user) {
//       users.removeUser(id);
//       socket.leave(user.room);
//       io.to(user.room).emit('updateUsers', users.getUsersByRoom(user.room));
//       io.to(user.room).emit('newMessage', new Message('admin', `User ${user.name} left chat`))
//     }
//     cb()
//   });

//   socket.on('disconnect', () => {
//     const id = socket.id;
//     const user = users.getUser(id);
//     if (user) {
//       users.removeUser(id);
//       socket.leave(user.room);
//       io.to(user.room).emit('updateUsers', users.getUsersByRoom(user.room));
//       io.to(user.room).emit('newMessage', new Message('admin', `User ${user.name} left chat`))
//     }
//   });
// })

module.exports = {
  app,
  server
}
