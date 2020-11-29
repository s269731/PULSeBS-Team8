import React, { Component } from "react";
import {Container, Tab, Tabs} from "react-bootstrap";
import AvailableCourses from "./AvailableCourses";
import LecturesCalendar from "./LecturesCalendar";
import API from "../../api/api";

class StudentPage extends Component {

  constructor(props) {
    super(props);
    this.state = { lectures: [], refresh: false, errMsg: [], modality:"lectures" };
  }

  componentDidMount() {
    API.getLectures()
        .then((res) => {
          console.log(res)
          this.setState({ lectures: res });
          this.setState({refresh: false})
        })
        .catch((err) => {
          if (err.status === 401) {
            this.props.notLoggedUser();
          }
          this.setState({ serverErr: true, loading: null });
        });
  }

  cancelBookingByStudent=(id)=> {
    API.cancelBookingByStudent(id)
        .then(() => {
          this.componentDidMount();
          this.setState({refresh: true})
        }).catch((err) => {
      console.log(err.status);
      if (err.status === 401) {
        this.props.notLoggedUser();
      }
    });
  }


  bookLecture = (id) => {
    API.bookLeacture(id)
        .then((res) => {
          this.componentDidMount();
          let a = JSON.stringify(res.errors[0].msg);

          const err = this.state.lectures.map((i, key) => {
            if (i.id === id && a === '"Booking is closed for that Lecture"') {
              return "Booking is closed for that Lecture";
            } else {
              return null;
            }
          });
          this.setState({ errMsg: err });
        })
        .catch((err) => {
          if (err.status === 401) {
            this.props.notLoggedUser();
          }
          this.setState({ serverErr: true, loading: null });
        });
  };

  render() {
    return (
      <Container fluid data-testid="student-page">
        <Tabs
            id="controlled-tab"
            activeKey={this.state.modality}
            onSelect={(k) => this.setState({modality:k})}

        >
          <Tab eventKey="lectures" title="My Lectures">
            <AvailableCourses
                lectures={this.state.lectures}
                errMsg={this.state.errMsg}
                refresh={this.state.refresh}
                bookLecture={this.bookLecture}
                cancelBookingByStudent={this.cancelBookingByStudent}
            />
          </Tab>
          <Tab eventKey="calendar" title="Calendar">
            <LecturesCalendar
                bookedLectures={this.state.lectures.filter((lecture) => lecture.booked===true)}
                cancelBooking={this.cancelBookingByStudent}
                notLoggedUser={this.props.notLoggedUser}
            />
          </Tab>

        </Tabs>
      </Container>
    );
  }
}

export default StudentPage;
