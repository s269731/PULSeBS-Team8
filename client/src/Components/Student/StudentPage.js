import React, {Component} from 'react';
import {Button, Card, Image} from 'react-bootstrap'
import Jumbotron from "../../assets/courses.png"
import { withRouter } from 'react-router-dom';


class StudentPage extends Component {
  constuctor() {
    this.routeChange = this.routeChange.bind(this);
  }

  routeAllCourses=()=> {
    let path = `/courses`;
    this.props.history.push(path);
  }

  routeRegCourses=()=> {
    let path = `/registeredCourses`;
    this.props.history.push(path);
  }

  render() {
    return (
      <div>
        
        <Card style={{
          width: '20rem',
          float: "left",
          margin: "20px",
        }}>
          <Card.Img variant="top" src={Jumbotron} />
          <Card.Body>
            <Button style={{
          padding: '1rem 1.1rem',
          fontSize: '1.3rem'
        }} onClick={this.routeAllCourses} variant="info">Available Lectures</Button>
          </Card.Body>
        </Card>
        <Card style={{
          width: '20rem',
          float: "left",
          margin: "20px",

        }}>
          <Card.Img variant="top" src={Jumbotron} />
          <Card.Body>
            <Button style={{
          padding: '1rem 1.1rem',
          fontSize: '1.3rem'
        }} onClick={this.routeRegCourses} variant="info">Registered Lectures</Button>
          </Card.Body>
        </Card>

      </div>
    );
  }
}

export default withRouter (StudentPage);