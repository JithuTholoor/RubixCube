import React, { Component } from 'react';

class Cube extends Component {
  render() {
    return (
      <div className="cube">
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
