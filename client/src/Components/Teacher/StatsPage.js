import React,{Component} from 'react'
import LecturesGraph from './Graphs/LecturesGraph.js'
import {Row, Col, Button, ButtonGroup, Table, Container,Tabs,Tab} from 'react-bootstrap'

const StatsTable = (props) => {
    return <Table responsive striped bordered hover >
        <thead>
        <tr>
            <th>Date</th>
            <th>Booked Students</th>
            <th>Room capacity</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>1</td>
            {Array.from({ length: 2 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
            ))}
        </tr>
        <tr>
            <td>2</td>
            {Array.from({ length: 2 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
            ))}
        </tr>
        <tr>
            <td>3</td>
            {Array.from({ length: 2 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
            ))}
        </tr>
        </tbody>
    </Table>
}


class StatsPage extends Component {
    constructor() {
        super();
        this.state={modality:'daily'}

    }
    setModality(modality){
        this.setState({modality:modality})
    }

    handleStats(id){

    }
    render() {
        return <>
            <Container fluid  className={"statsLecture"}>
            <Row className="justify-content-md-center below-nav">
                <h3 className={"headerLectureList"}>Statistics about your lectures </h3>
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
                                        value={e}
                                        key={e}
                                        onClick={(ev) => {
                                            this.handleStats(ev.target.value);
                                        }}
                                        data-testid="handlelecture-button"
                                    >
                                        {e}
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
               <Tabs
                   id="controlled-tab"
                   activeKey={this.state.modality}
                   onSelect={(k) => this.setModality(k)}
               >
                   <Tab eventKey="daily" title="Daily">
                     <Row  className="justify-content-md-center below-nav">
                         <Col>
                            <StatsTable/>
                        </Col>
                        <Col xs={6}>
                            {this.props.canShowGraphs &&
                            <LecturesGraph/>}
                        </Col>
                     </Row>
                   </Tab>
                   <Tab eventKey="weekly" title="Weekly">
                       <Row  className="justify-content-md-center below-nav">
                           <Col>
                               <StatsTable/>
                           </Col>
                           <Col xs={6}>
                               {this.props.canShowGraphs &&
                               <LecturesGraph/>}
                           </Col>
                       </Row>
                   </Tab>
                   <Tab eventKey="monthly" title="Monthly">
                       <Row  className="justify-content-md-center below-nav">
                           <Col>
                               <StatsTable/>
                           </Col>
                           <Col xs={6}>
                               {this.props.canShowGraphs &&
                               <LecturesGraph/>}
                           </Col>
                       </Row>
                   </Tab>
            </Tabs>
            </Col>
        </Row>
            </Container>
            </>
    }
}
export default StatsPage;