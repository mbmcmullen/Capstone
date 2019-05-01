import React, { Component } from "react";
import { Button, Table, Container, Row, Col } from "reactstrap";
import socketIOClient from "socket.io-client";
import { Graph } from 'react-d3-graph';
import DAG from './DAG'

var socket = socketIOClient("http://localhost:3001/") 

class FlightSimulator extends Component {
    constructor() {
        super()
        this.state = {
            // future possible values include aot node values and state
            noseAngle: 3,
            aot1: 3,
            aot2: 3,
            diff: 0
        }
    }

    componentDidMount() {
        // event listener for nose angle up on 'up' arrow key pressed
        document.addEventListener("keyup", (event) => { if (event.which == 38) this.pilotUp()}, false )
        // event listener for nose angle down on 'down' arrow key pressed
        document.addEventListener("keydown", (event) => { if (event.which == 40) this.pilotDown()}, false )
        // update noseAngle on 'nose_angle' event from socket
        socket.on("nose_angle", (newAngle) => {
            this.setState({noseAngle: newAngle})
            console.log(`nose_angle event recieved ${Date.now()} : ${newAngle}`)
        })
    }

    pilotUp() {
        socket.emit("pilot_up", this.state.noseAngle)
        console.log(`pilot_up event emitted ${Date.now()} : ${this.state.noseAngle} `)    
    }

    pilotDown() {
        socket.emit("pilot_down", this.state.noseAngle)
        console.log(`pilot_down event emitted ${Date.now()} : ${this.state.noseAngle} `)
    }

    render() {
        return (
            <div>
                <Container>
                    <Row>
                    <h2 className="h2Class">Flight Simulator</h2>
                    </Row>
                    <Row>
                        <Col>
                            <Table>
                                <thead>
                                    <td>Dataflow Diagram</td>
                                </thead>
                                <tbody>
                                    <tr>
                                        <DAG 
                                            noseAngle={this.state.noseAngle}
                                            aot1={this.state.aot1}
                                            aot2={this.state.aot2}
                                            diff={this.state.diff}
                                         />
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col>
                            <Table>
                                <thead>Pilot Controls</thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Button onClick={() => this.pilotUp()}>UP</Button>
                                        </td>
                                        <td>
                                            Nose Angle: {this.state.noseAngle}
                                        </td>
                                        <td>
                                            <Button onClick={() => this.pilotDown()}>DOWN</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

 
export default FlightSimulator 

