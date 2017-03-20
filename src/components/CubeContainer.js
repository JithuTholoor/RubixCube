import React, { Component } from 'react';
import Cube from './Cube';
import { toDegrees, toRadians, calcPosition } from './Utilities';

class CubeContainer extends Component {

    constructor(props) {
        super(props);
        this.moveCubes = this.moveCubes.bind(this);
        this.getOrientation = this.getOrientation.bind(this);
        this.directionChange = this.directionChange.bind(this);
        this.state = {
            positions: [
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
            ],
            angleOfRotation: Array(27).fill(0)
            , roationVector: Array(27).fill([1, 0, 0])
        };
        this.state.movedPositions = this.state.positions;
        this.state.prevRoationVector = this.state.roationVector;
        this.calculateResultantAngle = this.calculateResultantAngle.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.rotateCube = this.rotateCube.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mouseup', this.onTouchEnd);
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onTouchEnd);
    }

    moveCubes() {
        let arr = this.state.movedPositions.slice();
        const roationVector = this.state.roationVector;
        const angleOfRotation = this.state.angleOfRotation;
        for (let i = 0; i < arr.length; i++) {
            arr[i] = calcPosition(this.state.positions[i], roationVector[i], angleOfRotation[i]);
        }
        this.setState({ movedPositions: arr });
    }

    getOrientation(index) {
        return [this.state.roationVector[index][0],
        this.state.roationVector[index][1],
        this.state.roationVector[index][2],
        this.state.angleOfRotation[index]];
    }

    directionChange(eve) {
        this.setState({ roationVector: eve.target.value.split(',') });
    }

    calculateResultantAngle(alpha, roationVector, index) {
        const cos = (angle) => (Math.cos(toRadians(angle)));
        const sin = (angle) => (Math.sin(toRadians(angle)));

        const lx = roationVector[0];
        const ly = roationVector[1];
        const lz = roationVector[2];

        const mx = this.state.roationVector[index][0];
        const my = this.state.roationVector[index][1];
        const mz = this.state.roationVector[index][2];

        const beta = this.state.angleOfRotation[index];

        const gama = 2 * toDegrees(Math.acos(
            cos(alpha / 2) * cos(beta / 2) - sin(alpha / 2) * sin(beta / 2) * (lx * mx + ly * my + lz * mz)
        ));

        const nx = ((
            sin(alpha / 2) * cos(beta / 2) * lx +
            cos(alpha / 2) * sin(beta / 2) * mx +
            sin(alpha / 2) * sin(beta / 2) * (ly * mz - lz * my)
        ) / sin(gama / 2)).toFixed(6);

        const ny = ((
            sin(alpha / 2) * cos(beta / 2) * ly +
            cos(alpha / 2) * sin(beta / 2) * my +
            sin(alpha / 2) * sin(beta / 2) * (lz * mx - lx * mz)
        ) / sin(gama / 2)).toFixed(6);

        const nz = ((
            sin(alpha / 2) * cos(beta / 2) * lz +
            cos(alpha / 2) * sin(beta / 2) * mz +
            sin(alpha / 2) * sin(beta / 2) * (lx * my - ly * mx)
        ) / sin(gama / 2)).toFixed(6);
        return { gama, roationVector: [nx, ny, nz] };
    }

    onTouchStart(eve) {
        this.setState({ touchStarted: true, mousePoint: { x: eve.clientX, y: eve.clientY } })
    }

    onTouchMove(eve) {
        if (this.state.touchStarted) {
            let diffY = eve.clientY - this.state.mousePoint.y;
            let diffX = eve.clientX - this.state.mousePoint.x;
            if (Math.abs(diffY) > Math.abs(diffX))
                this.setState({ mousePoint: { x: eve.clientX, y: eve.clientY } }, () => {                    
                    debugger;
                    let rotationResult = this.calculateResultantAngle(-diffY, [1, 0, 0], 0);
                    this.setState(
                        {
                            angleOfRotation: Array(27).fill(rotationResult.gama),
                            roationVector: Array(27).fill(rotationResult.roationVector)
                        }, this.moveCubes);
                });
            else
                this.setState({ mousePoint: { x: eve.clientX, y: eve.clientY } }, () => {
                    let rotationResult = this.calculateResultantAngle(diffX, [0, 1, 0], 0);
                    this.setState(
                        {
                            angleOfRotation: Array(27).fill(rotationResult.gama),
                            roationVector: Array(27).fill(rotationResult.roationVector)
                        }, this.moveCubes);
                });
        }
    }

    onTouchEnd() {
        this.setState({ touchStarted: false, mousePoint: {} })
    }

    rotateCube(xAxisMove, yAxisMove, cubePosition) {
        let sixFaceAxis = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
        const roationVector = this.state.roationVector;
        const angleOfRotation = this.state.angleOfRotation;

        for (let f in sixFaceAxis) {
            sixFaceAxis[f] = calcPosition(sixFaceAxis[f], roationVector[0], angleOfRotation[0]);
        }

        let movedPosition;
        let index;
        let diff = 1000;
        for (let i in sixFaceAxis) {
            movedPosition = calcPosition(cubePosition.slice(), sixFaceAxis[i].slice(), yAxisMove);
            if (diff >
                Math.abs((movedPosition[0] - cubePosition[0]))
            ) {
                diff = Math.abs((movedPosition[0] - cubePosition[0]))
                index = i;
            }
        }


        let arr = this.state.movedPositions.slice();
        for (let j = 0; j < arr.length; j++) {
            let lineSum1 = (this.state.positions[j][0]) * (sixFaceAxis[index][0])
            let lineSum2 = (this.state.positions[j][1] * sixFaceAxis[index][1])
            let lineSum3 = (this.state.positions[j][2] * sixFaceAxis[index][2]);
            if (lineSum1 + lineSum2 + lineSum3 == 0)
                arr[j] = calcPosition(this.state.positions[j], sixFaceAxis[index], yAxisMove);
        }
        
        let rotationResult = this.calculateResultantAngle(yAxisMove, sixFaceAxis[index],0);
                    this.setState(
                        {
                            angleOfRotation: Array(27).fill(rotationResult.gama),
                            roationVector: Array(27).fill(rotationResult.roationVector)
                        }, this.moveCubes);
        this.setState({ movedPositions: arr });
    }

    render() {
        return (
            <div>
                <div style={{ position: 'absolute', zIndex: 1, width: '150px' }}>
                    <span>{this.state.angleOfRotation[0]}</span><br />
                    <span>{this.state.mousePoint ? this.state.mousePoint.x : ''}</span>
                </div>
                <div className="cube-container"
                    onMouseDown={this.onTouchStart}
                    onTouchStart={this.onTouchStart}
                    onMouseMove={this.onTouchMove}
                    onTouchMove={this.onTouchMove}>
                    {this.state.positions.map((val, index) => {
                        return (
                            <Cube rotateCubes={this.rotateCube}
                                translate={this.state.movedPositions[index]} orientation={this.getOrientation(index)} />
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default CubeContainer;
