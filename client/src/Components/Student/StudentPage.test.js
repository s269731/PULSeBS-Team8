import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import StudentPage from "./StudentPage";

test("Student page rendering/navigation", () => {
  const history = createMemoryHistory();

  jest.mock();

  render(
    <Router history={history}>
      <StudentPage history={history} />
    </Router>
  );
  // verify page content for expected route
  expect(screen.getByTestId("student-page")).toBeInTheDocument();

  const leftClick = { button: 0 };
  userEvent.click(screen.getByTestId("courses-button"), leftClick);
  expect(history.location.pathname).toBe("/courses");
  userEvent.click(screen.getByTestId("registered-courses-button"), leftClick);
  expect(history.location.pathname).toBe("/registeredCourses");
});
