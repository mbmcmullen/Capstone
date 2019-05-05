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
    Pipeline as pipeline,
    Stream,
    EventOut,
    percentile
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
            time: new Date(),
            events: new Ring(100),
            nose_angle_events: new Ring(200), 
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
        // Setup our aggregation pipelines
        //

        this.stream = new Stream();

        //
        // Setup our interval to advance the time and generate raw events
        //

        // const increment = 5 * sec;
        // this.interval = setInterval(() => {
        //     const t = new Date(this.state.time.getTime() + increment);
        //     const event = this.getNewEvent(t);

        //     // Raw events
        //     const newEvents = this.state.events;
        //     newEvents.push(event);
        //     // console.log(JSON.stringify(event))
        //     this.setState({ time: t, events: newEvents });

        //     // Let our aggregators process the event
        //     this.stream.addEvent(event);
        // }, rate);

        this.interval = setInterval(() => {
            const t = new Date(this.state.time.getTime()+sec)
            // const t = new Date()
            const event = new TimeEvent(t, this.props.noseAngle)
            const newNoseAngleEvents = this.state.nose_angle_events
            newNoseAngleEvents.push(event)
            this.setState({ time: t, nose_angle_events: newNoseAngleEvents });
            // console.log("nose_angle event handled in RealTimeChart")
        }, 100)

        
        // this.state.socket.on("nose_angle", (newAngle) => {

        // })
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const latestTime = `${this.state.time}`;

        const scatterStyle = {
            value: {
                normal: {
                    fill: "steelblue",
                    opacity: 0.9
                }
            }
        };

        //
        // Create a TimeSeries for our raw and nose_angle events
        //

        // const eventSeries = new TimeSeries({
        //     name: "raw",
        //     events: this.state.events.toArray()
        // });

        const noseAngleEventSeries = new TimeSeries({
            name: "nose_angle", 
            events: this.state.nose_angle_events.toArray()
        })

        // Timerange for the chart axis
        const initialBeginTime = new Date();
        const timeWindow = 1 * hours;

        let beginTime;
        // const endTime = new Date(this.state.time.getTime() + minute);
        const endTime = new Date(this.state.time.getTime());
        // const endTime = new Date(initialBeginTime.getTime() + hours);
        if (endTime.getTime() - timeWindow < initialBeginTime.getTime()) {
            beginTime = initialBeginTime;
        } else {
            beginTime = new Date(endTime.getTime() - timeWindow);
        }
        const timeRange = new TimeRange(beginTime, endTime);
        console.log(`\ncurrent time : ${new Date()}`)
        console.log(`beginTime : ${beginTime}`)
        console.log(`endTime : ${endTime}`)
        console.log(`timeRange : ${timeRange.toString()}`)

        // Charts (after a certain amount of time, just show hourly rollup)
        const charts = (
            <Charts>
                {/* <ScatterChart axis="y" series={eventSeries} style={scatterStyle} /> */}
                <ScatterChart axis="y" series={noseAngleEventSeries} style={scatterStyle} />                
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
            { key: "pilot", color: "#27AE60", width: 2 }
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
                                    key: "pilot",
                                    label: "PILOT",
                                    style: { fill: "#27AE60" }
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