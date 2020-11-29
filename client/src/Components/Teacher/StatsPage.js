import React,{Component} from 'react'
import LecturesGraph from './Graphs/LecturesGraph.js'
import {Row, Col, Button, ButtonGroup, Table, Container, Tabs, Tab, Card, Accordion} from 'react-bootstrap'
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
        this.state={modality:'daily', stats:[]}

    }
    componentDidMount() {
        API.getTeacherStats().then((res)=>{
            console.log(res[0])
            let i=0;
            while (i<res.length) {
                for (let l of res[i].dailystatsarray) {
                    let time = l.date
                    l.date = new Date(l.date).toLocaleDateString("en")
                    l.hour = new Date(time).getHours()
                    console.log(l.hour)
                }
                i++;
            }
            console.log(res)
            this.setState({logs:res, subjectLogs:res[0]})

        }).catch((err)=>{
            console.log(err)
        })
    }

    setModality(modality){
        this.setState({modality:modality})
    }

    handleStats(id){
        console.log(id)
        console.log(id==='del')
        if(id === "del"){
            let res=this.state.logs
            this.setState({subjectLogs:res[0]})
        }
        else {
            for (let item of this.state.logs) {
                let trovato = 0;
                if (item.subjectId.SubjectName === id) {
                    trovato = 1;

                    this.setState({subjectLogs: item});
                    break;
                }
                if (trovato == 0) {
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
    }
    render() {
        return <>
            <Container fluid  className={"statsLecture"}>
            <Row className="justify-content-md-center below-nav">
                <h3 className={"headerLectureList"}>Statistics {this.state.subjectLogs && <> about <span className={"courseTitle"} >{this.state.subjectLogs.subjectId.SubjectName}</span></>} course
                    <br/><h6>Tables and charts are referring to a specific course</h6>
                </h3>
            </Row>



            <Row className="justify-content-md-center">
                <Col className="col-1 justify-content-md-center FiltersList" >
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
                                                    <br />
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
               {this.state.subjectLogs && <><Tabs
                   id="controlled-tab"
                   activeKey={this.state.modality}
                   onSelect={(k) => this.setModality(k)}
               >
                   <Tab eventKey="daily" title="Daily">
                       <Row className="justify-content-md-center below-nav">
                           <Col>

                               <MDBDataTable
                                   striped
                                   bordered
                                   small
                                   data={{columns: colsDaily, rows: this.state.subjectLogs.dailystatsarray}}
                               />
                           </Col>
                           <Col xs={6}>
                               {this.props.canShowGraphs &&
                               <LecturesGraph detail={'d'} logs={this.state.subjectLogs.dailystatsarray}/>}
                           </Col>
                       </Row>
                   </Tab>
                   <Tab eventKey="weekly" title="Weekly">
                       <Row className="justify-content-md-center below-nav">
                           <Col>
                               <MDBDataTable
                                   striped
                                   bordered
                                   small
                                   data={{columns: colsWeekly, rows:this.state.subjectLogs.weeklystatsarray}}
                               />
                           </Col>
                           <Col xs={6}>
                               {this.props.canShowGraphs &&
                               <LecturesGraph detail={'w'} logs={this.state.subjectLogs.weeklystatsarray}/>}
                           </Col>
                       </Row>
                   </Tab>
                   <Tab eventKey="monthly" title="Monthly">
                       <Row className="justify-content-md-center below-nav">
                           <Col>
                               <MDBDataTable
                                   striped
                                   bordered
                                   small
                                   data={{columns: colsMonthly, rows:this.state.subjectLogs.monthlystatsarray}}
                               />
                           </Col>
                           <Col xs={6}>
                               {this.props.canShowGraphs &&
                               <LecturesGraph detail={'m'} logs={this.state.subjectLogs.monthlystatsarray}/>}
                           </Col>
                       </Row>
                   </Tab>
               </Tabs></>}
            </Col>
        </Row>
            </Container>
            </>
    }
}
export default StatsPage;