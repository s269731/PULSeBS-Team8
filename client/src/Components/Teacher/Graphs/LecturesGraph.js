import React, {Component} from 'react'
import {CanvasJSChart} from 'canvasjs-react-charts'

class LecturesGraph extends Component {
	constructor() {
		super();
		this.generateDataPoints = this.generateDataPoints.bind(this);
	}

	generateDataPoints() {
	let pts=[]
	if(this.props.detail==='d'){
        for(let l of this.props.logs){
            pts.push({x: new Date(l.date), y:l.bookedSeats})
        }
        console.log(pts)
        return pts;
    }

    if(this.props.detail==='w'){
    let i=1;
            for(let l of this.props.logs){
                pts.push({x: i, y:l.weeklyavgbookings, label:l.weekId})
                i=i+1
            }
            console.log(pts)
            return pts;
        }
    if(this.props.detail==='m'){
    let i=1
            for(let l of this.props.logs){
                pts.push({x: i, y:l.monthlyavgbookings, label:l.weekId})
                i=i+1
            }
            console.log(pts)
            return pts;
        }


	}



	render() {
	    let FormatString: ""
	    if(this.props.detail==='d'){
	        FormatString= "D MMM YYYY"
	    }

		const options = {
			theme: "light2", // "light1", "dark1", "dark2"
			animationEnabled: true,
			zoomEnabled: true,
			showInLegend:true,
			axisX:{
			    valueFormatString: FormatString
			},
			xValueFormatString: FormatString,
			title: {
				text: "Bookings trend"
			},
			data: [{
				type: "area",
				dataPoints: this.generateDataPoints()
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

export default LecturesGraph;