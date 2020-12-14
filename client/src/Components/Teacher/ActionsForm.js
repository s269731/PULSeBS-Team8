import React, { useState } from "react";
import {Button, Modal, Alert, Form, Col} from "react-bootstrap";



function ActionsForm(props) {
    const [show, setShow] = useState(false);
    const [attendanceNum, setAttendanceNum] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleOperation = (event) => {
        setShow(false);
        if (props.operation==='delete') {
            props.cancelLecture(props.l.id);
        }
        if(props.operation==='modify'){
            props.changeModalityLecture(props.l.id);
        }
        if(props.operation==='recordAttendance'){
            event.preventDefault()
            console.log(props.l.id)
            console.log(attendanceNum)
            props.recordAttendance(props.l.id, attendanceNum);
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
            {props.operation==='recordAttendance' &&
                <Button
                    data-testid="record-attendance-lecture-button"
                    variant="success"
                    onClick={handleShow}
                >
                    Insert attendance information
                </Button>
            }
            <Modal
                show={show}
                onHide={handleClose}
                data-testid="modification-lecture-modal"
            >
                <Modal.Header closeButton>
                    {props.operation==='recordAttendance'? <Modal.Title>Insert attendance information</Modal.Title>:<Modal.Title>Warning</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    {props.operation!=='recordAttendance' && <><Alert variant={"danger"} className={"actionsAlarm"}>
                        {props.operation === 'delete' && <h4>Are you sure to delete this lecture?</h4>}
                        {props.operation === 'modify' && <><h4>Are you sure to make this an online
                            lecture?</h4><br/><h4>You cannot undo this operation</h4></>}
                    </Alert>
                    <hr
                        style={{
                            color: "#000000",
                            backgroundColor: "#000000",
                            height: 0.5,
                            borderColor: "#000000",
                        }}
                    /></>}
                    <br />
                    <Alert variant={"info"}  className={"actionsInfo"}>
                        <h5>
                            Date: {props.l.date} at {props.l.hour}
                        </h5>
                        <br />
                        <h5>Course: {props.l.subject}</h5>
                        {props.operation==='recordAttendance' && <><br/><h5>Booked
                        students: {props.l.bookedStudents}</h5></>}
                    </Alert>

                    {props.operation==='recordAttendance' &&<><hr
                        style={{
                            color: "#000000",
                            backgroundColor: "#000000",
                            height: 0.5,
                            borderColor: "#000000",
                        }}
                    /> <Form method="POST" onSubmit={(event) => handleOperation(event)}>
                        <Form.Label><h5>Insert here the number of present students:</h5></Form.Label>
                        <Form.Row>
                            <Col xs={3}>
                                <Form.Group controlId="description">
                                     <Form.Control data-testid={"insert-attendance-field"} type="number" id={"inputNum"} name="Number" placeholder="Type a number" value = {attendanceNum} onChange={(ev) => setAttendanceNum(Number(ev.target.value))} required autoFocus/>
                                </Form.Group>
                            </Col>
                            <Col xs={9}>
                                    {(attendanceNum<0 || attendanceNum>props.l.bookedStudents) ? <Alert variant={"danger"} className={"actionsAlarm"}>Insert a number between 0 and {props.l.bookedStudents}</Alert> : <Form.Group className={"align-content-right"}><Button variant="primary" type="submit" data-testid={"submit-button"}>Save</Button></Form.Group>}
                            </Col>
                        </Form.Row>
                    </Form></>}
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
