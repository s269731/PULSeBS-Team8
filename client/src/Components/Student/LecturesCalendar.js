import React, {useState, useEffect} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "moment/locale/nb";
import "../../assets/sass/styles.scss";
import {Button, OverlayTrigger, Popover} from "react-bootstrap";

const localizer = momentLocalizer(moment);

export default function LecturesCalendar(props) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
      const cal = props.bookedLectures.map((lec) => {
        return {
          id: lec.id,
          instructor: lec.teacherName,
          room: lec.room,
          title: lec.subject,
          startDate: moment(lec.date + "T" + lec.hour).toDate(),
          endDate: moment(lec.date + "T" + lec.hour + "-02:00").toDate(),
        };
      });
      setEvents(cal);

  }, [props.bookedLectures]);

  const popover = (event) => (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Cancel reservation</Popover.Title>
      <Popover.Content>
        for <strong>canceling</strong> course. Click here:
        <Button
          data-testid="cancel-reservation-button"
          onClick={() => props.cancelBooking(event.id)}
          variant="danger"
        >
          Cancel
        </Button>
      </Popover.Content>
    </Popover>
  );

  const Event = ({ event }) => (
    <OverlayTrigger
      trigger="focus"
      placement="top"
      overlay={popover(event)}
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

  return (
      <div data-testid="calendar-page">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="startDate"
          endAccessor="endDate"
          defaultView="week"
          style={{ height: 900 }}
          views={["month", "week", "day"]}
          min={new Date(2020, 1, 0, 7, 0, 0)}
          max={new Date(2022, 1, 0, 21, 0, 0)}
          culture="en"
          components={{
            event: Event,
          }}
        />
      </div>
  );
}
