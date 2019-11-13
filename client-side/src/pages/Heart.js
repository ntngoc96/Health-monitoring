import React, { Component } from 'react';
import { Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';
import Axios from 'axios';
import firebase from "firebase";


import { Chart } from "../components/Chart/index";


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

let date;



export class Heart extends Component {
  constructor() {
    super();
    this.state = {
      mac: "FD:B6:72:9B:46:3C",
      message: ""
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });

  }

  onStopClicked = async () => {
    const { mac } = this.state;
    let response = await Axios.get(`/stop?mac=${mac}`);
    if (response.status === 200) {
      this.setState({
        message: response.data.msg
      })
    } else {
      this.setState({
        message: "Error"
      })
    }

  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { mac } = this.state;
    const response = await Axios.get(`/live?mac=${mac}`);
    if (response.status === 200) {
      this.setState({
        message: response.data.msg
      })
    } else {
      this.setState({
        message: "Error"
      })
    }


  }

  listenRealtime = () => {
    let date = new Date();
    db.collection('health-monitoring').doc(`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`).onSnapshot(function (doc) {
      // console.log("Current data: ", doc.data());
      let { heart, calories, steps, meters, fat_burn } = doc.data();

      this.setState(() => { return { heart, calories, steps, meters, fat_burn } });
    }.bind(this));

  }

  componentDidMount() {
    this.listenRealtime();
  }

  render() {
    const { mac, heart, calories, steps, meters, fat_burn, message } = this.state;
    return (
      <div>
        <Row>
          <Col sm="4" className="text-center">
            <Form onSubmit={(e) => this.onSubmit(e)}>
              <FormGroup row>
                <Col sm={9}>
                  <Input type="text" name="mac" id="mac" placeholder="Input MAC Address"
                    onChange={e => this.handleInputChange(e)}
                    value={mac} />
                </Col>
                <Col sm={3}><Button>Start device</Button></Col>
              </FormGroup>
            </Form>
          </Col>
          <Col>
            <Button onClick={this.onStopClicked}>Stop device</Button>
          </Col>
        </Row>
        <Row><Col>{message === undefined ? "" : message}</Col></Row>
        {/* <Row> */}
        {heart === 0 && "Loading..."}
        {/*this.state.heart !== 0 && <Chart data={updateChart(this.state.heart)} name="Grandmother" displayTitle="true" />*/}
        {heart !== 0 &&
          <div class="grid-container">
            <div class="heart-rate-chart">
              <Chart data={updateChart(heart)} name="Grandmother" displayTitle={false} />
            </div>
            <div class="calories">
              <div className="item-icon">
                <i class="fab fa-gripfire"></i>
              </div>
              <div className="item-group" >
                <div className="item-value">{calories}</div>
                <div className="item-label">calories</div>
              </div>
            </div>
            <div class="steps">
              <div className="item-icon">
                <i class="fas fa-walking"></i>
              </div>
              <div className="item-group">
                <div className="item-value">{steps}</div>
                <div className="item-label">steps</div>
              </div>
            </div>
            <div class="fat-burning">
              <div className="item-icon">
                <i class="fas fa-walking"></i>
              </div>
              <div className="item-group">
                <div className="item-value">{fat_burn}g</div>
                <div className="item-label">Fat Burning</div>
              </div>
            </div>
            <div class="meter">
              <div className="item-icon">
                <i class="fas fa-route"></i>
              </div>
              <div className="item-group">
                <div className="item-value">{meters}</div>
                <div className="item-label">meter</div>
              </div>
            </div>
            <div class="excercise">
              <div className="item-label">Excercise</div>
              <div className="item-value">No</div>
            </div>
          </div>
        }
        {/* </Row> */}
      </div>
    );
  }
}

export default Heart;


const data = {
  labels: ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1",],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,0.2)',
      // backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [71, 75, 77, 75, 72, 77, 71, 70, 76, 79, 80, 75],
      lineTension: 0,
      borderWidth: 2,
    },
  ]
}

const updateChart = (heart) => {
  date = new Date();
  let getSeconds = date.getSeconds();

  if (getSeconds <= 9) getSeconds = "0" + getSeconds;
  let timeCurrent = `${date.getHours()}:${date.getMinutes()}:${getSeconds}`;



  let oldLabel = Array.from(data.labels);
  // let oldValue;
  if (oldLabel.length >= 12) oldLabel.shift();
  oldLabel.push(timeCurrent);

  const datasetsCopy = data.datasets.slice(0);
  const dataCopy = Array.from(datasetsCopy[0].data.slice(0));
  if (dataCopy.length >= 12) dataCopy.shift();

  dataCopy.push(parseInt(heart, 10));
  datasetsCopy[0].data = dataCopy;
  data.labels = oldLabel;
  data.datasets = datasetsCopy;

  return data;
}