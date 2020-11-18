import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";
import API from "./api/api";

test("full app rendering/navigating", () => {
  const history = createMemoryHistory();

  const mockGetUser = jest.mock();
  mockGetUser
    .spyOn(API, "getUser")
    .mockReturnValue(
      new Promise((resolve) =>
        resolve({ id: 1, role: "D", email: "dfdf@sdf.com" })
      )
    );

  render(
    <Router history={history}>
      <App />
    </Router>
  );
  // verify page content for expected route
  // often you'd use a data-testid or role query, but this is also possible
  expect(screen.getByText(/Login/i)).toBeInTheDocument();

  const leftClick = { button: 0 };
  userEvent.click(screen.getByText(/Login/i), leftClick);

  // check that the content changed to the new page
  expect(screen.getByTestId("login-page")).toBeInTheDocument();

  API.getUser.mockRestore();
});

test("random routes redirect to home page", () => {
  const history = createMemoryHistory();
  const mockGetUser = jest.mock();
  mockGetUser
    .spyOn(API, "getUser")
    .mockReturnValue(
      new Promise((resolve) =>
        resolve({ id: 1, role: "S", email: "dfdf@sdf.com" })
      )
    );
  history.push("/some/bad/route");
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  expect(screen.getByTestId("home-page")).toBeInTheDocument();
});
