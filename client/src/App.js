  import React from "react";
  import "./App.css";
  import Header from "./Components/Header.js";
  import TeacherPage from "./Components/Teacher/TeacherPage";
  import StudentPage from "./Components/Student/StudentPage"
  import { Switch } from "react-router";
  import { withRouter, Redirect, Route, Link } from "react-router-dom";
  import { Row, Col, Container, Alert } from "react-bootstrap";
  import Login from "./pages/logins/index";
  import API from "./api/api";
  import OfficerPage from "./Components/SupportOfficer/OfficerPage";
  import AddStudent from "./Components/SupportOfficer/AddStudent";
  import Manager from "./pages/manager";


  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = { authErr: null , loggedUser: null};
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
      this.getUser = this.getUser.bind(this);
      this.notLoggedUser = this.notLoggedUser.bind(this);
    }

    componentDidMount() {
      this.getUser();
    }
    getUser = () => {
      API.getUser()
        .then((res) => {
          let path;
          if(res.role==='S'){
            path='/student'
          }
          if(res.role==='D'){
            path='/teacher'
          }
          if(res.role==='O'){
            path='/officer'
          }
          if(res.role==='M'){
            path='/manager'
          }
          res['path']=path
          this.setState({ loggedUser: res });
        })
        .catch((err) => {
          if (err.status === 401) {
            this.setState({ loggedUser: null });
          }
        });
    };
    login = (pars) => {
      this.setState({ loading: true });
      API.Login(pars)
        .then((user) => {
          let path;
          if(user.role==='S'){
            path='/student'
          }
          if(user.role==='D'){
            path='/teacher'
          }
          if(user.role==='O'){
            path='/officer'
          }
          if(user.role==='M'){
            path='/manager'
          }
          user['path']=path
          this.setState({ loggedUser: user, authErr: null, loading: false });
          this.getUser();
        })
        .catch((errorObj) => {
          console.log(errorObj);
          this.setState({ loggedUser: null, authErr: errorObj, loading: false });
        });
    };
    logout = () => {
      API.userLogout()
        .then(() => {
          this.setState({ loggedUser: null, authErr: null });
        })
        .catch((err) => {
          this.setState({ loggedUser: null, authErr: null });
        });
    };
    notLoggedUser() {
        console.log("not")
      this.setState({ loggedUser: null });
    }
    render() {
      return (
        <>
          <Header
            path={this.props.location.pathname}
            loggedUser={this.state.loggedUser}
            logout={this.logout}
          />
          <Switch>
          <Route exact path="/officer">
            {this.state.loggedUser && this.state.loggedUser.role === "O" ? <OfficerPage notLoggedUser={this.notLoggedUser}/>:<Redirect to="/login" />}
          </Route>
            <Route exact path="/officer/addStudent">
              {this.state.loggedUser && this.state.loggedUser.role === "O" ?<AddStudent/>:<Redirect to="/login" />}
            </Route>
           

            <Route exact path="/home">
              <Container data-testid="home-page">
                <Col>
                  <Row className="justify-content-md-center below-nav">
                    <h1 >
                      Welcome
                      {this.state.loggedUser && this.state.loggedUser.name && (
                        <span data-testid="user-name">, {this.state.loggedUser.name} !</span>
                      )}
                    </h1>
                  </Row>
                  <Row className="justify-content-md-center below-nav">
                    <h3>
                      This is a tool to manage bookings of lectures during this
                      pandemic period
                      <br />
                      <br />
                    </h3>
                    {this.state.loggedUser &&
                      this.state.loggedUser.role &&
                       (
                        <>
                          <Alert variant={"info"}>
                            <Link to={this.state.loggedUser.path}>
                              {" "}
                              ACCESS TO YOUR PERSONAL PAGE{" "}
                            </Link>
                          </Alert>
                        </>
                      )}

                  </Row>
                </Col>
              </Container>
            </Route>
            <Route exact path="/login">
              {this.state.loggedUser && (
                <Redirect to={this.state.loggedUser.path} />
              )}

              {!this.state.loggedUser && (
                <Login
                  login={this.login}
                  error={this.state.authErr}
                  loading={this.state.loading}
                />
              )}
              }
            </Route>
            <Route exact path="/teacher">
              {this.state.loggedUser && this.state.loggedUser.role === "D" ? (
                <TeacherPage notLoggedUser={this.notLoggedUser} canShowGraphs={!this.props.test}/>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route exact path="/student">
              {this.state.loggedUser && this.state.loggedUser.role === "S" ? (
                <StudentPage />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route exact path="/manager">
              {this.state.loggedUser && this.state.loggedUser.role === "M" ? <Manager />:<Redirect to="/login" />}
            </Route> <Route>
              <Redirect to="/home" />
            </Route>
          </Switch>
        </>
      );
    }
  }
  export default withRouter(App);
