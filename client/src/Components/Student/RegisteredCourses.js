import React, {Component} from 'react';
import {BigCalendar, Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/nb';
import '../../assets/sass/styles.scss'
import API from "../../api/api";
import {Container, Button, Popover, OverlayTrigger} from 'react-bootstrap';
const localizer = momentLocalizer(moment);

export default class NewCalendarView extends Component {

  cancelMethod(id) {
    alert("Deleted Course Id: " + id);
  }

  componentDidMount() {
    API
      .getLectures()
      .then((res) => {
        console.log(res)
        const cal = res.map((lec) => {
          let lecture = {
            id: lec.id,
            instructor: lec.teacherName,
            room: lec.room,
            title: lec.subject,
            startDate: moment(lec.date + "T" + lec.hour).toDate(),
            endDate: moment(lec.date + "T" + lec.hour + "-02:00").toDate()
          }
          return lecture;
        })
        this.setState({events: cal, loading: null, serverErr: null})
      })
      .catch((err) => {
        if (err.status === 401) {
          this
            .props
            .notLoggedUser()
        }
        this.setState({serverErr: true, loading: null})
      })
  }
  constructor(props) {
    super(props);

    this.state = {
      events: []
    }
  }

  popover = (event) => (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Cancel reservation</Popover.Title>
      <Popover.Content>
        for <strong>canceling</strong> course. Click here:
        <Button data-testid="cancel-reservation-button" onClick={() => this.cancelMethod(event.id)} variant='danger'>Cancel</Button>
      </Popover.Content>
    </Popover>
  );

  Event = ({event}) => (
    <OverlayTrigger trigger="click" placement="top" overlay={this.popover(event)}>
      <Button
        data-testid="open-popover-cancel-reservation-button"
        style={{
        background: "transparent",
        border: "none"
      }}>{event.title}
        <br/>
        Lecture Room:{event.room}<br/>
        Teacher: {event.instructor}</Button>
    </OverlayTrigger>
  );

  render() {

    return (
      <Container fluid data-testid="registered-courses-page">
        <div style={{
          flex: 1
        }}>
          <Calendar
            localizer={localizer}
            events={this.state.events}
            startAccessor='startDate'
            endAccessor='endDate'
            defaultView='week'
            views={['month', 'week', 'day']}
            min={new Date(2020, 1, 0, 7, 0, 0)}
            max={new Date(2022, 1, 0, 21, 0, 0)}
            culture='en'
            components={{
            event: this.Event
          }}/>
        </div>
      </Container>
    );
  }
}
