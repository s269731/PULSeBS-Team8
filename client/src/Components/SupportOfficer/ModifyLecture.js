import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Accordion,
  Button,
  ButtonGroup,
  Form
} from "react-bootstrap";
import API from "../../api/api";
import Jumbotron from "../../assets/edit.jpg";



class ModifyLecture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Years: [
        {
          SubjectId: 1,
          SubjectName: "1st Year"
        }, {
          SubjectId: 2,
          SubjectName: "2nd Year"
        }, {
          SubjectId: 3,
          SubjectName: "3rd Year"
        }, {
          SubjectId: 4,
          SubjectName: "4th Year"
        }
        , {
          SubjectId: 5,
          SubjectName: "5th Year"
        }
      ],
      delete: "del",
      checkedCourses: [],
      students: [],
      loading: true,
      serverErr: false,
      lectures: [],
      filteredLec2: [],
      allChecked: false
    };
  }

  deleteCourse(id){
    let lectures = this.state.lectures.filter(lectures => 
      {return lectures !== id});
    this.setState({lectures: lectures});
  }

  componentDidMount() {
    API.getOfficerSchedule()
        .then((res) => {
          this.setState({ lectures: res});
          this.setState({filteredLec2: res})
        })
        .catch((err) => {
          if (err.status === 401) {
            // this.props.notLoggedUser();
          }
           this.setState({ serverErr: true, loading: null });
        });
  }


  changeYear=(id)=>{
    if (id === "del") {
      this.setState({lectures: this.state.filteredLec2});
    }
    else{ 
    this.setState({filteredLec2: this.state.filteredLec2})
    let filteredLec = this.state.filteredLec2.filter(item => 
      {return item.Year === id});
    this.setState({lectures: filteredLec});
  }
}

selectAll(event){
  const isChecked = event.target.checked;
  if (isChecked) {
    let courses = [...this.state.checkedCourses,test];
    this.setState=({allChecked: true})
    this.setState({checkedCourses: courses});
  } else {
    let courses = this.state.checkedCourses.filter(courses => 
      {return courses.id !== test.id});
    this.setState({checkedCourses: courses});
  }
}

  chooseCourse(event, id, subjId, modality) {
    const isChecked = event.target.checked;
    let test={
      id: id,
      SubjectId: subjId,
      Modality: modality
    }
    if (isChecked) {
      let courses = [...this.state.checkedCourses,test];
      this.setState({checkedCourses: courses});
    } else {
      let courses = this.state.checkedCourses.filter(courses => 
        {return courses.id !== test.id});
      this.setState({checkedCourses: courses});
    }
  }


  changeModality=(courses)=>{
    API.changeModalityCourse(courses)
    .then(() => {
      console.log("helloSuccess")
      // this.componentDidMount();
    }).catch((err) => {
  console.log(err+"");
  if (err.status === 401) {
    this.props.notLoggedUser();
  }});
  }

  render() {
    return ( <> 
    <Container fluid data-testid="lecturetable" className={"lectureTable"}>
      <Row className="justify-content-md-center below-nav">
        <h3 className={"headerLectureList"}>List of Courses:
        </h3 >
      </Row>
      < Row className="justify-content-md-center">
        <Col className="col-2 justify-content-md-center">
          <h3>Years</h3>
          <ButtonGroup vertical>
            {this.state.Years.map((e) => {
                // console.log(e)
                return ( <> 
                <Button
                  variant="primary"
                  onClick={() => this.changeYear(e.SubjectId)}
                  data-testid="handlelecture-button">
                  {e.SubjectName}
                </Button> < br /> 
                </>);
              })}
              <Button
                  variant={"danger"}
                  onClick={(e) => {
                    this.changeYear(this.state.delete);
                  }}
                  data-testid="handlelecture-del-button"
                >
                  Cancel filters
                </Button>
          </ButtonGroup>
          <br></br>
          <br></br>
          <br></br>
          
          {this.state.checkedCourses.length > 0  &&
          <h4>Change Modality</h4>
          }
          {this.state.checkedCourses.length > 0 && 
          <Button block  variant="info" data-testid="handlelecture-button14"
          onClick={() => this.changeModality(this.state.checkedCourses)}>
            Change Modality
          </Button>
           }
         
        </Col>
        <Row>
          <Row></Row>
          <Row></Row>

        <Form.Check     
                          className="my-1 mr-sm-2"
                          label="Check All"
                          key={1}
                          type="checkbox"
                         />
        </Row>
        
        < Col className="col-8">
          <Accordion className="box-shadow" defaultActiveKey="0">
            {this.state.lectures.map((e, id) => {
                return (
                  <Form>
                    <Form.Group controlId="formBasicCheckbox">
                      <Row className="border-bottom  pb-3 pt-2 mb-0" data-testid="lecture-s-row">
                        <Form.Check
                          key={id + 1}
                          type="checkbox"
                          onChange={event => this.chooseCourse(event, id, e.SubjectId, e.Modality)}/>
                        <h5>{id + 1}.</h5>
                        <Col className="subjectName">
                          <h5 >
                            {e.SubjName }
                          </h5>
                        
                        </Col>
                        <Col>
                <h5><b>Course Code:</b> {e.SubjectId}</h5>
                        </Col>
                        <Col className="align-content-start date">
                          <h5>
                            <b>Days of Week</b>
                            {e.schedules.map((sc, id) => {
                return (  <>
                      <select name="Todays_Day">
                          <option value="Mon">Monday</option>
                          <option value="Tue">Tuesday</option>
                          <option value="Wed">Wednesday</option>
                          <option value="Thu">Thursday</option>
                          <option value="Fri">Friday</option>
                          <option value="Sat">Saturday</option>
                          <option value="Sun">Sunday</option>
                      </select>
                      <h5></h5>
                            <h5>{sc.Hour}</h5>
                           </>
              )})}
                          </h5>
                        </Col>
                <Col>
                <Row></Row>
                <Row><h5><b>Year:</b> {e.Year} </h5></Row>
                <Row><h5><b>Semestr:</b> {e.Semester }</h5></Row>
                <Row><h5><b>Teacher:</b> {e.Tname} {e.Tsurname}</h5></Row>
                <Row><h5><b>Modality:</b> {e.Modality}</h5> </Row>
                </Col>
                {/* <Col>
                
                </Col> */}
                <Button data-testid="course-upload-button" variant="light">
          <img
            style={{
            height: "2rem",
            float: "left",
            margin: "2px"
          }}
            src={Jumbotron}
            alt="my image"
            onClick={this.routeAddCor}/>
             </Button>
                      </Row>
                      
                    </Form.Group>
                  </Form>
                );
              })}
          </Accordion>
        </Col>
      </Row >
    </Container> 
    </>
    );
  }
}
export default ModifyLecture;