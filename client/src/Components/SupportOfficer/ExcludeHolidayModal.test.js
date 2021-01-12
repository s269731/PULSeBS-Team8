import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import ExcludeHolidayModal from "./ExcludeHolidayModal";


const leftClick = { button: 0 };

 test("Exclude Holiday Modal rendering", async () => {
    render(<ExcludeHolidayModal/>);
    await  waitFor(() => expect(screen.getByTestId("exc-holiday-button")).toBeInTheDocument());
    await  waitFor(() => userEvent.click(screen.getByTestId("exc-holiday-button"), leftClick));
    await  waitFor(() => expect(screen.getByTestId("exc-holiday-modal")).toBeInTheDocument());
    await  waitFor(() => expect(screen.getByTestId("exc-holiday-close")).toBeInTheDocument());
    await  waitFor(() => userEvent.click(screen.getByTestId("exc-holiday-close"), leftClick));

  });