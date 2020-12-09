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


class ModifyLecture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [
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
      years: "1st",
      delete: "del",
      checkedCourses: [],
      students: [],
      loading: true,
      serverErr: false,
      changeYear: "1",
      lectures: [],
      filteredLec2: []
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

  chooseCourse(event, id) {
    const isChecked = event.target.checked;
    if (isChecked) {

      let courses = [...this.state.checkedCourses,id];
      this.setState({checkedCourses: courses});
    } else {

      let courses = this.state.checkedCourses.filter(courses => 
        {return courses !== id});
      this.setState({checkedCourses: courses});
    }
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
            {this.state.subjects.map((e) => {
                console.log(e)
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
          <Button block  variant="info" data-testid="handlelecture-button1">
            Change to Virtual
          </Button>
           }
          <br></br>
           {this.state.checkedCourses.length > 0 && 
          <Button block variant="info" data-testid="handlelecture-button1">
            Change to InPerson
          </Button>
           }
           <br></br>
           {this.state.checkedCourses.length > 0 && 
          <Button block variant="danger" data-testid="handlelecture-button">
            Delete Selected Courses
          </Button> }
         
        </Col>
        < Col className="col-8">
          <Accordion className="box-shadow" defaultActiveKey="0">
            {this
              .state
              .lectures
              .map((e, id) => {
                return (
                  <Form>
                    <Form.Group controlId="formBasicCheckbox">
                      <Row className="border-bottom  pb-3 pt-2 mb-0" data-testid="lecture-s-row">
                        <Form.Check
                          key={id + 1}
                          type="checkbox"
                          onChange={event => this.chooseCourse(event, id)}/>
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
                            <h5>{sc.Day}</h5>
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