import React, { Component } from 'react';
import Axios from 'axios';
export class Data extends Component {
  async componentDidMount() {
    try {
      console.log(`hello loc`);
      
      let response = await Axios.get('/api/data/hearts');
      console.log(response);
      
    } catch (error) {
      
    }
  }
  
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default Data;
