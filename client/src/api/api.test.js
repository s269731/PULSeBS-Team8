
// import dependencies
import React from 'react'
import {server,rest} from "./testServer";

import { BrowserRouter as Router } from "react-router-dom";
// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect'
// the component to test
import TeacherPage from "../Components/Teacher/TeacherPage";
import App from "../App";

// ...
test('loads and displays lectures', async () => {
    // eslint-disable-next-line no-restricted-globals
    console.log(location.origin)
    render(<TeacherPage />)

    await waitFor(() => screen.getByTestId('lecturetable'))

    expect(screen.getByTestId('lecturetable')).toHaveTextContent('Course')
    //expect(screen.getByRole('button')).toHaveAttribute('disabled')
})

test('handlers server error', async () => {
    server.use(
        // override the initial "GET /greeting" request handler
        // to return a 500 Server Error
        rest.get("*/api/teacher/lectures", (req, res, ctx) => {
            return res(ctx.status(500))
        })
    )
    render(<TeacherPage />)
    await waitFor(() => screen.getByTestId('error-message'))}
)

test('user', async () => {
    // eslint-disable-next-line no-restricted-globals
    console.log(location.origin)
    render(<Router>
        <App />
    </Router>)

    await waitFor(() =>screen.getByTestId('user-name'))

    expect(screen.getByTestId('user-name')).toHaveTextContent('Matteo');
    //expect(screen.getByRole('button')).toHaveAttribute('disabled')
})

