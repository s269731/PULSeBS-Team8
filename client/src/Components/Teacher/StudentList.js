import React, { useState } from "react";
import {Button, Modal, Alert, Spinner, Row, Col, Form} from "react-bootstrap";
import API from "../../api/api";



function StudentList(props) {
  const [show, setShow] = useState(false);
  const [students, setStudents] = useState([]);
  const [serverErr, setServerErr] = useState(false);
  const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll]=useState(false)
    const [alert, setAlertShow]=useState(false);
  const addStudent=(add, id, ssn)=>{
console.log(add)
      let res=students.map((s)=>{
          if(s.id===id){
              s.select=add;
          }
          return s;
      });
        console.log(res)
      setStudents(res);
  }
const addAllStudents=(add)=>{

          let res = students.map((s) => {

                  s.select = add;
              return s;
          });
          console.log(res)
          setStudents(res);
          if(add) {
              setSelectAll(true)
          }else{
              setSelectAll(false)
          }

    }
const handleAlertShow=()=>{
        setAlertShow(true)
}
const handleAlertUnshow=()=>{
        setAlertShow(false)
}

const submitAttendanceData=()=>{
    setAlertShow(false)
        let presentStuds=[]
    students.forEach((s)=>{
            if(s.select){
                presentStuds.push(s.id)
            }
        })
    console.log(presentStuds)
    API.insertAttendanceInfo(props.id, presentStuds).then((res)=>{
        setServerErr(false);

        handleClose();
        props.getLectures();
    }).catch((e)=>{
        setServerErr(true);
    })
}


  const handleClose = () => setShow(false);
  const handleShow = () => {
    setLoading(true);
    API.getStudentListByLectureId(props.id)
      .then((res) => {
          res=res.map((s)=>{
              return {
                  select: s.status===3 ? 1 : 0,
                  id:s.id,
                  name:s.name,
                  surname:s.surname,
                  ssn:s.ssn,
                  email:s.email
              }
          })
        setStudents(res);
        setLoading(false);
        setServerErr(false);
      })
      .catch((e) => {
        if (e.status === 401) {
          props.notLoggedUser();
        }
        setStudents([]);
        setServerErr(true);
        setLoading(false);
      });
    setShow(true);
  };

let hasAttendance=props.hasAttendance
    if(props.hasAttendance===1){
       hasAttendance=true
    }
    if(props.hasAttendance===0){
        hasAttendance=false
    }
    console.log(hasAttendance)
    console.log(props.recordAttendance)
  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        data-testid="studentlist-button"
      >
          {!hasAttendance ? <>{ props.recordAttendance ? <>Insert attendance information</> : <>List of booked students</>}</> : <>List of present students</>}
      </Button>

      <Modal show={show} onHide={handleClose} data-testid="studentlist-modal">
        <Modal.Header closeButton>
          <Modal.Title>{!hasAttendance ? <>{ props.recordAttendance ? <>Insert attendance information</> : <>List of booked students</>}</> : <>List of present students</>}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {serverErr && (
            <Alert variant="danger" data-testid="error-message">
              Server Error
            </Alert>
          )}
          {!serverErr && loading && (
            <Alert variant="primary">
              <Spinner animation="border" variant="primary" /> Loading ...
            </Alert>
          )}
          {!serverErr && !loading && students.length === 0 && (
            <span data-testid="no-student-message">
              <hr
                style={{
                  color: "#000000",
                  backgroundColor: "#000000",
                  height: 0.5,
                  borderColor: "#000000",
                }}
              />
              No students booked for this lesson yet
              <hr
                style={{
                  color: "#000000",
                  backgroundColor: "#000000",
                  height: 0.5,
                  borderColor: "#000000",
                }}
              />
            </span>
          )}
          {!serverErr && !loading && students.length !== 0 && (
            <>
              <hr
                style={{
                  color: "#000000",
                  backgroundColor: "#000000",
                  height: 0.5,
                  borderColor: "#000000",
                }}
              />
              <Row>
                <Col>SURNAME</Col>
                <Col>NAME</Col>
                <Col>E-MAIL</Col>
                  {(props.recordAttendance===true || hasAttendance===true) && <Col><Row>PRESENCE</Row></Col>}
              </Row>
              <hr
                style={{
                  color: "#000000",
                  backgroundColor: "#000000",
                  height: 0.5,
                  borderColor: "#000000",
                }}
              />
            </>
          )}
          {!serverErr &&
            !loading &&
            students.length !== 0 &&
            students.map((s, id) => {

              return <>
                  <Row data-testid="student-row">
                      <Col>{s.surname}</Col>
                      <Col>{s.name}</Col>
                      <Col>{s.email}</Col>

                      {(props.recordAttendance || hasAttendance) && <Col>
                          <Form>
                              <Form.Group controlId="formBasicCheckbox">

                                  {hasAttendance ? <Form.Check
                                      data-testid="checkOne"
                                      checked={s.select}
                                      key={s.id}
                                      disabled
                                      type="checkbox"

                                  /> : <Form.Check
                                      data-testid="checkOne"
                                      checked={s.select}
                                      key={s.id}
                                      type="checkbox"
                                      onChange={event => addStudent(event.target.checked, s.id, s.SSN)}
                                  />}
                              </Form.Group>
                          </Form>
                      </Col>}


                  </Row>
              </>
            })}
            {(props.recordAttendance && !hasAttendance) &&
            <Row className={"selectAll text-center text-md-right"}>
                <Col>
                <Form>
                    <Form.Group controlId="formBasicCheckbox">

                        <Form.Check
                            data-testid="checkAll"
                            checked={selectAll}
                            type="checkbox"
                            label={"Select All"}
                            onChange={event => addAllStudents(event.target.checked)}
                        />
                    </Form.Group>
                </Form>
                </Col>
            </Row>
            }

        </Modal.Body>
        <Modal.Footer>
            {
                alert ?

                    <Alert variant={"danger"}> <Row className={"text-center text-md-left"}>
                        <Col>
                            <h6>Do you really want to save the attendance information? <br/><b>(You cannot undo this operation)</b></h6>
                        </Col>

                            <Col xs={2}>
                                <Button data-testid={"confirm-button"} variant={"success"} onClick={submitAttendanceData}>Yes</Button>
                            </Col>
                            <Col xs={2}>
                                <Button data-testid={"exit-button"} variant={"secondary"} onClick={handleAlertUnshow}>No</Button>
                            </Col>
                    </Row>
                    </Alert>
                    :<>
                    {(props.recordAttendance && !hasAttendance) && <Button
                        variant="primary"
                        onClick={handleAlertShow}
                        data-testid="submit-attendance-button"
                    >
                        Save
                    </Button>}

                <Button
                variant="secondary"
                onClick={handleClose}
                data-testid="close-button"
                >
                Close
                </Button>
            </>}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StudentList;
