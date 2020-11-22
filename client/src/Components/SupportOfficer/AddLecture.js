import React, {Component} from 'react';
import {Button, Card, Form, Row, Col} from 'react-bootstrap'

class AddLecture extends Component {
  render() {
    return (
      <div>
        <Card>
          <Card.Header>
            <h4>Add New Lecture
            </h4>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col>
                <Form.Group controlId="exampleForm.ControlSelect1">
                <h4>Choose Teacher</h4>
                <Form.Control as="select">
                  <option>Luca</option>
                  <option>Nino</option>
                  <option>Loredana</option>
                  <option>Jinzhuo</option>
                  <option>Daniele</option>
                </Form.Control>
              </Form.Group>
                </Col>
                <Col>
                  <h5>Choose Subject</h5>
                  <Form.Control placeholder="Subject"/>
                </Col>
              </Row>
              <Row/>
              <br/>
              <Row>
                <Col>
                  <h5>Date</h5>
                  <Form.Control placeholder="Date"/>
                </Col>
                <Col>
                  <h5>Modality</h5>
                  <Form.Control placeholder="Modality"/>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col>
                  <h5>Class</h5>
                  <Form.Control placeholder="Email"/>
                </Col>
                <Col>
                  <h5>Capacity</h5>
                  <Form.Control placeholder="Capacity"/>
                </Col>
              </Row>
              <br/>
            </Form>

          </Card.Body>
          <Card.Footer className="text-muted">
            <Button variant="success" size="lg">Save
            </Button>
          </Card.Footer>
        </Card>

      </div>
    );
  }
}

export default AddLecture;