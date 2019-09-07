var express = require('express');
var socket = require('socket.io');

var app = express()
var server = app.listen(3000, function(){
  console.log("Node.js server created");
})

app.use(express.static('front-end'))

var io = socket(server, {pingTimeout: 60000});

io.on("connection", function(socket) {
  console.log("socket.io connected " + socket.id)
  io.send("Hello from node.js")

  socket.on("something", function(data) {
    console.log("Received something")
    console.log(data)
  })
  
  socket.on("message", function(data) {
    console.log("Received message")
    console.log(data)
  })
})

