import React,{Component} from 'react'
import {CanvasJSChart} from 'canvasjs-react-charts'

class LogGraph extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const options = {
            backgroundColor: "#F8F9FA",
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "Operations typologies"
            },
            data: [{
                type: "pie",
                startAngle: 75,
                toolTipContent: "<b>{label}</b>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}%",
                dataPoints: [
                    { y: this.props.summary.TypeOp0, label: "Student bookings" },
                    { y: this.props.summary.TypeOp1, label: "Student book cancellations" },
                    { y: this.props.summary.TypeOp2, label: "Teacher lecture cancellations" },
                    { y: this.props.summary.TypeOp3, label: "Teacher lecture modality switchings" }
                ]
            }]
        }
        return (
            <div>
                <CanvasJSChart options = {options}
                    /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    }
}

export default LogGraph;