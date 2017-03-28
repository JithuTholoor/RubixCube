import React, { Component } from 'react';
import Cube,{cubeWidth} from './Cube';
import { calcPosition,
    calculateResultantAngle,
    getCubePositionDiffrence,
    getTouchPositions} from './Utilities';

class CubeContainer extends Component {

    constructor(props) {
        super(props);
        this.getOrientation = this.getOrientation.bind(this);
        this.state = {
            positions: [
                [0, 0, 0],
                [-cubeWidth, 0, 0],
                [cubeWidth, 0, 0],
                [0, -cubeWidth, 0],
                [0, cubeWidth, 0],
                [-cubeWidth, -cubeWidth, 0],
                [-cubeWidth, cubeWidth, 0],
                [cubeWidth, -cubeWidth, 0],
                [cubeWidth, cubeWidth, 0],

                [0, 0, -cubeWidth],
                [-cubeWidth, 0, -cubeWidth],
                [cubeWidth, 0, -cubeWidth],
                [0, -cubeWidth, -cubeWidth],
                [0, cubeWidth, -cubeWidth],
                [-cubeWidth, -cubeWidth, -cubeWidth],
                [-cubeWidth, cubeWidth, -cubeWidth],
                [cubeWidth, -cubeWidth, -cubeWidth],
                [cubeWidth, cubeWidth, -cubeWidth],

                [0, 0, cubeWidth],
                [-cubeWidth, 0, cubeWidth],
                [cubeWidth, 0, cubeWidth],
                [0, -cubeWidth, cubeWidth],
                [0, cubeWidth, cubeWidth],
                [-cubeWidth, -cubeWidth, cubeWidth],
                [-cubeWidth, cubeWidth, cubeWidth],
                [cubeWidth, -cubeWidth, cubeWidth],
                [cubeWidth, cubeWidth, cubeWidth],
            ],
            angleOfRotation: Array(27).fill(0)
            , rotationVector: Array(27).fill([1, 0, 0]),
            faceRotationAngle: 0
        };
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.rotateCube = this.rotateCube.bind(this);
        this.reArrangeCubes = this.reArrangeCubes.bind(this);
        this.rotateCubeSpace=this.rotateCubeSpace.bind(this);
    }

    componentDidMount() {
        //adding listener for mouseup
        document.addEventListener('mouseup', this.onTouchEnd);
        this.rotateCubeSpace(120,0);
    }

    componentWillUnmount() {
        //removeEventListener
        document.removeEventListener('mouseup', this.onTouchEnd);
    }

    /**return css parameters for orientation */
    getOrientation(index) {
        return [this.state.rotationVector[index][0],
            this.state.rotationVector[index][1],
            this.state.rotationVector[index][2],
            this.state.angleOfRotation[index]];
    }

    /**Touch events */
    onTouchStart(eve) {
        this.setState({touchStarted: true, mousePoint:
        {x: getTouchPositions(eve).clientX, y: getTouchPositions(eve).clientY}});
    }

    rotateCubeSpace(diffX,diffY){
        let arr = this.state.positions.slice();
        let angleOfRotationArr = [];
        let rotationVectorArr = [];
        for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.abs(diffY) > Math.abs(diffX) ?
                calcPosition(this.state.positions[i], [1, 0, 0], -diffY) :
                calcPosition(this.state.positions[i], [0, 1, 0], diffX);
            let rotationResult = Math.abs(diffY) > Math.abs(diffX) ?
                calculateResultantAngle(-diffY, [1, 0, 0], this.state.rotationVector[i], this.state.angleOfRotation[i]) :
                calculateResultantAngle(diffX, [0, 1, 0], this.state.rotationVector[i], this.state.angleOfRotation[i]);
            angleOfRotationArr[i] = rotationResult.gama;
            rotationVectorArr[i] = rotationResult.rotationVector;
        }

        this.setState(
            {
                positions: arr,
                angleOfRotation: angleOfRotationArr,
                rotationVector: rotationVectorArr
            });
    }

    onTouchMove(eve) {
        if (this.state.touchStarted) {
            let diffY = getTouchPositions(eve).clientY - this.state.mousePoint.y;
            let diffX = getTouchPositions(eve).clientX - this.state.mousePoint.x;
            this.setState({mousePoint: {x: getTouchPositions(eve).clientX, y: getTouchPositions(eve).clientY}}, () => {
                this.rotateCubeSpace(diffX,diffY);
            });
        }
    }

    onTouchEnd() {
        this.setState({touchStarted: false, mousePoint: {}});
        if (this.state.faceRotationIndex) {
            this.reArrangeCubes();
        }
    }

    reArrangeCubes() {
        if (this.state.faceRotationAngle % 90 == 0) {
            this.setState({faceRotationAngle: 0, faceRotationIndex: null,autoRotation:undefined});
            return;
        }
        this.rotateCube(Math.sqrt(.5), Math.sqrt(.5), null,true);
        setTimeout(this.reArrangeCubes, .001);
    }

    /**Method triggered by child cube on cube movement*/
    rotateCube(xAxisMove, yAxisMove, cubePosition,autoMove) {

        /** avoiding multiple simultaneous move*/
        if( this.state.autoRotation && !autoMove)
            return;

        /** check for no movement*/
        if (xAxisMove == 0 && yAxisMove == 0)
            return;

        /**resultant move */
        let currentMove = 1;

        /**fetching state data */
        let rotationVector = this.state.rotationVector.slice();
        let angleOfRotation = this.state.angleOfRotation;
        let arr = this.state.positions.slice();

        /**face vectors for all six faces */
        let sixFaceAxis = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
        for (let f in sixFaceAxis) {
            sixFaceAxis[f] = calcPosition(sixFaceAxis[f], rotationVector[0], angleOfRotation[0]);
        }

        let index = 0;
        let reverseAngle = false;
        if (!autoMove) {
            /**Finding face on which rotation gives matching cube movement */
            let movedPosition;
            let diff = 1000;
            for (let i in sixFaceAxis) {
                movedPosition = calcPosition(cubePosition.slice(), sixFaceAxis[i].slice(), currentMove);
                if (diff > getCubePositionDiffrence(movedPosition, cubePosition, xAxisMove, yAxisMove)
                    && Math.abs((cubePosition[0] * sixFaceAxis[i][0] + cubePosition[1] * sixFaceAxis[i][1] + cubePosition[2] * sixFaceAxis[i][2]) - cubeWidth) < .1
                ) {
                    diff = getCubePositionDiffrence(movedPosition, cubePosition, xAxisMove, yAxisMove);
                    index = i;
                    reverseAngle = false;
                }

                movedPosition = calcPosition(cubePosition.slice(), sixFaceAxis[i].slice(), -currentMove);
                if (diff > getCubePositionDiffrence(movedPosition, cubePosition, xAxisMove, yAxisMove)
                    && Math.abs((cubePosition[0] * sixFaceAxis[i][0] + cubePosition[1] * sixFaceAxis[i][1] + cubePosition[2] * sixFaceAxis[i][2]) - cubeWidth) < .1
                ) {
                    diff = getCubePositionDiffrence(movedPosition, cubePosition, xAxisMove, yAxisMove);
                    index = i;
                    reverseAngle = true;
                }
            }
            this.setState({'faceRotationIndex': index, "reverseAngle": reverseAngle});
        }
        else {
            reverseAngle = this.state.reverseAngle;
            index = this.state.faceRotationIndex;
        }


        /** calculating position of cubes in the face rotation */
        for (let j = 0; j < arr.length; j++) {
            let lineSum1 = (arr[j][0]) * (sixFaceAxis[index][0]);
            let lineSum2 = (arr[j][1]) * (sixFaceAxis[index][1]);
            let lineSum3 = (arr[j][2]) * (sixFaceAxis[index][2]);

            /** filter for identifying cubes in the rotating face*/
            if (Math.abs((lineSum1 + lineSum2 + lineSum3) - cubeWidth) < .1) {
                arr[j] = calcPosition(this.state.positions[j], sixFaceAxis[index], reverseAngle ? -currentMove : currentMove);
                const rotationResult = calculateResultantAngle(reverseAngle ? -currentMove : currentMove, sixFaceAxis[index], rotationVector[j].slice(), angleOfRotation[j]);
                rotationVector[j] = rotationResult.rotationVector;
                angleOfRotation[j] = rotationResult.gama;
            }
        }

        /** setting u the state */
        this.setState(
            {
                positions: arr,
                angleOfRotation: angleOfRotation,
                rotationVector: rotationVector,
                faceRotationAngle: this.state.faceRotationAngle + (reverseAngle ? -currentMove : currentMove),
                autoRotation:autoMove
            }
        );
    }

    render() {
        return (
                <div className="cube-container"
                     onMouseDown={this.onTouchStart}
                     onTouchStart={this.onTouchStart}
                     onMouseMove={this.onTouchMove}
                     onTouchMove={this.onTouchMove}>
                    {this.state.positions.map((val, index) => {
                        return (
                            <Cube key={index} rotateCubes={this.rotateCube}
                                  translate={this.state.positions[index]} orientation={this.getOrientation(index)}/>
                        )
                    })}
                </div>
        );
    }
}

export default CubeContainer;
