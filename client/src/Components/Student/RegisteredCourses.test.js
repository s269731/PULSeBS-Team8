import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import RegisteredCourses from "./LecturesCalendar";
import API from "../../api/api";

const leftClick = { button: 0 };
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

test("RegisteredCourses page rendering with lectures list", async () => {
  const mockGetLectures = jest.spyOn(API, "getBookedLectures");
  mockGetLectures.mockReturnValue(Promise.resolve(lecturesList));
  const mockNotLoggedUser = jest.fn();

  render(<RegisteredCourses notLoggedUser={mockNotLoggedUser} />);

  expect(screen.getByTestId("registered-courses-page")).toBeInTheDocument();
  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));
});
test("RegisteredCourses page rendering without lectures list", async () => {
  const mockGetLectures = jest.spyOn(API, "getBookedLectures");
  mockGetLectures.mockReturnValue(Promise.reject({ status: 401 }));
  const mockNotLoggedUser = jest.fn();

  render(<RegisteredCourses notLoggedUser={mockNotLoggedUser} />);

  expect(screen.getByTestId("registered-courses-page")).toBeInTheDocument();
  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(1));

  //FIXME: uncomment this when an error alert with this testid is added to the courses page
  //expect(screen.getByTestId('error-message')).toBeInTheDocument();
});

test("Successfully cancel a reservation", async () => {
  const mockGetLectures = jest.spyOn(API, "getBookedLectures");
  mockGetLectures.mockReturnValue(Promise.resolve(lecturesList));
  const mockNotLoggedUser = jest.fn();
  const mockcancelBookingByStudent = jest.spyOn(API, "cancelBookingByStudent");
  mockcancelBookingByStudent.mockReturnValue(new Promise((resolve) => resolve("ok")));

  render(<RegisteredCourses notLoggedUser={mockNotLoggedUser} />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));

  userEvent.click(
    screen.getAllByTestId("open-popover-cancel-reservation-button")[0],
    leftClick
  );
  const cancelButton = screen.getByTestId("cancel-reservation-button");
  expect(cancelButton).toBeInTheDocument();
  userEvent.click(cancelButton, leftClick);

  //FIXME: when a success alert is added, test if it's in the page
  //expect(screen.getByTestId('successfully-cancel-reservation-alert')).toBeInTheDocument()
});

test("Error in cancelling a reservation", async () => {
  const mockGetLectures = jest.spyOn(API, "getBookedLectures");
  mockGetLectures.mockReturnValue(Promise.resolve(lecturesList));
  const mockNotLoggedUser = jest.fn();
  const mockcancelBookingByStudent = jest.spyOn(API, "cancelBookingByStudent");
  mockcancelBookingByStudent.mockImplementation(() => {
    return new Promise((resolve, reject) => {
      reject({ status: 401 });
    });
  });

  render(<RegisteredCourses notLoggedUser={mockNotLoggedUser} />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));

  userEvent.click(
    screen.getAllByTestId("open-popover-cancel-reservation-button")[0],
    leftClick
  );
  const cancelButton = screen.getByTestId("cancel-reservation-button");
  expect(cancelButton).toBeInTheDocument();
  userEvent.click(cancelButton, leftClick);

  await waitFor(() => expect(mockcancelBookingByStudent).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(1));

  //FIXME: when an error alert is added, test if it's in the page
  //expect(screen.getByTestId('error-cancel-reservation-alert')).toBeInTheDocument()
});
