import React from 'react'
import './App.css'
import Navbars from './Components/Navbar.js'
import TeacherPage from "./Components/TeacherPage";
import {Switch} from 'react-router';
import {withRouter,Redirect, Route} from 'react-router-dom';
import {Alert} from 'react-bootstrap';


class App extends React.Component{

  constructor(props) {
    super(props);
  }
  render(){
    return <>

        <Navbars path={this.props.location.pathname}></Navbars>
        <Switch>
          <Route exact path='/home'>
            <Alert variant="info">Login page not implemented.</Alert>
            <Alert variant="info">Student page not implemented.</Alert>
            <Alert variant="info">Teacher page implemented. Go to localhost:3000/teacher</Alert>
          </Route>
          <Route exact path='/login'>
            <Alert variant="info">Login page not implemented. Insert here Login components.</Alert>
          </Route>
          <Route exact path='/teacher'>
            <TeacherPage></TeacherPage>
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
