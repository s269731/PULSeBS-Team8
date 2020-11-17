import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent, getByTestId, getByText, waitFor, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import Login from "./index";

describe("Input", () => {
  afterEach(() => {
    cleanup();
  });

  it("handle login with non-empty email and password", async () => {
    const mockLogin = jest.fn().mockImplementation(() => {
      console.log("mockLogin mock triggered");
    });
    let { container } = render(<Login login={mockLogin} loading={false} error={false} />);

    act(() => {
      let inputEmail = container.querySelector('input[name="email"]');
      let inputPass = container.querySelector('input[name="password"]');
      expect(inputEmail).not.toBe(null);
      expect(inputPass).not.toBe(null);
      fireEvent.change(inputEmail, { target: { value: "sdfgjsuinv@gmail.com" } });
      fireEvent.change(inputPass, { target: { value: "p4ssw0rd" } });

    });
    const button = container.querySelector("[data-testid=login]");
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1))
  });

  it("handle login with empty email and password", async () => {
    const mockLogin = jest.fn().mockImplementation(() => {
      console.log("mockLogin mock triggered");
    });
    let { container } = render(<Login login={mockLogin} loading={false} error={true} />);

    const button = container.querySelector("[data-testid=login]");
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(0))
  });
});
