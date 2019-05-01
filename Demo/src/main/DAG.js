import React, { Component } from "react";
import { Button, Table, Container, Row, Col } from "reactstrap";
import { Graph } from 'react-d3-graph';


class DAG extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // noseAngle: this.props.noseAngle,
            data: {
                nodes: [{ id: `AOT 1: ${this.props.aot1}`, x: -100, y: -30}, { id: `AOT 2: ${this.props.aot2}`, x: -100, y: 60 }, { id: `DIFF`, x: -30, y: 20 }, { id: `PILOT`, x: -20, y: 80 }, { id: `NOSE ANGLE: ${this.props.noseAngle}`, x: 40, y: 20}],
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
                focusedNodeId: `DIFF`
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
            nodes: [{ id: `AOT 1: ${this.props.aot1}`, x: -100, y: -30}, { id: `AOT 2: ${this.props.aot2}`, x: -100, y: 60 }, { id: `DIFF`, x: -30, y: 20 }, { id: `PILOT`, x: -20, y: 80 }, { id: `NOSE ANGLE: ${this.props.noseAngle}`, x: 40, y: 20}],
            links: [], //[{ source: 'AOT 1', target: 'DIFF' }, { source: 'AOT 2', target: 'DIFF' }, { source: 'DIFF', target: `NOSE ANGLE: ${this.props.noseAngle}`}, {source: `PILOT ${this.props.noseAngle}`, target: `NOSE ANGLE: ${this.props.noseAngle}`}]
            focusedNodeId: `DIFF`
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

export default DAG