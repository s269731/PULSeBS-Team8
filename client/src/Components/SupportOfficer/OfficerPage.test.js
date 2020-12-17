import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import OfficerPage from "./OfficerPage";
import API from "../../api/api";
import {Router} from "react-router-dom";
import { createMemoryHistory } from "history";


const leftClick = { button: 0 };

test("test OfficerPage student-upload-button", async () => {
  const history = createMemoryHistory();

  render(
      <Router history={history}>
        <OfficerPage />
      </Router>
  );
    
  userEvent.click(screen.getByTestId("student-upload-button"), leftClick);
});

  test("test OfficerPage teacher-upload-button", async () => {
    const history = createMemoryHistory();
  
    render(
        <Router history={history}>
          <OfficerPage />
        </Router>
    );
      
    userEvent.click(screen.getByTestId("teacher-upload-button"), leftClick);
  });

  test("test OfficerPage lecture-upload-button", async () => {
    const history = createMemoryHistory();
  
    render(
        <Router history={history}>
          <OfficerPage />
        </Router>
    );
      
    userEvent.click(screen.getByTestId("lecture-upload-button"), leftClick);
  });

  test("test OfficerPage course-upload-button", async () => {
    const history = createMemoryHistory();
  
    render(
        <Router history={history}>
          <OfficerPage />
        </Router>
    );
      
    userEvent.click(screen.getByTestId("course-upload-button"), leftClick);
  });

  test("test OfficerPage subject-upload-button", async () => {
    const history = createMemoryHistory();
  
    render(
        <Router history={history}>
          <OfficerPage />
        </Router>
    );
      
    userEvent.click(screen.getByTestId("subject-upload-button"), leftClick);
  });

