import React from 'react'
import './App.css'
import Navbars from './Components/Navbar.js'
import TeacherPage from "./Components/TeacherPage";
import {Switch} from 'react-router';
import {withRouter,Redirect, Route} from 'react-router-dom';
import {Alert} from 'react-bootstrap';
import Login from './pages/logins/index'
import API from "./api";


class App extends React.Component{

  constructor(props) {
    super(props);
    this.state={authErr:null}
    this.login=this.login.bind(this);
    this.logout=this.logout.bind(this);
    this.getUser=this.getUser.bind(this);
  }

  componentDidMount() {
    this.getUser()
  }
  getUser=()=>{
    API.getUser().then((res)=>{
      this.setState({loggedUser:res})
    })
  }
  login=(pars)=>{
    this.setState({loading:true})
    API.Login(pars).then(
        (user)=>{
          this.setState({loggedUser:user,authErr:null, loading:false});
          this.getUser()
        }
    ).catch((errorObj) => {
      console.log(errorObj)
      this.setState({loggedUser:null,authErr:errorObj,loading:false});
    });
  }
  logout = () => {
    API.userLogout().then(() => {
      this.setState({loggedUser: null,authErr: null});
    });
  }
  render(){
    return <>

        <Navbars path={this.props.location.pathname} loggedUser={this.state.loggedUser} logout={this.logout}/>
        <Switch>
          <Route exact path='/home'>
            <Alert variant="info">Student page not implemented.</Alert>
            <Alert variant="info">Teacher page implemented but with only stub data. Go to localhost:3000/teacher</Alert>
          </Route>
          <Route exact path='/login'>
            {(this.state.loggedUser && this.state.loggedUser.role==="D") &&  <Redirect to='/teacher'/>}
            {(this.state.loggedUser && this.state.loggedUser.role==="S") &&  <Redirect to='/student'/>}
            {(!this.state.loggedUser) && <Login login={this.login} error={this.state.authErr} loading={this.state.loading}/>}}
          </Route>
          <Route exact path='/teacher'>
            {(this.state.loggedUser && this.state.loggedUser.role==="D") ?  <TeacherPage/> :<Redirect to='/login'/>}

          </Route>
          <Route exact path='/student'>
            {(this.state.loggedUser && this.state.loggedUser.role==="S") ?  <Alert variant="info">Student page not implemented. Insert here Student components.</Alert> :<Redirect to='/login'/>}
          </Route>
          <Route><Redirect to='/home'/></Route>
        </Switch>
    </>
  }




}
export default withRouter(App);
