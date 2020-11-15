import React from 'react'
import {Container, Row,Col, Alert, Button,ButtonGroup} from 'react-bootstrap'
import StudentList from "./StudentList";
import API from "../../api/api";
import CancelForm from "./CancelForm";


const LectureItem=(props)=>{
    let l=props.lecture;

    return <>
        {l.visible &&
        <Container>
                <Row className="justify-content-md-center">

                    <Col>
                        <Alert variant="primary">
                            <Row>
                                <Col>
                                    <Row className="justify-content-md-center">
                                        <Col className="subjectName">
                                            <h6>{l.subject}<br/></h6>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-md-center">
                                       <Col className="align-content-start date">
                                           <h5>Lecture of {l.date} at {l.hour}</h5>
                                       </Col>
                                        {(l.modality && l.modality==="In person" )?  <><Col  xs={6} md={4} className="align-content-start"><h5>Room: {l.room}</h5></Col>
                                               </>
                                            :
                                            <Col  xs={6} md={4} className="align-content-start"><h5>Room: Virtual</h5></Col>}
                                    </Row>
                                    <Row >
                                        {(l.modality && l.modality==="In person" ) &&  <><Col   className="align-content-start"><h5>Room Capacity: {l.capacity}</h5></Col></>}
                                       <Col  className="align-content-end"><h5>Booked students: {l.bookedStudents}</h5></Col>
                                    </Row>
                                </Col>
                            <Col>
                                <Row className="justify-content-md-center">
                                    <StudentList id={l.id} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <CancelForm l={l} cancelLecture={props.cancelLecture}/></Row>
                            </Col>
                            </Row>
                        </Alert>
                    </Col>

                </Row>
            </Container>}
    </>
}


class LectureTable extends React.Component{
    constructor(props) {
        super(props);
        this.state={students:[], loading:true, serverErr:false,lectures:props.lectures}
    }


    handleLectures(id){
        let lects=this.state.lectures
        for(let l of lects){
            l.visible = l.subject === id;
        }
        this.setState({lectures:lects})
    }
    render(){
        return(
            <>
                <Container fluid>
                    <Row className="justify-content-md-center below-nav"><h3>Your next lectures: </h3></Row>
                    <Row className="justify-content-md-center below-nav">
                        <Col className="col-3 justify-content-md-center">
                            <h5>Courses</h5>
                            <ButtonGroup vertical>
                                {this.props.subjects.map((e)=>{
                                console.log(e)
                                return <><Button variant="primary" value={e} key={e} onClick={(e)=>{this.handleLectures(e.target.value)}}>
                                    {e}
                                </Button><br/></>})}
                            </ButtonGroup>

                        </Col>
                        <Col>
                            {this.props.lectures.map((e)=>{return <LectureItem lecture={e} cancelLecture={this.props.cancelLecture}/>})}
                        </Col>
                    </Row>

                </Container>

            </>


        )
    }

}
export default LectureTable;