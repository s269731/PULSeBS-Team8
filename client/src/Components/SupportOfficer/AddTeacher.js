import React, { Component } from 'react';
import {Button, Card, Form, Row, Col} from 'react-bootstrap'

class AddTeacher extends Component {
    render() {
        return (
            <div>
                <Card>
          <Card.Header>
              <h4>Add New Teacher </h4></Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col>
                <h5>Teacher Name</h5>
                  <Form.Control placeholder="First name"/>
                </Col>
                <Col>
                <h5>Teacher Surname</h5>
                  <Form.Control placeholder="Last name"/>
                </Col>
              </Row>
              <Row/>
              <br/>
              <Row>
                <Col>
                <h5>Email address</h5>
                  <Form.Control placeholder="Email"/>
                </Col>
                <Col>
                <h5>Password</h5>
                  <Form.Control placeholder="Last name"/>
                </Col>
              </Row>
              <br/>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <h4>Choose Course</h4>
                <Form.Control as="select">
                  <option>Computer Engineering</option>
                  <option>Network</option>
                  <option>Cloud Computing</option>
                  <option>Artificial Intelegence</option>
                  <option>Data Science</option>
                </Form.Control>
              </Form.Group>
            </Form>

          </Card.Body>
          <Card.Footer className="text-muted">
            <Button variant="success" size="lg" >Save     </Button>
          </Card.Footer>
        </Card>

            </div>
        );
    }
}

export default AddTeacher;