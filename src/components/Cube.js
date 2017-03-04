import React, { Component } from 'react';

class Cube extends Component {
    
    cubePosition() {
        return (
            this.props.translate ? {
                transform: `translate3d(${this.props.translate[0]}px,
        ${this.props.translate[1]}px,
        ${this.props.translate[2]}px)
         rotate3d(${this.props.orientation[0]},${this.props.orientation[1]},${this.props.orientation[2]},${this.props.orientation[3]}deg)`
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
