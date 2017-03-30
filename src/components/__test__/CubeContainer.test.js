import CubeContainer from './../CubeContainer';
import { render, shallow } from 'enzyme';
import React, { Component } from 'react';

describe('CubeContainer', () => {    
    
    it('Renders without crashing', () => {
        const result = render(<CubeContainer/>);
        expect(result).toBeDefined();
    });
});