import React from 'react';
import {Row,Col,Container}from 'react-bootstrap'
import LectureTable from "./LectureTable.js";
class TeacherPage extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return <>
            <Container>
            <Col>
            <Row className="justify-content-md-left ">
                <h1>Hello, teacher!</h1>
            </Row>
            <Row className="justify-content-md-left ">
                <h3>This is your personal page</h3>
            </Row>
            </Col>
                <LectureTable></LectureTable>
            </Container>
            </>
    }

}

export default TeacherPage;