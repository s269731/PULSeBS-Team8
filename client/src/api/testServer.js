// import dependencies
import React from 'react'

// import API mocking utilities from Mock Service Worker
import { rest } from 'msw'
import { setupServer } from 'msw/node'

// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect'
// the component to test
import TeacherPage from "../Components/Teacher/TeacherPage";
const lectures=[{
        lectureId: 1,
        subjectName: "SoftwareEngineering I",
    dateHour: "2020-11-20T15:26:00.029Z",
        modality: "In person",
        className: "12A",
        capacity: 150,
        bookedPeople: 100,
        teacherName: "Franco yjtyjty",


    },
    {
        lectureId: 2,
        subjectName: "SoftwareEngineering II",
        dateHour: "2020-11-28T17:26:00.029Z",
        modality: "Remote",
        room: "12A",
        capacity: 50,
        bookedStudents: 100,
        teacherName: "Franco yjtyjty",
    },
    {
        lectureId: 4,
        subjectName: "SoftwareEngineering II",
        dateHour: "2020-11-17T17:26:00.029Z",
        modality: "In person",
        room: "12A",
        capacity: 50,
        bookedStudents: 100,
        teacherName: "Franco yjtyjty"
    }]
const handlers=[

    rest.get('http://localhost/api/user',((req, res, ctx)=>{
        return res(ctx.status(200), ctx.json({id: 1, role: "D", name: "Matteo", surname: "Bianchi"}))
    })),

    rest.post('http://localhost/api/login',(req,res,ctx)=>{
        return res(ctx.status(200),ctx.json({
            id: 1, username: req.body.email
        }))
    }),

    rest.get('http://localhost/api/teacher/lectures',((req,res,ctx)=>{
        return res(ctx.status(200), ctx.json(lectures))
    }))

]
// declare which API requests to mock
const server = setupServer(...handlers)

export{server,rest}