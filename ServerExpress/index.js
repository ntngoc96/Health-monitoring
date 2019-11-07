var express = require('express');
var socket = require('socket.io');

const admin = require('firebase-admin');

const port = 8080;
var app = express();
var server = app.listen(port, function () {
  console.log(`Node.js server created and listen on port: ${port}`);
})

/* Firebase Firestore Secrect key */
let serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

/* Start Socket on server */
var io = socket(server, { pingTimeout: 60000 });

io.on("connection", function (socket) {
  console.log("socket.io connected " + socket.id)

  /* Connect to Firestore */
  let docRef = db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019')

  // Listen heart rate data from Python Application
  socket.on("heart_rate", function (data) {
    //LED = 0 -> Normal, LED = 1 -> Warning, LED = 2 -> Danger
    let alertLED = 0;
    let { heart_rate } = data;
    if (heart_rate < 40 || heart_rate > 160) {
      alertLED = 2;
    } else if (heart_rate < 60 || heart_rate > 120) {
      alertLED = 1;
    } else {
      alertLED = 0;
    }

    // Update data
    docRef.update(data);
    // Send to ESP8266
    io.sockets.emit("heart_rate", { heart_rate, alertLED });
  })

  // Listen steps - calories - fatburn - meter from Python Application
  socket.on("steps", function (data) {
    docRef.update(data);
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

/* Testing function
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
  let steps = 100;
  let calories = 0;
  let fat_burn = 1;
  let meter = 0;
  setInterval(() => {
    let heart_rate = Math.ceil(Math.random()*50) + 70
    db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019').update({
      heart_rate: heart_rate,
    })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }, 2000)
  setInterval(() => {
    steps += Math.ceil(Math.random()*10);
    meter += Math.ceil(Math.random()*8);
    calories += Math.ceil(Math.random()*15);
    fat_burn += Math.ceil(Math.random());
    db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019').update({
      steps,
      fat_burn,
      calories,
      meter
    })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }, 3000)

  res.send("real time started")
})

*/
