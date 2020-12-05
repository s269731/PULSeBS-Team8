import React, {Component} from 'react';
import {
  Row,
  Button
  } from 'react-bootstrap'

import Jumbotron from "../../assets/graduated.png";
import Jumbotron1 from "../../assets/teacher.png";
import Jumbotron2 from "../../assets/education.png";
import Jumbotron3 from "../../assets/language.png";
import Jumbotron4 from "../../assets/classroom.png";
import AddStudent from "./AddStudent";


import { withRouter } from "react-router-dom";


class OfficerPage extends Component {

  constructor(props) {
    super(props);
    this.state={
      routeChange: null
    }
}
  routeAddSt = () => {
    this.setState({
      routeChange: "S",
    })

  };
  routeAddTec = () => {
    this.setState({
      routeChange: "T"
    })

  };
  routeAddLec = () => {
    this.setState({
      routeChange: "L"
    })

  };
  routeAddCor = () => {
    this.setState({
      routeChange: "C"
    })

  };
  routeAddClass = () => {
    this.setState({
      routeChange: "Cl"
    })

  };
  render() {
    if(this.state.routeChange==="S" || this.state.routeChange==="T" ||
    this.state.routeChange==="L" || this.state.routeChange==="C" ||
    this.state.routeChange==="Cl"){ 
    return(
      <>
      <AddStudent routeChange={this.state.routeChange}/>  
      </>
    )
    }
    return (
      <div data-testid="officer-page">
          <Row className="justify-content-md-center below-nav">
                  <h1>
                    Setup System
                  </h1>
                  </Row>
                  <Row className="justify-content-md-center below-nav">
        <Button data-testid="student-upload-button" variant="light"
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

        <Button data-testid="teacher-upload-button" variant="light">
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

        <Button data-testid="lecture-upload-button" variant="light">
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

        <Button data-testid="course-upload-button" variant="light">
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

        <Button data-testid="subject-upload-button" variant="light">
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
            {(this.state.routeChange==="S" || this.state.routeChange==="T" || 
            this.state.routeChange==="L" || this.state.routeChange==="C" ||
            this.state.routeChange==="Cl") &&
            <AddStudent routeChange={this.state.routeChange}/>}

      </div>
    );
  }
}

export default withRouter(OfficerPage);
