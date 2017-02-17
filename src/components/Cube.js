import React, { Component } from 'react';

class Cube extends Component {

    toRadians (angle) {
    return angle * (Math.PI / 180);
    }

    calcPosition() {
        if (this.props.orientation && !this.props.base) {
            debugger;
            let zAxis = Math.sin(this.toRadians(this.props.orientation[1])) * 50;
            let angle = Math.abs(180 - this.props.orientation[1]) / 2;
            let xAxis = Math.abs(zAxis) / Math.tan(this.toRadians(angle))==Infinity?100:Math.abs(zAxis) / Math.tan(this.toRadians(angle));
            return [xAxis, 0, zAxis];
        }
        return [0, 0, 0];
    }

    cubePosition() {
        var changedPositions = this.calcPosition();
        return (
            this.props.translate ? {
                transform: `translate3d(${this.props.translate[0] - changedPositions[0]}px,
        ${this.props.translate[1] - changedPositions[1]}px,
        ${this.props.translate[2] - changedPositions[2]}px)
         rotateX(0deg) rotateY(${this.props.orientation[1]}deg) rotateZ(0deg)`
            } : {});
    }

    render() {
        return (
            <div className="cube" style={this.cubePosition()}>
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
                <div className="face left"></div>
                <div className="face right"></div>
            </div>
        );
    }
}

export default Cube;
