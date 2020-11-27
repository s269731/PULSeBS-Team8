import React, { useState } from "react";
import { Button, Modal, Alert } from "react-bootstrap";


function ChangeModalityForm(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const HandleDelete = () => {
    setShow(false);
    props.changeModalityLecture(props.l.id);
  };
  return (
    <>
        {props.l.canModify ? (
      <Button
          data-testid="modify-lecture-button"
          variant="warning"
          onClick={handleShow}
      >
        Switch to online lecture
      </Button>
        ) : (
            <Button
                variant="warning"
                disabled={true}
            >
                Cannot switch to online lecture
            </Button>
        )}
      <Modal
        show={show}
        onHide={handleClose}
        data-testid="modify-lecture-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant={"danger"}>
            <h4>Are you sure to make this an online lecture?</h4><br/><h4>You cannot undo this operation</h4>
          </Alert>
          <hr
            style={{
              color: "#000000",
              backgroundColor: "#000000",
              height: 0.5,
              borderColor: "#000000",
            }}
          />
          <br />
          <Alert variant={"info"}>
            <h5>
              Date: {props.l.date} at {props.l.hour}
            </h5>
            <br />
            <h5>Course: {props.l.subject}</h5>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            data-testid="modify-lecture-closemodal-button"
            variant="warning"
            onClick={HandleDelete}
          >
            Switch to online lecture
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ChangeModalityForm;
