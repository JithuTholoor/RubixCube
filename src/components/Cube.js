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
        faceRotationInit: React.PropTypes.func,
        translate: React.PropTypes.array,
        orientation: React.PropTypes.array
    };

    constructor(props) {
        super(props);

        this.onTouchStart = this.onTouchStart.bind(this);
        let faceColors = {};
        faceColors.top = this.props.translate[1] === -cubeWidth ? '#fff' : '';
        faceColors.bottom = this.props.translate[1] === cubeWidth ? '#FDCC09' : '';
        faceColors.left = this.props.translate[0] === -cubeWidth ? '#DC422F' : '';
        faceColors.right = this.props.translate[0] === cubeWidth ? '#FF6C00' : '';
        faceColors.front = this.props.translate[2] === cubeWidth ? '#009D54' : '';
        faceColors.back = this.props.translate[2] === -cubeWidth ? '#3D81F6' : '';

        if (Math.abs(this.props.translate[0]) +
            Math.abs(this.props.translate[1]) +
            Math.abs(this.props.translate[2]) === cubeWidth) {
            this.disableFaceRotation=true;
        }
        this.state = {touchStarted: false, faceColors: faceColors};
    }

    componentDidMount() {
        this.elem.addEventListener('mouseup', this.onTouchEnd);
        this.elem.addEventListener('touchend', this.onTouchEnd);
        this.elem.addEventListener('touchcancel', this.onTouchEnd);
    }

    componentWillUnmount() {
        this.elem.removeEventListener('mouseup', this.onTouchEnd);
        this.elem.removeEventListener('touchend', this.onTouchEnd);
        this.elem.removeEventListener('touchcancel', this.onTouchEnd);
    }

    cubePosition() {
        return (
            this.props.translate ? {
                transform: `translate3d(${this.props.translate[0]}px,${this.props.translate[1]}px,${this.props.translate[2]}px)
         rotate3d(${this.props.orientation[0]},${this.props.orientation[1]},${this.props.orientation[2]},${this.props.orientation[3]}deg)`
            } : {});
    }

    onTouchStart(eve, face,index) {
        if(this.disableFaceRotation)
            return true;
        eve.stopPropagation();
        this.props.faceRotationInit(
            {x: getTouchPositions(eve).clientX, y: getTouchPositions(eve).clientY},
            face
        );
    }

    render() {
        return (
            <div ref={elem => this.elem = elem}
                className="cube" style={this.cubePosition()}>
                {faceArray.map((face, index) => {
                    return <div key={index}
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
