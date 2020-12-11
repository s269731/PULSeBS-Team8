import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import AvailableCourses from "./AvailableCourses";
import API from "../../api/api";

const leftClick = { button: 0 };
const lecturesList = [
  {
    id: 1,
    subject: "SoftwareEngineering II",
    date: new Date(Date.now() + 2 * 24*60*60*1000).toISOString().split('T')[0],
    hour: "15:26",
    modality: "In person",
    room: "12A",
    capacity: 150,
    bookedStudents: 100,
    teacherName: "Franco yjtyjty",
    lectureId: 1,
    booked: 2,
    visible:true
  },
  {
    id: 2,
    subject: "SoftwareEngineering II",
    date: new Date(Date.now() + 2 * 24*60*60*1000).toISOString().split('T')[0],
    hour: "15:26",
    modality: "In person",
    room: "12A",
    capacity: 150,
    bookedStudents: 151,
    teacherName: "Franco yjtyjty",
    lectureId: 1,
    booked: 2,
    visible:true
  },
  {
    id: 3,
    subject: "SoftwareEngineering II",
    date: new Date(Date.now() + 3 * 24*60*60*1000).toISOString().split('T')[0],
    hour: "15:26",
    modality: "In person",
    room: "12A",
    capacity: 150,
    bookedStudents: 100,
    teacherName: "Franco yjtyjty",
    lectureId: 1,
    booked: 1,
    visible:true
  },
  {
    id: 4,
    subject: "SoftwareEngineering II",
    date: new Date(Date.now() + 3 * 24*60*60*1000).toISOString().split('T')[0],
    hour: "15:26",
    modality: "Virtual",
    room: "12A",
    capacity: 150,
    bookedStudents: 151,
    teacherName: "Franco yjtyjty",
    lectureId: 1,
    booked: 1,
    visible:true
  },
];
const subjects=["SoftwareEngineering II"]

test("AvailableCourses page rendering with lectures list", async () => {
  render(<AvailableCourses
      subjects={subjects}
      lectures={lecturesList}
      errMsg={[]}
  />);

  expect(screen.getByTestId("courses-page")).toBeInTheDocument();
  expect(screen.getAllByTestId("lecture-s-row")[0]).toBeInTheDocument();

});

test("Successfully book a lecture", async () => {
  const mockBookLecture = jest.fn();
  const mockCancelBookingByStudent = jest.fn();

  render(<AvailableCourses
      subjects={subjects}
      lectures={lecturesList}
      errMsg={[]}
      bookLecture={mockBookLecture}
      cancelBookingByStudent={mockCancelBookingByStudent}
  />);

  expect(screen.getByTestId("courses-page")).toBeInTheDocument();
  expect(screen.getAllByTestId("lecture-s-row")[0]).toBeInTheDocument();

  userEvent.click(screen.getAllByTestId("course-book-button")[0], leftClick);
  userEvent.click(screen.getAllByTestId("course-wait-button")[0], leftClick);

  await waitFor(() => expect(mockBookLecture).toHaveBeenCalledTimes(2));
});

test("Successfully cancel a lecture reservation", async () => {
  const mockCancelBookingByStudent = jest.fn();

  render(<AvailableCourses
      subjects={subjects}
      lectures={lecturesList}
      errMsg={[]}
      cancelBookingByStudent={mockCancelBookingByStudent}
  />);

  expect(screen.getByTestId("courses-page")).toBeInTheDocument();
  expect(screen.getAllByTestId("lecture-s-row")[0]).toBeInTheDocument();

  userEvent.click(screen.getAllByTestId("course-cancel-button")[0], leftClick);

  await waitFor(() => expect(mockCancelBookingByStudent).toHaveBeenCalledTimes(1));
});
