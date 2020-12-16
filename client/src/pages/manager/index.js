import React from "react";
import { Container, Row, Col, Button, ButtonGroup, Tabs, Tab,Alert, Accordion, Card,InputGroup,FormControl } from "react-bootstrap";
import './manager.css'
import API from "../../api/api";
import LogGraph from './LogGraph'
import { MDBDataTable } from 'mdbreact';
import { CSVLink } from "react-csv";


import jsPDF from "jspdf";
import "jspdf-autotable";



let typeOp = [
    'Insert reservation',
    'Cancel reservation',
    'Cancel lecture',
    'Switch lecture to Virtual modality',
    'Record attendance info'
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
            filterApplied:'reset',
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

                this.setState({ summaryOperations: summaryOperations, logs: logs, data: data, subjects: subjects , serverErr:false})
            }).catch((err)=> {
                this.setState({serverErr:true})
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
                    if(id==='Switch lecture to Virtual modality'){
                        id="Lectures switched to virtual modality"
                    }
                    for (let l of logs) {
                        if (l.operation === id) {
                            newLogs.push(l)
                        }
                    }
                }
            }
        }
        let data = { columns: cols, rows: newLogs }

        this.setState({ data: data,filterApplied:id });
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
                    console.log(res)
                    this.setState({serverErr:false,
                        emptyRes:false,
                        csvData:res.map(val=>({
                            BookedCourse:val.Subject,
                            TeacherName:val.Teacher.Name,
                            TeacherSSN: val.Teacher.SSN,
                            BookedStudents:val.Lectures[0].StudentList.map(stu=>stu.Name+" "+stu.SSN).join('--')
                        }))
                    })
                }else{
                    this.setState({emptyRes: true})
                }
            })
            .catch((err)=>{
                this.setState({serverErr: true})
            })
    }
    downloadpdf = ()=>{

        // initialize jsPDF
        const doc = new jsPDF();

        // define the columns we want and their titles
        const tableColumn = [ "Student SSN", "Student","Lecture Date","Hour","Course", "Teacher", "Teacher SSN"];
        // define an empty array of rows
        const tableRows = [];

        // for each ticket pass all its data into an array
        this.state.searchData.forEach(rows => {
            rows.Lectures.forEach(data=>{
                data.StudentList.forEach(student=>{
                    let lectDay = new Date(data.DateHour);
                    let fields = data.DateHour.split("T");
                    let min = lectDay.getMinutes().toString()
                    if (min === '0') {
                        min = '00'
                    }
                    let hour = lectDay.getHours() + ":" + min;
                    const lectureData = [
                        student.SSN,
                        student.Name,
                        lectDay.toLocaleDateString("en"),
                        hour,
                        rows.Subject,
                        rows.Teacher.Name,
                        rows.Teacher.SSN,


                    ];
                    // push each tickcet's info into a row
                    tableRows.push(lectureData);
                })

            })

        });


        // startY is basically margin-top
        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        const date = Date().split(" ");
        // we use a date string to generate our filename.
        const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
        // ticket title. and margin-top + margin-left
        doc.text("Contact tracing report for SSN: "+this.state.search, 14, 15);
        // we define the name of our PDF file.
        doc.save(`contact_tracing_report_${this.state.search}_${dateStr}.pdf`);



    }

    render() {
        return (
            <Container className='manager' data-testid="manager-page" style={ { padding: 5 } }>
                {this.state.serverErr && <Alert variant={"danger"}>Server error</Alert> }
                <Row className="justify-content-md-center below-nav">

                    { this.state.logs && this.state.subjects && this.state.modality==='table' && <>
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
                                {this.state.filterApplied!=='reset' && <Alert className={'alert-filter'} variant={'info'}><h6>Data filtered by: <span className={"filterName"}> {this.state.filterApplied}</span></h6></Alert>}
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
                                                <Button onClick={this.onSearchSsn} variant="outline-primary">Search</Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                {
                                    this.state.searchData.length?<div id='searchDataId' className='searchData'>
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
                                    </div>: <>
                                        {this.state.search!=='' && this.state.searchData.Errors && <div className='nodata'>No Data</div>}
                                        {this.state.emptyRes && <Alert variant={"danger"}>No results for your search</Alert> }
                                        </>
                                }

                                {this.state.searchData.length>0 && <Row className="justify-content-md-center">
                                    <Col style={{display: 'flex', justifyContent: 'space-around'}} className="LogChart"
                                         lg={6}>
                                        <Button>
                                            <CSVLink style={{color: '#fff'}} data={this.state.csvData}
                                                     variant="primary">
                                                Download CSV
                                            </CSVLink>
                                        </Button>

                                        <Button onClick={this.downloadpdf}>Download PDF</Button>
                                    </Col>
                                </Row>}
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>


            </Container>
        );
    }
}
export default Manager;
