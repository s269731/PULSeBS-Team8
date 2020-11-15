import React from 'react'
import {Container, Row,Col, Alert, Button} from 'react-bootstrap'
import API from "../../api/api";


const LectureItem=(props)=>{
     let l=props.lecture;
     let bookLeacture=props.bookLeacture;
    return <>
        <Container>
                <Row>
                    <Col>
                        <Alert variant="primary">
                            <Row>
                                <Col className="subjectName">
                                    <h6>{l.subject}<br/> </h6>
                                </Col>
                            </Row>
                            <Row className="justify-content-md-center">
                               <Col className="align-content-start date">
                                   <h5>Lecture Date: {l.date} at {l.hour}</h5>
                               </Col>
                            </Row>   
                            <Row className="justify-content-md-center">
                               <Col className="align-content-start date">
                                   <h5>Teacher Name: {l.teacherName}</h5>
                               </Col>
                            </Row>
                            <Row className="justify-content-md-center">
                               <Col className="align-content-start date">
                                   <h5>Leacture Modality: {l.modality}</h5>
                               </Col>
                            </Row>
                            <Row >
                               <Col  xs={20} md={3} className="align-content-start"><h5>Room: {l.room}</h5></Col>
                               <Col  xs={20} md={3} className="align-content-end"><h5>Booked students: {l.bookedStudents}</h5></Col>
                               <Col  xs={20} md={3} className="align-content-end"><h5>Class Capacity: {l.capacity}</h5></Col>
                               { l.booked===false && l.bookedStudents<l.capacity && <Col><Button onClick={() => bookLeacture(l.lectureId)} size="lg" variant="success" block>Book Now</Button></Col> }
                               {l.booked===false && l.bookedStudents>l.capacity && <Col><Button onClick={() => bookLeacture(l.lectureId)} size="lg" variant="warning" block>Wait</Button></Col> }
                               {l.booked===true && l.bookedStudents<l.capacity && <Col><h5>You already booked</h5></Col> } 
                               {l.booked===true && l.bookedStudents>l.capacity && <Col><h5>You are in waiting list</h5></Col>} 
                            </Row>
                            
                        </Alert>
                    </Col>
                </Row>
            </Container>
    </>
}

class AvailableCourses extends React.Component{


    componentDidMount() {
        API.getLectures().then((res)=>{
             this.setState({lectures:res,loading:null,serverErr:null})
        }).catch((err)=>{
            if(err.status===401){
                this.props.notLoggedUser()
            }
            this.setState({serverErr:true,loading:null})
        })
    }


    bookLeacture=(id)=> {
         this.componentDidMount();
        API.bookLeacture(id).then((res)=>{
            console.log(res)
        }).catch((err)=>{
            if(err.status===401){
                this.props.notLoggedUser()
            }
            this.setState({serverErr:true,loading:null})
        })
      }


    constructor(props) {
        super(props);
        this.state={lectures:[],
            refresh: true}
    }
    render(){
        return(
            <>
                <Container fluid>
                    <Row className="justify-content-md-center below-nav"><h3>Available Courses: </h3></Row>
                    {this.state.lectures.map((e, key)=>{return <LectureItem  lecture={e}  bookLeacture={this.bookLeacture} key={key}/>})}
                </Container>

            </>


        )
    }

}
export default AvailableCourses;