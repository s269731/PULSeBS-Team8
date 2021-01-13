import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import ModifyModal from "./ModifyModal";
import {Card} from "react-bootstrap";

const leftClick = { button: 0 };
const schedule={
    Day:"Mon",
    Class:5,
Capacity:100
}
test("Modify Modal rendering", async () => {
    render(<ModifyModal sc={schedule} hr={"16:00"} min={"18:30"} id={3}/>
    );

    await  waitFor(() => expect(screen.getByTestId( "modify-schedule-button")).toBeInTheDocument());
    await  waitFor(() => userEvent.click(screen.getByTestId("modify-schedule-button"), leftClick));
    await  waitFor(() => expect(screen.getByTestId("modify-lecture-schedule-closemodal-button")).toBeInTheDocument());
    await  waitFor(() => expect(screen.getByTestId("modification-lecture-modal")).toBeInTheDocument());


});