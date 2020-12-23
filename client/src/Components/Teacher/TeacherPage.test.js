import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";

import TeacherPage from "./TeacherPage";
import API from "../../api/api";
import {act} from "react-dom/test-utils";

const mockNotLoggedUser = jest.fn();
const leftClick = { button: 0 };

const subjects=[
  {SubjectId:1,SubjectName:"SoftwareEngineering II"},
  {SubjectId:2,SubjectName:"SoftwareEngineering I"}

]
let lectDay=new Date(Date.now() + 2 * 24*60*60*1000).toISOString()
let fields = lectDay.split("T");
let date = fields[0];
console.log(date)
let min = new Date(lectDay).getMinutes().toString()
if (min.length===1) {
  min = '0'+min
}
let hour = new Date(lectDay).getHours() + ":" + min;
console.log(hour)
let pastLectDay=new Date(Date.now() - 2*60*60*1000).toISOString()
let pastFields = pastLectDay.split("T");
let pastDate = pastFields[0];
console.log(pastDate)
let pmin = new Date(pastLectDay).getMinutes().toString()
if (pmin === '0') {
  pmin = '00'
}
let phour = new Date(pastLectDay).getHours() + ":" + pmin;
const pastLectures = [
  {
    id: 1,
    subject: "SoftwareEngineering I",
    date: pastDate,
    hour: phour,
    modality: "In person",
    room: "12A",
    capacity: 150,
    bookedStudents: 100,
    teacherName: "Franco yjtyjty",
    lectureId: 1,
    booked: false,
    canDelete: false,
    canModify:false,
    hasAttendance:false, canRecordAttendance:true,
  },
  {
    id: 2,
    subject: "SoftwareEngineering II",
    date: pastDate,
    hour: phour,
    modality: "In person",
    room: "12A",
    capacity: 50,
    bookedStudents: 50,
    teacherName: "Franco yjtyjty",
    lectureId: 2,
    booked: false,
    canDelete: false,
    canModify:false,
    hasAttendance:false, canRecordAttendance:true,
  },
  {
    id: 4,
    subject: "SoftwareEngineering II",
    date: pastDate,
    hour: phour,
    modality: "In person",
    room: "12A",
    capacity: 50,
    bookedStudents: 50,
    teacherName: "Franco yjtyjty",
    lectureId: 4,
    booked: false,
    canDelete: false,
    canModify: false,
    hasAttendance:false, canRecordAttendance:true
  },]
const lectures=[ {
  id: 1,
  subject: "SoftwareEngineering I",
  date: pastDate,
  hour: phour,
  modality: "In person",
  room: "12A",
  capacity: 150,
  bookedStudents: 100,
  teacherName: "Franco yjtyjty",
  lectureId: 1,
  booked: false,
  canDelete: false,
  canModify:false,
  hasAttendance:false, canRecordAttendance:true,
},{
    id: 4,
    subject: "SoftwareEngineering II",
    date: date,
    hour: hour,
    modality: "In person",
    room: "12A",
    capacity: 50,
    bookedStudents: 100,
    teacherName: "Franco yjtyjty",
    lectureId: 4,
    booked: false,
    canDelete: true,
    canModify: true,
    hasAttendance:false,
    canRecordAttendance:false,
    presentStudents:0,
  },
  {
    id: 4,
    subject: "SoftwareEngineering II",
    date: date,
    hour: hour,
    modality: "In person",
    room: "12A",
    capacity: 50,
    bookedStudents: 100,
    teacherName: "Franco yjtyjty",
    lectureId: 4,
    booked: false,
    canDelete: false,
    canModify: false,
    hasAttendance:false,
    canRecordAttendance:false,
    presentStudents:0,
  },
];
const studentsList = [
  { name: "aa", surname: "bb", email: "a@b.c", status:0 },
  { name: "zz", surname: "yy", email: "z@y.x", status:0 },
];
const presentStudentsList = [
  {id:1, name: "aa", surname: "bb", email: "a@b.c", ssn:"aaa1b",status:0 },
  {id:2, name: "zz", surname: "yy", email: "z@y.x", ssn:"aaabc", status:0 },
];
test("Teacher page rendering with lectures", async () => {
  const mockGetLectures = jest.spyOn(API, "getLecturesTeacher");
  mockGetLectures.mockReturnValue(new Promise((resolve) => resolve(lectures)));
  const mockGetPastLectures = jest.spyOn(API, "getPastLecturesTeacher");
  mockGetPastLectures.mockReturnValue(new Promise((resolve) => resolve(pastLectures)));
  const mockGetSubjects=jest.spyOn(API, "getCourses");
  mockGetSubjects.mockReturnValue(new Promise((resolve) => resolve(subjects)));
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
  const mockGetPastLectures = jest.spyOn(API, "getPastLecturesTeacher");
  mockGetPastLectures.mockReturnValue(new Promise((resolve) => resolve(pastLectures)));
  const mockGetSubjects=jest.spyOn(API, "getCourses");
  mockGetSubjects.mockReturnValue(new Promise((resolve) => resolve(subjects)));

  render(<TeacherPage notLoggedUser={mockNotLoggedUser} />);

  expect(screen.getByTestId("teacher-page")).toBeInTheDocument();

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(1));
  expect(screen.getByTestId("error-message")).toBeInTheDocument();
});

test("LectureTable filter lectures button works", async () => {
  const mockGetLectures = jest.spyOn(API, "getLecturesTeacher");
  mockGetLectures.mockReturnValue(new Promise((resolve) => resolve(lectures)));
  const mockGetPastLectures = jest.spyOn(API, "getPastLecturesTeacher");
  mockGetPastLectures.mockReturnValue(new Promise((resolve) => resolve(pastLectures)));
  const mockGetSubjects=jest.spyOn(API, "getCourses");
  mockGetSubjects.mockReturnValue(new Promise((resolve) => resolve(subjects)));
  render(<TeacherPage />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));

  //TODO: add checks to see if the correct modality is shown
  userEvent.click(screen.getAllByTestId("handlelecture-button")[0], leftClick);
  //expect(screen.getByTestId('modality-in-person')).toBeInTheDocument();
  userEvent.click(screen.getAllByTestId("handlelecture-button")[1], leftClick);
  //expect(screen.getByTestId('modality-remote')).toBeInTheDocument();
});

test("LectureTable cancel filter lectures button works", async () => {
  const mockGetLectures = jest.spyOn(API, "getLecturesTeacher");
  mockGetLectures.mockReturnValue(new Promise((resolve) => resolve(lectures)));
  const mockGetPastLectures = jest.spyOn(API, "getPastLecturesTeacher");
  mockGetPastLectures.mockReturnValue(new Promise((resolve) => resolve(pastLectures)));
  const mockGetSubjects=jest.spyOn(API, "getCourses");
  mockGetSubjects.mockReturnValue(new Promise((resolve) => resolve(subjects)));
  render(<TeacherPage />);

  await waitFor(() => expect(mockGetLectures).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));

  //TODO: add checks to see if the correct modality is shown
  userEvent.click(screen.getAllByTestId("handlelecture-del-button")[0], leftClick);
  //expect(screen.getByTestId('modality-in-person')).toBeInTheDocument();
});

test("Cancel lecture button from Teacher Page works", async () => {
  const mockDeleteLectureByTeacher = jest.spyOn(API, "deleteLectureByTeacher");
  mockDeleteLectureByTeacher.mockReturnValue(new Promise((resolve) => resolve(lectures)));
  const mockGetLectures = jest.spyOn(API, "getLecturesTeacher");
  mockGetLectures.mockReturnValue(new Promise((resolve) => resolve(lectures)));
  const mockGetPastLectures = jest.spyOn(API, "getPastLecturesTeacher");
  mockGetPastLectures.mockReturnValue(new Promise((resolve) => resolve(pastLectures)));
  const mockGetSubjects = jest.spyOn(API, "getCourses");
  mockGetSubjects.mockReturnValue(new Promise((resolve) => resolve(subjects)));
  render(<TeacherPage notLoggedUser={mockNotLoggedUser}/>);

  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));
  userEvent.click(screen.getAllByTestId("tab-next-lect")[0], leftClick);
  await waitFor(() => expect(screen.getAllByTestId("card-toggle")).not.toBeNull());
  userEvent.click(screen.getAllByTestId("card-toggle")[0], leftClick);
  userEvent.click(screen.getAllByTestId("cancel-lecture-button")[0], leftClick);
  expect(screen.getByTestId("modification-lecture-modal")).toBeInTheDocument();
  userEvent.click(
      screen.getByTestId("cancel-lecture-closemodal-button"),
      leftClick
  );
});

//FIXME: right now, the test works only on a lecture of today of 2 hours ago. We should find a way to click on the tab button in  order to access to previous lectures
  test("Insert attendance form from Teacher Page works", async () => {
    const mockInsertAttendanceByTeacher = jest.spyOn(API, "insertAttendanceInfo");
    mockInsertAttendanceByTeacher.mockReturnValue(new Promise((resolve) => resolve()));
    const mockGetLectures=jest.spyOn(API, "getLecturesTeacher");
    const mockGetPastLectures = jest.spyOn(API, "getPastLecturesTeacher");
    mockGetPastLectures.mockReturnValue(new Promise((resolve) => resolve(pastLectures)));
    mockGetLectures.mockReturnValue(new Promise((resolve) => resolve(lectures)));
    const mockGetSubjects=jest.spyOn(API, "getCourses");
    mockGetSubjects.mockReturnValue(new Promise((resolve) => resolve(subjects)));
    const mockGetStudents=jest.spyOn(API,"getStudentListByLectureId");
    mockGetStudents.mockReturnValue(new Promise((resolve)=>resolve(presentStudentsList)))
    const res=render(<TeacherPage notLoggedUser={mockNotLoggedUser} />);

    await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(screen.getAllByTestId("card-toggle")).not.toBeNull());
    console.log(screen.getAllByTestId("past-card-toggle").length)
    userEvent.click(screen.getAllByTestId("past-card-toggle")[0], leftClick);
    userEvent.click(screen.getAllByTestId("studentlist-button")[0], leftClick);
    await waitFor(() => expect(mockGetStudents).toHaveBeenCalledTimes(1));
    await waitFor(()=> expect(screen.getByTestId("studentlist-modal")).toBeInTheDocument())
    await waitFor(()=>{expect(screen.getAllByTestId("checkOne")).not.toBeNull()});

    userEvent.click(
        screen.getAllByTestId("checkOne")[0],
        leftClick
    );
    userEvent.click(
        screen.getAllByTestId("checkOne")[0],
        leftClick
    );
    userEvent.click(screen.getByTestId("submit-attendance-button"))
    await waitFor(() => expect(screen.getByTestId("confirm-button")).not.toBeNull());
    userEvent.click(
        screen.getByTestId("confirm-button"),
        leftClick
    );

  await waitFor(() => expect(mockInsertAttendanceByTeacher).toHaveBeenCalledTimes(1));
});


test("Modify lecture button from Teacher Page works", async () => {
  const mockGetLectures = jest.spyOn(API, "getLecturesTeacher");
  mockGetLectures.mockReturnValue(new Promise((resolve) => resolve(lectures)));
  const mockModifyLectureByTeacher = jest.spyOn(API, "changeModalityLecture");
  mockModifyLectureByTeacher.mockReturnValue(new Promise((resolve) => resolve(lectures)));
  const mockGetSubjects=jest.spyOn(API, "getCourses");
  mockGetSubjects.mockReturnValue(new Promise((resolve) => resolve(subjects)));
  const mockGetPastLectures = jest.spyOn(API, "getPastLecturesTeacher");
  mockGetPastLectures.mockReturnValue(new Promise((resolve) => resolve(pastLectures)));
  render(<TeacherPage notLoggedUser={mockNotLoggedUser} canShowGraphs={false}/>);

  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));
  await waitFor(() => expect(screen.getAllByTestId("card-toggle")).not.toBeNull());
  userEvent.click(screen.getAllByTestId("card-toggle")[0], leftClick);
  await
  userEvent.click(screen.getAllByTestId("modify-lecture-button")[0], leftClick);
  await waitFor(() =>  expect(screen.getByTestId("modification-lecture-modal")).toBeInTheDocument());
  userEvent.click(
      screen.getByTestId("modify-lecture-closemodal-button"),
      leftClick
  );
  await waitFor(() => expect(mockModifyLectureByTeacher).toHaveBeenCalledTimes(1));
});

/*FIXME
test("Cancel lecture button from Teacher Page doesn't work", async () => {
  const mockGetLectures = jest.spyOn(API, "getLecturesTeacher");
  mockGetLectures.mockReturnValue(new Promise((resolve) => resolve(lectures)));

  const mockDeleteLectureByTeacher = jest.spyOn(API, "deleteLectureByTeacher");
  mockDeleteLectureByTeacher.mockReturnValue(
    new Promise((resolve, reject) => {
      reject({ status: 401 });
    })
  );

  render(<TeacherPage notLoggedUser={mockNotLoggedUser} />);

  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));

  userEvent.click(screen.getAllByTestId("cancel-lecture-button")[0], leftClick);

  expect(screen.getByTestId("cancel-lecture-modal")).toBeInTheDocument();

  userEvent.click(
    screen.getByTestId("cancel-lecture-closemodal-button"),
    leftClick
  );

  await waitFor(() => expect(mockDeleteLectureByTeacher).toHaveBeenCalledTimes(1));
});
*/
