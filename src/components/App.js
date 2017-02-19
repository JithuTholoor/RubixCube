import React, { Component } from 'react';
import CubeContainer from './CubeContainer';

class App extends Component {

    constructor(props){
        super(props);
        this.rangeChange=this.rangeChange.bind(this);
        this.state={orientation:[0,0,0]};
    }

    rangeChange(eve) {
        this.setState({orientation:[0,eve.target.value,0]})
    }

    render() {
        return (
            <div className="app">
                {this.state.orientation[1]}
                <input onChange={this.rangeChange} type="range" min="0" max="360" style={{'margin-bottom':'100px'}}/>
                <CubeContainer orientation={this.state.orientation}/>
            </div>
        );
    }
}

export default App;
