import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import StudentPage from "./StudentPage";
import HelpStudentModal from "./HelpStudentModal";


const leftClick = { button: 0 };

 test("Student page Modal rendering", async () => {
    render(<HelpStudentModal/>);
    await  waitFor(() => expect(screen.getByTestId("help-button")).toBeInTheDocument());
    await waitFor(() => userEvent.click(screen.getByTestId("help-button"), leftClick));
    // await waitFor(() => expect(screen.getAllByTestId("student-page-modal")).toBeInTheDocument());
  });