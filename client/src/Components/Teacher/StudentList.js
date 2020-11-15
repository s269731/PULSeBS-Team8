import React, {useEffect, useState} from 'react';
import {Button, Modal, Alert, Spinner, Row,Col} from 'react-bootstrap';
import API from "../../api/api";



function StudentItem(s){
    console.log(s.s.surname)
    return(<><Row><Col>{s.s.surname}</Col><Col>{s.s.name}</Col><Col>{s.s.email}</Col></Row>
    </>)
}


function StudentList(props) {
    const [show, setShow] = useState(false);
    const [students, setStudents]=useState([]);
    const [serverErr, setServerErr]=useState(false);
    const [loading, setLoading]=useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {

        setLoading(true)
        API.getStudentListByLectureId(props.id).then((res)=>{
            setStudents(res)
            setLoading(false)
            setServerErr(false)
        }).catch((e)=>{
            if(e.status===401){
                props.notLoggedUser();
            }
            setStudents([])
            setServerErr(true)
            setLoading(false)
        })
        setShow(true);
    }


    return (
        <>
            <Button variant="primary" onClick={handleShow} data-testid="studentlist-button">
                Show list of booked students
            </Button>

            <Modal show={show} onHide={handleClose} data-testid="studentlist-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Booked students</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {serverErr && <Alert variant="danger" data-testid="error-message">Server Error</Alert>}
                    {!serverErr && loading && <Alert variant="primary"><Spinner animation="border" variant="primary"/> Loading ...</Alert>}
                    {!serverErr && !loading && students.length===0 && <><hr  style={{
                        color: '#000000',
                        backgroundColor: '#000000',
                        height: .5,
                        borderColor : '#000000'
                    }}/>No students booked for this lesson yet<hr  style={{
                        color: '#000000',
                        backgroundColor: '#000000',
                        height: .5,
                        borderColor : '#000000'
                    }}/></>}
                    {!serverErr && !loading  && students.length!==0 && <>
                        <hr  style={{
                            color: '#000000',
                            backgroundColor: '#000000',
                            height: .5,
                            borderColor : '#000000'
                        }}/>
                        <Row><Col>SURNAME</Col><Col>NAME</Col><Col>E-MAIL</Col></Row>
                        <hr  style={{
                            color: '#000000',
                            backgroundColor: '#000000',
                            height: .5,
                            borderColor : '#000000'
                        }}/>
                    </>}
                    {!serverErr && !loading  && students.length!==0 && students.map((s)=>{return <StudentItem s={s}/>})}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} data-testid="close-button">
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
}

export default StudentList;
