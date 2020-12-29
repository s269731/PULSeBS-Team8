import React, { useState } from "react";
import {Button, Modal} from "react-bootstrap";
import Jumbotron from "../../assets/helpF.png";
import filterPng from "../../assets/stu/01.png";
import bookPng from "../../assets/stu/02.png";
import cancelPng from "../../assets/stu/03.png";
import calendarPng from "../../assets/stu/04.png";

function HelpStudentModal(props) {
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
              <h3 style={titStyle}>2.To book a lecture,you can click on "Book now "button</h3>
              <img style={{maxWidth:'100%'}} src={bookPng} alt=""/>
              <h3 style={titStyle}>3.To cancel a lecture,you can click on "Cancel reservation" button</h3>
              <img style={{maxWidth:'100%'}} src={cancelPng} alt=""/>
              <h3 style={titStyle}>4.To get your Calendar,you can click on "Calendar"</h3>
              <img style={{maxWidth:'100%'}} src={calendarPng} alt=""/>
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
  
  export default HelpStudentModal;
