import React from "react";
import  {Alert, Spinner, Container, Tabs, Tab, Row} from "react-bootstrap";
import LectureTable from "./LectureTable.js";
import StatsPage from './StatsPage';
import API from "../../api/api";

class TeacherPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, serverErr: null , modality:"lectures", noLect:false, noSubj:false};
    this.cancelLecture = this.cancelLecture.bind(this);
    this.changeModalityLecture = this.changeModalityLecture.bind(this);
    this.recordAttendance=this.recordAttendance.bind(this);
  }
    setModality(k){
      this.setState({modality:k})
    }
  cancelLecture(id) {
    API.deleteLectureByTeacher(id)
      .then((res) => {
        this.getLectures();
      })
      .catch((err) => {
        console.log(err.status);
        if (err.status === 401) {
          this.props.notLoggedUser();
        }
        this.setState({ serverErr: true });
      });
  }
  changeModalityLecture(id){
      API.changeModalityLecture(id)
          .then((res) => {
              this.getLectures();
          })
          .catch((err) => {
              console.log(err.status);
              if (err.status === 401) {
                  this.props.notLoggedUser();
              }
              this.setState({ serverErr: true });
          });
  }
  recordAttendance(id,number){
    console.log(id)
      console.log(number)
      API.insertAttendanceInfo(id,number).then((res) => {
          this.getLectures();
      })
          .catch((err) => {
              console.log(err.status);
              if (err.status === 401) {
                  this.props.notLoggedUser();
              }
              this.setState({ serverErr: true });
          });

  }
  getLectures() {
    API.getLecturesTeacher()
      .then((lects) => {
          console.log(lects)
        API.getCourses().then((subs)=>{
            console.log(subs)
            console.log(lects.length)
            console.log(subs)
            if(subs.errors){
                this.setState({
                    subjects: [],
                    lectures: [], loading: null,
                    serverErr: null, noLect: false, noSubj:true
                })
            }
            else {
                if (lects.length > 0) {
                    this.setState({
                        subjects: subs,
                        lectures: lects,
                        loading: null,
                        serverErr: null,
                        noLect: false,
                        noSubj:false
                    });
                } else {
                    this.setState({
                        subjects: subs,
                        lectures: [], loading: null,
                        serverErr: null, noLect: true, noSubj:false
                    })
                }
            }
        })
      })
      .catch((err) => {
        console.log(err.status);
        if (err.status === 401) {
          this.props.notLoggedUser();
        }
        this.setState({ serverErr: true, loading: null , noLect:false, noSubj:false});
      });
  }
  componentDidMount() {
    //retrieve lectures for the teacher
    this.getLectures();
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  render() {
    return (
      <>
        <Container fluid data-testid="teacher-page">
          {this.state.serverErr && (
            <Alert variant="danger" data-testid="error-message">
              Server Error
            </Alert>
          )}
          {this.state.serverErr === null && this.state.loading && (
            <Alert variant="primary">
              <Spinner animation="border" variant="primary" /> Loading ...
            </Alert>
          )}

          {this.state.serverErr === null &&
            this.state.loading === null &&
            this.state.subjects &&  (

                <Tabs
                    id="controlled-tab"
                    activeKey={this.state.modality}
                    onSelect={(k) => this.setModality(k)}

                >
                    <Tab eventKey="lectures" title="My Lectures">
                        {this.state.subjects && this.state.lectures.length>0 && !this.state.noSubj ? <LectureTable
                            subjects={this.state.subjects}
                            lectures={this.state.lectures}
                            cancelLecture={this.cancelLecture}
                            changeModalityLecture={this.changeModalityLecture}
                            recordAttendance={this.recordAttendance}
                            notLoggedUser={this.props.notLoggedUser}
                        />: <>
                            {this.state.noSubj ? <Row className="justify-content-md-center below-nav"><Alert className={"alert"} variant={"info"} data-testid={"no-courses-message"}><h4>No courses assigned to you</h4></Alert></Row>:
                            <Row className="justify-content-md-center below-nav"><Alert className={"alert"} variant={"info"} data-testid={"no-lectures-message"}><h4>You have not programmed lectures</h4></Alert></Row>
                            }
                                </>
                            }

                    </Tab>
                    <Tab eventKey="stats" title="Statistics">
                        {this.state.subjects && <StatsPage subjects={this.state.subjects} canShowGraphs={this.props.canShowGraphs}/>}
                    </Tab>


                </Tabs>

            )}
        </Container>
      </>
    );
  }
}

export default TeacherPage;
