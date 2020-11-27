import React, { useState } from "react";
import { Button, Modal, Alert } from "react-bootstrap";


function ActionsForm(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleOperation = () => {
        setShow(false);
        if (props.operation==='delete') {
            props.cancelLecture(props.l.id);
        }
        if(props.operation==='modify'){
            props.changeModalityLecture(props.l.id);
        }
    };

    return (
        <>
            {props.operation==='delete' && <>{props.l.canDelete ? (
                <Button
                    data-testid="cancel-lecture-button"
                    variant="danger"
                    onClick={handleShow}
                >
                    Cancel lecture
                </Button>
            ) : (
                <Button variant="danger" disabled={true}>
                    Cannot cancel this lecture
                </Button>
            )}</>}
            {props.operation==='modify' && <>{props.l.canModify ? (
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
            )}</>}
            <Modal
                show={show}
                onHide={handleClose}
                data-testid="modification-lecture-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant={"danger"}>
                        {props.operation==='delete' && <h4>Are you sure to delete this lecture?</h4>}
                        {props.operation==='modify' && <><h4>Are you sure to make this an online
                            lecture?</h4><br/><h4>You cannot undo this operation</h4></>}
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
                    {props.operation==='delete' &&
                    <Button
                        data-testid="cancel-lecture-closemodal-button"
                        variant="danger"
                        onClick={handleOperation}
                    >
                        Delete
                    </Button>}
                    {props.operation==='modify' &&
                    <Button
                        data-testid="modify-lecture-closemodal-button"
                        variant="warning"
                        onClick={handleOperation}
                    >
                        Switch to online lecture
                    </Button>}

                </Modal.Footer>
            </Modal>
        </>
    );
}
export default ActionsForm;
