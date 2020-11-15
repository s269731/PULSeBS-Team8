import React, {useEffect, useState} from 'react';
import {Button, Modal, Alert, Spinner, Row,Col} from 'react-bootstrap';
import API from "../../api/api";

function CancelForm(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const HandleDelete=()=>{
        setShow(false)
        props.cancelLecture(props.l.id);
    }
    return (
        <>
            {props.l.canDelete ?
                <Button variant="danger" onClick={handleShow}>Cancel this lecture</Button> :
                <Button variant="danger" disabled={true}>Cannot cancel this lecture</Button>

            }
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body><Alert variant={"danger"}><h4>Are you sure to delete this lecture?</h4></Alert><hr  style={{
                    color: '#000000',
                    backgroundColor: '#000000',
                    height: .5,
                    borderColor : '#000000'
                }}/><br/><Alert variant={"info"}><h5>Date: {props.l.date} at {props.l.hour}</h5><br/><h5>Course: {props.l.subject}</h5></Alert></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={HandleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default CancelForm;