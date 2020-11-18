import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { } from "history";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import TeacherPage from "./TeacherPage";
import API from "../../api/api";

const leftClick = { button: 0 };
const lectures = [
  {
    id: 1,
    subject: "SoftwareEngineering I",
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
    date: "2020-11-28",
    hour: "17:26",
    modality: "Remote",
    room: "12A",
    capacity: 50,
    bookedStudents: 100,
    teacherName: "Franco yjtyjty",
    lectureId: 2,
    booked: false,
  },
  {
    id: 4,
    subject: "SoftwareEngineering II",
    date: "2020-11-17",
    hour: "17:26",
    modality: "In person",
    room: "12A",
    capacity: 50,
    bookedStudents: 100,
    teacherName: "Franco yjtyjty",
    lectureId: 4,
    booked: false,
  },
];

test("Teacher page rendering with lectures", async () => {
  const mockGetLectures = jest.spyOn(API, "getLecturesTeacher");
  mockGetLectures.mockReturnValue(new Promise((resolve) => resolve(lectures)));
  const mockNotLoggedUser = jest.fn();

  render(<TeacherPage notLoggedUser={mockNotLoggedUser} />);

  expect(screen.getByTestId("teacher-page")).toBeInTheDocument();

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));
  expect(screen.getByTestId("lecturetable")).toBeInTheDocument();
});

test("Teacher page rendering with failing lectures api", async () => {
  const mockGetLectures = jest.spyOn(API, "getLecturesTeacher");
  mockGetLectures.mockReturnValue(
    new Promise((resolve, reject) => {
      reject({ status: 401 });
    })
  );
  const mockNotLoggedUser = jest.fn();

  render(<TeacherPage notLoggedUser={mockNotLoggedUser} />);

  expect(screen.getByTestId("teacher-page")).toBeInTheDocument();

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(1));
  expect(screen.getByTestId("error-message")).toBeInTheDocument();
});

test("LectureTable filter lectures button works", async () => {
  const mockGetLectures = jest.spyOn(API, "getLecturesTeacher");
  mockGetLectures.mockReturnValue(new Promise((resolve) => resolve(lectures)));
  const mockNotLoggedUser = jest.fn();

  render(<TeacherPage />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));

  //TODO: add checks to see if the correct modality is shown
  userEvent.click(screen.getAllByTestId("handlelecture-button")[0], leftClick);
  //expect(screen.getByTestId('modality-in-person')).toBeInTheDocument();
  userEvent.click(screen.getAllByTestId("handlelecture-button")[1], leftClick);
  //expect(screen.getByTestId('modality-remote')).toBeInTheDocument();
});
