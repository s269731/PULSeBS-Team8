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
  }
  login=(pars)=>{
    this.setState({loading:true})
    API.Login(pars).then(
        (user)=>{
          this.setState({loggedUser:user,authErr:null, loading:false});
        }
    ).catch((errorObj) => {
      console.log(errorObj)
      this.setState({loggedUser:null,authErr:errorObj,loading:false});
    });
  }
  render(){
    return <>

        <Navbars path={this.props.location.pathname}/>
        <Switch>
          <Route exact path='/home'>
            <Alert variant="info">Login page not implemented.</Alert>
            <Alert variant="info">Student page not implemented.</Alert>
            <Alert variant="info">Teacher page implemented. Go to localhost:3000/teacher</Alert>
          </Route>
          <Route exact path='/login'>
            <Login login={this.login} error={this.state.authErr} loading={this.state.loading}/>
          </Route>
          <Route exact path='/teacher'>
            <TeacherPage/>
          </Route>
          <Route exact path='/student'>
            <Alert variant="info">Student page not implemented. Insert here Student components.</Alert>
          </Route>
          <Route><Redirect to='/home'/></Route>
        </Switch>
    </>
  }




}
export default withRouter(App);
