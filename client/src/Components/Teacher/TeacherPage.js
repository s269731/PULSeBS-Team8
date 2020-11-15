import React from 'react';
import {Alert,Spinner,Container}from 'react-bootstrap'
import LectureTable from "./LectureTable.js";
import API from "../../api/api";

class TeacherPage extends React.Component{
    constructor(props) {
        super(props);
        this.state={loading:true,serverErr:null}
        this.cancelLecture=this.cancelLecture.bind(this)
    }

    cancelLecture(id){

        //this is a stub function that deletes only local state of lectures
        //UPDATE THIS WITH CONNECTION WITH SERVER AS SOON AS THE API IS AVAILABLE
       let newLectures=[];
       for(let l of this.state.lectures){
           if(l.id!==id){
               newLectures.push(l)
           }
       }
       this.setState({lectures:newLectures}
       )
    }

    componentDidMount() {
        //retrieve lectures for the teacher
        API.getLectures().then((res)=>{
            console.log(res)

            let subjects=[]
            for(let l of res){
                subjects.push(l.subject)
            }
            subjects=subjects.filter(this.onlyUnique)
            subjects=subjects.sort()
            console.log(subjects)


            this.setState({subjects:subjects, lectures:res,loading:null,serverErr:null})
        }).catch((err)=>{
            this.setState({serverErr:true,loading:null})
        })
    }
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    render(){
        return <>
            <Container fluid>
                {this.state.serverErr && <Alert variant="danger">Server Error</Alert>}
                {this.state.serverErr===null && this.state.loading && <Alert variant="primary"><Spinner animation="border" variant="primary"/> Loading ...</Alert>}
                {this.state.serverErr===null && this.state.loading===null && this.state.subjects && <LectureTable subjects={this.state.subjects} lectures={this.state.lectures} cancelLecture={this.cancelLecture}/>}
            </Container>
            </>
    }

}

export default TeacherPage;