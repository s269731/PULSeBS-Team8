import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import LecturesCalendar from "./LecturesCalendar";

const lecturesList = [
  {
    id: 1,
    subject: "SoftwareEngineering II",
    date: "2020-11-20",
    hour: "15:26",
    modality: "In person",
    room: "12A",
    capacity: 150,
    bookedStudents: 100,
    teacherName: "Franco yjtyjty",
    lectureId: 1,
    booked: false,
  },
  {
    id: 2,
    subject: "SoftwareEngineering II",
    date: "2020-11-20",
    hour: "15:26",
    modality: "In person",
    room: "12A",
    capacity: 150,
    bookedStudents: 151,
    teacherName: "Franco yjtyjty",
    lectureId: 1,
    booked: false,
  },
  {
    id: 3,
    subject: "SoftwareEngineering II",
    date: "2020-11-20",
    hour: "15:26",
    modality: "In person",
    room: "12A",
    capacity: 150,
    bookedStudents: 100,
    teacherName: "Franco yjtyjty",
    lectureId: 1,
    booked: true,
  },
  {
    id: 4,
    subject: "SoftwareEngineering II",
    date: "2020-11-20",
    hour: "15:26",
    modality: "In person",
    room: "12A",
    capacity: 150,
    bookedStudents: 151,
    teacherName: "Franco yjtyjty",
    lectureId: 1,
    booked: true,
  },
];

test("Calendar rendering with lectures list", async () => {
  render(<LecturesCalendar
      bookedLectures={lecturesList}
      errMsg={[]}
  />);

  expect(screen.getByTestId("calendar-page")).toBeInTheDocument();
});
