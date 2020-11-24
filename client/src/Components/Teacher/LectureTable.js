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
import CancelForm from "./CancelForm";
import ChangeModalityForm from "./ChangeModalityForm";

const LectureItem = (props) => {
  let l = props.lecture;
  const date = new Date(l.date);
  return (
    <>
      {l.visible && (
        <Card>
          <Accordion.Toggle className="subjectName" as={Card.Header} eventKey={props.eId}>
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
                    {l.modality && l.modality === "In person" && (
                        <>
                          <Col xs={6} md={4} className="align-content-start">
                            <h6 className="tableHeader">Room Capacity</h6>
                            <h5> {l.capacity}</h5>
                          </Col>
                        </>
                    )}
                  </Row>
                  <Row>
                    <Col className="align-content-start">
                      <h6 className="tableHeader">Room:</h6>
                      <h5>
                        {l.modality && l.modality === "In person" ? (l.room) : ("Virtual")}
                      </h5>
                    </Col>
                    <Col xs={6} md={4} className="align-content-end">
                      <h6 className="tableHeader">Booked students</h6>
                      <h5> {l.bookedStudents}</h5>
                    </Col>
                  </Row>
                  {/*BUTTONS*/}
                  <Row className="pt-4 pb-2">
                    <Col className="align-content-end">
                      <StudentList
                          id={l.id}
                          notLoggedUser={props.notLoggedUser}
                      />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <CancelForm l={l} cancelLecture={props.cancelLecture} />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <ChangeModalityForm l={l} changeModalityLecture={props.changeModalityLecture}/>
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
            <h3>Your next lectures: </h3>
          </Row>
          <Row className="justify-content-md-center">
            <Col className="col-2 justify-content-md-center">
              <h5>Courses</h5>
              <ButtonGroup vertical>
                {this.props.subjects.map((e) => {
                  return (
                    <>
                      <Button
                        variant="primary"
                        value={e}
                        key={e}
                        onClick={(ev) => {
                          this.handleLectures(ev.target.value);
                        }}
                        data-testid="handlelecture-button"
                      >
                        {e}
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
