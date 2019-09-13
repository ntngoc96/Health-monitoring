import React, { useState, Component } from 'react';
import './App.css';
import firebase from "firebase";

import { Chart } from "./components/Chart/index";

//config firebase
var firebaseConfig = {
  apiKey: "AIzaSyD_ClIvKIcZxUOG_3mYzBCWjJXKrJ9i9Wc",
  authDomain: "health-monitoring-db.firebaseapp.com",
  databaseURL: "https://health-monitoring-db.firebaseio.com",
  projectId: "health-monitoring-db",
  storageBucket: "",
  messagingSenderId: "254660283616",
  appId: "1:254660283616:web:e61dd99297af51bccd5485"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,0.2)',
      // backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65,75,63,69,65,62, 59, 80, 81, 56, 55, 40]
    }
  ]
}

const updateChart = (heart_rate)  => {
    
  let oldLabel = Array.from(data.labels);
  // let oldValue;
  let temp = oldLabel.shift();
  oldLabel.push(temp)

  const datasetsCopy = data.datasets.slice(0);
  const dataCopy = Array.from(datasetsCopy[0].data.slice(0));
  // dataCopy[dataCopy.length-1] = dataCopy[dataCopy.length-1] + 10;
  // oldValue = dataCopy.shift();
  dataCopy.shift();
  dataCopy.push(parseInt(heart_rate, 10));
  datasetsCopy[0].data = dataCopy;

  // this.setState({
  //   data: Object.assign({}, this.state.data, {
  //     labels: oldLabel,
  //     datasets: datasetsCopy
  //   })
  // });

  data.labels = oldLabel;
  data.datasets = datasetsCopy;

  return data;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }

  }
  
  listenRealtime = () => {

    db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019').onSnapshot(function (doc) {
      console.log("Current data: ", doc.data());
      
      this.setState(() => { return { count: doc.data().heart_rate }});
    }.bind(this));

  }

  componentDidMount() {
    this.listenRealtime();
  }
  

    render() {
      
      return (
        <div>hello
          {this.state.count !== 0 && <Chart data={updateChart(this.state.count)} location="Massachusetts"/>}
          {this.state.count === 0 && "Loading..."}
        </div>
      );
    }
  }



  export default App;


// function App() {

  //   const [count, setCount] = useState(0);

  //   function writeData() {
  //     // Add a new document in collection "cities"
  //     db.collection("cities").doc("LA").set({
  //       name: "Los Angeles",
  //       state: "CA",
  //       country: "USA"
  //     })
  //       .then(function () {
  //         console.log("Document successfully written!");
  //       })
  //       .catch(function (error) {
  //         console.error("Error writing document: ", error);
  //       });
  //   }

  //   function fetchData() {
  //     db.collection("cities")
  //       .get()
  //       .then(querySnapshot => {
  //         const data = querySnapshot.docs.map(doc => doc.data());
  //         console.log(data); // array of cities objects
  //       });
  //   }

  //   function listenRealtime(){

  //     db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019').onSnapshot(function(doc) {
  //       // console.log("Current data: ", doc.data());
  //       setCount(doc.data().heart_rate);
  //       // return doc.data().heart_rate;
  //     });


  //   }
  //   listenRealtime()
  //   return (
  //     <div className="App">
  //       Hello
  //       {}
  //       {count === 0 && <Chart heart_rate={count}/>} 
  //       {count !== 0 && "Loading..."} 
  //     </div>
  //   );
  // }