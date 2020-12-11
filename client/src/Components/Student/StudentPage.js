import React, { Component } from "react";
import {Container, Tab, Tabs} from "react-bootstrap";
import AvailableCourses from "./AvailableCourses";
import LecturesCalendar from "./LecturesCalendar";
import API from "../../api/api";

class StudentPage extends Component {

  constructor(props) {
    super(props);
    this.state = { lectures: [], subjects:[], refresh: false, errMsg: [], modality:"lectures" };
    this.handleLectures=this.handleLectures.bind(this);
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
    }
  componentDidMount() {
    API.getLectures()
        .then((res) => {
            let subjects=[]
            subjects=res.map((l)=>{return l.subject}).filter(this.onlyUnique)
            console.log(subjects)
          console.log(res)
          this.setState({ lectures: res, subjects:subjects });
          this.setState({refresh: false})
        })
        .catch((err) => {
          if (err.status === 401) {
            this.props.notLoggedUser();
          }
          this.setState({ serverErr: true, loading: null });
        });
  }
    handleLectures(id) {
      console.log(id)
        if (id === "del") {
            let lects = this.state.lectures;
            for (let l of lects) {
                l.visible = true;
            }
            this.setState({ lectures: lects });
        } else {
            let lects = this.state.lectures;
            for (let l of lects) {
                l.visible = l.subject === id;
            }
            this.setState({ lectures: lects });
        }
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
          <Tab eventKey="lectures" title="My Lectures" data-testid="lectures-tab-button">
            <AvailableCourses
                subjects={this.state.subjects}
                lectures={this.state.lectures}
                errMsg={this.state.errMsg}
                refresh={this.state.refresh}
                bookLecture={this.bookLecture}
                cancelBookingByStudent={this.cancelBookingByStudent}
                handleLectures={this.handleLectures}
            />
          </Tab>
          <Tab data-testid="calendar-tab-button" eventKey="calendar" title="Calendar">
            <LecturesCalendar
                bookedLectures={this.state.lectures.filter((lecture) => lecture.booked===0)}
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
