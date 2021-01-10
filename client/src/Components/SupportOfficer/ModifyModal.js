import React, { useState } from "react";
import {Button, Modal, Alert, Card} from "react-bootstrap";

import TimePicker from 'react-time-picker';

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
                                    fontSize: 18,
                                    height: 30,
                                    width: 100,
                                    padding: '0px 4px',
                                    margin: '3px',
                                    color: '#333',
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

                                 <TimePicker
                                    value={props.hr}
                                    onChange={(value)=>setOptionHour1(value)}
                                    disableClock={true}
                                />-
                                <TimePicker
                                    value={props.min}
                                    onChange={(value)=>setOptionHour2(value)}
                                    minTime={props.hr}
                                    disableClock={true}
                                />

                            <br></br>
                            <b>Class:</b>
                            <input
                                onChange={e => setOptionClass(e.target.value)}
                                style={{
                                    border: '1px solid #666',
                                    fontSize: 20,
                                    width: 90,
                                    padding: '0px 4px',
                                    margin: '2px',
                                    color: '#333',
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
                                    padding: '0px 4px',
                                    margin: '2px',
                                    color: '#333',
                                }}
                                type="number"
                                id="capacity"
                                size="5"/>


                            <br></br>

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
