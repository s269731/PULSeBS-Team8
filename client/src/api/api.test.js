import React from 'react'
import {server,rest} from "./testServer";
import { BrowserRouter as Router } from "react-router-dom";
// import react-testing methods
import { render, fireEvent, waitFor, screen ,act } from '@testing-library/react'
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect'
// the component to test
import TeacherPage from "../Components/Teacher/TeacherPage";
import App from "../App";
import API from "./api";
import Login from "../pages/logins/index";
import Navbar from "../Components/Navbar.js";
import StudentList from "../Components/Teacher/StudentList";
import userEvent from "@testing-library/user-event";
import CancelForm from "../Components/Teacher/CancelForm";
import AvailableCourses from "../Components/Student/AvailableCourses";
import RegisteredCourses from "../Components/Student/LecturesCalendar";


const leftClick = { button: 0 };

test('right login', async () => {
    const loginSpy=jest.spyOn(API, "Login");
    // eslint-disable-next-line no-restricted-globals
    let { container } = render(
        <Login login={API.Login} loading={false} error={false} />
    );
    act(() => {
        let inputEmail = container.querySelector('input[name="email"]');
        let inputPass = container.querySelector('input[name="password"]');
        expect(inputEmail).not.toBe(null);
        expect(inputPass).not.toBe(null);
        fireEvent.change(inputEmail, {
            target: { value: "sdfgjsuinv@gmail.com" },
        });
        fireEvent.change(inputPass, { target: { value: "p4ssw0rd" } });
    });
    const button = container.querySelector("[data-testid=login-button]");
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    await waitFor(() => expect(loginSpy).toHaveBeenCalledTimes(1));
})

test('wrong login', async () => {
    server.use(
        rest.post('http://localhost/api/login',(req,res,ctx)=>{
            return res(ctx.status(404))
        })
    )
    const loginSpy=jest.spyOn(API, "Login");
    // eslint-disable-next-line no-restricted-globals
    let { container } = render(
        <Login login={API.Login} loading={false} error={true} />
    );

    const button = container.querySelector("[data-testid=login-button]");
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() => expect(loginSpy).toHaveBeenCalledTimes(0));
})

test('get auth user', async () => {
    render(<Router>
        <App />
    </Router>)
    await waitFor(() =>screen.getByTestId('user-name'))
    expect(screen.getByTestId('user-name')).toHaveTextContent('Matteo');
})

test('get no auth user', async () => {
    server.use(
        rest.get('http://localhost/api/user',((req, res, ctx)=>{
            return res(ctx.status(401), )
        }))
    )
    render(<Router>
        <App />
    </Router>)
    await waitFor(() =>screen.queryByTestId('user-name')==null)
    expect(screen.queryByTestId('user-name')).toBeNull()
})

test('logout', async ()=>{
    const logoutSpy=jest.spyOn(API, "userLogout");
    let {container}= render(
        <Router><Navbar
        path="/home"
        loggedUser={{id: 1, role: "D", name: "Matteo", surname: "Bianchi"}}
        logout={API.userLogout}
    /></Router>)
    const button = container.querySelector("[data-testid=logout-link]");
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() => expect(logoutSpy).toHaveBeenCalledTimes(1));
})


test('loads and displays lectures for teachers', async () => {
    render(<TeacherPage />)
    await waitFor(() => screen.getByTestId('lecturetable'))
    expect(screen.getByTestId('lecturetable')).toHaveTextContent('Course')
})

test('handlers server error for teacher lectures', async () => {
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
test('get student list with more some student', async()=> {
     render(<StudentList
        id={1}
    />)
    userEvent.click(screen.getByTestId("studentlist-button"), leftClick);
    await waitFor(() => expect(screen.getAllByTestId('student-row')).toHaveLength(2))
})
test('get student list with no students', async()=> {
    server.use(
        rest.get('http://localhost/api/teacher/lectures/:lectureId',((req,res,ctx)=>{
            return res(ctx.status(200), ctx.json([]))
        }))
    )
    render(<StudentList
        id={1}
    />)
    userEvent.click(screen.getByTestId("studentlist-button"), leftClick);
    await waitFor(() => expect(screen.getByTestId('no-student-message')));
})

test('teacher delete a lecture', async()=>{
    const deleteSpy=jest.spyOn(API, "deleteLectureByTeacher");
    render( <CancelForm l={{
        id: 4,
        subject: "SoftwareEngineering II",
        date: "2020-11-17",
        hour: "17:26",
        modality: "In person",
        room: "12A",
        capacity: 50,
        bookedStudents: 100,
        teacherName: "Franco yjtyjty",
        lectureId: 4,
        booked: false,
        canDelete:true
    }} cancelLecture={API.deleteLectureByTeacher} />)

    userEvent.click(screen.getByTestId("cancel-lecture-button"), leftClick);

    expect(screen.getByTestId("cancel-lecture-modal")).toBeInTheDocument();

    userEvent.click(
        screen.getByTestId("cancel-lecture-closemodal-button"),
        leftClick
    );
    await waitFor(() => expect(deleteSpy).toHaveBeenCalledTimes(1));
})

test('show student lectures list', async ()=>{
    render(<AvailableCourses />);

    expect(screen.getByTestId("courses-page")).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByTestId('lecture-s-row')).toHaveLength(3))
})

test('show student lectures list for no auth user', async ()=>{
    server.use(
        rest.get('http://localhost/api/student/lectures',((req,res,ctx)=>{
            return res(ctx.status(401))
        }))
    )
    render(<AvailableCourses />);
    await waitFor(() => expect(screen.queryAllByTestId('lecture-s-row')).toHaveLength(0))
})


test('book a lecture', async ()=>{
    render(<AvailableCourses />);
    expect(screen.getByTestId("courses-page")).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByTestId('lecture-s-row')).toHaveLength(3))
    userEvent.click(screen.getByTestId("course-book-button"), leftClick);
    //await waitFor(() => expect(screen.getByTestId("confirm-message")).toHaveLength(1));
})

test('student get his bookings', async()=>{
    const getSpy=jest.spyOn(API, "getBookedLectures");
    render(<RegisteredCourses />);
    await waitFor(() => expect(getSpy).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("registered-courses-page")).toBeInTheDocument();

})

test('student deletes a booking', async ()=>{
    const deleteSpy=jest.spyOn(API, "cancelBookingByStudent");
    render(<AvailableCourses />);
    expect(screen.getByTestId("courses-page")).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByTestId('lecture-s-row')).toHaveLength(3))
    userEvent.click(screen.getAllByTestId("course-cancel-button")[0], leftClick);
    await waitFor(() => expect(deleteSpy).toHaveBeenCalledTimes(1));
})

