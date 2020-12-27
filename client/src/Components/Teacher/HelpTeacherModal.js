import React, { useState } from "react";
import {Button, Modal} from "react-bootstrap";
import Jumbotron from "../../assets/helpF.png";

function HelpTeacherModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)};
  
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
            There is nothing difficult, for understanding you just need to check the page
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
