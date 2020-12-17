import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import ModifyLecture from "./ModifyLecture";
import ModifyModal from "./ModifyModal";

import API from "../../api/api";

const leftClick = { button: 0 };
const mockNotLoggedUser = jest.fn();

const Courses = [
  [
    {
        "SubjectId": "XY1211",
        "SubjName": "Metodi di finanziamento delle imprese",
        "Year": 1,
        "Semester": 1,
        "Tname": "Ines",
        "Tsurname": "Beneventi",
        "Modality": "Virtual",
        "schedules": [
            {
                "ScheduleId": 1,
                "Class": 1,
                "Day": "Mon",
                "Capacity": 121,
                "Hour": "08:30-11:30"
            },
            {
                "ScheduleId": 3,
                "Class": 2,
                "Day": "Tue",
                "Capacity": 120,
                "Hour": "16:00-17:30"
            },
            {
                "ScheduleId": 52,
                "Class": 1,
                "Day": "Mon",
                "Capacity": 120,
                "Hour": "8:30-11:30"
            },
            {
                "ScheduleId": 54,
                "Class": 2,
                "Day": "Tue",
                "Capacity": 120,
                "Hour": "16:00-17:30"
            }
        ]
    }
]
]


let a={
  "SubjectId": "Metodi di finanziamento delle imprese",
  "ScheduleId": 1,
  "Class": 1,
  "Day":  "Mon",
  "Capacity":  121,
  "Hour": "08:30-11:30"
}

test("List of Courses for Officer", async () => {
  render(<ModifyLecture
      lectures={Courses}/>);

  expect(screen.getByTestId("lecturetable")).toBeInTheDocument();
  expect(screen.getAllByTestId("lecture-s-row")[0]).toBeInTheDocument();
  userEvent.click(screen.getByTestId("Change-Schedule-Id"), leftClick);

});


test("Officer page Change Modality", async () => {
  render(<ModifyLecture
    lectures={Courses}/>);

  expect(screen.getByTestId("Change-Modality-Id")).toBeInTheDocument();
  userEvent.click(screen.getByTestId("Change-Modality-Id"), leftClick);
});

test("Officer page Change Schedule", async () => {
  render(<ModifyLecture
    lectures={Courses}/>);

   expect(screen.getByTestId("Change-Schedule-Id")).toBeInTheDocument();
   userEvent.click(screen.getByTestId("Change-Schedule-Id"), leftClick);

});



test("Officer check Box", async () => {
  
    render(<ModifyLecture
      lectures={Courses}/>);

  expect(screen.getByTestId("checkAll")).toBeInTheDocument();

});



test("Officer filter lectures button check", async () => {

  let Years= [
    {
      SubjectId: 1,
      SubjectName: "1st Year"
    }, {
      SubjectId: 2,
      SubjectName: "2nd Year"
    }, {
      SubjectId: 3,
      SubjectName: "3rd Year"
    }, {
      SubjectId: 4,
      SubjectName: "4th Year"
    }, {
      SubjectId: 5,
      SubjectName: "5th Year"
    }
  ]
  const mockGetLectures = jest.spyOn(API, "getOfficerSchedule");
  mockGetLectures.mockReturnValue(new Promise((resolve) => resolve(Courses)));
  render(<ModifyLecture notLoggedUser={mockNotLoggedUser} />);
    //check year button
  // userEvent.click(screen.getByTestId("changeYear"), leftClick);

});

