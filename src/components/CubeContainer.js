import React, { Component } from 'react';
import Cube from './Cube';

class CubeContainer extends Component {
    render() {
        return (
            <div className="cube-container">
                <Cube translate={[0,0,0]} base="true" orientation={this.props.orientation}/>
                <Cube translate={[50,0,0]} orientation={this.props.orientation} />
            </div>
        );
    }
}

export default CubeContainer;
