import React, { Component } from 'react';

class Cube extends Component {

    constructor(props) {
        super(props);
        this.state = { touchStarted: false };
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mouseup', this.onTouchEnd);
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onTouchEnd);
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
        this.setState({ touchStarted: true });
        this.setState({ touchStarted: true, mousePoint: { x: eve.clientX, y: eve.clientY } })
    }

    onTouchMove(eve) {
        if (this.state.touchStarted) {
            let diffY = eve.clientY - this.state.mousePoint.y;
            let diffX = eve.clientX - this.state.mousePoint.x;
            if (Math.abs(diffY) > Math.abs(diffX))
                this.setState({ mousePoint: { x: eve.clientX, y: eve.clientY } }, () => { this.calculateResultantAngle(diffY, [1, 0, 0]) });
            else
                this.setState({ mousePoint: { x: eve.clientX, y: eve.clientY } }, () => { this.calculateResultantAngle(diffX, [0, 1, 0]) });
        }
    }
    
    onTouchEnd() {
        //this.setState({ touchStarted: false, mousePoint: {} })
    }

    render() {
        return (
            <div className="cube" style={this.cubePosition()}
                onMouseDown={this.onTouchStart}
                onTouchStart={this.onTouchStart}
                onMouseMove={this.onTouchMove}
                onTouchMove={this.onTouchMove}>
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
