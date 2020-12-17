import React from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Accordion,
  Button,
  ButtonGroup,
  Form, Tabs, Tab, Alert
} from "react-bootstrap";
import API from "../../api/api";
import ModifyModal from "./ModifyModal";


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
      weekDay: null,
      Time1: null,
      Time2: null,
      Class: null,
      Capacity: null,
      disabled: true,
      scId: null,
      tabModality:'modality'
    };
    this.SaveEdit=this.SaveEdit.bind(this)
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
setModality(val){
    this.setState({tabModality:val})
}

  retrieveCourses(){
    console.log("here2")
    API
        .getOfficerSchedule()
        .then((res) => {
          console.log(res)
          if (this.state.changeYear === true) {
            console.log("if")
            this.setState({lectures: this.state.filteredLec1})
            this.setState({filteredLec2: res})
            this.setState({ checkedCourses: []})
            this.changeYear(this.state.year)
          } else {
            console.log("else")
            this.setState({lectures: res});
            this.setState({filteredLec2: res})
          }
        })
        .catch((err) => {
          if (err.status === 401) {
          }
          this.setState({serverErr: true, loading: null});
        });
  }
  componentDidMount() {
   this.retrieveCourses()
  }

  changeYear = (id) => {
      if (id === "del") {
        this.setState({
          changeYear: true,
          allChecked: false,
          checkedCourses: [],
          lectures: this.state.filteredLec2,
          year: "del"
        });
      } else {
        this.setState({
          changeYear: true,
          allChecked: false,
          checkedCourses: [],
          year: id,
          filteredLec2: this.state.filteredLec2
        });

        let filteredLec = this.state.filteredLec2.filter(item => {
          return item.Year === id
        });

        this.setState({lectures: filteredLec, filteredLec1: filteredLec});
      }

  }
  selectAll=(event)=>{  
     const isChecked = event.target.checked; 
     this.setState({allChecked: !this.state.allChecked})
     if (isChecked){
      if(this.state.year==="del"){ 
        this.setState({checkedCourses: this.state.filteredLec2});  
      }
      else{
        this.setState({checkedCourses: this.state.filteredLec1});  
      }
     } 
  else {     
        this.setState({checkedCourses: []}); 
          } 
        }

  chooseCourse = (event, id, subjId, modality) => {
    const isChecked = event.target.checked;
    let test = {
      id: id,
      SubjectId: subjId,
      Modality: modality
    }
    if (isChecked) {
      let courses = [...this.state.checkedCourses,test];
      this.setState({checkedCourses: courses});
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
    let l=courses;
    if(this.state.allChecked){
      l=this.state.checkedCourses
    }
    API.changeModalityCourse(l).then(() => {
        this.setState({changeYear: true, confirm:true})
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
confirmMessage(){
    this.setState({confirm:false})
}

  setSelectedOptionWeek = (e) => {
    this.setState({weekDay: e})
  }
  setSelectedOptionTime1 = (e) => {
    this.setState({Time1: e})
  }
  setSelectedOptionTime2 = (e) => {
    this.setState({Time2: e})
  }
  setSelectedOptionClass = (e) => {
    this.setState({Class: e})
  }
  setSelectedOptionCapacity = (e) => {
    this.setState({Capacity: e})
  }
  enableEdit(sc) {
    this
      .state
      .lectures
      .forEach((e) => {
        {
          e
            .schedules
            .map((scNew) => {
              if (scNew.ScheduleId === sc.ScheduleId) {
                this.setState({scId: sc.ScheduleId, disabled: false,
                Class: sc.Class, Time1: sc.Hour.substring(0, 5), 
              Time2: sc.Hour.substring(6, 11),
            Capacity: sc.Capacity, weekDay: sc.Day});
              }
            })
        }

      })

  }
  disableEdit() {
    this.setState({scId: null})
  }

  SaveEdit(a){
    API.changeSchedule(a).then((res) => {
      console.log('here')
      this.retrieveCourses()
      })
      .catch((err) => {
        if (err.status === 401) {
          this.props.notLoggedUser();
        }
      });
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
          <ButtonGroup data-testid="changeYearGroup" vertical>
            {this
              .state
              .Years
              .map((e) => {
                // console.log(e)
                return ( <> <Button
                  data-testid="changeYear"
                  variant="primary"
                  onClick={() => this.changeYear(e.SubjectId)}
                  data-testid="handlelecture-button">
                  {e.SubjectName}
                </Button> < br /> </>);
              })}
            <Button
            data-testid="cancel-filter"
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
        </Col>


        < Col className="col-8">
          <Tabs id="manager-tab"
                activeKey={ this.state.modality }
                onSelect={ (k) => {
                  this.setModality(k);
                } }>
            <Tab data-testid="Change-Modality-Id" eventKey="modality" title="Change Modality" tabClassName={ "tab-label" }>

                {this.state.confirm &&<><Row className="below-tab justify-content-md-center" >
                  <h6>
                    <Alert variant={"success"}>
                    <Row className={'justify-content-md-center  border-bottom  pb-3 pt-2 mb-0'}>Courses modality correctly changed!</Row>
                  <Button
                      block
                      variant="info"

                      onClick={() => this.confirmMessage()}>
                    <h6>Ok</h6>
                  </Button></Alert></h6> </Row></>
                }

                {!this.state.confirm && this.state.checkedCourses.length > 0 &&<><Row className="below-tab" data-testid="lecture-s-row">
                  <Button
                      block
                      variant="info"
                      data-testid="handlelecture-button14"
                      onClick={() => this.changeModality(this.state.checkedCourses)}>
                    <h6>Change Modality for selected courses</h6>
                  </Button></Row></>
                }


              <Row className="border-bottom  pb-3 pt-2 mb-0" data-testid="lecture-s-row">
                <Col>
                <h6><Alert variant={"info"} className={"below-tab"}>
                  <Form.Check data-testid="checkAll" checked={this.state.allChecked} onChange={this.selectAll}   className="my-1 mr-sm-2" label="Select all courses" key={1} type="checkbox"/>
                  </Alert> </h6>
                </Col>
              </Row>

              {this
                  .state
                  .lectures
                  .map((e, id) => {

                    return (<><Card data-testid="card-toggle">

                      <Card.Header>
                        <Row className="border-bottom  pb-3 pt-2 mb-0" data-testid="lecture-s-row">
                          <Form>
                            <Form.Group controlId="formBasicCheckbox">

                              <Form.Check
                                  data-testid="checkOne"
                                  checked={this.state.allChecked || this.state.checkedCourses.some(item=>item.id===id)}
                                  key={id + 1}
                                  type="checkbox"
                                  onChange={event => this.chooseCourse(event, id, e.SubjectId, e.Modality)}/>
                            </Form.Group>
                          </Form>
                          <Col xs={3} className={'align-content-left'}>

                            <h5>{e.SubjectId}</h5>

                          </Col>
                          <Col xs={6} className={'align-content-center'}>
                            <h5 className="subjectName">
                              <b></b>{e.SubjName}</h5>

                            <h5><b>{e.Modality}</b></h5>
                          </Col>
                          <Col xs={2} className={'align-content-right'}>

                            <h5>
                              <b>Year:</b>
                              {e.Year}
                            </h5>

                          </Col>
                        </Row>
                      </Card.Header>
                    </Card>
                    </>)})}

            </Tab>


            <Tab data-testid="Change-Schedule-Id" eventKey="schedule" title="Change Schedule" tabClassName={ "tab-label" }>
          <Accordion className="box-shadow" defaultActiveKey="0">
            {this
              .state
              .lectures
              .map((e, id) => {
                console.log(e)
                return (<>
                    <Card data-testid="card-toggle">
                      <Accordion.Toggle className="box-shadow" as={Card.Header} eventKey={id+1} data-testid="card-toggle">
                        <Row className="border-bottom  pb-3 pt-2 mb-0" data-testid="lecture-s-rowM">

                            <Col xs={3} className={'align-content-left'}>
                              <h5>{e.SubjectId}</h5>

                            </Col>
                            <Col xs={6} className={'align-content-center'}>
                                <h5 className="subjectName">
                                  <b></b>{e.SubjName}</h5>
                            </Col>
                          <Col xs={2} className={'align-content-right'}>
                                <h5>
                                  <b >Year:</b>
                                  {e.Year}
                                </h5>
                            </Col>
                          </Row>

                      </Accordion.Toggle>

                      <Accordion.Collapse eventKey={id+1}>
                        <Card.Body>
                          <Row className={'align-content-center'}>
                          <Col  className={'align-content-center'} xs={6}>
                          <Row className={'align-content-center'}>
                            <Col>
                            <h5>
                              <b>Year:</b>
                              &nbsp;{e.Year}
                            </h5>
                            </Col>
                          </Row>
                            <Row>

                            <Col><h5>
                              <b>Semester:</b>
                              &nbsp;{e.Semester}</h5></Col>
                          </Row>

                          <Row>
                            <Col>
                            <h5>

                              <b>Teacher:</b>
                              &nbsp;{e.Tname}&nbsp;
                              {e.Tsurname}</h5></Col>

                          </Row>
                          <Row>
                            <h5>
                              <Col>
                              <b>Modality:</b>{this.state.refresh} {e.Modality}</Col></h5>
                          </Row>
                          </Col>

                          <Col xs={6} className="date">
                          <h5>
                            <b>Course Schedule</b>

                            <div className="select-container">

                              {e.schedules.map((sc, id) => {

                                  /*let hr = sc
                                    .Hour
                                    .substring(0, 5);
                                  console.log(hr)
                                  let min = sc
                                    .Hour
                                    .substring(6, 11);*/
                                let hours=sc.Hour.split('-')
                                if(hours[0].split(":")[0].length===1){
                                  hours[0]='0'+hours[0]
                                }
                                if(hours[1].split(":")[0].length===1){
                                  hours[1]='0'+hours[1]
                                }

                                  return ( <>
                                        <Card
                                            bg='light'
                                            style={{
                                              float: "left"
                                            }}>
                                          <Card.Body>

                                            <Row>
                                              <Col><b>Day:</b>{sc.Day}</Col>
                                              <Col><b>From:</b>{hours[0]}</Col>
                                              <Col><b>To:</b>{hours[1]}</Col>
                                            </Row>
                                            <Row>
                                              <Col><b>Class:</b>{sc.Class}</Col>
                                              <Col><b>Capacity:</b>{sc.Capacity}</Col>
                                            </Row>


                                            <ModifyModal sc={sc} hr={hours[0]} min={hours[1]} id={id} e={e} SaveEdit={this.SaveEdit} notLoggedUser={this.props.notLoggedUser}/>

                                            </Card.Body>
                                            </Card>
                                        </>
                                  );
                                })}
                            </div>
                          </h5>
                        </Col>
                          </Row>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card></>
                );
              })}
          </Accordion>
            </Tab>
          </Tabs>
        </Col>
      </Row >
    </Container> 
    </>
    );
  }
}
export default ModifyLecture;