import React from "react";
import { Container, Row, Col, Card, Button,Table } from "react-bootstrap";
import {Link} from 'react-router-dom'
import './manager.css'
import API from "../../api/api";
import LogGraph from './LogGraph'

let typeOp = [
	'insert reservation',
	'cancel reservation',
	'cancel lecture',
	'lectures switched to virtual modality'
]


class Manager extends React.Component {
    constructor(){
        super();
        this.state = {
            logs:[]
        }
    }
    componentDidMount(){
        API.getLogs()
        .then(res=>{console.log(res)
            let summaryOperations=res[0];
            console.log(summaryOperations)
            res.shift()
            this.setState({summaryOperations:summaryOperations,logs:res})
        })
    }
    render() {
        return (
            <Container className='manager' data-testid="courses-page" style={{padding:5}}>
                <Row className="justify-content-md-center below-nav">
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>UserName</th>
                                    <th>Email</th>
                                    <th>TypeOp</th>
                                    <th>TimeStamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.logs.map((item,idx)=>{
                                        return <tr>
                                            <td>{item.name_surname}</td>
                                            <td>{item.email}</td>
                                            <td>{typeOp[item.typeOp]}</td>
                                            <td>{new Date(parseInt(item.timestamp)).toLocaleString()}</td>

                                        </tr>
                                    })
                                }
                            </tbody>
                        </Table>
                    </Col>
                    <Col className="justify-content-md-left below-nav LogChart" >
                        {this.state.summaryOperations && <LogGraph summary={this.state.summaryOperations}/>}
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default Manager;
