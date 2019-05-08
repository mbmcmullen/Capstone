import React, { Component } from "react";
import { Button, Container, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import socketIOClient from "socket.io-client";
import DAG from './DAG'
import Chart from "./RealTimeChart"
import "./main.css"

class FlightSimulator extends Component {
    constructor() {
        super()

        this.state = {
            // future possible values include aot node values and state
            noseAngle: 0,
            aot1: { data: 0, status: "valid"},
            aot2: { data: 0, status: "valid"},
            socket: socketIOClient("http://backend:3001/") 
        }
    }

    componentDidMount() {
        this.state.socket.connect()

        this.state.socket.on("connect", () => {console.log("frontend connected")})

        // event listener for nose angle up on 'up' arrow key pressed
        document.addEventListener("keyup", (event) => { if (event.which === 38) this.pilotUp()}, false )
        
        // event listener for nose angle down on 'down' arrow key pressed
        document.addEventListener("keydown", (event) => { if (event.which === 40) this.pilotDown()}, false )
        
        // update noseAngle on 'nose_angle' event from socket
        this.state.socket.on("nose_angle", (newAngle) => {
            this.setState({noseAngle: newAngle})
            // console.log(`nose_angle event recieved ${Date.now()} : ${newAngle}`)
        })
        
        // update aot1 value and status 
        this.state.socket.on("aot1", (newAot1) => {
            this.setState({aot1: newAot1})
            // console.log(`aot1 : ${JSON.stringify(this.state.aot1)}`)
        })

        // update aot2 value and status
        this.state.socket.on("aot2", (newAot2) => {
            this.setState({aot2: newAot2})
            // console.log(`Set aot2 state`)
        })
    }

    pilotUp() {
        this.state.socket.emit("pilot_up", this.state.noseAngle)
        // console.log(`pilot_up event emitted ${Date.now()} : ${this.state.noseAngle} `)    
    }

    pilotDown() {
        this.state.socket.emit("pilot_down", this.state.noseAngle)
        // console.log(`pilot_down event emitted ${Date.now()} : ${this.state.noseAngle} `)
    }
     
    killAot1() {
        this.state.socket.emit("kill_aot1", {})
        // console.log(`kill_aot1 event emitted ${Date.now()} `)
    }

    killAot2() {
        this.state.socket.emit("kill_aot2", {})
        // console.log(`kill_aot2 event emitted ${Date.now()} `)
    }

    restartAot1() {
        this.state.socket.emit("restart_aot1", {})
        // console.log(`restart_aot1 event emitted ${Date.now()}`)
    }

    restartAot2() {
        this.state.socket.emit("restart_aot2", {})
        // console.log(`restart_aot2 event emitted ${Date.now()}`)
    }

    render() {
        return (
            <div ref={this._element}>
                <Container>
                    <Row>
                    <h2 className="h2Class">Flight Simulator</h2>
                    </Row>
                    <Row>
                        <Col className="data-display">
                            <Row>
                                <Card className="my-card">
                                    <CardHeader><h3>DEPENDENCY CHART</h3></CardHeader>
                                    <CardBody>
                                        <DAG 
                                            aot1Status={this.state.aot1.status}
                                            aot2Status={this.state.aot2.status}
                                        />
                                    </CardBody>
                                </Card>
                            </Row>
                            <Row>
                                <Card className="my-card">
                                    <CardHeader>
                                        <h3>DATA POINTS</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <Chart 
                                            noseAngle={this.state.noseAngle} 
                                            aot1={this.state.aot1} 
                                            aot2={this.state.aot2}
                                        />
                                    </CardBody>
                                </Card>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Card className="my-card">
                                    <CardHeader>
                                        <h3 className="h3Class">PILOT CONTROLS</h3>
                                    </CardHeader>
                                    <CardBody>
                                            <Col>
                                                <Button className="control-button" onClick={() => this.pilotUp()}>UP</Button>
                                            </Col>
                                            <Col>
                                                <p>Nose Angle: {this.state.noseAngle}</p>
                                            </Col>
                                            <Col>
                                                <Button className="control-button" onClick={() => this.pilotDown()}>DOWN</Button>
                                            </Col>
                                    </CardBody>
                                </Card>
                            </Row>
                            <Row>
                                <Card className="my-card"> 
                                    <CardHeader>
                                        <h3 className="h3Class">SENSOR CONTROLS</h3>                                        
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col>
                                                <Button className="control-button" onClick={() => this.killAot1()}>KILL AOT 1</Button>
                                            </Col>
                                            <Col>
                                                <Button className="control-button" onClick={() => this.killAot2()}>KILL AOT 2</Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Button className="control-button" onClick={() => this.restartAot1()}>RESTART AOT 1</Button>
                                            </Col>
                                            <Col>
                                                <Button className="control-button" onClick={() => this.restartAot2()}>RESTART AOT 2</Button>
                                            </Col>
                                        </Row>
                                    </CardBody>                                    
                                </Card>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
 
export default FlightSimulator 

