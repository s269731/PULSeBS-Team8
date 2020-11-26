import React, {Component} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "moment/locale/nb";
import "../../assets/sass/styles.scss";
import API from "../../api/api";
import {Button, OverlayTrigger, Popover} from "react-bootstrap";

const localizer = momentLocalizer(moment);

export default class NewCalendarView extends Component {
  componentDidMount() {
    API.getBookedLectures()
      .then((res) => {
        console.log(res);
        const cal = res.map((lec) => {
          return {
            id: lec.id,
            instructor: lec.teacherName,
            room: lec.room,
            title: lec.subject,
            startDate: moment(lec.date + "T" + lec.hour).toDate(),
            endDate: moment(lec.date + "T" + lec.hour + "-02:00").toDate(),
          };
        });
        this.setState({ events: cal, loading: null, serverErr: null });
      })
      .catch((err) => {
        if (err.status === 401) {
          this.props.notLoggedUser();
        }
        this.setState({ serverErr: true, loading: null });
      });
  }
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }

  cancelBooking = (id) => {
    this.props.cancelBooking(id);
    this.componentDidMount();
  }

  popover = (event) => (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Cancel reservation</Popover.Title>
      <Popover.Content>
        for <strong>canceling</strong> course. Click here:
        <Button
          data-testid="cancel-reservation-button"
          onClick={() => this.cancelBooking(event.id)}
          variant="danger"
        >
          Cancel
        </Button>
      </Popover.Content>
    </Popover>
  );

  Event = ({ event }) => (
    <OverlayTrigger
      trigger="focus"
      placement="top"
      overlay={this.popover(event)}
    >
      <Button
        data-testid="open-popover-cancel-reservation-button"
        style={{
          background: "transparent",
          border: "none",
        }}
      >
        {event.title}
        <br />
        Lecture Room:{event.room}
        <br />
        Teacher: {event.instructor}
      </Button>
    </OverlayTrigger>
  );

  render() {
    return (
          <Calendar
            data-testid="registered-courses-page"
            localizer={localizer}
            events={this.state.events}
            startAccessor="startDate"
            endAccessor="endDate"
            defaultView="week"
            style={{ height: 900 }}
            views={["month", "week", "day"]}
            min={new Date(2020, 1, 0, 7, 0, 0)}
            max={new Date(2022, 1, 0, 21, 0, 0)}
            culture="en"
            components={{
              event: this.Event,
            }}
          />
    );
  }
}
