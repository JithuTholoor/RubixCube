import React, { Component } from 'react';
import {getTouchPositions} from '../utilities/utilities';
export const cubeWidth = 50;

class Cube extends Component {

    static propTypes = {
        rotateCubes: React.PropTypes.func,
        translate:React.PropTypes.array,
        orientation:React.PropTypes.array
    };

    constructor(props) {
        super(props);

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        let faceColors = {};
        faceColors.top = this.props.translate[1] == -cubeWidth ? '#fff' : '';
        faceColors.bottom = this.props.translate[1] == cubeWidth ? '#FDCC09' : '';
        faceColors.left = this.props.translate[0] == -cubeWidth ? '#DC422F' : '';
        faceColors.right = this.props.translate[0] == cubeWidth ? '#FF6C00' : '';
        faceColors.front = this.props.translate[2] == cubeWidth ? '#009D54' : '';
        faceColors.back = this.props.translate[2] == -cubeWidth ? '#3D81F6' : '';
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
                transform: `translate3d(${this.props.translate[0]}px,
        ${this.props.translate[1]}px,
        ${this.props.translate[2]}px)
         rotate3d(${this.props.orientation[0]},${this.props.orientation[1]},${this.props.orientation[2]},${this.props.orientation[3]}deg)`
            } : {});
    }

    onTouchStart(eve) {
        eve.stopPropagation();
        this.setState({touchStarted: true});
        this.setState({
            touchStarted: true,
            mousePoint: {x: getTouchPositions(eve).clientX, y: getTouchPositions(eve).clientY}
        });
    }

    onTouchMove(eve) {
        if (this.state.touchStarted) {
            let diffY = getTouchPositions(eve).clientY - this.state.mousePoint.y;
            let diffX = getTouchPositions(eve).clientX - this.state.mousePoint.x;
            this.props.rotateCubes(diffX, diffY, this.props.translate);
            this.setState({mousePoint: {x: getTouchPositions(eve).clientX, y: getTouchPositions(eve).clientY}});
        }
        if (eve.targetTouches)
            eve.stopPropagation();
    }

    onTouchEnd() {
        this.setState({touchStarted: false, mousePoint: {}})
    }

    render() {
        return (
            <div className="cube" style={this.cubePosition()}
                 onMouseDown={this.onTouchStart}
                 onTouchStart={this.onTouchStart}
                 onMouseMove={this.onTouchMove}
                 onTouchMove={this.onTouchMove}>
                <div className="face front" style={{'backgroundColor':this.state.faceColors.front}}></div>
                <div className="face back" style={{'backgroundColor':this.state.faceColors.back}}></div>
                <div className="face top" style={{'backgroundColor':this.state.faceColors.top}}></div>
                <div className="face bottom" style={{'backgroundColor':this.state.faceColors.bottom}}></div>
                <div className="face left" style={{'backgroundColor':this.state.faceColors.left}}></div>
                <div className="face right" style={{'backgroundColor':this.state.faceColors.right}}></div>
            </div>
        );
    }
}

export default Cube;
