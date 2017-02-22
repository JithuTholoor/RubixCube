import React, { Component } from 'react';
import Cube from './Cube';

class CubeContainer extends Component {

    constructor(props){
        super(props);
        this.rangeChangeY=this.rangeChangeY.bind(this);
        this.rangeChangeX=this.rangeChangeX.bind(this);
        this.rangeChangeZ=this.rangeChangeZ.bind(this);
        this.calcPosition=this.calcPosition.bind(this);
        this.moveCubes=this.moveCubes.bind(this);
        this.state={
            positions:[
                [0, 0, 0],
                [-50, 0, 0],
                [50, 0, 0],
                [0, -50, 0],
                [0, 50, 0],
                [-50, -50, 0],
                [-50, 50, 0],
                [50, -50, 0],
                [50, 50, 0],
                
                [0, 0, -50],
                [-50, 0, -50],
                [50, 0, -50],
                [0, -50, -50],
                [0, 50, -50],                
                [-50, -50, -50],
                [-50, 50, -50],
                [50, -50, -50],
                [50, 50, -50],

                [0, 0, 50],
                [-50, 0, 50],
                [50, 0, 50],
                [0, -50, 50],
                [0, 50, 50],                
                [-50, -50, 50],
                [-50, 50, 50],
                [50, -50, 50],
                [50, 50, 50],
                ]
            ,orientation:[0,0,0],prevOrientation:[0,0,0]};
    }

    rangeChangeY(eve) {
        let currentOrientation=this.state.orientation;
        this.setState({orientation:[currentOrientation[0],eve.target.value,currentOrientation[2]],prevOrientation:currentOrientation},()=>{
            this.moveCubes();
        });
    }
    rangeChangeX(eve) {
        let currentOrientation=this.state.orientation;
        this.setState({orientation:[eve.target.value,currentOrientation[1],currentOrientation[2]],prevOrientation:currentOrientation},()=>{
            this.moveCubes();
        });
    }
    rangeChangeZ(eve) {
        let currentOrientation=this.state.orientation;
        this.setState({orientation:[currentOrientation[0],currentOrientation[1],eve.target.value],prevOrientation:currentOrientation},()=>{
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
        let x = position[0];
        let y = position[1];
        let z = position[2];
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
            z = -1*(position[0]* Math.sin(this.toRadians(this.state.orientation[1]-this.state.prevOrientation[1]))) +
                position[2] * Math.cos(this.toRadians(this.state.orientation[1]-this.state.prevOrientation[1]));
        }
        if(this.state.prevOrientation[2]!=this.state.orientation[2]) {
            x = position[0] * Math.cos(this.toRadians(this.state.orientation[2]-this.state.prevOrientation[2])) -
                position[1] * Math.sin(this.toRadians(this.state.orientation[2]-this.state.prevOrientation[2]));
            y = position[0] * Math.sin(this.toRadians(this.state.orientation[2]-this.state.prevOrientation[2])) +
                position[1] * Math.cos(this.toRadians(this.state.orientation[2]-this.state.prevOrientation[2]));
            z = position[2];
        }
        return [x, y, z];
    }
    render() {
        return (
            <div>
                {this.state.orientation[1]}
                <input onChange={this.rangeChangeY} type="range" min="0" max="360" style={{'margin-bottom':'100px'}}/>
                {this.state.orientation[0]}
                <input onChange={this.rangeChangeX}  type="range" min="0" max="360" style={{'margin-bottom':'100px'}}/>
                {this.state.orientation[2]}
                <input onChange={this.rangeChangeZ}  type="range" min="0" max="360" style={{'margin-bottom':'100px'}}/>
                <div className="cube-container">
                    {this.state.positions.map((val,index)=>{
                        return (
                            <Cube translate={this.state.positions[index]} orientation={this.state.orientation}
                          prevOrientation={this.state.prevOrientation}/>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default CubeContainer;
