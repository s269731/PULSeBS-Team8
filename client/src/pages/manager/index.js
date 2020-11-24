import React from "react";
import { Container, Row, Col, Card, Button,Table } from "react-bootstrap";
import {Link} from 'react-router-dom'
import './manager.css'
// import API from "../../api/api";



class Manager extends React.Component {
    render() {
        return (
            <Container className='manager' data-testid="courses-page" style={{padding:20}}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>UserId</th>
                            <th>UserName</th>
                            <th>TypeOp</th>
                            <th>TimeStamp</th>
                            <th>letures</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>111</td>
                            <td>Otto</td>
                            <td>delete</td>
                            <td>2020-11-20 12:35:20</td>
                            <td>abc</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>111</td>
                            <td>Otto</td>
                            <td>booking</td>
                            <td>2020-11-20 12:30:20</td>
                            <td>abc</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>111</td>
                            <td>Otto</td>
                            <td>Login</td>
                            <td>2020-11-20 12:20:20</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>222</td>
                            <td>Mark</td>
                            <td>delete</td>
                            <td>2020-11-20 12:35:20</td>
                            <td>DDDDDD</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>222</td>
                            <td>Mark</td>
                            <td>booking</td>
                            <td>2020-11-20 12:30:20</td>
                            <td>DDDDDD</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>222</td>
                            <td>Mark</td>
                            <td>Login</td>
                            <td>2020-11-20 12:20:20</td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }
}
export default Manager;
