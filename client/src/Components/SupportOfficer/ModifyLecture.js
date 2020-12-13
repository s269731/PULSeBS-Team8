import React from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Accordion,
  Button,
  ButtonGroup,
  Form
} from "react-bootstrap";
import API from "../../api/api";
import Jumbotron from "../../assets/edit.jpg";
import TimeField from 'react-simple-timefield';

const options = [
  {
    label: "Mon",
    value: "Mon"
  }, {
    label: "Tue",
    value: "Tue"
  }, {
    label: "Wed",
    value: "Wed"
  }, {
    label: "Thu",
    value: "Thu"
  }, {
    label: "Fri",
    value: "Fri"
  }, {
    label: "Sat",
    value: "Sat"
  }
];

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
        }, {
          SubjectId: 5,
          SubjectName: "5th Year"
        }
      ],
      delete: "del",
      checkedCourses: [],
      students: [],
      loading: true,
      refresh: false,
      serverErr: false,
      lectures: [],
      filteredLec1: [],
      filteredLec2: [],
      allChecked: false,
      changeYear: false,
      year: "del",
      weekDay: "",
      disabled: true,
      scId: null
    };
  }

  deleteCourse(id) {
    let lectures = this
      .state
      .lectures
      .filter(lectures => {
        return lectures !== id
      });
    this.setState({lectures: lectures});
  }

  componentDidMount() {
    API
      .getOfficerSchedule()
      .then((res) => {
        if (this.state.changeYear === true) {
          this.setState({lectures: this.state.filteredLec1})
          this.setState({filteredLec2: res})
          this.changeYear(this.state.year)
        } else {
          this.setState({lectures: res});
          this.setState({filteredLec2: res})
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          // this.props.notLoggedUser();
        }
        this.setState({serverErr: true, loading: null});
      });
  }

  changeYear = (id) => {
    if (id === "del") {
      this.setState({lectures: this.state.filteredLec2});
      this.setState({year: "del"})
    } else {
      this.setState({checkedCourses: []});
      this.setState({year: id})
      this.setState({filteredLec2: this.state.filteredLec2})
      let filteredLec = this
        .state
        .filteredLec2
        .filter(item => {
          return item.Year === id
        });
      this.setState({lectures: filteredLec});
      this.setState({filteredLec1: filteredLec})

    }
  }

  // selectAll(event){   const isChecked = event.target.checked;   if (isChecked)
  // {     let courses = [...this.state.checkedCourses,test];
  // this.setState=({allChecked: true})     this.setState({checkedCourses:
  // courses});   } else {     let courses =
  // this.state.checkedCourses.filter(courses =>       {return courses.id !==
  // test.id});     this.setState({checkedCourses: courses});   } }

  chooseCourse = (event, id, subjId, modality) => {
    const isChecked = event.target.checked;
    let test = {
      id: id,
      SubjectId: subjId,
      Modality: modality
    }
    if (isChecked) {
      let courses = [
        ...this.state.checkedCourses,
        test
      ];
      this.setState({checkedCourses: courses});
      // this.setState({refresh: true})
    } else {
      let courses = this
        .state
        .checkedCourses
        .filter(courses => {
          return courses.id !== test.id
        });
      this.setState({checkedCourses: courses});
    }
  }

  changeModality = (courses) => {
    API
      .changeModalityCourse(courses)
      .then(() => {
        this.setState({changeYear: true})
        this.componentDidMount();
      })
      .catch((err) => {
        if (err.status === 401) {
          this
            .props
            .notLoggedUser();
        }
      });
  }

  setSelectedOption = (e, id) => {
    this.setState({weekDay: e})
  }
  enableEdit(id) {
    this
      .state
      .lectures
      .map((e) => {
        {
          e
            .schedules
            .map((sc) => {
              if (sc.ScheduleId === id) {
                this.setState({scId: id});
                this.setState({disabled: false});
              }
            })
        }

      })

  }
  disableEdit() {
    this.setState({scId: null})
  }

  render() {
    return ( <> 
    <Container fluid data-testid="lecturetable" className={"lectureTable"}>
      <Row className="justify-content-md-center below-nav">
        <h3 className={"headerLectureList"}>List of Courses:
        </h3>
      </Row>
      < Row className="justify-content-md-center">
        <Col className="col-2 justify-content-md-center">
          <h3>Years</h3>{this.state.refresh}
          <ButtonGroup vertical>
            {this
              .state
              .Years
              .map((e) => {
                // console.log(e)
                return ( <> <Button
                  variant="primary"
                  onClick={() => this.changeYear(e.SubjectId)}
                  data-testid="handlelecture-button">
                  {e.SubjectName}
                </Button> < br /> </>);
              })}
            <Button
              variant={"danger"}
              onClick={(e) => {
              this.changeYear(this.state.delete);
            }}
              data-testid="handlelecture-del-button">
              Cancel filters
            </Button>
          </ButtonGroup>
          <br></br>
          <br></br>
          <br></br>

          {this.state.checkedCourses.length > 0 && <h4>Change Modality</h4>
}
          {this.state.checkedCourses.length > 0 && <Button
            block
            variant="info"
            data-testid="handlelecture-button14"
            onClick={() => this.changeModality(this.state.checkedCourses)}>
            Change Modality
          </Button>
}

        </Col>
        <Row>
          <Row></Row>
          <Row></Row>

          <Form.Check className="my-1 mr-sm-2" label="Check All" key={1} type="checkbox"/>
        </Row>

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
                          onChange={event => this.chooseCourse(event, id, e.SubjectId, e.Modality)}/>
                        <h5>{id + 1}.</h5>
                        <Col className="subjectName">
                          <h5 >
                            {e.SubjName}
                          </h5>

                        </Col>
                        <Col>
                          <Row>
                            <h5>
                              <b>Course Code:</b>
                              {e.SubjectId}</h5>
                          </Row>
                          <Row>
                            <h5>
                              <b>Year:</b>
                              {e.Year}
                            </h5>
                          </Row>
                          <Row>
                            <h5>
                              <b>Semestr:</b>
                              {e.Semester}</h5>
                          </Row>
                          <Row>
                            <h5>
                              <b>Teacher:</b>
                              {e.Tname}
                              {e.Tsurname}</h5>
                          </Row>
                          <Row>
                            <h5>
                              <b>Modality:</b>{this.state.refresh} {e.Modality}</h5>
                          </Row>
                        </Col>

                        <Col xs={5} className="align-content-start date">
                          <h5>
                            <b>Course Details</b>
                            <div className="select-container">

                              {e
                                .schedules
                                .map((sc, id) => {

                                  let hr = sc
                                    .Hour
                                    .substring(0, 5);
                                  let min = sc
                                    .Hour
                                    .substring(6, 11);

                                  return ( <> <Card
                                    bg='light'
                                    style={{
                                    float: "left"
                                  }}>
                                    <Card.Body>
                                      <b>Time:</b>
                                      <select
                                      
                                        disabled={sc.ScheduleId===this.state.scId ? false : true}
                                        // ? "disabled"
                                        // : ""}
                                        style={{
                                        border: '1px solid #666',
                                        fontSize: 20,
                                        width: 100,
                                        padding: '2px 4px',
                                        margin: '2px',
                                        color: '#333',
                                        borderRadius: 10
                                      }}
                                        id={id}
                                        defaultValue={sc.Day}
                                        onChange={e => this.setSelectedOption(e.target.value, id)}>
                                        {options.map((option) => {
                                          return ( <> <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option> 
                                          </>
                                        );
                                      })}
                                      </select>
                                      <TimeField
                                        disabled={sc.ScheduleId===this.state.scId ? false : true}
                                        style={{
                                        border: '1px solid #666',
                                        fontSize: 20,
                                        width: 80,
                                        padding: '2px 4px',
                                        margin: '2px',
                                        color: '#333',
                                        borderRadius: 10
                                      }}
                                        value={hr}></TimeField>-
                                      <TimeField
                                        disabled={sc.ScheduleId===this.state.scId ? false : true}
                                        style={{
                                        border: '1px solid #666',
                                        fontSize: 20,
                                        width: 80,
                                        padding: '2px 4px',
                                        margin: '2px',
                                        color: '#333',
                                        borderRadius: 12
                                      }}
                                        value={min}></TimeField>
                                      {/* <input  defaultValue={hr}></input> - <input type="time" defaultValue={min}></input> */}
                                      <br></br>
                                      <b>Class:</b>
                                      <input
                                        disabled={sc.ScheduleId===this.state.scId ? false : true}
                                        style={{
                                        border: '1px solid #666',
                                        fontSize: 20,
                                        width: 90,
                                        padding: '2px 4px',
                                        margin: '2px',
                                        color: '#333',
                                        borderRadius: 10
                                      }}
                                        defaultValue={sc.Class}
                                        type="text"
                                        id="class"
                                        size="5"/>
                                      <br></br>
                                      <b>Capacity:</b>
                                      <input
                                        disabled={sc.ScheduleId===this.state.scId ? false : true}
                                        style={{
                                        border: '1px solid #666',
                                        fontSize: 20,
                                        width: 90,
                                        padding: '2px 4px',
                                        margin: '2px',
                                        color: '#333',
                                        borderRadius: 10
                                      }}
                                        defaultValue={sc.Capacity}
                                        type="number"
                                        id="capacity"
                                        size="5"/>

                                      <Button
                                        onClick={() => this.enableEdit(sc.ScheduleId)}
                                        style={{
                                        height: "1.6rem",
                                        position: 'absolute',
                                        right: "0",
                                        top: "0"
                                      }}
                                        variant="light">
                                        <img
                                          style={{
                                          height: "1.6rem",
                                          position: 'absolute',
                                          right: "0",
                                          top: "0"
                                        }}
                                          src={Jumbotron}
                                          alt="my image"/>
                                      </Button>
                                      {/* </Card> */}
                                      <br></br>
                                      {sc.ScheduleId === this.state.scId && <Button
                                        style={{
                                        float: 'right',
                                        margin: "1px"
                                      }}
                                        size="sm"
                                        variant="success">Save</Button>
}
                                      {sc.ScheduleId === this.state.scId && <Button
                                        onClick={() => this.disableEdit()}
                                        style={{
                                        float: 'right',
                                        margin: "1px"
                                      }}
                                        size="sm"
                                        variant="danger">Cancel</Button>
}
                                    </Card.Body>
                                  </Card> 
                                  </>
                                  );
                                })}
                            </div>
                          </h5>
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