import React from "react";
import {Container, Row, Col, Button,ButtonGroup, Tabs, Tab, Accordion, Card} from "react-bootstrap";
import './manager.css'
import API from "../../api/api";
import LogGraph from './LogGraph'
import { MDBDataTable } from 'mdbreact';
import { CSVLink, CSVDownload } from "react-csv";
 
const csvData = [
  ["firstname", "lastname", "email"],
  ["Ahmed", "Tomi", "ah@smthing.co.com"],
  ["Raed", "Labes", "rl@smthing.co.com"],
  ["Yezzi", "Min l3b", "ymin@cocococo.com"]
];

let typeOp = [
	'Insert reservation',
	'Cancel reservation',
	'Cancel lecture',
	'Switch lecture to Virtual modality'
]
const cols=[
    {
        label: 'Username',
        field: 'username',
        sort: 'asc',
        width: 150
    },
    {
        label: 'E-mail',
        field: 'email',
        sort: 'asc',
        width: 270
    },
    {
        label: 'Operation',
        field: 'operation',
        sort: 'asc',
        width: 200
    },
    {
        label: 'Course',
        field: 'subject',
        sort: 'asc',
        width: 100
    },
    {
        label: 'Lecture date',
        field: 'lectDate',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Timestamp',
        field: 'timestamp',
        sort: 'asc',
        width: 100
    }
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
            let summaryOperations=res["summary"];
            console.log(summaryOperations)
            let logs=res["logs"]
            let subjects = [];
            for (let l of logs) {
                subjects.push(l.subject);
            }
            subjects = subjects.filter(this.onlyUnique);
            subjects = subjects.sort();
            console.log(logs)
            let data={columns:cols ,rows:logs}

            this.setState({summaryOperations:summaryOperations,logs:logs, data:data, subjects:subjects})
        })
    }
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    handleLogs(id, type){
        console.log(id)
        let logs=this.state.logs
        console.log(logs)
        let newLogs=[]
        if(type==='reset') {
                newLogs=logs;
        }
            else{
                if(type==='course'){
                    for (let l of logs) {
                        if(l.subject === id){
                            newLogs.push(l)
                        }
                    }

                }
                else{
                    if(type === 'operation'){
                        for (let l of logs) {
                           if (l.operation === id){
                               newLogs.push(l)
                           }
                        }
                    }
                }
            }
        let data={columns:cols,rows:newLogs}

        this.setState({ data: data });
    }

    setModality(k){
        this.setState({modality:k})
    }
    onSearch = (val)=>{
        if(!val){
            this.setState({
                data:{columns:cols,rows:this.state.logs}
            })
            return
        }
        this.setState({
            data:{columns:cols,rows:[this.state.logs.filter(item=>item.email.includes(val))[0]]}
        })
    }
    render() {
        return (
            <Container className='manager' data-testid="manager-page" style={{padding:5}}>
                <Row className="justify-content-md-center below-nav">
                    {this.state.logs && this.state.subjects && <>
                        <Col xs={2} className="col-2 justify-content-md-left">
                            <h4>Filters</h4>
                            <Accordion>
                            <Card>

                            <Accordion.Toggle className="filtersOp" as={Card.Header} eventKey={1}>
                            <h5>Operations</h5>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={1}>
                                <Card.Body>
                                    <ButtonGroup vertical>
                                        {typeOp.map((e) => {
                                            return (
                                                <>
                                                    <Button
                                                        variant="info"
                                                        value={e}
                                                        key={e}
                                                        onClick={(ev) => {
                                                            this.handleLogs(ev.target.value,'operation');
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
                                </Card.Body>
                            </Accordion.Collapse>
                            </Card>
                            <Card>
                            <Accordion.Toggle className="filtersCourse" as={Card.Header} eventKey={2}>
                                <h5>Courses</h5>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={2}>
                                <Card.Body>
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
                                </Card.Body>
                            </Accordion.Collapse>
                            </Card>
                            </Accordion>
                        </Col></>
                    }
                    <Col>


                        <Tabs id="manager-tab"
                              activeKey={this.state.modality}
                              onSelect={(k) => this.setModality(k)}>
                            <Tab eventKey="table" title="Table View" tabClassName={"tab-label"}>
                                <MDBDataTable
                                    striped
                                    bordered
                                    onSearch={this.onSearch}
                                    small
                                    data={this.state.data}
                                />

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
