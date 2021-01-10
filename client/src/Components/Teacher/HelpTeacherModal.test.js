import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import HelpTeacherModal from "./HelpTeacherModal";


const leftClick = { button: 0 };

 test("Teacher page Modal rendering", async () => {
    render(<HelpTeacherModal/>);
    await  waitFor(() => expect(screen.getByTestId("help-button")).toBeInTheDocument());
    await waitFor(() => userEvent.click(screen.getByTestId("help-button"), leftClick));

  });