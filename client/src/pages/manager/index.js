import React from "react";
import { Container, Row, Col, Button, ButtonGroup, Tabs, Tab,Alert, Accordion, Card,InputGroup,FormControl } from "react-bootstrap";
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
                            TeacherSSN: val.Teacher.SSN,
                            BookStudents:val.Lectures[0].StudentList.map(stu=>stu.Name+" "+stu.SSN).join('--')
                        }))
                    })
                }else{
                    alert('Request Error')
                }
            })
    }
    downloadpdf = ()=>{
        //TODO: fix pdf rendering
        let ele = document.getElementById('searchData');
        /*console.log(ele)
        var opt = {
            margin:       0.1,
            filename:     'Contact tracing report - '+this.state.search,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };*/

        //html2pdf().from(ele).set(opt).save();
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
                            <Tab eventKey="table" title="Statistics Table" tabClassName={ "tab-label" }>
                                <MDBDataTable
                                    striped
                                    bordered
                                    small
                                    data={ this.state.data }
                                />

                            </Tab>
                            <Tab eventKey="chart" title="Statistics Chart" tabClassName={ "tab-label" }>
                                <Row className="justify-content-md-center">
                                    <Col className="LogChart" >
                                        { this.state.summaryOperations && <LogGraph summary={ this.state.summaryOperations } /> }
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="search" title="Generate Contact Tracing Report" tabClassName={ "tab-label" }>
                                <Row className="justify-content-md-center">
                                    <Alert variant={"info"}><h5>Insert the SSN number to generate the contact tracing report<br/> taking in consideration all the lectures of the past 14 days</h5></Alert></Row>
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
                                    this.state.searchData.length?<div id='searchData' className='searchData'>
                                        <Row style={{borderBottom:'1px solid #ccc'}}>
                                            <Col><h6><span className={"tableHeader"}>Contact tracing report</span></h6></Col>
                                            <Col><h6><span className={"tableHeader"}>Student SSN:</span>{this.state.search}</h6></Col>
                                        </Row>
                                        {
                                            this.state.searchData.map((val)=>(
                                                <>

                                                    <Row className={"below-tab"}>
                                                        <Col> <h6><span className={"tableHeader"}>Course:</span>{val.Subject}</h6></Col>
                                                        <Col><h6><span className={"tableHeader"}>Teacher:</span>{val.Teacher.Name} <span className={"tableHeader"}>SSN:</span>{val.Teacher.SSN} </h6></Col>
                                                    </Row>
                                                    <hr
                                                        style={{
                                                            color: "#000000",
                                                            backgroundColor: "#000000",
                                                            height: 0.1,
                                                            borderColor: "#000000",
                                                            marginTop:"3px",
                                                            marginBottom:"2px"
                                                        }}
                                                    />
                                                    {val.Lectures.map(lec=> {
                                                        let lectDay = new Date(lec.DateHour);
                                                        let fields = lec.DateHour.split("T");
                                                        let date = fields[0];
                                                        let min = lectDay.getMinutes().toString()
                                                        if (min === '0') {
                                                            min = '00'
                                                        }
                                                        let hour = lectDay.getHours() + ":" + min;
                                                        return (
                                                            <>
                                                                <Row className={"list-lecture-header"}>
                                                                    <Col>
                                                                        <h6><span className={"tableHeader"}>Lecture
                                                                            Date:</span>{lectDay.toLocaleDateString("en")} at {hour}</h6></Col>
                                                                </Row>

                                                                <Row className={"list-lecture"} >
                                                                    <Col><h6><span className={"tableHeader"}>Students present at the lecture:</span></h6></Col>
                                                                </Row>

                                                                    {lec.StudentList.map(stu => (
                                                                        <Row className={"list-element"}>
                                                                            <h6>{stu.SSN} {stu.Name}</h6>
                                                                        </Row>
                                                                    ))}

                                                            </>
                                                        )
                                                    })}

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

                                        <Button onClick={this.downloadpdf}>Download PDF</Button>
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
