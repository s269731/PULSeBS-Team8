import React from 'react'
import {Container, Row,Col, Alert, Button,ButtonGroup} from 'react-bootstrap'
import StudentList from "./StudentList";
import API from "../../api/api";
import CancelForm from "./CancelForm";


const LectureItem=(props)=>{
    let l=props.lecture;
    let month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    const date=new Date(l.date)
    return <>
        {l.visible &&
        <Container>

                <Row className="justify-content-md-center">

                    <Col>
                        <Alert variant="primary">
                            <Row>
                                <Col>
                                    <Row className="justify-content-md-center">
                                        <h6>Course:</h6>
                                        <Col className="subjectName">
                                            <h6> {l.subject}<br/><br/></h6>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-md-center">
                                       <Col className="align-content-start date">
                                           <h6 className="tableHeader">Date</h6><h5>{date.getDate()} {month[date.getMonth()]} {date.getFullYear()} at {l.hour}</h5>
                                       </Col>
                                        {(l.modality && l.modality==="In person" )?  <><Col  xs={6} md={4} className="align-content-start"><h6 className="tableHeader">Room</h6><h5>{l.room}</h5></Col>
                                               </>
                                            :
                                            <Col  xs={6} md={4} className="align-content-start"><h6 className="tableHeader">Room:</h6><h5>Virtual</h5></Col>}
                                    </Row>
                                    <Row >
                                        {(l.modality && l.modality==="In person" ) &&  <><Col   className="align-content-start"><h6 className="tableHeader">Room Capacity</h6><h5> {l.capacity}</h5></Col></>}
                                       <Col xs={6} md={4} className="align-content-end"><h6 className="tableHeader">Booked students</h6><h5> {l.bookedStudents}</h5></Col>
                                    </Row>
                                </Col>
                            <Col>
                                <Row className="justify-content-md-center">
                                    <StudentList id={l.id} notLoggedUser={props.notLoggedUser}/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                            {this.props.lectures.map((e)=>{return <LectureItem lecture={e} cancelLecture={this.props.cancelLecture} notLoggedUser={this.props.notLoggedUser}/>})}
                        </Col>
                    </Row>

                </Container>

            </>


        )
    }

}
export default LectureTable;