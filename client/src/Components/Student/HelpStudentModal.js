import React, { useState } from "react";
import {Button, Modal, Carousel} from "react-bootstrap";
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
    const btnStyle = {position:'absolute',bottom:0}

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
      {/* <div></div> */}
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          data-testid="student-page-modal"

        >
          <Modal.Header closeButton>
            <Modal.Title>Tutorial</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Carousel 
            interval={30000} 
            style={{height:430}} 
            prevIcon={<Button data-testid="modal-prev-button" style={btnStyle}>Prev</Button>} 
            nextIcon={<Button data-testid="modal-next-button"  style={btnStyle}>Next</Button>}
          >
            <Carousel.Item style={ { textAlign: 'center' } }>
            <h3 data-testid="text-test" style={titStyle}>1.To filter courses,you can click "course name" you wanted</h3>
              <img style={ { maxWidth: '100%' } } src={ filterPng } alt="" />
            </Carousel.Item>
            <Carousel.Item style={ { textAlign: 'center' } }>
              <h3 style={titStyle}>2.To book a lecture,you can click on "Book now "button</h3>
              <img style={ { maxWidth: '100%' } } src={ bookPng } alt="" />
            </Carousel.Item>
            <Carousel.Item style={ { textAlign: 'center' } }>
            <h3 style={titStyle}>3.To cancel a lecture,you can click on "Cancel reservation" button</h3>
              <img style={ { maxWidth: '100%' } } src={ cancelPng } alt="" />
            </Carousel.Item>
            <Carousel.Item style={ { textAlign: 'center' } }>
            <h3 style={titStyle}>4.To get your Calendar,you can click on "Calendar"</h3>
              <img style={ { maxWidth: '100%' } } src={ calendarPng } alt="" />
            </Carousel.Item>
           
          </Carousel>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button data-testid="understood-button" variant="primary" onClick={handleClose}>Understood</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default HelpStudentModal;
