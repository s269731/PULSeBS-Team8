import React, { Component } from "react";
import {Nav, Navbar, Col, Row, Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";
import Jumbotron from "../assets/helpF.png";
import HelpStudentModal from "./Student/HelpStudentModal";
import HelpTeacherModal from "./Teacher/HelpTeacherModal";


//import {Link} from 'react-router-dom'

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.loggedUser)
    return (
      <Navbar variant="dark" bg="primary" className={"Nav"}>
        <Navbar.Brand>
          <Navbar.Text className="headerLinks">
            <Row>
              <Link to="/home">
                <Col>
                  <Row className="justify-content-md-center">
                    <span className="headerLinks">PULSeBS</span>
                  </Row>
                  <Row className="justify-content-md-center">
                    <span className="headerNames">
                      {" "}
                      Pandemic University Lecture Seat Booking System
                    </span>
                  </Row>
                </Col>
              </Link>
            </Row>
          </Navbar.Text>
          {/*this.props.path==="/officer" && <Navbar.Text>&nbsp; - Officer Portal</Navbar.Text>*/}
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end"></Navbar.Collapse>
        <Nav className="ml-md-auto">
          <Navbar.Text>
            {!this.props.loggedUser && this.props.path === "/home" && (
              <Link data-testid="login-link" to="/login" className="headerLinks">
                <span className="headerLinks">Login </span>
              </Link>
            )}
            {this.props.loggedUser && this.props.loggedUser.name && (
              <>

                <span className="headerWelcome">
                  {" "}
                  Welcome, {this.props.loggedUser.name} !
                  <span className={"badge"}>

                    <span className={"badgeText"}>

                      {this.props.loggedUser.role === "S" && <>STUDENT</>}
                      {this.props.loggedUser.role === "D" && <>TEACHER</>}
                      {this.props.loggedUser.role === "M" && <>MANAGER</>}
                      {this.props.loggedUser.role === "O" && <>OFFICER</>}
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-check"
                           viewBox="0 0 16 16">
  <path fill-rule="evenodd"
        d="M8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6 5c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10zm4.854-7.85a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
</svg>
                    </span>{" "}
                  </span>{" "}
                </span>

                {this.props.loggedUser.role === "S" &&
            <HelpStudentModal/>}
             {this.props.loggedUser.role === "D" &&
            <HelpTeacherModal/>}
                <Link
                  to="/home"
                  className="headerLinks "
                  onClick={this.props.logout}
                  data-testid="logout-link"
                >
                  Logout{" "}
                </Link>
              </>
            )}
            {this.props.loggedUser &&
              this.props.path === "/registeredCourses" &&
              this.props.loggedUser.role === "S" && (
                <Link to="/courses" className="headerLinks">
                  <span className="headerLinks">Available Lectures</span>
                </Link>
              )}
            {this.props.loggedUser &&
              this.props.path === "/courses" &&
              this.props.loggedUser.role === "S" && (
                <Link to="/registeredCourses" className="headerLinks">
                  <span className="headerLinks">Booked Lectures</span>
                </Link>
              )}
          </Navbar.Text>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
