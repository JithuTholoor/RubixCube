import React, { Component } from 'react';
import Cube from './Cube';

class CubeContainer extends Component {

    constructor(props){
        super(props);
        this.rangeChange=this.rangeChange.bind(this);
        this.rangeChangeX=this.rangeChangeX.bind(this);
        this.calcPosition=this.calcPosition.bind(this);
        this.moveCubes=this.moveCubes.bind(this);
        this.state={positions:[[0, 0, 0],[50, 0, 0]],orientation:[0,0,0],prevOrientation:[0,0,0]};
    }

    rangeChange(eve) {
        let currentOrientation=this.state.orientation;
        this.setState({orientation:[0,eve.target.value,0],prevOrientation:currentOrientation},()=>{
            this.moveCubes();
        });
    }
    rangeChangeX(eve) {
        let currentOrientation=this.state.orientation;
        this.setState({orientation:[eve.target.value,0,0],prevOrientation:currentOrientation},()=>{
            this.moveCubes();
        });
    }

    moveCubes(){
        let arr=this.state.positions.slice();
        for(let i=0;i<arr.length;i++){
            arr[i]=this.calcPosition(this.state.positions[i]);
        }
        this.setState({positions:arr});
    }

    toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    calcPosition(position) {
        let x = 0;
        let y = 0;
        let z = 0;
        if(this.state.prevOrientation[0]!=this.state.orientation[0]) {
            x = position[0];
            y = position[1]* Math.cos(this.toRadians(this.state.orientation[0]-this.state.prevOrientation[0]))-
                position[2] * Math.sin(this.toRadians(this.state.orientation[0]-this.state.prevOrientation[0]));
            z = position[1] * Math.sin(this.toRadians(this.state.orientation[0]-this.state.prevOrientation[0])) +
                position[2] * Math.cos(this.toRadians(this.state.orientation[0]-this.state.prevOrientation[0]));
        }
        if(this.state.prevOrientation[1]!=this.state.orientation[1]) {
            x = position[0] * Math.cos(this.toRadians(this.state.orientation[1]-this.state.prevOrientation[1])) +
                position[2] * Math.sin(this.toRadians(this.state.orientation[1]-this.state.prevOrientation[1]));
            y = position[1];
            z = -position[0] * Math.sin(this.toRadians(this.state.orientation[1]-this.state.prevOrientation[1])) +
                position[2] * Math.cos(this.toRadians(this.state.orientation[1]-this.state.prevOrientation[1]));
        }
        return [x, y, z];
    }
    render() {
        return (
            <div>
                {this.state.orientation[1]}
                <input onChange={this.rangeChange} value="0" type="range" min="0" max="360" style={{'margin-bottom':'100px'}}/>
                {this.state.orientation[0]}
                <input onChange={this.rangeChangeX} value="0" type="range" min="0" max="360" style={{'margin-bottom':'100px'}}/>
                <div className="cube-container">
                    <Cube translate={this.state.positions[0]} orientation={this.state.orientation}
                          prevOrientation={this.state.prevOrientation}/>
                    <Cube translate={this.state.positions[1]} orientation={this.state.orientation}
                          prevOrientation={this.state.prevOrientation}/>

                </div>
            </div>
        );
    }
}

export default CubeContainer;
