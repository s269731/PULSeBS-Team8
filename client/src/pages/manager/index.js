import React from "react";
import { Container, Row, Col, Button, ButtonGroup, Tabs, Tab, Form, Accordion, Card,InputGroup,FormControl } from "react-bootstrap";
import './manager.css'
import API from "../../api/api";
import LogGraph from './LogGraph'
import { MDBDataTable } from 'mdbreact';
import { CSVLink } from "react-csv";
import html2pdf from 'html2pdf.js';



let typeOp = [
    'Insert reservation',
    'Cancel reservation',
    'Cancel lecture',
    'Switch lecture to Virtual modality'
]
const cols = [
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
    constructor() {
        super();
        this.state = {
            logs: [],
            search:'',
            csvData:[],
            searchData:[
                // {
                //     Teacher:{Name:'aaa'},
                //     Subject:'bbb',
                //     Lectures:[
                //         {
                //             DateHour:'2020-12-12',
                //             StudentList:[{Name:'ggg'},{Name:'hhh'}]
                //         }
                //     ]
                // }
            ],
            modality: 'search'
        }
    }
    componentDidMount() {
        API.getLogs()
            .then(res => {
                console.log(res)
                let summaryOperations = res["summary"];
                console.log(summaryOperations)
                let logs = res["logs"]
                let subjects = [];
                for (let l of logs) {
                    subjects.push(l.subject);
                }
                subjects = subjects.filter(this.onlyUnique);
                subjects = subjects.sort();
                console.log(logs)
                let data = { columns: cols, rows: logs }

                this.setState({ summaryOperations: summaryOperations, logs: logs, data: data, subjects: subjects })
            })
    }
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    handleLogs(id, type) {
        let logs = this.state.logs
        let newLogs = []
        if (type === 'reset') {
            newLogs = logs;
        }
        else {
            if (type === 'course') {
                for (let l of logs) {
                    if (l.subject === id) {
                        newLogs.push(l)
                    }
                }

            }
            else {
                if (type === 'operation') {
                    for (let l of logs) {
                        if (l.operation === id) {
                            newLogs.push(l)
                        }
                    }
                }
            }
        }
        let data = { columns: cols, rows: newLogs }

        this.setState({ data: data });
    }

    setModality(k) {
        this.setState({ modality: k })
    }
   
    handleChange = (v)=>{
        this.setState({
            search:v.target.value
        })
    }
    onSearchSsn = () => {
        API.getContactTracing(this.state.search)
            .then(res => {
                if(res.length){
                    this.setState({searchData:res});
                    
                    this.setState({
                        csvData:res.map(val=>({
                            BookCourse:val.Subject,
                            TeacherName:val.Teacher.Name,
                            BookStudents:val.Lectures[0].StudentList.map(stu=>stu.Name).join('--')
                        }))
                    })
                }else{
                    alert('Request Error')
                }
            })
    }
    downloadpdf = ()=>{
        let ele = document.getElementsByClassName('searchData')[0];
        html2pdf().from(ele).save();
    }

    render() {
        return (
            <Container className='manager' data-testid="manager-page" style={ { padding: 5 } }>
                <Row className="justify-content-md-center below-nav">
                    { this.state.logs && this.state.subjects && <>
                        <Col xs={ 2 } className="col-2 justify-content-md-left">
                            <h4>Filters</h4>
                            <Accordion>
                                <Card>

                                    <Accordion.Toggle className="filtersOp" as={ Card.Header } eventKey={ 1 }>
                                        <h5>Operations</h5>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={ 1 }>
                                        <Card.Body>
                                            <ButtonGroup vertical>
                                                { typeOp.map((e) => {
                                                    return (
                                                        <>
                                                            <Button
                                                                variant="info"
                                                                value={ e }
                                                                key={ e }
                                                                onClick={ (ev) => {
                                                                    this.handleLogs(ev.target.value, 'operation');
                                                                } }
                                                                data-testid="handlelecture-button"
                                                            >
                                                                { e }
                                                            </Button>
                                                            <br />
                                                        </>
                                                    );
                                                }) }
                                                <Button
                                                    variant={ "danger" }
                                                    value={ "del" }
                                                    key={ "del" }
                                                    onClick={ (e) => {
                                                        this.handleLogs(e.target.value, 'reset');
                                                    } }
                                                    data-testid="handlelecture-del-button"
                                                >
                                                    Cancel filters
                                        </Button>
                                            </ButtonGroup>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Accordion.Toggle className="filtersCourse" as={ Card.Header } eventKey={ 2 }>
                                        <h5>Courses</h5>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={ 2 }>
                                        <Card.Body>
                                            <ButtonGroup vertical>
                                                { this.state.subjects.map((e) => {
                                                    return (
                                                        <>
                                                            <Button
                                                                variant="primary"
                                                                value={ e }
                                                                key={ e }
                                                                onClick={ (ev) => {
                                                                    this.handleLogs(ev.target.value, 'course');
                                                                } }
                                                                data-testid="handlelecture-button"
                                                            >
                                                                { e }
                                                            </Button>
                                                            <br />
                                                        </>
                                                    );
                                                }) }

                                                <Button
                                                    variant={ "danger" }
                                                    value={ "del" }
                                                    key={ "del" }
                                                    onClick={ (e) => {
                                                        this.handleLogs(e.target.value, 'reset');
                                                    } }
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
                            activeKey={ this.state.modality }
                            onSelect={ (k) => {
                                this.setModality(k);
                            } }>
                            <Tab eventKey="table" title="Table View" tabClassName={ "tab-label" }>
                                <MDBDataTable
                                    striped
                                    bordered
                                    small
                                    data={ this.state.data }
                                />

                            </Tab>
                            <Tab eventKey="chart" title="Chart View" tabClassName={ "tab-label" }>
                                <Row className="justify-content-md-center">
                                    <Col className="LogChart" >
                                        { this.state.summaryOperations && <LogGraph summary={ this.state.summaryOperations } /> }
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="search" title="Search View" tabClassName={ "tab-label" }>
                                <Row className="justify-content-md-center">
                                    <Col className="LogChart" lg={ 6 } >
                                        <InputGroup style={{padding: '20px 0'}}>
                                            <FormControl
                                                onChange={this.handleChange}
                                                placeholder="Enter SSN"
                                            />
                                            <InputGroup.Append>
                                                <Button onClick={this.onSearchSsn} variant="outline-secondary">Search</Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                {
                                    this.state.searchData.length?<div className='searchData'>
                                        <Row style={{borderBottom:'1px solid #ccc'}}>
                                            <Col>SSN:{this.state.search}</Col>
                                        </Row>
                                        {
                                            this.state.searchData.map((val)=>(
                                                <>
                                                    <Row>
                                                        <Col>Subject:{val.Subject}</Col>
                                                        <Col>Teacher:{val.Teacher.Name}</Col>
                                                    </Row>
                                                    {val.Lectures.map(lec=>(
                                                        <>
                                                            <Row>
                                                                <Col>Lecture DateHour:{lec.DateHour}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>Lecture StudentList</Col>
                                                            </Row>
                                                            <Row>
                                                                {lec.StudentList.map(stu=>(
                                                                    <Col>{stu.Name}</Col>
                                                                ))}
                                                            </Row>
                                                        </>
                                                    ))}
                                                </>
                                            ))
                                        }
                                    </div>:<div className='nodata'>No Data</div>
                                }
                                <Row className="justify-content-md-center">
                                    <Col style={{display:'flex',justifyContent:'space-around'}}  className="LogChart" lg={ 6 }>
                                        <Button>
                                            <CSVLink style={ { color: '#fff' } } data={ this.state.csvData } variant="primary">
                                                Download CSV
                                            </CSVLink>
                                        </Button>

                                        <Button onClick={this.downloadpdf}>Dowmload PDF</Button>
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
