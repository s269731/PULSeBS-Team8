import React from 'react';
import {Row,Col,Container}from 'react-bootstrap'
import LectureTable from "./LectureTable.js";
class TeacherPage extends React.Component{
    constructor(props) {
        super(props);
        this.state={lectures:[
            {subject:"COMPUTER SCIENCE",date:"30/11/2020",hour:"16:00",room:"VIRTUAL",bookedStudents:26},
                {subject:"COMPUTER SCIENCE",date:"01/12/2020",hour:"13:00",room:"VIRTUAL",bookedStudents:123},
                {subject:"COMPUTER SCIENCE",date:"04/12/2020",hour:"10:00",room:"VIRTUAL",bookedStudents:78},
                {subject:"COMPUTER SCIENCE",date:"05/12/2020",hour:"08:30",room:"VIRTUAL",bookedStudents:56}

            ]}
    }

    render(){
        return <>
            <Container fluid>
                <LectureTable lectures={this.state.lectures}></LectureTable>
            </Container>
            </>
    }

}

export default TeacherPage;