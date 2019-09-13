var express = require('express');
var socket = require('socket.io');

const admin = require('firebase-admin');

const port = 8080;
var app = express();
var server = app.listen(port, function () {
  console.log("Node.js server created");
})


let serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

app.use(express.static('front-end'))

var io = socket(server, { pingTimeout: 60000 });

io.on("connection", function (socket) {
  console.log("socket.io connected " + socket.id)
  io.send("Hello from node.js")

  //connect establish
  let docRef = db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019')

  socket.on("something", function (data) {
    console.log("Received something")
    console.log(data)
  })

  socket.on("heart_rate", function (data) {
    console.log("Received heart_rate")
    console.log(data)
    docRef.update(data)
  })

  socket.on("steps", function (data) {
    console.log("Received steps and ...")
    console.log(data)
    docRef.update(data);
  })

  socket.on("message", function (data) {
    console.log("Received message")
    console.log(data)
  })
})

app.get('/', (req, res) => {
  db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019').set({
    heart_rate: '99',
    steps: '50',
    calories: '1000'
  })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });

  res.send('doneee');
})

app.get('/get-data', (req, res) => {
  db.collection('users').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
  res.send("get-data")
})

app.get('/send-data', (req, res) => {
  let docRef = db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019')
  let setAda = docRef.update({
    heart_rate: '99',
    steps: '50',
    calories: '1000'
  });
  res.send("send-data")
})

app.get('/test-realtime', (req, res) => {
  setInterval(() => {
    let heart_rate = Math.ceil(Math.random()*10) + 70
    db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019').update({
      heart_rate: heart_rate,
      steps: '50',
      calories: '1000'
    })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }, 500)

  res.send("real time started")
})

