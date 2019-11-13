import React, { Component } from 'react';
import Axios from 'axios';
import { Row, Col, Button, Form, FormGroup, Input, Label, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
export class Data extends Component {
  constructor() {
    super();

    this.state = {
      day: "",
      month: "",
      year: "",
      type: "",
      files: [],
      fileContent: [],
      model: false
    }
  }

  toggle = () => this.setState((state, props) => {
    return { modal: !state.modal };
  });

  getFileContent = async (filename) => {
    const { day, month, year } = this.state;
    const response = await Axios.get(`/api/data/hearts?day=${day}&month=${month}&year=${year}&hour=${filename}`);
    if (response.status === 200) {
      this.setState((state, props) => {
        return { modal: !state.modal, fileContent: response.data };
      });

    }


  }

  async componentDidMount() {
    try {
      console.log(`hello loc`);

      // let response = await Axios.get('/api/data/hearts');
      // console.log(response);

    } catch (error) {

    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });

  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { day, month, year, type } = this.state;

    const response = await Axios.get(`/api/data/getFiles?day=${day}&month=${month}&year=${year}&type=${type}`);
    console.log(response.data);
    
    if (response.status === 200) {
      this.setState({
        files: response.data
      })
    }

  }

  render() {
    const { day, month, year, files, modal,fileContent } = this.state;
    console.log(fileContent);
    
    return (
      <div>
        <Row>
          <Col sm="12" className="text-center">
            <Form onSubmit={(e) => this.onSubmit(e)}>
              <FormGroup row>
                <Col sm={2}>
                  <Input type="text" name="day" id="day" placeholder="Input Day"
                    onChange={e => this.handleInputChange(e)}
                    value={day} />
                </Col>
                <Col sm={2}>
                  <Input type="text" name="month" id="month" placeholder="Input Month"
                    onChange={e => this.handleInputChange(e)}
                    value={month} />
                </Col>
                <Col sm={2}>
                  <Input type="text" name="year" id="year" placeholder="Input Year"
                    onChange={e => this.handleInputChange(e)}
                    value={year} />
                </Col>
                <Col sm={3}>
                  <FormGroup tag="fieldset">
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="type"
                          onChange={e => this.handleInputChange(e)}
                          value="Hearts" />{' '}
                        hearts
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="type"
                          onChange={e => this.handleInputChange(e)}
                          value="StepsAndCalories" /> steps and others
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </Col>
                <Col sm={3}><Button>Get files data</Button></Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <ListGroup>
              {files.length !== 0 && files.map((value, index) => <ListGroupItem key={index} onClick={(() => this.getFileContent(value))}>{value}</ListGroupItem>)}
            </ListGroup>
          </Col>
        </Row>

        <Modal isOpen={modal} toggle={this.toggle} >
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
            <Table hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Heart rate</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {fileContent.length !== 0 && fileContent.map((value, index) => <tr key={index}>
                  <th scope="row">{index}</th>
                  <td>{value.hearts.heart}</td>
                  <td>{value.time}</td>
                </tr>)}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Data;
