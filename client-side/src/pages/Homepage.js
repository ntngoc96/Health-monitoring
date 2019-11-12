// import React, { useState, Component } from 'react';
// import firebase from "firebase";

// import { Chart } from "../components/Chart/index"; 

// /* Config Firebase Firestore */
// var firebaseConfig = {
//   apiKey: "AIzaSyD_ClIvKIcZxUOG_3mYzBCWjJXKrJ9i9Wc",
//   authDomain: "health-monitoring-db.firebaseapp.com",
//   databaseURL: "https://health-monitoring-db.firebaseio.com",
//   projectId: "health-monitoring-db",
//   storageBucket: "",
//   messagingSenderId: "254660283616",
//   appId: "1:254660283616:web:e61dd99297af51bccd5485"
// };
// const firebaseApp = firebase.initializeApp(firebaseConfig);

// const db = firebaseApp.firestore();

// let date;

// const data = {
//   labels: ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1",],
//   datasets: [
//     {
//       label: 'My First dataset',
//       backgroundColor: 'rgba(255,255,255,0.2)',
//       // backgroundColor: 'rgba(255,99,132,0.2)',
//       borderColor: 'rgba(255,99,132,1)',
//       hoverBackgroundColor: 'rgba(255,99,132,0.4)',
//       hoverBorderColor: 'rgba(255,99,132,1)',
//       data: [71, 75, 77, 75, 72, 77, 71, 70, 76, 79, 80, 75],
//       lineTension: 0,
//       borderWidth: 2,
//     },
//   ]
// }

// const updateChart = (heart_rate) => {
//   date = new Date();
//   let getSeconds = date.getSeconds();

//   if (getSeconds <= 9) getSeconds = "0" + getSeconds;
//   let timeCurrent = `${date.getHours()}:${date.getMinutes()}:${getSeconds}`;



//   let oldLabel = Array.from(data.labels);
//   // let oldValue;
//   if (oldLabel.length >= 12) oldLabel.shift();
//   oldLabel.push(timeCurrent);

//   const datasetsCopy = data.datasets.slice(0);
//   const dataCopy = Array.from(datasetsCopy[0].data.slice(0));
//   if (dataCopy.length >= 12) dataCopy.shift();

//   dataCopy.push(parseInt(heart_rate, 10));
//   datasetsCopy[0].data = dataCopy;
//   data.labels = oldLabel;
//   data.datasets = datasetsCopy;

//   return data;
// }


// class Homepage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       heart_rate: 0,
//       calories: '',
//       meter: '',
//       steps: '',
//       fat_burn: '',
//     }

//   }

//   listenRealtime = () => {

//     db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019').onSnapshot(function (doc) {
//       console.log("Current data: ", doc.data());
//       let { heart_rate,calories,steps,meter,fat_burn } = doc.data();

//       this.setState(() => { return { heart_rate,calories,steps,meter,fat_burn } });
//     }.bind(this));

//   }

//   componentDidMount() {
//     this.listenRealtime();
//   }


//   render() {
//     let { heart_rate,calories,steps,meter,fat_burn } = this.state;
//     return (
//       <div>
//         {heart_rate === 0 && "Loading..."}
//         {/*this.state.heart_rate !== 0 && <Chart data={updateChart(this.state.heart_rate)} name="Grandmother" displayTitle="true" />*/}
//         {heart_rate !== 0 &&
//           <div class="grid-container">
//             <div class="heart-rate-chart">
//               <Chart data={updateChart(heart_rate)} name="Grandmother" displayTitle={false} />
//             </div>
//             <div class="calories">
//               <div className="item-icon">
//                 <i class="fab fa-gripfire"></i>
//               </div>
//               <div className="item-group" >
//                 <div className="item-value">{calories}</div>
//                 <div className="item-label">calories</div>
//               </div>
//             </div>
//             <div class="steps">
//               <div className="item-icon">
//                 <i class="fas fa-walking"></i>
//               </div>
//               <div className="item-group">
//                 <div className="item-value">{steps}</div>
//                 <div className="item-label">steps</div>
//               </div>
//             </div>
//             <div class="fat-burning">
//               <div className="item-icon">
//                 <i class="fas fa-walking"></i>
//               </div>
//               <div className="item-group">
//                 <div className="item-value">{fat_burn}g</div>
//                 <div className="item-label">Fat Burning</div>
//               </div>
//             </div>
//             <div class="meter">
//               <div className="item-icon">
//                 <i class="fas fa-route"></i>
//               </div>
//               <div className="item-group">
//                 <div className="item-value">{meter}</div>
//                 <div className="item-label">meter</div>
//               </div>
//             </div>
//             <div class="excercise">
//               <div className="item-label">Excercise</div>
//               <div className="item-value">No</div>
//             </div>
//           </div>
//         }
//       </div>
//     );
//   }
// }



// export default Homepage;


// // function App() {

//   //   const [heart_rate, setheart_rate] = useState(0);

//   //   function writeData() {
//   //     // Add a new document in collection "cities"
//   //     db.collection("cities").doc("LA").set({
//   //       name: "Los Angeles",
//   //       state: "CA",
//   //       heart_ratery: "USA"
//   //     })
//   //       .then(function () {
//   //         console.log("Document successfully written!");
//   //       })
//   //       .catch(function (error) {
//   //         console.error("Error writing document: ", error);
//   //       });
//   //   }

//   //   function fetchData() {
//   //     db.collection("cities")
//   //       .get()
//   //       .then(querySnapshot => {
//   //         const data = querySnapshot.docs.map(doc => doc.data());
//   //         console.log(data); // array of cities objects
//   //       });
//   //   }

//   //   function listenRealtime(){

//   //     db.collection('users').doc('A0zUndNcLS1FwT6OIRYj').collection('health-monitoring').doc('12-9-2019').onSnapshot(function(doc) {
//   //       // console.log("Current data: ", doc.data());
//   //       setheart_rate(doc.data().heart_rate);
//   //       // return doc.data().heart_rate;
//   //     });


//   //   }
//   //   listenRealtime()
//   //   return (
//   //     <div className="App">
//   //       Hello
//   //       {}
//   //       {heart_rate === 0 && <Chart heart_rate={heart_rate}/>} 
//   //       {heart_rate !== 0 && "Loading..."} 
//   //     </div>
//   //   );
//   // }