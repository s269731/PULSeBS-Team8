import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CancelForm from "./CancelForm.js";

const leftClick = { button: 0 };
const lecture = { canDelete: true };

test("Cancel lecture button works", async () => {
  const cancelLecture = jest.fn();

  render(<CancelForm l={lecture} cancelLecture={cancelLecture} />);

  userEvent.click(screen.getByTestId("cancel-lecture-button"), leftClick);

  expect(screen.getByTestId("cancel-lecture-modal")).toBeInTheDocument();

  userEvent.click(
    screen.getByTestId("cancel-lecture-closemodal-button"),
    leftClick
  );
  await waitFor(() => expect(cancelLecture).toHaveBeenCalledTimes(1));
});
