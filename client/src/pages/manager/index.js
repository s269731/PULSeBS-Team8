import React from "react";
import {Container, Row, Col, Card, Button, Table, ButtonGroup, Tabs, Tab} from "react-bootstrap";
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
            logs:[],
            modality:'table'
        }
    }
    componentDidMount(){
        API.getLogs()
        .then(res=>{console.log(res)
            let summaryOperations=res[0];
            console.log(summaryOperations)
            res.shift()
            for(let r of res){
                r["visible"]=true
            }
            let subjects = [];
            for (let l of res) {
                subjects.push(l.subject);
            }
            subjects = subjects.filter(this.onlyUnique);
            subjects = subjects.sort();
            this.setState({summaryOperations:summaryOperations,logs:res, subjects:subjects})
        })
    }
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    handleLogs(id, type){
        console.log(id)
        let logs=this.state.logs
        if(type==='reset') {
            for (let l of logs) {
                l.visible = true;
            }
        }
            else{
                if(type==='course'){
                    for (let l of logs) {
                        l.visible = l.subject === id;
                    }

                }
                else{
                    if(type === 'operation'){
                        for (let l of logs) {
                           l.visible = l.typeOp === id;
                        }
                        this.setState({ logs: logs });
                    }
                }
            }
        this.setState({ logs: logs });
    }

    setModality(k){
        this.setState({modality:k})
    }
    render() {
        return (
            <Container className='manager' data-testid="courses-page" style={{padding:5}}>
                <Row className="justify-content-md-center below-nav">
                    {this.state.logs && this.state.subjects && <>
                        <Col xs={2} className="col-2 justify-content-md-left">
                            <h5>Operations</h5>
                            <ButtonGroup vertical>
                                {typeOp.map((e) => {
                                    return (
                                        <>
                                            <Button
                                                variant="info"
                                                value={e}
                                                key={e}
                                                onClick={(ev) => {
                                                    this.handleLogs(typeOp.indexOf(ev.target.value),'operation');
                                                }}
                                                data-testid="handlelecture-button"
                                            >
                                                {e}
                                            </Button>
                                            <br/>
                                        </>
                                    );
                                })}
                            </ButtonGroup>

                                <h5>Courses</h5>
                            <ButtonGroup vertical>
                                {this.state.subjects.map((e) => {
                                    return (
                                        <>
                                            <Button
                                                variant="primary"
                                                value={e}
                                                key={e}
                                                onClick={(ev) => {
                                                    this.handleLogs(ev.target.value, 'course');
                                                }}
                                                data-testid="handlelecture-button"
                                            >
                                                {e}
                                            </Button>
                                            <br/>
                                        </>
                                    );
                                })}

                                <Button
                                    variant={"danger"}
                                    value={"del"}
                                    key={"del"}
                                    onClick={(e) => {
                                        this.handleLogs(e.target.value, 'reset');
                                    }}
                                    data-testid="handlelecture-del-button"
                                >
                                    Cancel filters
                                </Button>
                            </ButtonGroup>
                        </Col></>
                    }
                    <Col>
                        <Tabs id="manager-tab"
                              activeKey={this.state.modality}
                              onSelect={(k) => this.setModality(k)}>
                            <Tab eventKey="table" title="Table View" tabClassName={"tab-label"}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Operation</th>
                                            <th>Lecture date</th>
                                            <th>Subject</th>
                                            <th>Operation Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {

                                            this.state.logs.map((item,idx)=>{
                                                return <>{item.visible ? <tr>
                                                    <td>{item.name_surname}</td>
                                                    <td>{item.email}</td>
                                                    <td>{typeOp[item.typeOp]}</td>
                                                    <td>{new Date(item.lectDate).toLocaleString("en")}</td>
                                                    <td>{item.subject}</td>
                                                    <td>{new Date(parseInt(item.timestamp)).toLocaleString("en")}</td>

                                                </tr>:<></>}</>
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey="chart" title="Chart View" tabClassName={"tab-label"}>
                                <Row className="justify-content-md-center">
                                    <Col className="LogChart" >
                                        {this.state.summaryOperations && <LogGraph summary={this.state.summaryOperations}/>}
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>


            </Container>
        );
    }
}
export default Manager;
