import React, { Component } from 'react';
import Cube from './Cube';
import { calcPosition, calculateResultantAngle, getCubePositionDiffrence } from './Utilities';

class CubeContainer extends Component {

    constructor(props) {
        super(props);
        this.getOrientation = this.getOrientation.bind(this);
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
            , roationVector: Array(27).fill([1, 0, 0]),
            faceRotationAngle: 0
        };
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.rotateCube = this.rotateCube.bind(this);
        this.reArrangeCubes = this.reArrangeCubes.bind(this);
    }

    componentDidMount() {
        //adding listener for mouseup
        document.addEventListener('mouseup', this.onTouchEnd);
    }

    componentWillUnmount() {
        //removeEventListener
        document.removeEventListener('mouseup', this.onTouchEnd);
    }

    /**return css parameters for orientation */
    getOrientation(index) {
        return [this.state.roationVector[index][0],
        this.state.roationVector[index][1],
        this.state.roationVector[index][2],
        this.state.angleOfRotation[index]];
    }

    /**Touch events */
    onTouchStart(eve) {
        this.setState({ touchStarted: true, mousePoint: { x: eve.clientX, y: eve.clientY } })
    }

    onTouchMove(eve) {
        if (this.state.touchStarted) {
            let diffY = eve.clientY - this.state.mousePoint.y;
            let diffX = eve.clientX - this.state.mousePoint.x;
            this.setState({ mousePoint: { x: eve.clientX, y: eve.clientY } }, () => {
                let arr = this.state.positions.slice();
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = Math.abs(diffY) > Math.abs(diffX) ?
                        calcPosition(this.state.positions[i], [1, 0, 0], -diffY) :
                        calcPosition(this.state.positions[i], [0, 1, 0], diffX);
                }
                let rotationResult = Math.abs(diffY) > Math.abs(diffX) ?
                    calculateResultantAngle(-diffY, [1, 0, 0], this.state.roationVector[0], this.state.angleOfRotation[0]) :
                    calculateResultantAngle(diffX, [0, 1, 0], this.state.roationVector[0], this.state.angleOfRotation[0]);
                this.setState(
                    {
                        positions: arr,
                        angleOfRotation: Array(27).fill(rotationResult.gama),
                        roationVector: Array(27).fill(rotationResult.roationVector)
                    });
            });
        }
    }

    onTouchEnd() {
        this.setState({ touchStarted: false, mousePoint: {} });
        if (this.state.faceRotationIndex) {
            this.reArrangeCubes();
        }
    }

    reArrangeCubes() {
        if (this.state.faceRotationAngle % 90 == 0) {
            this.setState({ faceRotationAngle: 0, faceRotationIndex: null });
            return;
        }
        this.rotateCube(Math.sqrt(.5), Math.sqrt(.5), null);
        setTimeout(this.reArrangeCubes, .001);
    }

    //Method triggered by child cube on cube movement
    rotateCube(xAxisMove, yAxisMove, cubePosition) {
        /** check for no movement*/
        if (xAxisMove == 0 && yAxisMove == 0)
            return;

        /**resultant move */
        let currentMove = 1;

        /**fetching state data */
        let roationVector = this.state.roationVector.slice();
        let angleOfRotation = this.state.angleOfRotation;
        let arr = this.state.positions.slice();

        /**face vectors for all six faces */
        let sixFaceAxis = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
        for (let f in sixFaceAxis) {
            sixFaceAxis[f] = calcPosition(sixFaceAxis[f], roationVector[0], angleOfRotation[0]);
        }

        let index = 0;
        let reverseAngle = false;
        if (!this.state.faceRotationIndex) {
            /**Finding face on which rotation gives matching cube movement */
            let movedPosition;
            let diff = 1000;
            for (let i in sixFaceAxis) {
                movedPosition = calcPosition(cubePosition.slice(), sixFaceAxis[i].slice(), currentMove);
                if (diff > getCubePositionDiffrence(movedPosition,cubePosition,xAxisMove,yAxisMove)
                    && Math.abs((cubePosition[0] * sixFaceAxis[i][0] + cubePosition[1] * sixFaceAxis[i][1] + cubePosition[2] * sixFaceAxis[i][2]) - 50) < .1
                ) {
                    diff = getCubePositionDiffrence(movedPosition,cubePosition,xAxisMove,yAxisMove);
                    index = i;
                    reverseAngle = false;
                }

                movedPosition = calcPosition(cubePosition.slice(), sixFaceAxis[i].slice(), -currentMove);
                if (diff > getCubePositionDiffrence(movedPosition,cubePosition,xAxisMove,yAxisMove)
                    && Math.abs((cubePosition[0] * sixFaceAxis[i][0] + cubePosition[1] * sixFaceAxis[i][1] + cubePosition[2] * sixFaceAxis[i][2]) - 50) < .1
                ) {
                    diff = getCubePositionDiffrence(movedPosition,cubePosition,xAxisMove,yAxisMove);
                    index = i;
                    reverseAngle = true;
                }
            }
            this.setState({ 'faceRotationIndex': index, "reverseAngle": reverseAngle });
        }
        else {
            reverseAngle = this.state.reverseAngle;
            index = this.state.faceRotationIndex;
        }


        /** calculating position of cubes in the face rotation */
        for (let j = 0; j < arr.length; j++) {
            let lineSum1 = (arr[j][0]) * (sixFaceAxis[index][0])
            let lineSum2 = (arr[j][1]) * (sixFaceAxis[index][1])
            let lineSum3 = (arr[j][2]) * (sixFaceAxis[index][2]);

            /** filter for indetifying cubes in the rotating face*/
            if (Math.abs((lineSum1 + lineSum2 + lineSum3) - 50) < .1) {
                arr[j] = calcPosition(this.state.positions[j], sixFaceAxis[index],this.state.reverseAngle?-currentMove:currentMove);
                const rotationResult = calculateResultantAngle(this.state.reverseAngle?-currentMove:currentMove, sixFaceAxis[index], roationVector[j].slice(), angleOfRotation[j]);
                roationVector[j] = rotationResult.roationVector;
                angleOfRotation[j] = rotationResult.gama;
            }
        }

        /** setting u the state */
        
        console.log(angleOfRotation);
        console.log(this.state.faceRotationAngle + currentMove);
        this.setState(
            {
                positions: arr,
                angleOfRotation: angleOfRotation,
                roationVector: roationVector,
                faceRotationAngle: this.state.faceRotationAngle + currentMove
            });
    }

    render() {
        return (
            <div>
                {/*TODO - remove once dev is completed*/}
                {/*<div style={{ position: 'absolute', zIndex: 1, width: '150px' }}>
                    <span>{this.state.angleOfRotation}</span><br />
                    <span>{this.state.roationVector}</span>
                </div>*/}
                {/*TODO -end*/}

                <div className="cube-container"
                    onMouseDown={this.onTouchStart}
                    onTouchStart={this.onTouchStart}
                    onMouseMove={this.onTouchMove}
                    onTouchMove={this.onTouchMove}>
                    {this.state.positions.map((val, index) => {
                        return (
                            <Cube key={index} rotateCubes={this.rotateCube}
                                translate={this.state.positions[index]} orientation={this.getOrientation(index)} />
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default CubeContainer;
