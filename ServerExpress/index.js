var express = require('express');
var socket = require('socket.io');
var fs = require('fs');
const admin = require('firebase-admin');

const { exec, spawn } = require('child_process');

let stdFlag = false;

//set MaxListenner
require('events').EventEmitter.defaultMaxListeners = 100;
//path to Folder AppPython, modify before running server
var pathWS = "../AppPython/";

// options for spawn
var defaults = {
  cwd: pathWS,
  env: process.env
};
//get Time
// let current_datetime = new Date();
// let current_minutes = current_datetime.getMinutes().toString();
var age = 69;
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

function createFolder(foldername) {
  let current_datetime = new Date();
  //var current_datetime = new Date()
  var formatted_date = current_datetime.getFullYear() + "_"
    + (current_datetime.getMonth() + 1) + "_"
    + current_datetime.getDate();
  //var current_minutes = current_datetime.getMinutes().toString();
  var pathFolder = __dirname + `/Databases/${foldername}/${formatted_date}`;
  return pathFolder;
  //${JSON.stringify(formatted_date)}HealthData
}

var hearts = {
  "data": [],
  appendData: function (t, mData) {
    return this.data.push({ "time": t, "hearts": mData })
  },
};
var stepsAndCalories = {
  "data": [],
  appendData: function (t, mData) {
    return this.data.push({ "time": t, "stepsAndCalories": mData })
  },
}

io.on("connection", function (socket) {
  console.log("socket.io connected " + socket.id);

  let date = new Date();


  /* Connect to Firestore */
  let healthMonitoring = db.collection('health-monitoring').doc(`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);

  let setWithOptions = healthMonitoring.set({}, { merge: true });
  let docRef = db.collection('health-monitoring').doc(`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);

  // Create Write Stream
  //let wstream = fs.createWriteStream('health-monitoring.txt', {flags: "a"});
  // Listen heart rate data from Python Application
  socket.on("heart_rate", function (data) {
    console.log(`heart rate`,data);

    let current_datetime = new Date();
    let current_hours = current_datetime.getHours().toString();
    let current_minutes = current_datetime.getMinutes().toString();
    let current_seconds = current_datetime.getSeconds().toString();
    if (parseInt(current_seconds) < 10) {
      current_seconds = "0" + current_seconds
    }
    let receivedTime = current_hours + ":" + current_minutes + ":" + current_seconds;
    //chunkData.push(data)
    //sconsole.log("Received heart_rate", data);
    //hearts.appendData(chunkData.shift())
    hearts.appendData(receivedTime, data)
    let savedData = JSON.stringify(hearts, null, "\t")
    var pathToHeartsDatabases = createFolder("Hearts");
    //console.log("Write Received heart_rate to File: ", savedData)
    if (fs.existsSync(pathToHeartsDatabases)) {
      fs.writeFile(`${pathToHeartsDatabases}/${current_hours}h.json`, savedData, (err) => {
        if (err) throw err;
        //console.log("written Heart")
      })
    } else {
      fs.mkdir(pathToHeartsDatabases, { recursive: true }, (err) => {
        if (err) throw err;
        //console.log("Created Hearts Folder")
        fs.writeFile(`${pathToHeartsDatabases}/${current_hours}h.json`, savedData, (err) => {
          if (err) throw err;
          //console.log("written Heart")
        })
      });
    }
    if(age>18 && age<36){
      if(Math.abs(data.heart - 72) >=15 ){
        data.alertLED =1;
      }else if(Math.abs(data.heart - 72) >=20){
        data.alertLED = 2;
      }else{
        data.alertLED = 0;
      }
    }else if(age>35 && age<56){
      if(Math.abs(data.heart - 74) >=15 ){
        data.alertLED =1;
      }else if(Math.abs(data.heart - 74) >=20){
        data.alertLED = 2;
      }else{
        data.alertLED = 0;
      }
    }
    else if(age>55 && age<100){
      if(Math.abs(data.heart - 69) >=15 ){
        data.alertLED =1;
      }else if(Math.abs(data.heart - 69) >=20){
        data.alertLED = 2;
      }else{
        data.alertLED = 0;
      }
    }
    // Update data
    docRef.update(data);
    // Send to ESP8266
    io.sockets.emit("heart_rate", data);
  })

  // Listen steps - calories - fatburn - meter from Python Application
  socket.on("steps", function (data) {
    let current_datetime = new Date();
    let current_hours = current_datetime.getHours().toString();
    let current_minutes = current_datetime.getMinutes().toString();
    let current_seconds = current_datetime.getSeconds().toString();
    if (parseInt(current_seconds) < 10) {
      current_seconds = "0" + current_seconds
    }
    let receivedTime = current_hours + ":" + current_minutes + ":" + current_seconds;
    console.log("Received steps and ...");
    stepsAndCalories.appendData(receivedTime, data)
    let savedData = JSON.stringify(stepsAndCalories, null, "\t");
    let pathToStepsDatabases = createFolder("StepsAndCalories");
    //console.log("Write Received Steps to File: ", savedData)


    if (fs.existsSync(pathToStepsDatabases)) {
      fs.writeFile(`${pathToStepsDatabases}/${current_hours}h.json`, savedData, (err) => {
        if (err) throw err;
        console.log("written Steps")
      })
    } else {
      fs.mkdir(pathToStepsDatabases, { recursive: true }, (err) => {
        if (err) throw err;
        //console.log("Created Steps Folder")
        fs.writeFile(`${pathToStepsDatabases}/${current_hours}h.json`, savedData, (err) => {
          if (err) throw err;
          console.log("written Steps")
        })
      });
    }
    //console.log(data);
    docRef.update(data);
  })
  socket.on("battery", function (data) {
    console.log("battery information: ", data);
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

app.get('/live', (req, res) => {

  try {
    // command 
    let mac = req.query.mac;
    const example = spawn('python3', ['example.py', `-m ${mac}`, '-l'], defaults);
    console.log("running...");
    example.stdout.on('data', (data) => {
      // console.log(`stdout: ${data}`);
      returnData = 
      console.log(data);
    });

    example.stderr.on('data', (data) => {
      //console.error(`string_decoder.StringDecoder(encoding);: ${data}`);

    });

    example.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    res.status(200).json({ msg: "Start server successfully" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }

})

//ex: localhost:8080/live?mac=FD:B6:72:9B:46:3C

// stop send data to client 
app.get('/stop', (req, res) => {
  try {
    let mac = req.query.mac;
    exec(`kill -9 $(ps aux | pgrep -f "python3 example.py -m ${mac} -l")`);
    res.status(200).json({ msg: "Stop device successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//ex: localhost:8080/stop?mac=FD:B6:72:9B:46:3C

app.get('/api/data/hearts', (req, res) => {
  try {
    const { day, month, year,hour } = req.query;
    fs.readFile(__dirname + `/Databases/Hearts/${year}_${month}_${day}/${hour}`, 'utf-8', (err, data) => {
      if (err) {
        console.log(err);

      }
      objData = JSON.parse(data);
      res.status(200).json(objData.data)
    });
  } catch (error) {
    console.log(error);

    res.status(500).json(error)
  }
})


app.get('/api/data/steps', (req, res) => {
  let date = req.query.date;
  let hour = req.query.hour;
  fs.readFile(__dirname + `/Databases/StepsAndCalories/${date}/${hour}h.json`, 'utf-8', (err, data) => {
    if (err) throw err;
    objData = JSON.parse(data);
    console.log(objData.data);
  });
})

app.get('/api/data/getFiles', (req, res) => {
  const { day, month, year, type } = req.query;
  
  fs.readdir(__dirname + `/Databases/${type}/${year}_${month}_${day}`, function (err, filenames) {
    if (err) {
      console.log(err);

      res.status(400).json(err)
    }
    res.status(200).json(filenames)
  });
})

