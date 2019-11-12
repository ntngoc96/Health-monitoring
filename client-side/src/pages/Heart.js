import React, { Component } from 'react';
import { Row,Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

export class Heart extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col sm="4"><Form>
            <FormGroup row>
              <Col sm={9}>
                <Input type="text" name="mac" id="mac" placeholder="Input MAC Address" />
              </Col>
              <Col sm={3}><Button>Submit</Button></Col>
            </FormGroup>
          </Form></Col>
        </Row>
      </div>
    );
  }
}

export default Heart;
