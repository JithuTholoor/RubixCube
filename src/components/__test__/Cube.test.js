import Cube from './../Cube';
import { render, shallow } from 'enzyme';
import React, { Component } from 'react';

describe('Cube', () => {

    it('Renders without crashing', () => {
        const result = render(<Cube rotateCubes={jest.fn()} translate={[0,0,0]} orientation={[1,0,0,0]}/>);
        expect(result).toBeDefined();
    });

});