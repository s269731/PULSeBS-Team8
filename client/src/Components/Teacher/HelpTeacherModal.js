import React, { useState } from "react";
import {Button, Modal} from "react-bootstrap";
import Jumbotron from "../../assets/helpF.png";
import filterPng from "../../assets/tea/01.png";
import opePng from "../../assets/tea/02.png";
import pastPng from "../../assets/tea/03.png";
import statisticsPng from "../../assets/tea/041.png";
import bookingPng from "../../assets/tea/042.png";
import attendancePng from "../../assets/tea/043.png";

function HelpTeacherModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)};
    const titStyle = {textAlign:'left',margin:'20px 0 10px',fontSize:24}
    return (
      <>
        <Button data-testid="help-button" variant="link">
          <img
            style={{
            height: "2rem",
            marginRight: "6px",            
          }}
            src={Jumbotron}
            alt="my image"
            onClick={handleShow}/></Button>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Tutorial</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{textAlign:'center'}}>
              <h3 style={titStyle}>1.To filter courses,you can click "course name" you wanted</h3>
              <img style={{maxWidth:'100%'}} src={filterPng} alt=""/>
              <h3 style={titStyle}>2.To get booked students list,you can click on"Booked students" button;  To cancel a lecture,you can click on "Cancel lecture" button; To modify the lecture modality,you can click on "Switch to online lecture" button</h3>
              {/* <h3 style={titStyle}>2.2To cancel a lecture,you can click on"Cancel lecture"button</h3>
              <h3 style={titStyle}>2.3To modify the lecture modality,you can click on"Switch to online lecture"button</h3> */}
              <img style={{maxWidth:'100%'}} src={opePng} alt=""/>
              <h3 style={titStyle}>3.To see past lectures,you can click on"My past lectures"button</h3>
              <img style={{maxWidth:'100%'}} src={pastPng} alt=""/>
              <h3 style={titStyle}>4.1 To see the Statistics of course,you can click on "Statistics" button</h3>
              <img style={{maxWidth:'100%'}} src={statisticsPng} alt=""/>
              <h3 style={titStyle}>4.2 Statistics includes Booking Statistics and Attendance Statistics,you can click "Booking Statistics " and "Attendance Statistics" buttons to get detailed data</h3>
              <img style={{maxWidth:'100%'}} src={bookingPng} alt=""/>
              <img style={{maxWidth:'100%'}} src={attendancePng} alt=""/>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>Understood</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default HelpTeacherModal;
