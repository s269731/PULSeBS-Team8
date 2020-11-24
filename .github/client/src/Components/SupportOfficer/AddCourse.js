import React, {Component} from 'react';
import {Button, Card, Form, Row, Col} from 'react-bootstrap'

class AddCourse extends Component {
  render() {
    return (
      <div>
        <Card>
          <Card.Header>
            <h4>Add New Course
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
                  <h5>Subject Name</h5>
                  <Form.Control placeholder="Subject name"/>
                </Col>
              </Row>
              <Row/>
              <br/>
              <Col>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <h4>Choose Course</h4>
                    <Form.Control as="select">
                      <option>Computer Engineering</option>
                      <option>Nino</option>
                      <option>Loredana</option>
                      <option>Jinzhuo</option>
                      <option>Daniele</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
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

export default AddCourse;