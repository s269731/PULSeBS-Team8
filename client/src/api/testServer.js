// import dependencies
import React from 'react'
// import API mocking utilities from Mock Service Worker
import { rest } from 'msw'
import { setupServer } from 'msw/node'
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect'

const students=[
        {
            name:"Luca",
            surname:"Barco",
            email:"pippo@topolino.com"
        },
        {
            name: "Matteo",
            surname: "Berri",
            email: "pluto@topolino.com"
        }
    ]

const lectures=[
        {
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
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
        },
        {
            lectureId: 4,
            subjectName: "SoftwareEngineering II",
            dateHour: "2020-11-17T17:26:00.029Z",
            modality: "In person",
            room: "12A",
            capacity: 50,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty"
        }
    ]

const studentslectures=[
        {
            lectureId: 1,
            subjectName: "SoftwareEngineering I",
            dateHour: "2020-11-20T15:26:00.029Z",
            modality: "In person",
            className: "12A",
            capacity: 150,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
            booked:false

        },
        {
            lectureId: 2,
            subjectName: "SoftwareEngineering II",
            dateHour: "2020-11-28T17:26:00.029Z",
            modality: "In person",
            room: "12A",
            capacity: 50,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
            booked:true
        },
        {
            lectureId: 4,
            subjectName: "SoftwareEngineering II",
            dateHour: "2020-11-17T17:26:00.029Z",
            modality: "In person",
            room: "12A",
            capacity: 50,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
            booked:true
        }
    ]
const studentsbookings=[
        {
            lectureId: 2,
            subjectName: "SoftwareEngineering II",
            dateHour: "2020-11-28T17:26:00.029Z",
            modality: "In person",
            room: "12A",
            capacity: 50,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
            booked:true
        },
        {
            lectureId: 4,
            subjectName: "SoftwareEngineering II",
            dateHour: "2020-11-17T17:26:00.029Z",
            modality: "In person",
            room: "12A",
            capacity: 50,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
            booked:true
        }
    ]

const handlers=[
    rest.get('http://localhost/api/user',((req, res, ctx)=>{
        return res(ctx.status(200), ctx.json({id: 1, role: "D", name: "Matteo", surname: "Bianchi"}))
    })),
    rest.post('http://localhost/api/login',(req,res,ctx)=>{
        return res(ctx.status(200),ctx.json({
            id: 1, username: req.body.email
        }))
    }),
    rest.post('http://localhost/api/logout',(req,res,ctx)=>{
        return res(ctx.status(200))
    }),
    rest.get('http://localhost/api/teacher/lectures',((req,res,ctx)=>{
        return res(ctx.status(200), ctx.json(lectures))
    })),
    rest.get('http://localhost/api/teacher/lectures/:lectureId',((req,res,ctx)=>{
        return res(ctx.status(200), ctx.json(students))
    })),
    rest.delete('http://localhost/api/teacher/lectures/:lectureId',((req,res,ctx)=>{
        return res(ctx.status(200),ctx.json({}))
    })),
    rest.post('http://localhost/api/teacher/changemodality',(req,res,ctx)=>{
        return res(ctx.status(200))
    }),
    rest.get('http://localhost/api/student/lectures',((req,res,ctx)=>{
        return res(ctx.status(200), ctx.json(studentslectures))
    })),
    rest.post('http://localhost/api/student/reserve',(req,res,ctx)=>{
        return res(ctx.status(200))
    }),
    rest.get('http://localhost/api/student/bookings',((req,res,ctx)=>{
        return res(ctx.status(200), ctx.json(studentsbookings))
    })),

]
// declare which API requests to mock
const server = setupServer(...handlers)

export{server,rest}