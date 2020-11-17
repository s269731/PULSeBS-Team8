import React from 'react'
import {Container, Row,Col, Alert, Button} from 'react-bootstrap'
import API from "../../api/api";


const LectureItem=(props)=>{
    let l=props.lecture;
    let bookLecture=props.bookLecture;
    let errMsg=props.errMsg
    let key=props.k

    return <>
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
                           <Col></Col>
                           <Col></Col>
                           <Col className="align-content-start date">
                               {<h5>{errMsg[key]}</h5>}
                               {console.log(key+" kkk")}
                           </Col>
                        </Row>
                        <Row >
                           <Col  xs={20} md={3} className="align-content-start"><h5>Room: {l.room}</h5></Col>
                           <Col  xs={20} md={3} className="align-content-end"><h5>Booked students: {l.bookedStudents}</h5></Col>
                           <Col  xs={20} md={3} className="align-content-end"><h5>Class Capacity: {l.capacity}</h5></Col>

                           {l.modality !=="In person" && <Col><h5>Lecture is Virtual</h5></Col>}
                           {l.modality==="In person" && l.booked===false && l.bookedStudents<l.capacity && <Col><Button data-testid="course-book-button" onClick={() => bookLecture(l.lectureId)} size="lg" variant="success" block>Book Now</Button></Col> }
                           {l.modality==="In person" && l.booked===false && l.bookedStudents>l.capacity && <Col><Button data-testid="course-wait-button" onClick={() => bookLecture(l.lectureId)} size="lg" variant="warning" block>Wait</Button></Col> }
                           {l.modality==="In person" && l.booked===true && l.bookedStudents<l.capacity && <Col><h5>You already booked</h5></Col> }
                           {l.modality==="In person" && l.booked===true && l.bookedStudents>l.capacity && <Col><h5>You are in waiting list</h5></Col>}
                        </Row>
                    </Alert>
                </Col>
            </Row>
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


    bookLecture=(id)=> {
         this.componentDidMount();
        API.bookLeacture(id).then((res)=>{
            let a=JSON.stringify(res.errors[0].msg);
            console.log(a+" aa");
            const err=this.state.lectures.map((i, key)=>{
                if(i.id===id && a === '"Booking is closed for that Lecture"'){
                    return a;
                }
                else{
                    return null;
                }
            })
            this.setState({errMsg: err})
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
            refresh: true,
            errMsg: []}
    }
    render(){
        return(
            <>
                <Container fluid data-testid="courses-page">
                    <Row className="justify-content-md-center below-nav"><h3>Available Courses: </h3></Row>
                    {this.state.lectures.map((e, key)=>{return <LectureItem errMsg={this.state.errMsg}  lecture={e}  bookLecture={this.bookLecture} k={key}/>})}
                </Container>
            </>
        )
    }

}
export default AvailableCourses;
