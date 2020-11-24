import React, { Component } from "react";
import { Container, Row, Button, Card} from "react-bootstrap";
import Jumbotron from "../../assets/courses.png";
import { withRouter } from "react-router-dom";

class StudentPage extends Component {
  routeAllCourses = () => {
    let path = `/courses`;
    this.props.history.push(path);
  };

  routeRegCourses = () => {
    let path = `/registeredCourses`;
    this.props.history.push(path);
  };

  render() {
    return (
      <Card>
        <Card
          style={{
            margin: "auto",
          }}
        >
          <Container data-testid="student-page">
            <Row>
              <Card
                style={{
                  width: "20rem",
                  float: "left",
                  margin: "20px",
                }}
              >
                <Card.Img variant="top" src={Jumbotron} />
                <Card.Body>
                  <Button
                    style={{
                      padding: "1rem 1.1rem",
                      fontSize: "1.3rem",
                    }}
                    data-testid="courses-button"
                    onClick={this.routeAllCourses}
                    variant="info"
                  >
                    Available Lectures
                  </Button>
                </Card.Body>
              </Card>
              <Card
                style={{
                  width: "20rem",
                  float: "left",
                  margin: "20px",
                }}
              >
                <Card.Img variant="top" src={Jumbotron} />
                <Card.Body>
                  <Button
                    style={{
                      padding: "1rem 1.1rem",
                      fontSize: "1.3rem",
                    }}
                    data-testid="registered-courses-button"
                    onClick={this.routeRegCourses}
                    variant="info"
                  >
                    Calendar
                  </Button>
                </Card.Body>
              </Card>
            </Row>
          </Container>
        </Card>
      </Card>
    );
  }
}

export default withRouter(StudentPage);
