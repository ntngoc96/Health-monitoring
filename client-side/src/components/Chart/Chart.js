import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';


class Chart extends Component {


  componentDidMount() {
  }




  render() {
    console.log(this.props.data);

    return (
      <div>
        <Line
          data={this.props.data}
          options={{
            responsive: true,
            title: {
              display: this.props.displayTitle,
              text: 'Heart rate monitoring of ' + this.props.name,
              fontSize: 25
            },
            caretSize: 8,
            legend: {
              display: "this.props.displayLegend",
              position: "this.props.legendPosition"
            },
            scales: {
              yAxes: [{
                stacked: true,
                gridLines: {
                  display: true,
                  color: "rgba(255,99,132,0.2)"
                },
                ticks: {
                  min: 0,
                  max: 150
                }
              }],
              xAxes: [{
                gridLines: {
                  display: true
                }
              }],
            },
            plugins: {
              datalabels: {
                display: true,
                color: function (context) {
                  var index = context.dataIndex;
                  var value = context.dataset.data[index];
                  return value < 74 ? 'red' :  // draw negative values in red
                    value < 77 && value >= 74 ? 'blue' :    // else, alternate values in blue and green
                      value >= 77 && value < 79 ? 'green' : 'black';
                },
                font: {
                  size: 22
                },
                align: "top",
              },
              
            }
          }}
        />
      </div>
    );
  }
}

Chart.propTypes = {

};

export { Chart };

// class Chart extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//         datasets: [
//           {
//             label: 'My First dataset',
//             backgroundColor: 'rgba(255,255,255,0.2)',
//             // backgroundColor: 'rgba(255,99,132,0.2)',
//             borderColor: 'rgba(255,99,132,1)',
//             borderWidth: 1,
//             hoverBackgroundColor: 'rgba(255,99,132,0.4)',
//             hoverBorderColor: 'rgba(255,99,132,1)',
//             data: [65, 59, 80, 81, 56, 55, 40]
//           }
//         ]
//       }
//     }
//   }

//   componentDidMount(){
//   }

//   updateChart = (heart_rate)  => {

//     let oldLabel = Array.from(this.state.data.labels);
//     // let oldValue;
//     let temp = oldLabel.shift();
//     oldLabel.push(temp)

//     const datasetsCopy = this.state.data.datasets.slice(0);
//     const dataCopy = Array.from(datasetsCopy[0].data.slice(0));
//     dataCopy[dataCopy.length-1] = dataCopy[dataCopy.length-1] + 10;
//     // oldValue = dataCopy.shift();
//     dataCopy.shift();
//     dataCopy.push(parseInt(heart_rate, 10));
//     datasetsCopy[0].data = dataCopy;

//     this.setState({
//       data: Object.assign({}, this.state.data, {
//         labels: oldLabel,
//         datasets: datasetsCopy
//       })
//     });
//   }


//   render() {
//     console.log(`rerender`,this.props.heart_rate);
//     // this.updateChart(this.props.heart_rate);

//     return (
//       <div>
//         <Line
//           data={this.state.data}
//           // options={{
//           //   title: {
//           //     display: this.props.displayTitle,
//           //     text: 'Largest Cities In ' + this.props.location,
//           //     fontSize: 25
//           //   },
//           //   legend: {
//           //     display: "this.props.displayLegend",
//           //     position: "this.props.legendPosition"
//           //   }
//           // }}
//         />
//       </div>
//     );
//   }
// }

// Chart.propTypes = {

// };

// export { Chart };