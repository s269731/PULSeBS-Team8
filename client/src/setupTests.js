// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import {server, rest} from "./api/testServer.js"
// establish API mocking before all tests
beforeAll(() => server.listen({
    onUnhandledRequest(req) {
        console.error(
            'Found an unhandled %s request to %s',
            req.method,
            req.url.href,
        )
    },
}))
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())
// clean up once the tests are done
afterAll(() => server.close())