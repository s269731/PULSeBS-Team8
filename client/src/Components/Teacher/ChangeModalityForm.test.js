import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangeModalityForm from "./ChangeModalityForm";

const leftClick = { button: 0 };
const lecture = { canModify: true };

test("Modify lecture button works", async () => {
    const modifyLecture = jest.fn();

    render(<ChangeModalityForm l={lecture} changeModalityLecture={modifyLecture} />);

    userEvent.click(screen.getByTestId("modify-lecture-button"), leftClick);

    expect(screen.getByTestId("modify-lecture-modal")).toBeInTheDocument();

    userEvent.click(
        screen.getByTestId("modify-lecture-closemodal-button"),
        leftClick
    );
    await waitFor(() => expect(modifyLecture).toHaveBeenCalledTimes(1));
});
