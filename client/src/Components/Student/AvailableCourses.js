import React from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";

const LectureItem = (props) => {
  let l = props.lecture;
  let bookLecture = props.bookLecture;
  let cancelBooking=props.cancelBooking;
  let errMsg = props.errMsg;
  let key = props.k;

  return (
    <>
      <Row data-testid="lecture-s-row">
        <Col>
          <Alert variant="primary" className="rounded box-shadow">
            <Row>
              <Col className="subjectName">
                <h5 className="border-bottom border-secondary pb-3 pt-2 mb-0">
                  {l.subject}
                </h5>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="align-content-start date">
                <h6 className="pt-3">
                  Lecture Date: {l.date} at {l.hour}
                </h6>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="align-content-start date">
                <h6>Teacher Name: {l.teacherName}</h6>
              </Col>
              <Col></Col>
              <Col></Col>
              <Col className="align-content-start date">
                {<h6>{errMsg[key]}</h6>}
 
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="align-content-start date">
                <h6>Lecture Modality: {l.modality}</h6>
              </Col>
              <Col></Col>
              <Col></Col>
              {l.modality === "In person" &&
                l.booked === true &&
                l.bookedStudents < l.capacity && (
                  <Col>
                    <h5 data-testid="confirm-message">You already booked</h5>
                  </Col>
                )}
              {l.modality === "In person" &&
                l.booked === true &&
                l.bookedStudents > l.capacity && (
                  <Col>
                    <h5 data-testid="confirm-message">You are in waiting list</h5>
                  </Col>
                )}
            </Row>
            <Row>
              <Col xs={20} md={3} className="align-content-start">
                <h6>Room: {l.room}</h6>
              </Col>
              <Col xs={20} md={3} className="align-content-end">
                <h6>Booked students: {l.bookedStudents}</h6>
              </Col>
              <Col xs={20} md={3} className="align-content-end">
                <h6>Class Capacity: {l.capacity}</h6>
              </Col>

              {l.modality !== "In person" && (
                <Col>
                  <h6>Lecture is Virtual</h6>
                </Col>
              )}
              {l.modality === "In person" &&
                l.booked === false &&
                l.bookedStudents < l.capacity && (
                  <Col>
                    <Button
                      data-testid="course-book-button"
                      onClick={() => bookLecture(l.lectureId)}
                      size="sm"
                      variant="success"
                      block
                    >
                      Book Now
                    </Button>
                  </Col>
                )}
              {l.modality === "In person" &&
                l.booked === false &&
                l.bookedStudents > l.capacity && (
                  <Col>
                    <Button
                      data-testid="course-wait-button"
                      onClick={() => bookLecture(l.lectureId)}
                      size="sm"
                      variant="warning"
                      block
                    >
                      Wait
                    </Button>
                  </Col>
                )}
                {l.modality === "In person" &&
                l.booked === true &&
                 (
                  <Col>
                    <Button
                      data-testid="course-cancel-button"
                      onClick={() => cancelBooking(l.lectureId)}
                      size="sm"
                      variant="danger"
                      block
                    >
                      Cancel
                    </Button>
                  </Col>
                )}
            </Row>
          </Alert>
        </Col>
      </Row>
    </>
  );
};

const AvailableCourses = (props) => {
  return (
    <>
        <Row data-testid="courses-page" className="justify-content-md-center below-nav">
          <h3>Available Courses: </h3>
        </Row>
        {props.lectures.map((e, key) => {
          return (
            <LectureItem
              errMsg={props.errMsg}
              lecture={e}
              bookLecture={props.bookLecture}
              cancelBooking={props.cancelBookingByStudent}
              k={key}
              refresh={props.refresh}
            />
          );
        })}
    </>
  );
}

export default AvailableCourses;
