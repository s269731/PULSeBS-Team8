import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
// import {Link} from 'react-router-dom';
import '../App.css';
//import {Link} from 'react-router-dom'

class Navbars extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (

                <Navbar  variant="dark" bg="dark">
                    <Navbar.Brand >
                        <Navbar.Text>
                            Pandemic University Lecture Seat Booking System (PULSeBS)
                        </Navbar.Text>
                        {/*this.props.path==="/officer" && <Navbar.Text>&nbsp; - Officer Portal</Navbar.Text>*/}
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                    </Navbar.Collapse>
                    <Nav className="ml-md-auto">
                        {/*this.props.path==="/officer" &&  <Link to='/home' className="headerLinks "><Navbar.Text>&nbsp; Home </Navbar.Text></Link>*/}
                        {/*this.props.path==="/home" &&  <Link to='/officer' className="headerLinks "><Navbar.Text>&nbsp; Officer Portal </Navbar.Text></Link>*/}
                    </Nav>
                </Navbar>

        );
    }
}

export default Navbars;