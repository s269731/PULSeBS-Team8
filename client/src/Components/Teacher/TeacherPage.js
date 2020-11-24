import React from "react";
import  {Row,Alert, Spinner, Container, Tabs, Tab} from "react-bootstrap";
import LectureTable from "./LectureTable.js";
import API from "../../api/api";

class TeacherPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, serverErr: null , modality:"lectures"};
    this.cancelLecture = this.cancelLecture.bind(this);
    this.changeModalityLecture = this.changeModalityLecture.bind(this);
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
      let newLectures=[];
      for(let l of this.state.lectures){
          if(l.id!==id){
              newLectures.push(l)
          }
      }
      this.setState({lectures:newLectures}
      )
  }
  getLectures() {
    API.getLecturesTeacher()
      .then((res) => {

        let subjects = [];
        for (let l of res) {
          subjects.push(l.subject);
        }
        subjects = subjects.filter(this.onlyUnique);
        subjects = subjects.sort();
        console.log("subj")
        console.log(subjects)
        console.log("lect")
        console.log(res)
        this.setState({
          subjects: subjects,
          lectures: res,
          loading: null,
          serverErr: null,
        });
      })
      .catch((err) => {
        console.log(err.status);
        if (err.status === 401) {
          this.props.notLoggedUser();
        }
        this.setState({ serverErr: true, loading: null });
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
            this.state.subjects && (

                <Tabs
                    id="controlled-tab"
                    activeKey={this.state.modality}
                    onSelect={(k) => this.setModality(k)}

                >
                    <Tab eventKey="lectures" title="My Lectures">
                        <LectureTable
                            subjects={this.state.subjects}
                            lectures={this.state.lectures}
                            cancelLecture={this.cancelLecture}
                            changeModalityLecture={this.changeModalityLecture}
                            notLoggedUser={this.props.notLoggedUser}
                        />
                    </Tab>
                    <Tab eventKey="stats" title="Statistics">

                    </Tab>


                </Tabs>

            )}
        </Container>
      </>
    );
  }
}

export default TeacherPage;
