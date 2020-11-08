import React from 'react'
import './App.css'
import Navbars from './Components/Navbar.js'
import TeacherPage from "./Components/TeacherPage";



class App extends React.Component{

  constructor(props) {
    super(props);
  }
  render(){
    return <>
      <Navbars></Navbars>
      <TeacherPage></TeacherPage>
    </>
  }




}
export default App;
