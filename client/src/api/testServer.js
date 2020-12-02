// import dependencies
import React from 'react'
// import API mocking utilities from Mock Service Worker
import { rest } from 'msw'
import { setupServer } from 'msw/node'
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect'

const students=[
        {
            role:"S",
            name:"Luca",
            surname:"Barco",
            email:"pippo@topolino.com"
        },
        {
            role:"S",
            name: "Matteo",
            surname: "Berri",
            email: "pluto@topolino.com"
        }
    ]
const subjects=[
    {SubjectId:1,SubjectName:"SoftwareEngineering II"},
    {SubjectId:2,SubjectName:"SoftwareEngineering I"}

]
const stats=[{
    subjectId:{SubjectId:1, SubjectName:"SoftwareEngineering II"},
    dailystatsarray:[{
        date:"2020-11-28T17:26:00.029Z",
        bookedSeats:100,
        unoccupiedSeats:50
    }],
    weeklystatsarray:[
        {
            weekId:'23-28 NOV 2020',
            weeklyavgbookings:100,
            weeklyavgunoccupiedplaces:50
        }
    ],
    monthlystatsarray:[
        {
            monthId: 'NOV-2020',
            monthlyavgbookings: 100,
            monthlyavgunoccupiedseats: 50
        }

    ]
}]
const lectures=[
        {
            lectureId: 1,
            subjectName: "SoftwareEngineering I",
            dateHour: new Date(Date.now() + 2 * 24*60*60*1000).toISOString(),
            modality: "In person",
            className: "12A",
            capacity: 150,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
        },
        {
            lectureId: 2,
            subjectName: "SoftwareEngineering II",
            dateHour: new Date(Date.now() + 2 * 24*60*60*1000).toISOString(),
            modality: "Remote",
            room: "12A",
            capacity: 50,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
        },
        {
            lectureId: 4,
            subjectName: "SoftwareEngineering II",
            dateHour: new Date(Date.now() + 2 * 24*60*60*1000).toISOString(),
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
            dateHour: new Date(Date.now() + 2 * 24*60*60*1000).toISOString(),
            modality: "In person",
            className: "12A",
            capacity: 150,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
            booked:0

        },
        {
            lectureId: 2,
            subjectName: "SoftwareEngineering II",
            dateHour: new Date(Date.now() + 2 * 24*60*60*1000).toISOString(),
            modality: "In person",
            room: "12A",
            capacity: 50,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
            booked:0
        },
        {
            lectureId: 4,
            subjectName: "SoftwareEngineering II",
            dateHour: new Date(Date.now() + 2 * 24*60*60*1000).toISOString(),
            modality: "In person",
            room: "12A",
            capacity: 50,
            bookedPeople: 100,
            teacherName: "Franco yjtyjty",
            booked:2
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
    rest.get('http://localhost/api/teacher/subjects',((req,res,ctx)=>{
        return res(ctx.status(200), ctx.json(subjects))
    })),
    rest.get('http://localhost/api/teacher/statistics',((req,res,ctx)=>{
        return res(ctx.status(200), ctx.json(stats))
    })),


]
// declare which API requests to mock
const server = setupServer(...handlers)

export{server,rest}