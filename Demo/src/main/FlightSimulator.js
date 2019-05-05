import React, { Component } from "react";
import { Button, Table, Container, Row, Col } from "reactstrap";
import socketIOClient from "socket.io-client";
import DAG from './DAG'
import Chart from "./RealTimeChart"


class FlightSimulator extends Component {
    constructor() {
        super()

        this._element = React.createRef()

        this.state = {
            // future possible values include aot node values and state
            noseAngle: 3,
            aot1Status: "valid",
            aot2Status: "valid",
            socket: socketIOClient("http://localhost:3001/") 
        }
    }

    componentDidMount() {
        // event listener for nose angle up on 'up' arrow key pressed
        document.addEventListener("keyup", (event) => { if (event.which == 38) this.pilotUp()}, false )
        // event listener for nose angle down on 'down' arrow key pressed
        document.addEventListener("keydown", (event) => { if (event.which == 40) this.pilotDown()}, false )
        // update noseAngle on 'nose_angle' event from socket
        this.state.socket.on("nose_angle", (newAngle) => {
            this.setState({noseAngle: newAngle})
            console.log(`nose_angle event recieved ${Date.now()} : ${newAngle}`)
        })
    }

    pilotUp() {
        this.state.socket.emit("pilot_up", this.state.noseAngle)
        console.log(`pilot_up event emitted ${Date.now()} : ${this.state.noseAngle} `)    
    }

    pilotDown() {
        this.state.socket.emit("pilot_down", this.state.noseAngle)
        console.log(`pilot_down event emitted ${Date.now()} : ${this.state.noseAngle} `)
    }
     
    killAot1() {
        this.state.socket.emit("kill_aot1", {})
        console.log(`kill_aot1 event emitted ${Date.now()} `)
        this.setState({aot1Status: (this.state.aot1Status === "valid") ? "invalid" : "valid"})
    }

    killAot2() {
        this.state.socket.emit("kill_aot2", {})
        console.log(`kill_aot2 event emitted ${Date.now()} `)
    }

    render() {
        return (
            <div ref={this._element}>
                <Container>
                    <Row>
                    <h2 className="h2Class">Flight Simulator</h2>
                    </Row>
                    <Row id="data-display">
                        <Col>
                                <Row>
                                    <h3 className="h3Class">Dependency Chart</h3>
                                </Row>
                                <Row>
                                    <DAG 
                                        aot1Status={this.state.aot1Status}
                                        aot2Status={this.state.aot2Status}
                                        //height={this._element.current == null ? 200 : this._element.current.offsetHeight}
                                        //width={this._element.current == null ? 400 : this._element.current.offsetWidth}
                                    />
                                </Row>
                        </Col>
                        <Col>
                            <Container>
                                <Container>
                                    <Row>
                                        <h3 className="h3Class">Pilot Controls</h3>
                                    </Row>
                                    <Row>
                                            <Col>
                                                <Button onClick={() => this.pilotUp()}>UP</Button>
                                            </Col>
                                            <Col>
                                                <p>Nose Angle: {this.state.noseAngle}</p>
                                            </Col>
                                            <Col>
                                                <Button onClick={() => this.pilotDown()}>DOWN</Button>
                                            </Col>
                                    </Row>
                                </Container>
                                <Container>
                                    <Row>
                                        <h3 className="h3Class">Sensor Controls</h3>                                        
                                    </Row>
                                    <Row>
                                            <Col>
                                                <Button onClick={() => this.killAot1()}>KILL AOT 1</Button>
                                            </Col>
                                            <Col>
                                                <Button onClick={() => this.killAot2()}>KILL AOT 2</Button>
                                            </Col>
                                    </Row>
                                </Container>
                            </Container>
                        </Col>
                    </Row>
                    <Row>
                        <Chart noseAngle={this.state.noseAngle}/>
                    </Row>
                </Container>
            </div>
        )
    }
}
 
export default FlightSimulator 

