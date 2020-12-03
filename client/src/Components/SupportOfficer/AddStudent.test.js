import API from "../../api/api";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {Router} from "react-router-dom";
import AddStudent from "./AddStudent";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import React from "react";


test("full app rendering/navigating to login and logout", async () => {
  const history = createMemoryHistory();

  render(
      <Router history={history}>
        <AddStudent />
      </Router>
  );

  expect(screen.getByTestId('upload-page')).toBeInTheDocument();
});