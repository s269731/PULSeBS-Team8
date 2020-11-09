import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
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
                            Pandemic University Lecture Seat Booking System (PULSeBS)

                        {this.props.path==="/home" && <Navbar.Text className="headerLinks">&nbsp; -  Home </Navbar.Text>}
                        {this.props.path==="/login" && <Navbar.Text className="headerLinks">&nbsp; -  Login </Navbar.Text>}
                        {this.props.path==="/student" && <Navbar.Text className="headerLinks">&nbsp; -  Student Page </Navbar.Text>}
                        {this.props.path==="/teacher" && <Navbar.Text className="headerLinks">&nbsp; -  Teacher Page </Navbar.Text>}

                        </Navbar.Text>
                        {/*this.props.path==="/officer" && <Navbar.Text>&nbsp; - Officer Portal</Navbar.Text>*/}
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                    </Navbar.Collapse>
                    <Nav className="ml-md-auto">
                        <Navbar.Text>
                        {this.props.path==="/home" &&  <Link to='/login' className="headerLinks"><span className="headerLinks" >&nbsp; Login </span></Link>}
                        {this.props.loggedUser && this.props.loggedUser.name && <><span className="headerLinks"> Welcome, {this.props.loggedUser.name} !</span>
                            <Link to='/home' className="headerLinks " onClick={this.props.logout}>Logout </Link><Link to='/home' className="headerLinks"><span className="headerLinks">&nbsp; Home </span></Link></>}
                        </Navbar.Text>
                        </Nav>

                </Navbar>

        );
    }
}

export default Navbars;