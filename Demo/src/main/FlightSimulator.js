import React, { Component } from "react";
import { Button, Table, Container, Row, Col } from "reactstrap";
import socketIOClient from "socket.io-client";
import { Graph } from 'react-d3-graph';

var socket = socketIOClient("http://localhost:3001/") 

class FlightSimulator extends Component {
    constructor() {
        super()
        this.state = {
            // future possible values include aot node values and state
            noseAngle: 3
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", (event) => {console.log(`event: ${event.which}`)}, false )
        socket.on("nose_angle", (newAngle) => this.setState({noseAngle: newAngle}))
    }

    // componentDidUpdate() {
    //     socket.on("nose_angle", (newAngle) => this.setState({noseAngle: newAngle}))
    //     console.log(`UPDATE FlightSimulator.state.noseAngle : ${this.state.noseAngle}`)

    // }

    pilotUp() {
        socket.emit("pilot_up", this.state.noseAngle)
        // console.log(`FlightSimulator.state.noseAngle : ${this.state.noseAngle} `)    
    }

    pilotDown() {
        socket.emit("pilot_down", this.state.noseAngle)
        // console.log(`FlightSimulator.state.noseAngle : ${this.state.noseAngle} `)
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
                                        <DAG noseAngle={this.state.noseAngle}/>
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

class ObserverLog extends Component {
    constructor(props) {
        super(props)
    }
}

class DAG extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // noseAngle: this.props.noseAngle,
            data: {
                nodes: [{ id: 'AOT 1', x: -100, y: -30}, { id: 'AOT 2', x: -100, y: 60 }, { id: 'DIFF', x: -30, y: 20 }, { id: `PILOT`, x: -20, y: 80 }, { id: `NOSE ANGLE: ${this.props.noseAngle}`, x: 40, y: 20}],
                links: [] //[{ source: 'AOT 1', target: 'DIFF' }, { source: 'AOT 2', target: 'DIFF' }, { source: 'DIFF', target: `NOSE ANGLE: ${this.props.noseAngle}`}, {source: `PILOT ${this.props.noseAngle}`, target: `NOSE ANGLE: ${this.props.noseAngle}`}]
            },
            myConfig: {
                nodeHighlightBehavior: true,
                node: {
                    color: 'lightgreen',
                    size: 200,
                    highlightStrokeColor: 'blue'
                },
                link: {
                    highlightColor: 'lightblue'
                }, 
                directed: true, 
                staticGraph: true, 
            }
        }
 
    }

    // graph event callbacks
    onClickGraph = function() {
        window.alert(`Clicked the graph background`);
    };
    
    onClickNode = function(nodeId) {
        window.alert(`Clicked node ${nodeId}`);
    };
    
    onRightClickNode = function(event, nodeId) {
        window.alert(`Right clicked node ${nodeId}`);
    };
    
    onMouseOverNode = function(nodeId) {
        window.alert(`Mouse over node ${nodeId}`);
    };
    
    onMouseOutNode = function(nodeId) {
        window.alert(`Mouse out node ${nodeId}`);
    };
    
    onClickLink = function(source, target) {
        window.alert(`Clicked link between ${source} and ${target}`);
    };
    
    onRightClickLink = function(event, source, target) {
        window.alert(`Right clicked link between ${source} and ${target}`);
    };
    
    onMouseOverLink = function(source, target) {
        window.alert(`Mouse over in link between ${source} and ${target}`);
    };
    
    onMouseOutLink = function(source, target) {
        window.alert(`Mouse out link between ${source} and ${target}`);
    };

    render() {

        this.state.data = {
            nodes: [{ id: 'AOT 1', x: -100, y: -30}, { id: 'AOT 2', x: -100, y: 60 }, { id: 'DIFF', x: -30, y: 20 }, { id: `PILOT`, x: -20, y: 80 }, { id: `NOSE ANGLE: ${this.props.noseAngle}`, x: 40, y: 20}],
            links: [] //[{ source: 'AOT 1', target: 'DIFF' }, { source: 'AOT 2', target: 'DIFF' }, { source: 'DIFF', target: `NOSE ANGLE: ${this.props.noseAngle}`}, {source: `PILOT ${this.props.noseAngle}`, target: `NOSE ANGLE: ${this.props.noseAngle}`}]
        }
        console.log('DAG STATE ON RERENDER: \n')

        // console.log(JSON.stringify(this.state.data, null, '\t'))
        return (
            <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={this.state.data}
                config={this.state.myConfig}
                onClickNode={this.onClickNode}
                onRightClickNode={this.onRightClickNode}
                onClickGraph={this.onClickGraph}
                onClickLink={this.onClickLink}
                onRightClickLink={this.onRightClickLink}
                //onMouseOverNode={this.onMouseOverNode}
                //onMouseOutNode={this.onMouseOutNode}
                //onMouseOverLink={this.onMouseOverLink}
                //onMouseOutLink={this.onMouseOutLink}
            />
        )
    }
}

 
export default FlightSimulator 

