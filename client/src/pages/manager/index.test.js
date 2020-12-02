import {render, screen, waitFor} from "@testing-library/react";
import Manager from "./index";
import React from "react";
import API from "../../api/api";

const leftClick = { button: 0 };
let typeOp = [
  'Insert reservation',
  'Cancel reservation',
  'Cancel lecture',
  'Lectures switched to virtual modality'
];
const logs = [
    {"TypeOp0":2,"TypeOp1":1,"TypeOp2":0,"TypeOp3":0},
  {"name_surname":"Mario Rossi","email":"s0001@stud.com","typeOp":0,"lectDate":"2020-12-04T11:30:00.000Z","subject":"Computer Networks","timestamp":"1606904126209.0"},
  {"name_surname":"Mario Rossi","email":"s0001@stud.com","typeOp":1,"lectDate":"2020-12-04T11:30:00.000Z","subject":"Computer Networks","timestamp":"1606904124899.0"},
  {"name_surname":"Mario Rossi","email":"s0001@stud.com","typeOp":0,"lectDate":"2020-12-04T11:30:00.000Z","subject":"Computer Networks","timestamp":"1606903914243.0"}
]
let summary=logs[0]
logs.shift();
const parsedLogs = { summary:summary, logs: logs.map((l)=>{
  return ({
    username:l.name_surname,
    email:l.email,
    operation:typeOp[l.typeOp],
    lectDate:new Date(l.lectDate).toLocaleString("en"),
    subject:l.subject,
    timestamp:new Date(parseInt(l.timestamp)).toLocaleString("en")
  })
})};

test("Manager page rendering", async () => {
  render(<Manager />);

  expect(screen.getByTestId("manager-page")).toBeInTheDocument();
  //expect(screen.getAllByTestId("lecture-s-row")[0]).toBeInTheDocument();

});

/* TODO: find a solution to make jest work with canvasjs
test("Manager page rendering with logs", async () => {
  const mockGetLogs = jest.spyOn(API, "getLogs");
  mockGetLogs.mockReturnValue(Promise.resolve(parsedLogs));

  render(<Manager />);

  expect(screen.getByTestId("manager-page")).toBeInTheDocument();
  await waitFor(() => expect(mockGetLogs).toHaveBeenCalledTimes(1));
});
 */