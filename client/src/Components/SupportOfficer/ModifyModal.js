import React, { useState } from "react";
import {Button, Modal, Alert, Form, Col, Card} from "react-bootstrap";
import TimeField from "react-simple-timefield";
import Jumbotron from "../../assets/edit.jpg";
import API from "../../api/api";


const options = [
    {
        label: "Mon",
        value: "Mon"
    }, {
        label: "Tue",
        value: "Tue"
    }, {
        label: "Wed",
        value: "Wed"
    }, {
        label: "Thu",
        value: "Thu"
    }, {
        label: "Fri",
        value: "Fri"
    }
];


function ModifyModal(props) {
    const [show, setShow] = useState(false);
    const [error, setError] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [optionDay, setOptionDay] = useState(props.sc.Day);
    const [optionHour1, setOptionHour1] = useState(props.hr);
    const [optionHour2, setOptionHour2] = useState(props.min);
    const [optionClass, setOptionClass] = useState(props.sc.Class);
    const [optionCapacity, setOptionCapacity] = useState(props.sc.Capacity);


    const handleOperation = (event) => {
        setShow(false);
        //API call to change schedule
        let a={
            "SubjectId": props.e.SubjectId,
            "ScheduleId": props.sc.ScheduleId,
            "Class": optionClass,
            "Day":  optionDay,
            "Capacity":  optionCapacity,
            "Hour": optionHour1+"-"+optionHour2
        }
        props.SaveEdit(a);
    };

    return (
        <>
            <Button
                data-testid="cancel-lecture-button"
                variant="danger"
                onClick={handleShow}
            >
                Modify Schedule
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                data-testid="modification-lecture-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant={'danger'}>Server Error</Alert>}
                    <Card
                        bg='light'
                        style={{
                            float: "left"
                        }}>
                        <Card.Body>
                            <b>Time:</b>
                            <select
                                style={{
                                    border: '1px solid #666',
                                    fontSize: 20,
                                    width: 100,
                                    padding: '2px 4px',
                                    margin: '2px',
                                    color: '#333',
                                    borderRadius: 10
                                }}
                                id={props.id}
                                defaultValue={props.sc.Day}
                                onChange={e => setOptionDay(e.target.value)}>
                                {options.map((option) => {
                                    return ( <> <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                        </>
                                    );
                                })}
                            </select>
                            <TimeField
                                onChange={e => setOptionHour1(e.target.value)}
                                style={{
                                    border: '1px solid #666',
                                    fontSize: 20,
                                    width: 80,
                                    padding: '2px 4px',
                                    margin: '2px',
                                    color: '#333',
                                    borderRadius: 10
                                }}
                                value={props.hr}></TimeField>-
                            <TimeField
                                onChange={e => setOptionHour2(e.target.value)}
                                style={{
                                    border: '1px solid #666',
                                    fontSize: 20,
                                    width: 80,
                                    padding: '2px 4px',
                                    margin: '2px',
                                    color: '#333',
                                    borderRadius: 12
                                }}
                                value={props.min}></TimeField>
                            <br></br>
                            <b>Class:</b>
                            <input
                                onChange={e => setOptionClass(e.target.value)}
                                style={{
                                    border: '1px solid #666',
                                    fontSize: 20,
                                    width: 90,
                                    padding: '2px 4px',
                                    margin: '2px',
                                    color: '#333',
                                    borderRadius: 10
                                }}
                                defaultValue={props.sc.Class}
                                type="text"
                                id="class"
                                size="5"/>
                            <br></br>
                            <b>Capacity:</b>
                            <input
                                defaultValue={props.sc.Capacity}
                                onChange={e => setOptionCapacity(e.target.value)}
                                style={{
                                    border: '1px solid #666',
                                    fontSize: 20,
                                    width: 90,
                                    padding: '2px 4px',
                                    margin: '2px',
                                    color: '#333',
                                    borderRadius: 10
                                }}
                                type="number"
                                id="capacity"
                                size="5"/>


                            <br></br>
                            {/*props.sc.ScheduleId === this.state.scId && <Button
                                style={{
                                    float: 'right',
                                    margin: "1px"
                                }}
                                onClick={() => this.SaveEdit(props.e.SubjectId, props.sc.ScheduleId)}
                                size="sm"
                                variant="success">Save</Button>*/}
                            {/*props.sc.ScheduleId === this.state.scId && <Button
                                onClick={() => this.disableEdit()}
                                style={{
                                    float: 'right',
                                    margin: "1px"
                                }}
                                size="sm"
                                variant="danger">Cancel</Button>*/}
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                    <Button
                        data-testid="modify-lecture-schedule-closemodal-button"
                        variant="danger"
                        onClick={handleOperation}
                    >
                        Save
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
}
export default ModifyModal;
