import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActionsForm from "./ActionsForm";
import {act} from "react-dom/test-utils";

const leftClick = { button: 0 };
const lecture = { canDelete: true, canModify:true, hasAttendance:false, canRecordAttendance:true, bookedStudents:10 };

test("Cancel lecture button works", async () => {
    const cancelLecture = jest.fn();

    render(<ActionsForm l={lecture} cancelLecture={cancelLecture} operation={'delete'}/>);

    userEvent.click(screen.getByTestId("cancel-lecture-button"), leftClick);

    expect(screen.getByTestId("modification-lecture-modal")).toBeInTheDocument();

    userEvent.click(
        screen.getByTestId("cancel-lecture-closemodal-button"),
        leftClick
    );
    await waitFor(() => expect(cancelLecture).toHaveBeenCalledTimes(1));
});


test("Modify lecture button works", async () => {
    const modifyLecture = jest.fn();

    render(<ActionsForm l={lecture} changeModalityLecture={modifyLecture} operation={'modify'}/>);

    userEvent.click(screen.getByTestId("modify-lecture-button"), leftClick);

    expect(screen.getByTestId("modification-lecture-modal")).toBeInTheDocument();

    userEvent.click(
        screen.getByTestId("modify-lecture-closemodal-button"),
        leftClick
    );
    await waitFor(() => expect(modifyLecture).toHaveBeenCalledTimes(1));
});
/*
test("Insert attendance number works", async ()=>{
    const recordAttLecture = jest.fn();

    render(<ActionsForm l={lecture} recordAttendance={recordAttLecture} operation={'recordAttendance'}/>);

    userEvent.click(screen.getByTestId("record-attendance-lecture-button"), leftClick);

    await waitFor(() =>  expect(screen.getByTestId("insert-attendance-field")).toBeInTheDocument());
    act(() => {
        let inputNumber = screen.getByTestId("insert-attendance-field")
        console.log(inputNumber)
        expect(inputNumber).not.toBe(null);
        fireEvent.change(inputNumber, {
            target: { value: "3" },
        });
    })
    userEvent.click(
        screen.getByTestId("submit-button"),
        leftClick
    );

    await waitFor(() => expect(recordAttLecture).toHaveBeenCalledTimes(1));

})*/