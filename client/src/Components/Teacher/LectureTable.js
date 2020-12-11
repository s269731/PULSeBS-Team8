import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Accordion,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import StudentList from "./StudentList";
import ActionsForm from "./ActionsForm";

const LectureItem = (props) => {
  let l = props.lecture;
  const date = new Date(l.date);
  return (
    <>
      {l.visible && (
        <Card data-testid="card-toggle">
          <Accordion.Toggle className={l.canRecordAttendance || l.hasAttendance ? "pastSubjectName":"subjectName"} as={Card.Header} eventKey={props.eId}>
            <Row>
              <Col>
                <h5>{l.subject}</h5>
              </Col>
              <Col>
                <h5>{date.toLocaleDateString("en")}</h5>
              </Col>
              <Col>
                <h5>{l.hour}</h5>
              </Col>
            </Row>
          </Accordion.Toggle>

          <Accordion.Collapse eventKey={props.eId}>
            <Card.Body>
                  <Row className="justify-content-md-center">
                    <Col className="align-content-start date">
                      <h6 className="tableHeader">Date</h6>
                      <h5>
                        {date.toLocaleString("en", { weekday: "long" })}{", "}
                        {date.getDate()}{" "}
                        {date.toLocaleString("en", { month: "long" })}{" "}
                        {date.getFullYear()} at {l.hour}
                      </h5>
                    </Col>
                    <Col xs={6} md={4} className="align-content-start">
                      <h6 className="tableHeader">Room:</h6>
                      <h5>
                        {l.modality && l.modality === "In person" ? (l.room) : ("Virtual")}
                      </h5>
                    </Col>
                  </Row>
                  {l.modality && l.modality === "In person" && (
                    <Row>
                      <Col className="align-content-start">
                        <h6 className="tableHeader">Room Capacity</h6>
                        <h5> {l.capacity}</h5>
                      </Col>
                      <Col xs={6} md={4} className="align-content-end">
                        <h6 className="tableHeader">Booked students</h6>
                        <h5> {l.bookedStudents}</h5>
                      </Col>
                      {l.hasAttendance===true && <Col xs={6} md={4} className="align-content-end">
                        <h6 className="tableHeader">Present students</h6>
                        <h5> {l.presentStudents}</h5>
                      </Col>}
                    </Row>
                )}
                  {/*BUTTONS*/}
                  <Row className="pt-4 pb-2">
                    <Col className="align-content-end">
                      <StudentList
                          id={l.id}
                          notLoggedUser={props.notLoggedUser}
                      />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {!l.canRecordAttendance && !l.hasAttendance && <ActionsForm l={l} cancelLecture={props.cancelLecture} operation={'delete'}/>}
                      {!l.canRecordAttendance && !l.hasAttendance && l.modality === "In person" && <>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <ActionsForm l={l} changeModalityLecture={props.changeModalityLecture} operation={'modify'}/>
                        </>
                      }
                      {
                        l.canRecordAttendance && !l.hasAttendance && l.bookedStudents>0 && <>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <ActionsForm l={l} recordAttendance={props.recordAttendance} operation={'recordAttendance'}/>
                        </>
                      }
                    </Col>
                  </Row>

            </Card.Body>
          </Accordion.Collapse>
        </Card>
      )}
    </>
  );
};

class LectureTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      loading: true,
      serverErr: false,
      lectures: props.lectures,
    };
  }

  handleLectures(id) {
    if (id === "del") {
      let lects = this.props.lectures;
      for (let l of lects) {
        l.visible = true;
      }
      this.setState({ lectures: lects });
    } else {
      let lects = this.props.lectures;
      for (let l of lects) {
        l.visible = l.subject === id;
      }
      this.setState({ lectures: lects });
    }
  }
  render() {
    return (
      <>
        <Container fluid data-testid="lecturetable" className={"lectureTable"}>
          <Row className="justify-content-md-center below-nav">
            <h3 className={"headerLectureList"}>Your next lectures </h3>
          </Row>
          <Row className="justify-content-md-center">
            <Col className="col-2 justify-content-md-center">
              <h5>Courses</h5>
              <ButtonGroup vertical>
                {this.props.subjects.map((e) => {
                  console.log(e)
                  return (
                    <>
                      <Button
                        variant="primary"
                        value={e.SubjectName}
                        key={e.SubjectId}
                        onClick={(ev) => {
                          this.handleLectures(ev.target.value);
                        }}
                        data-testid="handlelecture-button"
                      >
                        {e.SubjectName}
                      </Button>
                      <br />
                    </>
                  );
                })}
                <Button
                  variant={"danger"}
                  value={"del"}
                  key={"del"}
                  onClick={(e) => {
                    this.handleLectures(e.target.value);
                  }}
                  data-testid="handlelecture-del-button"
                >
                  Cancel filters
                </Button>
              </ButtonGroup>
            </Col>
            <Col className="col-8">
              <Accordion className="box-shadow" defaultActiveKey="0">
                {this.props.lectures.map((e, id) => {
                  return (
                          <LectureItem
                            eId={id+1}
                            lecture={e}
                            cancelLecture={this.props.cancelLecture}
                            changeModalityLecture={this.props.changeModalityLecture}
                            recordAttendance={this.props.recordAttendance}
                            notLoggedUser={this.props.notLoggedUser}
                          />
                  );
                })}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
export default LectureTable;
