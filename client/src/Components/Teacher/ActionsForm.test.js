import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActionsForm from "./ActionsForm";

const leftClick = { button: 0 };
const lecture = { canDelete: true, canModify:true };

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