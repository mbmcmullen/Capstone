import React, { Component } from "react";
import { Graph } from 'react-d3-graph';


class DAG extends Component {
    constructor(props) {
        super(props)

        this.state = {
            myConfig: {
                nodeHighlightBehavior: true,
                node: {
                    color: 'green',
                    size: 300,
                    highlightStrokeColor: 'blue', 
                    fontSize: 18
                },
                link: {
                    highlightColor: 'lightblue'
                }, 
                directed: true, 
                staticGraph: true, 
                height: 200, 
                width: 500, 
                maxZoom: 2

            }
        }
    }
    
    // graph event callbacks
    onClickGraph = function() {
        window.alert(`Clicked the graph background`);
    };
    
    onClickNode = function(nodeId) {
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

    getAot1NodeColor(){
        return (this.props.aot1Status === "valid") ? "green" : "red"
    }

    getAot2NodeColor(){
        return (this.props.aot2Status === "valid") ? "green" : "red"
    }

    render() {

        this.state.data = {
            nodes: [
                { id: `AOT 1`, x: 100, y: 30, color: this.getAot1NodeColor()}, 
                { id: `AOT 2`, x: 100, y: 140, color: this.getAot2NodeColor()}, 
                { id: `DIFF`, x: 180, y: 90 }, 
                { id: `PILOT`, x: 230, y: 180 }, 
                { id: `NOSE ANGLE`, x: 300, y: 130}],
            
            links: [
                { source: 'AOT 1', target: 'DIFF'}, 
                { source: 'AOT 2', target: 'DIFF' }, 
                { source: 'DIFF', target: `NOSE ANGLE`}, 
                {source: `PILOT`, target: `NOSE ANGLE`}],
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

/**

<path class="link" d="M230,180A0,0 0 0,1 300,130" marker-end="url(#marker-large)" id="PILOT,NOSE ANGLE: 3" style="stroke-width: 1.5; stroke: rgb(211, 211, 211); opacity: 1; fill: none; cursor: pointer;"></path>

<path class="link" d="M230,180A0,0 0 0,1 0,0" marker-end="url(#marker-large)" id="PILOT,NOSE ANGLE: 3" style="stroke-width: 1.5; stroke: rgb(211, 211, 211); opacity: 1; fill: none; cursor: pointer;"></path>

 */