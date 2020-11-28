import React,{Component} from 'react'
import LecturesGraph from './Graphs/LecturesGraph.js'
import {Row, Col, Button, ButtonGroup, Table, Container,Tabs,Tab} from 'react-bootstrap'
import API from '../../api/api.js'

const  retrieveCourse=(list, id)=>{
    for(let i of list){
        if (i.SubjectId===id){
            return i.SubjectName;
        }
    }
}


const StatsTable = (props) => {
    let {detail, logs}=props
    return <Table responsive striped bordered hover >
        <thead>
        <tr>
            {detail==='d' && <th>Date</th>}
            {detail==='w' && <th>Week</th>}
            {detail==='m' && <th>Month</th>}
            <th>{detail!=='d' && <>Average </>}Booked Students</th>
            <th>{detail!=='d' && <>Average </>}Free Seats</th>
        </tr>
        </thead>
        <tbody>
        {logs.map((l)=>{
            return <>
                <tr>
                    {detail==='d' && <td>{new Date(l.date).toLocaleDateString("en")}</td>}
                    {detail==='w' && <td>{l.weekId}</td>}
                    {detail==='m' && <td>{l.monthId}</td>}

                    {detail==='d' && <td>{l.bookedSeats}</td>}
                    {detail==='w' && <td>{l.weeklyavgbookings}</td>}
                    {detail==='m' && <td>{l.monthlyavgbookings}</td>}

                    {detail==='d' && <td>{l.unoccupiedSeats}</td>}
                    {detail==='w' && <td>{l.weeklyavgunoccupiedplaces}</td>}
                    {detail==='m' && <td>{l.monthlyavgunoccupiedseats}</td>}
                </tr>
            </>
        })}
        </tbody>
    </Table>
}


class StatsPage extends Component {
    constructor() {
        super();
        this.state={modality:'daily', stats:[]}

    }
    componentDidMount() {
        API.getTeacherStats().then((res)=>{
            console.log(res[0])
            this.setState({logs:res, subjectLogs:res[0]})
        }).catch((err)=>{
            console.log(err)
        })
    }

    setModality(modality){
        this.setState({modality:modality})
    }

    handleStats(id){
        for(let item of this.state.logs){
            if (item.subjectId===id ){
                this.setState({subjectLogs:item});
                break;
            }
        }
    }
    render() {
        return <>
            <Container fluid  className={"statsLecture"}>
            <Row className="justify-content-md-center below-nav">
                <h3 className={"headerLectureList"}>Statistics about your lectures
                    of {this.state.subjectLogs && <>{this.state.subjectLogs.subjectId.subjectName}</>}</h3>
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
                                        value={e.SubjectId}
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
                               <StatsTable detail={'d'} logs={this.state.subjectLogs.dailystatsarray}/>
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
                               <StatsTable detail={'w'} logs={this.state.subjectLogs.weeklystatsarray}/>
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
                               <StatsTable detail={'m'} logs={this.state.subjectLogs.monthlystatsarray}/>
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