import React, { Component } from 'react';
import { Row, Col } from "reactstrap";
import { NavLink } from "react-router-dom";

export class ControlPanel extends Component {
  render() {
    return (
      <div className="control-page">
        <Row>
          <Col sm="6" className="p-4">
            <NavLink to="/"><i class="fas fa-heartbeat"></i>&nbsp;Heart Rate</NavLink>
          </Col>
          <Col sm="6" className="p-4">
            <NavLink to="/data"><i class="fas fa-database"></i>&nbsp;Data</NavLink>
          </Col>
        </Row>
        <Row>
          <Col sm="6" className="p-4">
            <NavLink to="/steps"><i class="fas fa-walking"></i>&nbsp;Steps</NavLink>
          </Col>
          <Col sm="6" className="p-4">
          <NavLink to="/devices"><i class="fab fa-creative-commons-sampling-plus"></i>&nbsp;My Device</NavLink>
          </Col>
        </Row>
      </div >
    );
  }
}

export default ControlPanel;
