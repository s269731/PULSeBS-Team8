import React from "react";
import { Row, Col, Alert, Button } from "react-bootstrap";

const LectureItem = (props) => {

  
  
  let l = props.lecture;
  let bookLecture = props.bookLecture;
  let cancelBooking=props.cancelBooking;
  let errMsg = props.errMsg;
  let key = props.k;
   

  // const 
  // const diff = timeEnd.diff(startDate);
  // const diffDuration = moment.duration(diff);
  // console.log(diffDuration);

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
                  <b>Lecture Date:</b> {l.date} at {l.hour}
                </h6>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="align-content-start date">
                <h6><b>Teacher Name:</b>{l.teacherName}</h6>
              </Col>
              <Col></Col>
              <Col></Col>
              <Col className="align-content-start date">
                {<h6>{errMsg[key]}</h6>}
 
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="align-content-start date">
                <h6><b>Lecture Modality:</b> {l.modality}</h6>
              </Col>
              <Col></Col>
              <Col></Col>
              {l.modality === "In person" &&
                l.booked === 0 &&
                 l.bookedStudents < l.capacity &&
                 (
                  <Col>
                    <h5 data-testid="confirm-message"><i>You already booked</i></h5>
                  </Col>
                )}
              {l.modality === "In person" &&
                l.booked === 0 &&
                 l.bookedStudents >= l.capacity && 
                (
                  <Col>
                    <h5 data-testid="confirm-message"><i>You are in waiting list</i></h5>
                  </Col>
                )}
            </Row>
            <Row>
              <Col xs={20} md={3} className="align-content-start">
                <h6><b>Room:</b> {l.room}</h6>
              </Col>
              <Col xs={20} md={3} className="align-content-end">
                <h6><b>Booked students:</b> {l.bookedStudents}</h6>
              </Col>
              <Col xs={20} md={3} className="align-content-end">
                <h6><b>Class Capacity:</b> {l.capacity}</h6>
              </Col>

              {l.modality !== "In person" && (
                <Col>
                  <h6>Lecture is Virtual</h6>
                </Col>
              )}
              {l.modality === "In person" &&

                l.booked === 2 &&
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
                l.booked === 2 &&
                l.bookedStudents >= l.capacity && (
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
                (l.booked === 0 || l.booked==1) &&
                // l.canModify===true &&
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
