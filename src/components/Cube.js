import React, { Component } from 'react';

class Cube extends Component {

    toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    calcPosition() {
        if (this.props.orientation) {
            //z axis calculation.
            let zAxis = 0;
            if (this.props.translate[0] != 0 || this.props.translate[2] != 0 )
                zAxis = this.props.translate[0] == 50 || this.props.translate[2] == 50  ?
                    Math.sin(this.toRadians(this.props.orientation[1])) * 50 :
                    Math.sin(this.toRadians(Math.abs(360 - this.props.orientation[1]))) * 50;

            //x axis calculation
            let xAxis = 0;
            if (this.props.translate[0] != 0 || this.props.translate[2] != 0 ) {
                let angle = Math.abs(180 - this.props.orientation[1]) / 2;
                xAxis = Math.abs(zAxis) / Math.tan(this.toRadians(angle)) == Infinity ? 100 : Math.abs(zAxis) / Math.tan(this.toRadians(angle));
                xAxis = this.props.translate[0] == 50 || this.props.translate[2] == -50 ? xAxis : 0 - xAxis;
            }
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
