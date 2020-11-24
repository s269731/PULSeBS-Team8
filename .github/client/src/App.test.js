import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";
import API from "./api/api";

const leftClick = { button: 0 };
const fakeUser = { id: 1, role: "D", name:"user1", surname:"test", email: "dfdf@sdf.com" };

test("full app rendering/navigating to login and logout", async () => {
  const history = createMemoryHistory();

  const mockLogin = jest.spyOn(API, "Login");
  mockLogin.mockReturnValue(new Promise((resolve) => resolve(fakeUser)));

  const mockUserLogout = jest.spyOn(API, "userLogout");
  mockUserLogout.mockReturnValue(new Promise((resolve) => resolve("ok")));

  const mockGetUser = jest.mock();
  mockGetUser
    .spyOn(API, "getUser")
    .mockReturnValue(
      new Promise((resolve) =>
        resolve(fakeUser)
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

  userEvent.click(screen.getByText(/Login/i), leftClick);

  // check that the content changed to the login page
  expect(screen.getByTestId("login-page")).toBeInTheDocument();
  expect(screen.getByTestId("login-button")).toBeInTheDocument();

  //change inputs for login
  let inputEmail = document.querySelector('input[name="email"]');
  let inputPass = document.querySelector('input[name="password"]');
  expect(inputEmail).not.toBe(null);
  expect(inputPass).not.toBe(null);
  fireEvent.change(inputEmail, {
    target: { value: "sdfgjsuinv@gmail.com" },
  });
  fireEvent.change(inputPass, { target: { value: "p4ssw0rd" } });

  //click on the login button
  userEvent.click(screen.getByTestId('login-button'), leftClick);

  await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1));

  await new Promise((r) => setTimeout(r, 1000));

  //click on the logout button
  userEvent.click(screen.getByTestId('logout-link'), leftClick);

  await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1));

  API.getUser.mockRestore();
  API.Login.mockRestore();
  API.userLogout.mockRestore();
});

test("fail when getting the current user", () => {
  const history = createMemoryHistory();

  const mockGetUser = jest.mock();
  mockGetUser
    .spyOn(API, "getUser")
    .mockReturnValue(
      new Promise((resolve, reject) =>
        reject({status:401})
      )
    );

  render(
    <Router history={history}>
      <App />
    </Router>
  );

  expect(screen.getByText(/Login/i)).toBeInTheDocument();

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

  API.getUser.mockRestore();
});
