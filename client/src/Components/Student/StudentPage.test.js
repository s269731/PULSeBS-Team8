import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import StudentPage from "./StudentPage";
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
    booked: 1,
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
    modality: "In person",
    room: "12A",
    capacity: 150,
    bookedStudents: 151,
    teacherName: "Franco yjtyjty",
    lectureId: 1,
    booked: 2,
    visible:true
  },
];

test("Student page rendering/navigation", () => {
  render(<StudentPage />);
  // verify page content for expected route
  expect(screen.getByTestId("student-page")).toBeInTheDocument();

  /* TODO: test tab navigation
  const leftClick = { button: 0 };
  userEvent.click(screen.getByTestId("courses-button"), leftClick);
  expect(history.location.pathname).toBe("/courses");
  userEvent.click(screen.getByTestId("registered-courses-button"), leftClick);
  expect(history.location.pathname).toBe("/registeredCourses");.
   */
});


test("Student page rendering with lectures list", async () => {
  const mockGetLectures = jest.spyOn(API, "getLectures");
  mockGetLectures.mockReturnValue(Promise.resolve(lecturesList));
  const mockNotLoggedUser = jest.fn();

  render(<StudentPage notLoggedUser={mockNotLoggedUser} />);

  expect(screen.getByTestId("courses-page")).toBeInTheDocument();
  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));
});


test("Student page rendering without lectures list", async () => {
  const mockGetLectures = jest.spyOn(API, "getLectures");
  mockGetLectures.mockReturnValue(Promise.reject({ status: 401 }));
  const mockNotLoggedUser = jest.fn();

  render(<StudentPage notLoggedUser={mockNotLoggedUser} />);

  expect(screen.getByTestId("courses-page")).toBeInTheDocument();
  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(1));

  //uncomment this when an error alert with this testid is added to the courses page
  //expect(screen.getByTestId('error-message')).toBeInTheDocument();
});

test("Successfully book a lecture", async () => {
  const mockGetLectures = jest.spyOn(API, "getLectures");
  mockGetLectures.mockReturnValue(Promise.resolve(lecturesList));
  const mockBookLecture = jest.spyOn(API, "bookLeacture");
  mockBookLecture.mockReturnValue(new Promise((resolve) => resolve("ok")));

  render(<StudentPage />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  userEvent.click(screen.getAllByTestId("lectures-tab-button")[0], leftClick);
  await waitFor(() => expect(screen.getAllByTestId("card-toggle")).not.toBeNull());
  userEvent.click(screen.getAllByTestId("card-toggle")[0], leftClick);
  await waitFor(() => expect(screen.getAllByTestId("course-book-button")).not.toBeNull());
  userEvent.click(screen.getAllByTestId("course-book-button")[0], leftClick);
  userEvent.click(screen.getAllByTestId("course-wait-button")[0], leftClick);

  await waitFor(() => expect(mockBookLecture).toHaveBeenCalledTimes(2));
});

test("Should fail to book a lecture if not logged in", async () => {
  const mockGetLectures = jest.spyOn(API, "getLectures");
  mockGetLectures.mockReturnValue(Promise.resolve(lecturesList));
  const mockNotLoggedUser = jest.fn();
  let mockBookLecture = jest.fn();
  mockBookLecture = jest.spyOn(API, "bookLeacture");
  mockBookLecture.mockImplementation(() => {
    return new Promise((resolve, reject) => {
      reject({ status: 401 });
    });
  });

  render(<StudentPage notLoggedUser={mockNotLoggedUser} />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));

  userEvent.click(screen.getAllByTestId("course-book-button")[0], leftClick);
  userEvent.click(screen.getAllByTestId("course-wait-button")[0], leftClick);

  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(mockBookLecture).toHaveBeenCalledTimes(2));
});

test("Successfully cancel a lecture reservation", async () => {
  const mockGetLectures = jest.spyOn(API, "getLectures");
  mockGetLectures.mockReturnValue(Promise.resolve(lecturesList));
  const mockNotLoggedUser = jest.fn();
  let mockcancelBookingByStudent = jest.fn();
  mockcancelBookingByStudent = jest.spyOn(API, "cancelBookingByStudent");
  mockcancelBookingByStudent.mockReturnValue(new Promise((resolve) => resolve("ok")));

  render(<StudentPage notLoggedUser={mockNotLoggedUser} />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));

  userEvent.click(screen.getAllByTestId("course-cancel-button")[0], leftClick);

  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));
  await waitFor(() => expect(mockcancelBookingByStudent).toHaveBeenCalledTimes(1));
});

test("Should fail to cancel a lecture reservation", async () => {
  const mockGetLectures = jest.spyOn(API, "getLectures");
  mockGetLectures.mockReturnValue(Promise.resolve(lecturesList));
  const mockNotLoggedUser = jest.fn();
  let mockcancelBookingByStudent = jest.fn();
  mockcancelBookingByStudent = jest.spyOn(API, "cancelBookingByStudent");
  mockcancelBookingByStudent.mockImplementation(() => {
    return new Promise((resolve, reject) => {
      reject({ status: 401 });
    });
  });

  render(<StudentPage notLoggedUser={mockNotLoggedUser} />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));

  userEvent.click(screen.getAllByTestId("course-cancel-button")[0], leftClick);

  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockcancelBookingByStudent).toHaveBeenCalledTimes(1));
});

/* TODO: simulate tab click
test("Successfully cancel a reservation from calendar view", async () => {
  const mockGetLectures = jest.spyOn(API, "getLectures");
  mockGetLectures.mockReturnValue(Promise.resolve(lecturesList));
  const mockNotLoggedUser = jest.fn();
  const mockcancelBookingByStudent = jest.spyOn(API, "cancelBookingByStudent");
  mockcancelBookingByStudent.mockReturnValue(new Promise((resolve) => resolve("ok")));

  render(<StudentPage notLoggedUser={mockNotLoggedUser} />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));

  const calendarButton = screen.getByTestId("calendar-tab-button");
  expect(calendarButton).toBeInTheDocument();
  userEvent.click(calendarButton, leftClick);

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
 */