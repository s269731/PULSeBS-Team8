import React from "react";
import {Row, Col,Button, Accordion, Card, ButtonGroup, Container} from "react-bootstrap";

const LectureItem = (props) => {

  
  
  let l = props.lecture;
  let bookLecture = props.bookLecture;
  let cancelBooking=props.cancelBooking;
  let errMsg = props.errMsg;
  let key = props.k;
  const date = new Date(l.date);
  return (<>{l.visible &&
    <>
        <Card data-testid="card-toggle">
            <Accordion.Toggle className="subjectName" as={Card.Header} eventKey={key} data-testid="card-toggle">
                <Row>

                    <Col>
                        <h5>
                            {date.getDate()}{" "}
                            {date.toLocaleString("en", {month: "long"})}{" "}
                            {date.getFullYear()} at {l.hour}
                        </h5>
                    </Col>
                    <Col>
                        <h5>{l.subject}</h5>
                    </Col>

                    <Col>
                        <h5>{l.hour}</h5>
                    </Col>
                </Row>
            </Accordion.Toggle>

            <Accordion.Collapse eventKey={key}>
                <Card.Body>
                    <Row data-testid="lecture-s-row">
                        <Col>
                            <Row className="justify-content-md-center">
                                <Col className="align-content-start date">
                                    <h6 className="tableHeader">Date</h6>
                                    <h5>
                                        {date.toLocaleString("en", {weekday: "long"})}{", "}
                                        {date.getDate()}{" "}
                                        {date.toLocaleString("en", {month: "long"})}{" "}
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
                                    <Col className="align-content-start date">
                                        <h6 className="tableHeader">Teacher:</h6>
                                        <h5>{l.teacherName}</h5>
                                    </Col>
                                    <Col className="align-content-start">
                                        <h6 className="tableHeader">Room Capacity</h6>
                                        <h5> {l.capacity}</h5>
                                    </Col>
                                    <Col xs={6} md={4} className="align-content-end">
                                        <h6 className="tableHeader">Booked students</h6>
                                        <h5> {l.bookedStudents}</h5>
                                    </Col>
                                </Row>
                            )}

                            <Row className="justify-content-md-center">
                                <Col className="align-content-start date">
                                    {<h6>{errMsg[key]}</h6>}

                                </Col>
                            </Row>

                            <Row className={"justify-content-md-center"} >

                                    {l.modality !== "In person" && (
                                        <Col>
                                            <h6>Lecture is Virtual</h6>
                                        </Col>
                                    )}
                                    {l.modality === "In person" &&
                                    l.booked === 2 &&
                                    l.bookedStudents < l.capacity && (
                                        <Col>
                                            {l.canBook ? <Button
                                                data-testid="course-book-button"
                                                onClick={() => bookLecture(l.lectureId)}
                                                size="lg"
                                                variant="success"
                                                block
                                            >
                                                Book Now
                                            </Button> :<Button
                                                size="lg"
                                                variant="success"
                                                disabled
                                                block
                                            >
                                                Cannot book
                                            </Button> }
                                        </Col>
                                    )}
                                    {l.modality === "In person" &&
                                    l.booked === 2 &&
                                    l.bookedStudents >= l.capacity && (
                                        <Col>
                                            <Button
                                                data-testid="course-wait-button"
                                                onClick={() => bookLecture(l.lectureId)}
                                                size="lg"
                                                variant="warning"
                                                block
                                            >
                                                Put me on the waiting list
                                            </Button>
                                        </Col>
                                    )}
                                    {l.modality === "In person" &&
                                    (l.booked === 0 || l.booked == 1) &&
                                    // l.canModify===true &&
                                    (<Col>
                                            <Row className="justify-content-md-center">
                                                {l.modality === "In person" &&
                                                l.booked === 0 &&
                                                l.bookedStudents <= l.capacity &&
                                                (

                                                       <h5 data-testid="confirm-message" className={"confirm"}><i>You are already booked</i></h5>

                                                )}
                                                {l.modality === "In person" &&
                                                l.booked === 1 &&
                                                l.bookedStudents >= l.capacity &&
                                                (

                                                    <h5 data-testid="confirm-message" className={"confirm"}><i>You are in waiting list</i></h5>

                                                )}
                                            </Row>
                                        <Row className={"buttonStudent justify-content-md-center"}>
                                            <Button
                                                data-testid="course-cancel-button"
                                                onClick={() => cancelBooking(l.lectureId)}
                                                size="lg"
                                                variant="danger"
                                                block
                                            >
                                                Cancel reservation
                                            </Button>
                                        </Row></Col>
                                    )}
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    </>
}</>
  );
};

const AvailableCourses = (props) => {
  return (
    <> <Container fluid data-testid="lecturetable" className={"lectureTable"}>
        <Row data-testid="courses-page" className="justify-content-md-center below-nav">
          <h3>Available Courses: </h3>
        </Row>
        <Row className="justify-content-md-center below-nav">
            <Col className="col-2 justify-content-md-center">
                <h5>Courses</h5>
                <ButtonGroup vertical>
                    {props.subjects.map((e) => {
                        console.log(e)
                        return (
                            <>
                                <Button
                                    variant="primary"
                                    value={e}
                                    key={e}
                                    onClick={(ev) => {
                                        props.handleLectures(ev.target.value);
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
                            props.handleLectures(e.target.value);
                        }}
                        data-testid="handlelecture-del-button"
                    >
                        Cancel filters
                    </Button>
                </ButtonGroup>
            </Col>
            <Col>
      <Accordion className="box-shadow" defaultActiveKey="0">
        {props.lectures.map((e, key) => {
          return (
            <LectureItem
              errMsg={props.errMsg}
              lecture={e}
              bookLecture={props.bookLecture}
              cancelBooking={props.cancelBookingByStudent}
              k={key+1}
              refresh={props.refresh}
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

export default AvailableCourses;
