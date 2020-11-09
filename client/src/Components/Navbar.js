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
                        {this.props.path==="/student" && <Navbar.Text className="headerLinks">&nbsp; -  Student Page </Navbar.Text>}
                        {this.props.path==="/teacher" && <Navbar.Text className="headerLinks">&nbsp; -  Teacher Page </Navbar.Text>}
                        </Navbar.Text>
                        {/*this.props.path==="/officer" && <Navbar.Text>&nbsp; - Officer Portal</Navbar.Text>*/}
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                    </Navbar.Collapse>
                    <Nav className="ml-md-auto">
                        {this.props.path==="/teacher" &&  <Link to='/home' className="headerLinks"><Navbar.Text className="headerLinks">&nbsp; Home </Navbar.Text></Link>}
                        {this.props.path==="/home" &&  <Link to='/login' className="headerLinks"><Navbar.Text className="headerLinks" >&nbsp; Login </Navbar.Text></Link>}
                    </Nav>
                </Navbar>

        );
    }
}

export default Navbars;