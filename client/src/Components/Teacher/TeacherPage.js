import React from 'react';
import {Alert,Spinner,Container}from 'react-bootstrap'
import LectureTable from "./LectureTable.js";
import API from "../../api/api";

class TeacherPage extends React.Component{
    constructor(props) {
        super(props);
        this.state={loading:true,serverErr:null}
    }

    componentDidMount() {
        //retrieve lectures for the teacher
        API.getLectures().then((res)=>{
            console.log(res)
            this.setState({lectures:res,loading:null,serverErr:null})
        }).catch((err)=>{
            this.setState({serverErr:true,loading:null})
        })
    }

    render(){
        return <>
            <Container fluid>
                {this.state.serverErr && <Alert variant="danger">Server Error</Alert>}
                {this.state.serverErr===null && this.state.loading && <Alert variant="primary"><Spinner animation="border" variant="primary"/> Loading ...</Alert>}
                {this.state.serverErr===null && this.state.loading===null && <LectureTable lectures={this.state.lectures}/>}
            </Container>
            </>
    }

}

export default TeacherPage;