import React,{Component} from 'react'
import LecturesGraph from './Graphs/LecturesGraph.js'
import {Row, Col, Button, ButtonGroup,Container, Tabs, Tab,Alert} from 'react-bootstrap'
import API from '../../api/api.js'

import { MDBDataTable } from 'mdbreact';

const colsDaily=[
    {
        label: 'Date',
        field: 'date',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Hour',
        field: 'hour',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Booked Students',
        field: 'bookedSeats',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Free Seats',
        field: 'unoccupiedSeats',
        sort: 'asc',
        width: 150
    },
]
const colsWeekly=[
    {
        label: 'Week',
        field: 'weekId',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Average Booked Students',
        field: 'weeklyavgbookings',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Average Free Seats',
        field: 'weeklyavgunoccupiedplaces',
        sort: 'asc',
        width: 150
    },
]
const colsMonthly=[
    {
        label: 'Month',
        field: 'monthId',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Average Booked Students',
        field: 'monthlyavgbookings',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Average Free Seats',
        field: 'monthlyavgunoccupiedseats',
        sort: 'asc',
        width: 150
    },
]

class StatsPage extends Component {
    constructor() {
        super();
        this.state={mainModality:'bookings', modality:'daily-bookings', stats:[],emptyLogs:false}

    }
    componentDidMount() {
        API.getTeacherStats().then((res)=>{
            console.log(res)
            if(res.errors){
                let subjectLogs = {
                    subjectId: {SubjectId:-1,SubjectName:""},
                    dailystatsarray: [],
                    weeklystatsarray: [],
                    monthlystatsarray: []

                }
                this.setState({subjectLogs: subjectLogs, logs:[], emptyLogs:true});
            }
            else {
                let i = 0;
                while (i < res.length) {
                    for (let l of res[i].dailystatsarray) {
                        let time = l.date
                        let mins=new Date(time).getMinutes().toString()
                        if(mins==='0'){
                            mins='00'
                        }
                        l.date = new Date(l.date).toLocaleDateString("en")
                        l.hour = new Date(time).getHours()+":"+mins
                        console.log(l.hour)
                    }
                    i++;
                }
                console.log(res)
                this.setState({logs: res, subjectLogs: res[0],emptyLogs:false})
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    setModality(modality){
        this.setState({modality:modality})
    }
    setMainModality(modality){
        let show;
        if(modality==='bookings'){
            show='daily-bookings'
        }
        else{
            show='daily-attendance'
        }
        this.setState({mainModality:modality, modality:show})
    }

    handleStats(id){
        console.log(id)
        console.log(id==='del')
        if(id === "del"){
            let res = this.state.logs
            if(res.length>0) {
                this.setState({subjectLogs: res[0]})
            }
        }
        else {
            let trovato = 0;
            for (let item of this.state.logs) {
                if (item.subjectId.SubjectName === id) {
                    trovato = 1
                    this.setState({subjectLogs: item});
                    break;
                }
            }
                if (trovato === 0) {
                    let subjectLogs = {
                        subjectId: {SubjectId:-1,SubjectName:""},
                        dailystatsarray: [],
                        weeklystatsarray: [],
                        monthlystatsarray: []

                    }
                    this.setState({subjectLogs: subjectLogs});
                }
            }

    }
    render() {
        return <>
            <Container fluid  className={"statsLecture"}>
            <Row className="justify-content-md-center below-nav">
                {this.state.emptyLogs ? <Alert variant={"danger"} className={"headerLectureList"}><h3>No statistics available</h3></Alert>: <h3 className={"headerLectureList"}>Statistics {this.state.subjectLogs && <> about <span
                    className={"courseTitle"}>{this.state.subjectLogs.subjectId.SubjectName}</span></>} course
                    <br/><h6>Tables and charts are referring to a specific course</h6>
                </h3>}
            </Row>


                {!this.state.emptyLogs &&

                <Row className="justify-content-md-center">

                    <Col className=" justify-content-md-center FiltersList">
                        <h5>Courses</h5>


                        <ButtonGroup vertical>
                            {this.props.subjects.map((e) => {
                                return (
                                    <>
                                        <Button
                                            variant="primary"
                                            value={e.SubjectName}
                                            key={e.SubjectId}
                                            onClick={(ev) => {
                                                this.handleStats(ev.target.value);
                                            }}
                                            data-testid="handlelecture-button"
                                        >
                                            {e.SubjectName}
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
                                    this.handleStats(e.target.value);
                                }}
                                data-testid="handlelecture-del-button"
                            >
                                Cancel filters
                            </Button>
                        </ButtonGroup>

                    </Col>
                    <Col xs={10}>
                        {this.state.subjectLogs && <>
                        <Tabs
                            id="controlled-main-tab"
                            activeKey={this.state.mainModality}
                            onSelect={(k) => this.setMainModality(k)}
                            variant={"pills"}
                        >


                            <Tab eventKey="bookings" title="Bookings Statistics">

                                <Tabs
                                id="controlled-main-bookings-tab"
                                activeKey={this.state.modality}
                                onSelect={(k) => this.setModality(k)}
                                className={"below-tab"}
                            >
                                <Tab eventKey="daily-bookings" title="Daily">
                                    <Row className="justify-content-md-center below-nav">
                                        <Col>
                                            {this.props.canShowGraphs &&
                                            <LecturesGraph mode={'b'} detail={'d'} logs={this.state.subjectLogs.dailystatsarray}/>}
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-md-center below-nav">
                                        <Col>
                                            { this.state.subjectLogs.dailystatsarray.length!==0 ?
                                            <MDBDataTable
                                                striped
                                                bordered
                                                small
                                                data={{columns: colsDaily, rows: this.state.subjectLogs.dailystatsarray}
                                                }
                                                data-testid={"logs-daily-table"}
                                            />: <Alert variant={"danger"} data-testid={"no-logs-warning"}>No statistics available for {this.state.subjectLogs.subjectId.SubjectName} course</Alert> }
                                        </Col>
                                    </Row>

                                </Tab>
                                <Tab eventKey="weekly-bookings" title="Weekly">
                                    <Row className="justify-content-md-center below-nav">
                                        <Col>
                                            {this.props.canShowGraphs &&
                                            <LecturesGraph mode={'b'} detail={'w'} logs={this.state.subjectLogs.weeklystatsarray}/>}
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-md-center below-nav">
                                        <Col>
                                            { this.state.subjectLogs.dailystatsarray.length!==0 ?
                                            <MDBDataTable
                                                striped
                                                bordered
                                                small
                                                data={{columns: colsWeekly, rows: this.state.subjectLogs.weeklystatsarray}}
                                                data-testid={"logs-weekly-table"}
                                            />: <Alert variant={"danger"} data-testid={"no-logs-warning"}>No statistics available for {this.state.subjectLogs.subjectId.SubjectName} course</Alert> }

                                        </Col>
                                    </Row>

                                </Tab>
                                <Tab eventKey="monthly-bookings" title="Monthly">
                                    <Row className="justify-content-md-center below-nav">
                                        <Col>
                                            {this.props.canShowGraphs &&
                                            <LecturesGraph mode={'b'} detail={'m'} logs={this.state.subjectLogs.monthlystatsarray}/>}
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-md-center below-nav">
                                        <Col>

                                            { this.state.subjectLogs.dailystatsarray.length!==0 ? <MDBDataTable
                                                striped
                                                bordered
                                                small
                                                data={{
                                                    columns: colsMonthly,
                                                    rows: this.state.subjectLogs.monthlystatsarray
                                                }}
                                                data-testid={"logs-monthly-table"}
                                            />: <Alert variant={"danger"} data-testid={"no-logs-warning"}>No statistics available for {this.state.subjectLogs.subjectId.SubjectName} course</Alert> }

                                        </Col>
                                    </Row>

                                </Tab>
                            </Tabs>
                            </Tab>



                            <Tab eventKey="attendance" title="Attendance Statistics">
                                <Tabs
                                    id="controlled-main-attendance-tab"
                                    activeKey={this.state.modality}
                                    onSelect={(k) => this.setModality(k)}
                                    className={"below-tab"}
                                >
                                    <Tab eventKey="daily-attendance" title="Daily">
                                        <Row className="justify-content-md-center below-nav">
                                            <Col>
                                                {this.props.canShowGraphs &&
                                                <LecturesGraph mode={'a'} detail={'d'} logs={this.state.subjectLogs.dailystatsarray}/>}
                                            </Col>
                                        </Row>
                                        <Row className="justify-content-md-center below-nav">
                                            <Col>
                                                { this.state.subjectLogs.dailystatsarray.length!==0 ?
                                                    <MDBDataTable
                                                        striped
                                                        bordered
                                                        small
                                                        data={{columns: colsDaily, rows: this.state.subjectLogs.dailystatsarray}
                                                        }
                                                        data-testid={"logs-daily-attendance-table"}
                                                    />: <Alert variant={"danger"} data-testid={"no-logs-attendance-warning"}>No statistics available for {this.state.subjectLogs.subjectId.SubjectName} course</Alert> }
                                            </Col>
                                        </Row>

                                    </Tab>
                                    <Tab eventKey="weekly-attendance" title="Weekly">
                                        <Row className="justify-content-md-center below-nav">
                                            <Col>
                                                {this.props.canShowGraphs &&
                                                <LecturesGraph mode={'a'} detail={'w'} logs={this.state.subjectLogs.weeklystatsarray}/>}
                                            </Col>
                                        </Row>
                                        <Row className="justify-content-md-center below-nav">
                                            <Col>
                                                { this.state.subjectLogs.dailystatsarray.length!==0 ?
                                                    <MDBDataTable
                                                        striped
                                                        bordered
                                                        small
                                                        data={{columns: colsWeekly, rows: this.state.subjectLogs.weeklystatsarray}}
                                                        data-testid={"logs-weekly-attendance-table"}
                                                    />: <Alert variant={"danger"} data-testid={"no-logs-attendance-warning"}>No statistics available for {this.state.subjectLogs.subjectId.SubjectName} course</Alert> }

                                            </Col>
                                        </Row>

                                    </Tab>
                                    <Tab eventKey="monthly-attendance" title="Monthly">
                                        <Row className="justify-content-md-center below-nav">
                                            <Col>
                                                {this.props.canShowGraphs &&
                                                <LecturesGraph mode={'a'} detail={'m'} logs={this.state.subjectLogs.monthlystatsarray}/>}
                                            </Col>
                                        </Row>
                                        <Row className="justify-content-md-center below-nav">
                                            <Col>

                                                { this.state.subjectLogs.dailystatsarray.length!==0 ? <MDBDataTable
                                                    striped
                                                    bordered
                                                    small
                                                    data={{
                                                        columns: colsMonthly,
                                                        rows: this.state.subjectLogs.monthlystatsarray
                                                    }}
                                                    data-testid={"logs-monthly-attendance-table"}
                                                />: <Alert variant={"danger"} data-testid={"no-logs-attendance-warning"}>No statistics available for {this.state.subjectLogs.subjectId.SubjectName} course</Alert> }

                                            </Col>
                                        </Row>

                                    </Tab>
                                </Tabs>
                            </Tab>

                        </Tabs>
                        </>}
                    </Col>
                </Row>}
            </Container>
            </>
    }
}
export default StatsPage;
