import React, {Component} from 'react'
import {CanvasJSChart} from 'canvasjs-react-charts'

class LecturesGraph extends Component {
	constructor() {
		super();
		this.generateBookedDataPoints = this.generateBookedDataPoints.bind(this);
		this.generateBookedRateDataPoints = this.generateBookedRateDataPoints.bind(this);
	}

	generateBookedDataPoints() {
	let pts=[]
	if(this.props.detail==='d'){
        for(let l of this.props.logs){

            pts.push({x: new Date(l.date), y:l.bookedSeats, label:l.date})
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
                pts.push({x: i, y:l.monthlyavgbookings, label:l.monthId})
                i=i+1
            }
            console.log(pts)
            return pts;
        }


	}
	generateBookedRateDataPoints() {
    	let pts=[]
    	if(this.props.detail==='d'){
            for(let l of this.props.logs){

                pts.push({x: new Date(l.date), y:l.bookedSeats/l.unoccupiedSeats, label:l.date})
            }
            console.log(pts)
            return pts;
        }

        if(this.props.detail==='w'){
        let i=1;
                for(let l of this.props.logs){
                    pts.push({x: i, y:l.weeklyavgbookings/l.weeklyavgunoccupiedplaces, label:l.weekId})
                    i=i+1
                }
                console.log(pts)
                return pts;
            }
        if(this.props.detail==='m'){
        let i=1
                for(let l of this.props.logs){
                    pts.push({x: i, y:l.monthlyavgbookings/l.monthlyavgunoccupiedseats, label:l.monthId})
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

		const options1 = {
			theme: "light1", // "light1", "dark1", "dark2"
			animationEnabled: true,
			zoomEnabled: true,
			showInLegend:true,
			axisX:{
			    valueFormatString: FormatString
			},
			xValueFormatString: FormatString,
			title: {
				text: "Booked seats trend"
			},
			data: [
			        {
                        type: "area",
                        dataPoints: this.generateBookedDataPoints()
                    },


             	]
		}
         {
        			theme: "light1", // "light1", "dark1", "dark2"
        			animationEnabled: true,
        			zoomEnabled: true,
        			showInLegend:true,
        			axisX:{
        			    valueFormatString: FormatString
        			},
        			xValueFormatString: FormatString,
        			title: {
        				text: "Booking rate"
        			},
        			data: [
        			        {
                                type: "area",
                                dataPoints: this.generateBookedRateDataPoints()
                            },

                     	]
        		}
		return (<>
		<div>
			<CanvasJSChart options = {options1}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		</>
		);
	}
}

export default LecturesGraph;
