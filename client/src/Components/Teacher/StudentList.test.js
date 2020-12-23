import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import StudentList from "./StudentList";
import API from "../../api/api";

const leftClick = { button: 0 };
const studentsList = [
  { name: "aa", surname: "bb", email: "a@b.c", status:0 },
  { name: "zz", surname: "yy", email: "z@y.x", status:0 },
];
const presentStudentsList = [
  {id:1, name: "aa", surname: "bb", email: "a@b.c", ssn:"aaa1b",status:3 },
  {id:2, name: "zz", surname: "yy", email: "z@y.x", ssn:"aaabc", status:3 },
];

test("StudentList modal rendering with student list", async () => {
  const mockGetStudentList = jest.spyOn(API, "getStudentListByLectureId");
  mockGetStudentList.mockReturnValue(
    new Promise((resolve) => resolve(studentsList))
  );
  const mockNotLoggedUser = jest.fn();

  render(<StudentList notLoggedUser={mockNotLoggedUser}
                      recordAttendance={false}
                      hasAttendance={false}
                      />);

  userEvent.click(screen.getByTestId("studentlist-button"), leftClick);
  await waitFor(() => expect(mockGetStudentList).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(0));

  expect(screen.getByTestId("studentlist-modal")).toBeInTheDocument();
  //close button
  userEvent.click(screen.getByTestId("close-button"), leftClick);
});

test("StudentList modal rendering without student list", async () => {
  const mockGetStudentList = jest.spyOn(API, "getStudentListByLectureId");
  mockGetStudentList.mockReturnValue(
    new Promise((resolve, reject) => {
      reject({ status: 401 });
    })
  );
  const mockNotLoggedUser = jest.fn();

  render(<StudentList notLoggedUser={mockNotLoggedUser}
                      recordAttendance={false}
                      hasAttendance={false}/>);

  userEvent.click(screen.getByTestId("studentlist-button"), leftClick);
  await waitFor(() => expect(mockGetStudentList).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockNotLoggedUser).toHaveBeenCalledTimes(1));

  expect(screen.getByTestId("error-message")).toBeInTheDocument();
});
test("Student list modal rendering with checkbox", async ()=>{
  const mockGetStudentList=jest.spyOn(API,"getStudentListByLectureId");
  mockGetStudentList.mockReturnValue(new Promise((resolve,reject)=>{
    resolve(presentStudentsList);
  }));
  const mockNotLoggedUser = jest.fn();
  render(<StudentList notLoggedUser={mockNotLoggedUser}
                      recordAttendance={true}
                      hasAttendance={false}/>);
  userEvent.click(screen.getByTestId("studentlist-button"), leftClick);
  await waitFor(() => expect(mockGetStudentList).toHaveBeenCalledTimes(1));
  await waitFor(()=>{expect(screen.getAllByTestId("checkOne")).not.toBeNull()});
  expect(screen.getAllByTestId("checkOne")).toHaveLength(2)
  expect(screen.getAllByTestId("checkAll")).toHaveLength(1)
  expect(screen.getByTestId("submit-attendance-button")).not.toBeNull()
})
