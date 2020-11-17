import React, {Component} from 'react';
import {Nav, Navbar,Col,Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import '../App.css';
//import {Link} from 'react-router-dom'

class Navbars extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (

                <Navbar  variant="dark" bg="primary">
                    <Navbar.Brand >
                        <Navbar.Text  className="headerLinks">
                            <Row >
                                <Link to='/home'>
                            <Col>
                                <Row className="justify-content-md-center"><span className="headerLinks">PULSeBS</span></Row>
                                <Row className="justify-content-md-center">
                            <span className="headerNames"> Pandemic University Lecture Seat Booking System</span>
                                </Row>
                            </Col>
                                </Link>

                            </Row>
                        </Navbar.Text>
                        {/*this.props.path==="/officer" && <Navbar.Text>&nbsp; - Officer Portal</Navbar.Text>*/}
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                    </Navbar.Collapse>
                    <Nav className="ml-md-auto">
                        <Navbar.Text>
                        {!this.props.loggedUser && this.props.path==="/home" &&  <Link to='/login' className="headerLinks"><span className="headerLinks" >Login </span></Link>}
                        {this.props.loggedUser && this.props.loggedUser.name && <><span className="headerWelcome"> Welcome, {this.props.loggedUser.name} !<span className={"badge"}><span className={"badgeText"}>{this.props.loggedUser.role==="S" && <>STUDENT</>}{this.props.loggedUser.role==="D" && <>TEACHER</>}</span> </span> </span>
                            <Link to='/home' className="headerLinks " onClick={this.props.logout}>Logout </Link></>}
                        {this.props.loggedUser  && this.props.loggedUser.role==="S" && <Link to='/student' className="headerLinks"><span className="headerLinks">Personal Area </span></Link>}
                        {this.props.loggedUser  && this.props.loggedUser.role==="D" && <Link to='/teacher' className="headerLinks"><span className="headerLinks">Personal Area </span></Link>}

                        {this.props.loggedUser && this.props.path==="/registeredCourses"  && this.props.loggedUser.role==="S" && <Link to='/courses' className="headerLinks"><span className="headerLinks">Available Lectures</span></Link>}
                        {this.props.loggedUser  && this.props.path==="/courses"  && this.props.loggedUser.role==="S" && <Link to='/registeredCourses' className="headerLinks"><span className="headerLinks">Booked Lectures</span></Link>}
                        </Navbar.Text>
                        </Nav>

                </Navbar>

        );
    }
}

export default Navbars;