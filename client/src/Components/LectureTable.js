import React from 'react'
import {Container, Row,Col, Alert} from 'react-bootstrap'

const LectureItem=(props)=>{/*
    return <>
        <Container>
                <Row>
                    <Col>
                        <Alert variant="primary">
                            <Row className="subjectName">
                                <h5>{props.subject}<br/></h5>
                            </Row>
                            <Row>
                               <Col  xs={6} md={4} className="align-content-start"><h4>Lecture of {props.date} at {props.hour}</h4></Col>
                            </Row>
                            <Row>
                               <Col  xs={6} md={4} className="align-content-start"><h4>Room: {props.room}</h4></Col>
                               <Col  xs={6} md={4} className="align-content-end"><h4>Booked students: {props.bookedStudents}</h4></Col>
                            </Row>
                        </Alert>
                    </Col>
                </Row>
            </Container>
    </>*/
}


class LectureTable extends React.Component{
    constructor(props) {
        super(props);

    }
    render(){
        return(
            <>
            <Container>
                <Row>
                    <Col>
                        <Alert variant="primary">
                            <Row className="subjectName">
                                <h5>Subject1<br/></h5>
                            </Row>
                            <Row>
                               <Col  xs={6} md={4} className="align-content-start"><h4>Lecture of 12/10/2020 at 16:00</h4></Col>
                            </Row>
                            <Row>
                               <Col  xs={6} md={4} className="align-content-start"><h4>Room: Virtual</h4></Col>
                               <Col  xs={6} md={4} className="align-content-end"><h4>Booked students: 100</h4></Col>
                            </Row>
                        </Alert>
                    </Col>
                </Row>
            </Container>

            </>


        )
    }

}
export default LectureTable;