import React, { useState } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import  from "../../api/api";

function CancelForm(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const HandleDelete = () => {
    setShow(false);
    props.cancelLecture(props.l.id);
  };
  return (
    <>
      {props.l.canDelete ? (
        <Button
          data-testid="cancel-lecture-button"
          variant="danger"
          onClick={handleShow}
        >
          Cancel this lecture
        </Button>
      ) : (
        <Button variant="danger" disabled={true}>
          Cannot cancel this lecture
        </Button>
      )}
      <Modal
        show={show}
        onHide={handleClose}
        data-testid="cancel-lecture-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant={"danger"}>
            <h4>Are you sure to delete this lecture?</h4>
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
            data-testid="cancel-lecture-closemodal-button"
            variant="danger"
            onClick={HandleDelete}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default CancelForm;
