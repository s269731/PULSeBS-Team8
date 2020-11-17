import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import AvailableCourses from "./AvailableCourses";
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

test("AvailableCourses page rendering with lectures list", async () => {
  const mockGetLectures = jest.spyOn(API, "getLectures");
  mockGetLectures.mockReturnValue(Promise.resolve(lecturesList));
  const mockNotLoggedUser = jest.fn();

  render(<AvailableCourses notLoggedUser={mockNotLoggedUser} />);

  expect(screen.getByTestId("courses-page")).toBeInTheDocument();
  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));

  //expect(screen.getByTestId('studentlist-modal')).toBeInTheDocument();
  //close button
  //userEvent.click(screen.getByTestId('close-button'), leftClick);
});

test("AvailableCourses page rendering without lectures list", async () => {
  const mockGetLectures = jest.spyOn(API, "getLectures");
  mockGetLectures.mockReturnValue(Promise.reject({ status: 401 }));
  const mockNotLoggedUser = jest.fn();

  render(<AvailableCourses notLoggedUser={mockNotLoggedUser} />);

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

  render(<AvailableCourses />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));

  userEvent.click(screen.getByTestId("course-book-button"), leftClick);
  userEvent.click(screen.getByTestId("course-wait-button"), leftClick);

  await waitFor(() => expect(mockBookLecture).toHaveBeenCalledTimes(2));
});

test("Should fail to book a lecture", async () => {
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

  render(<AvailableCourses notLoggedUser={mockNotLoggedUser} />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));

  userEvent.click(screen.getByTestId("course-book-button"), leftClick);
  userEvent.click(screen.getByTestId("course-wait-button"), leftClick);

  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(mockBookLecture).toHaveBeenCalledTimes(2));
});
