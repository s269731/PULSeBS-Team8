import React, {Component} from 'react';
import {
  Row,
  Button,
  } from 'react-bootstrap'
import Jumbotron from "../../assets/graduated.png";
import Jumbotron1 from "../../assets/teacher.png";
import Jumbotron2 from "../../assets/education.png";
import Jumbotron3 from "../../assets/language.png";
import Jumbotron4 from "../../assets/classroom.png";

import { withRouter } from "react-router-dom";


class OfficerPage extends Component {
  routeAddSt = () => {
    let path = `/officer/addStudent`;
    this.props.history.push(path);
  };
  routeAddTec = () => {
    let path = `/officer/addTeacher`;
    this.props.history.push(path);
  };
  routeAddLec = () => {
    let path = `/officer/addLecture`;
    this.props.history.push(path);
  };
  routeAddCor = () => {
    let path = `/officer/addCourse`;
    this.props.history.push(path);
  };
  routeAddClass = () => {
    let path = `/officer/addClassroom`;
    this.props.history.push(path);
  };
  render() {
    return (
      <div>
          <Row className="justify-content-md-center below-nav">
                  <h1>
                    Setup System
                  </h1>
                  </Row>
                  <Row className="justify-content-md-center below-nav">
        <Button variant="light"
       >
          <img
            style={{
            height: "10rem",
            float: "left",
            margin: "20px"
          }}
            src={Jumbotron}
            alt="my image"
            onClick={this.routeAddSt}/>
            <h4>Add Student</h4></Button>

        <Button variant="light">
          <img
            style={{
            height: "10rem",
            float: "left",
            margin: "20px"
          }}
            src={Jumbotron1}
            alt="my image"
            onClick={this.routeAddTec}/>
             <h4>Add Teacher</h4></Button>

        <Button variant="light">
          <img
            style={{
            height: "10rem",
            float: "left",
            margin: "20px"
          }}
            src={Jumbotron2}
            alt="my image"
            onClick={this.routeAddLec}/>
             <h4>Add Lecture</h4></Button>

        <Button variant="light">
          <img
            style={{
            height: "10rem",
            float: "left",
            margin: "20px"
          }}
            src={Jumbotron3}
            alt="my image"
            onClick={this.routeAddCor}/>
             <h4>Add Course</h4></Button>

        <Button variant="light">
          <img
            style={{
            height: "10rem",
            float: "left",
            margin: "20px"
          }}
            src={Jumbotron4}
            alt="my image"
            onClick={this.routeAddClass}/>
             <h4>Add Classroom</h4></Button>

            </Row>

      </div>
    );
  }
}

export default withRouter(OfficerPage);
