import CubeContainer from './../CubeContainer';
import { render, shallow } from 'enzyme';
import React, { Component } from 'react';

describe('CubeContainer', () => {

    it('Renders without crashing', () => {
        const result = render(<CubeContainer />);
        expect(result).toBeDefined();
    });

    describe('mouse events', () => {
        let tree;
        beforeAll(() => {
            tree = shallow(<CubeContainer />);
        });

        it('mouse down', () => {
            tree.simulate('mousedown', { stopPropagation: jest.fn(), clientX: 1, clientY: 1 });
            expect(tree.instance().state.touchStarted).toBe(true);
            expect(tree.instance().state.mousePoint).toEqual({ x: 1, y: 1 });
        });

        it('mouse move', () => {
            tree.simulate('mousemove', { clientX: 1, clientY: 1 });
            expect(tree.instance().state.touchStarted).toBe(true);
            expect(tree.instance().state.mousePoint).toEqual({ x: 1, y: 1 });
        });

        it('mouse up', () => {
            tree.instance().onTouchEnd();
            expect(tree.instance().state.touchStarted).toBe(false);
        });
    });

    describe('touch events', () => {
        let tree;
        beforeAll(() => {
            tree = shallow(<CubeContainer />);
        });

        it('touch start', () => {
            tree.simulate('touchstart', { stopPropagation: jest.fn(), targetTouches: [{ clientX: 1, clientY: 1 }] });
            expect(tree.instance().state.touchStarted).toBe(true);
            expect(tree.instance().state.mousePoint).toEqual({ x: 1, y: 1 });
        });

        it('touch move', () => {
            tree.simulate('touchmove', { stopPropagation: jest.fn(), targetTouches: [{ clientX: 2, clientY: 2 }] });
            expect(tree.instance().state.touchStarted).toBe(true);
            expect(tree.instance().state.mousePoint).toEqual({ x: 2, y: 2 });
        });
    });

    describe('Cube space rotation', () => {
        let tree;
        beforeAll(() => {
            tree = shallow(<CubeContainer />);
        });

        it('rotateCubeSpace - on x move', () => {
            tree.instance().rotateCubeSpace(1, 0);
            expect(tree.instance().state.positions[2]).toEqual([49.992384757819565, 0, -0.8726203218641756]);
            expect(tree.instance().state.angleOfRotation[2]).toEqual(0.9999999999997249);
            expect(tree.instance().state.rotationVector[2]).toEqual([0, 1.0000000000002751, 0]);
        });

        it('rotateCubeSpace - on y move', () => {
            tree.instance().rotateCubeSpace(0, 1);
            expect(tree.instance().state.positions[2]).toEqual([49.992384757819565, -0.015229324522606748, -0.8724874175625242]);
            expect(tree.instance().state.angleOfRotation[2]).toEqual(1.414204587376545);
            expect(tree.instance().state.rotationVector[2]).toEqual([-0.7070933185723947, 0.7070933185723947, -0.0061707099069101745]);
        });
    });

    describe('Cube face rotation', () => {
        let tree;
        beforeAll(() => {
            tree = shallow(<CubeContainer />);
        });

        it('face rotation', () => {
            tree.instance().rotateCube(0, 1, [1, 0, 0]);
            expect(tree.instance().state.positions[26]).toEqual([49.11976443595539, 50.86500507968374, 50]);
        });

        it('face rotation -reverse', () => {
            tree.instance().rotateCube(0, -1, [1, 0, 0], true);            
            expect(tree.instance().state.positions[26]).toEqual( [  48.22456651582974, 51.71451618607984, 50 ]);
        });

        it('face rotation - auto complete', () => {
            tree.setState({ autoRotation: true });
            tree.instance().rotateCube(0, 1, [1, 0, 0], true);    
            expect(tree.instance().state.positions[26]).toEqual( [ 47.31467892558151, 52.54827454987589, 50]);
        });

    });

});