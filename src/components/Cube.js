import React, { Component } from 'react';
import { getTouchPositions } from '../utilities/utilities';
export const cubeWidth = 50;
export const faceArray = ['front', 'back', 'top', 'bottom', 'left', 'right'];
export const facePosition = {
    left: [-cubeWidth, 0, 0],
    right: [cubeWidth, 0, 0],
    front: [0, 0, cubeWidth],
    back: [0, 0, -cubeWidth],
    top: [0, -cubeWidth, 0],
    bottom: [0, cubeWidth, 0]
};

class Cube extends Component {

    static propTypes = {
        rotateCubes: React.PropTypes.func,
        translate: React.PropTypes.array,
        orientation: React.PropTypes.array
    };

    constructor(props) {
        super(props);

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        let faceColors = {};
        faceColors.top = this.props.translate[1] === -cubeWidth ? '#fff' : '';
        faceColors.bottom = this.props.translate[1] === cubeWidth ? '#FDCC09' : '';
        faceColors.left = this.props.translate[0] === -cubeWidth ? '#DC422F' : '';
        faceColors.right = this.props.translate[0] === cubeWidth ? '#FF6C00' : '';
        faceColors.front = this.props.translate[2] === cubeWidth ? '#009D54' : '';
        faceColors.back = this.props.translate[2] === -cubeWidth ? '#3D81F6' : '';

        if (Math.abs(this.props.translate[0]) +
            Math.abs(this.props.translate[1]) +
            Math.abs(this.props.translate[2]) == cubeWidth) {
            this.disableFaceRotation=true;
        }
        this.state = {touchStarted: false, faceColors: faceColors};
    }

    componentDidMount() {
        document.addEventListener('mouseup', this.onTouchEnd);
        document.addEventListener('touchend', this.onTouchEnd);
        document.addEventListener('touchcancel', this.onTouchEnd);
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onTouchEnd);
        document.removeEventListener('touchend', this.onTouchEnd);
        document.removeEventListener('touchcancel', this.onTouchEnd);
    }

    cubePosition() {
        return (
            this.props.translate ? {
                transform: `translate3d(${this.props.translate[0]}px,${this.props.translate[1]}px,${this.props.translate[2]}px)
         rotate3d(${this.props.orientation[0]},${this.props.orientation[1]},${this.props.orientation[2]},${this.props.orientation[3]}deg)`
            } : {});
    }

    onTouchStart(eve, face) {
        if(this.disableFaceRotation)
            return true;
        eve.stopPropagation();
        this.setState({
            touchStarted: true,
            mousePoint: {x: getTouchPositions(eve).clientX, y: getTouchPositions(eve).clientY},
            touchedFace: face
        });
    }

    onTouchMove(eve) {
        if (this.state.touchStarted) {
            let diffY = getTouchPositions(eve).clientY - this.state.mousePoint.y;
            let diffX = getTouchPositions(eve).clientX - this.state.mousePoint.x;
            this.props.rotateCubes(diffX, diffY, this.props.translate, this.state.touchedFace, this.props.orientation);
            this.setState({mousePoint: {x: getTouchPositions(eve).clientX, y: getTouchPositions(eve).clientY}});
        }
        if (eve.targetTouches)
            eve.stopPropagation();
    }

    onTouchEnd() {
        this.setState({touchStarted: false, mousePoint: {}, touchedFace: undefined})
    }

    render() {
        return (
            <div className="cube" style={this.cubePosition()}>
                {faceArray.map((face, index) => {
                    return <div key={index}
                                onMouseMove={this.onTouchMove}
                                onTouchMove={this.onTouchMove}
                                onMouseDown={(evt) => this.onTouchStart(evt, face)}
                                onTouchStart={(evt) => this.onTouchStart(evt, face)}
                                className={'face ' + face}
                                style={{ 'backgroundColor': this.state.faceColors[face] }}></div>
                })}
            </div>
        );
    }
}

export default Cube;
