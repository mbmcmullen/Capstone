/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Ring from "ringjs";

import {
    TimeSeries,
    TimeRange,
    TimeEvent,
} from "pondjs";

import {ChartContainer, ChartRow, Charts, YAxis, ScatterChart, BarChart, Resizable, Legend, styler} from "react-timeseries-charts";

import socketIOClient from "socket.io-client";


const sec = 1000;
const minute = 60 * sec;
const hours = 60 * minute;
const rate = 1000;

class realtime extends React.Component {
    constructor(props) {
        super(props)
        
 
        this.state = {
            beginTime: new Date(),
            time: new Date(),
            events: new Ring(100),
            nose_angle_events: new Ring(200), 
            aot1_events: new Ring(200), 
            aot2_events: new Ring(200),
            socket: socketIOClient("http://localhost:3001/") 
        };
    }


    getNewEvent = t => {
        // const base = Math.sin(t.getTime() / 10000000) * 350 + 500;

        const base = Math.sin(t.getTime() / 10000000) * 16 + 20

        // return new TimeEvent(t, parseInt(base + Math.random() * 1000, 10));

        return new TimeEvent(t, parseInt(base + Math.random() * 5, 10));
    };

    componentDidMount() {
        //
        // Setup our interval to advance the time and generate raw events
        //

        this.intervalNoseAngle = setInterval(() => {
            // const t = new Date(this.state.time.getTime()+sec)
            const t = new Date()
            const event = new TimeEvent(t, this.props.noseAngle)
            const newNoseAngleEvents = this.state.nose_angle_events
            newNoseAngleEvents.push(event)
            this.setState({ time: t, nose_angle_events: newNoseAngleEvents });
            // console.log("nose_angle event handled in RealTimeChart")
        }, 30)

        this.intervalAot1 = setInterval(() => {
            if (this.props.aot1.status === "valid") {
                const t = new Date()
                const event = new TimeEvent(t, this.props.aot1.data)
                const newAot1Events = this.state.aot1_events
                newAot1Events.push(event)
                this.setState({time: t, aot1_events: newAot1Events})
            }
        }, 30)
        

        this.intervalAot2 = setInterval(() => {
            if (this.props.aot2.status === "valid") {
                const t = new Date()
                const event = new TimeEvent(t, this.props.aot2.data)
                const newAot2Events = this.state.aot2_events
                newAot2Events.push(event)
                this.setState({time: t, aot2_events: newAot2Events})
            }
        }, 30)
        
    }

    componentWillUnmount() {
        clearInterval(this.intervalNoseAngle);
        clearInterval(this.intervalAot1)
        clearInterval(this.intervalAot2)
    }

    render() {
        const latestTime = `${this.state.time}`;

        const scatterStyle = {
            value: {
                normal: {
                    fill: "#E74C3C",
                    opacity: 0.9
                }
            }
        };

        const styleAot1 = {
            value: {
                normal: {
                    fill: "#2980B9",
                    opacity: 0.9
                }
            }
        }

        const styleAot2 = {
            value: {
                normal: {
                    fill: "#F1C40F", 
                    opacity: 0.9
                }
            }
        }

        //
        // Create a TimeSeries for our raw and nose_angle events
        //

        const noseAngleEventSeries = new TimeSeries({
            name: "nose_angle", 
            events: this.state.nose_angle_events.toArray()
        })

        const aot1EventSeries = new TimeSeries({
            name: "aot1", 
            events: this.state.aot1_events.toArray()
        })

        const aot2EventSeries = new TimeSeries({
            name: "aot2", 
            events: this.state.aot2_events.toArray()
        })

        // Timerange for the chart axis
        const timeWindow = 1 * minute;

        let beginTime = this.state.beginTime;
        let endTime = new Date()

        if (endTime.getTime() - beginTime.getTime() > 5000){
            beginTime = new Date(endTime.getTime() - 5000)
            // console.log(`CONDITIONAL: ${endTime.getTime() - beginTime.getTime()}`)
        }

        const timeRange = new TimeRange(beginTime, endTime);
        // console.log(`\ncurrent time : ${(new Date()).getTime()}`)
        // console.log(`beginTime : ${beginTime.getTime()}`)
        // console.log(`endTime : ${endTime.getTime()}`)
        // console.log(`timeRange : ${timeRange.toString()}`)

        // Charts (after a certain amount of time, just show hourly rollup)
        const charts = (
            <Charts>
                <ScatterChart axis="y" series={noseAngleEventSeries} style={scatterStyle} />   
                <ScatterChart axis="y" series={aot1EventSeries} style={styleAot1} />
                <ScatterChart axis="y" series={aot2EventSeries} style={styleAot2} />
            </Charts>
        );

        const dateStyle = {
            fontSize: 12,
            color: "#AAA",
            borderWidth: 1,
            borderColor: "#F4F4F4"
        };

        const style = styler([
            { key: "aot1", color: "#2980B9", width: 1, dashed: true },
            { key: "aot2", color: "#F1C40F", width: 2 },
            { key: "nose_angle", color: "#E74C3C", width: 2 }
        ]);

        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <Legend
                            type="swatch"
                            style={style}
                            categories={[
                                {
                                    key: "aot1",
                                    label: "AOT 1",
                                    style: { fill: "#2980B9" }
                                },
                                {
                                    key: "aot2",
                                    label: "AOT 2",
                                    style: { fill: "#F1C40F" }
                                },
                                {
                                    key: "nose_angle",
                                    label: "NOSE ANGLE",
                                    style: { fill: "#E74C3C" }
                                }
                            ]}
                        />
                    </div>
                    <div className="col-md-8">
                        <span style={dateStyle}>{latestTime}</span>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer timeRange={timeRange}>
                                <ChartRow height="200">
                                    <YAxis
                                        id="y"
                                        label="Value"
                                        min={-2}
                                        max={20}
                                        width="50"
                                        type="linear"
                                    />
                                    {charts}
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
export default realtime;


