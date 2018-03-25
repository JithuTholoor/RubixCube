import Cube from './../Cube';
import { render, shallow } from 'enzyme';
import React, { Component } from 'react';

describe('Cube', () => {

    it('Renders without crashing', () => {
        const result = render(<Cube rotateCubes={jest.fn()} translate={[0,0,0]} orientation={[1,0,0,0]}/>);
        expect(result).toBeDefined();
    });

    it('cubePosition returns style for cube', ()=> {
        const tree = shallow(<Cube rotateCubes={jest.fn()} translate={[0,0,0]} orientation={[1,0,0,0]}/>);
        const result = tree.instance().cubePosition();
        expect(result.transform).toEqual(`translate3d(0px,0px,0px)
         rotate3d(1,0,0,0deg)`);
    });

    it('six faces',()=>{
        const tree = shallow(<Cube rotateCubes={jest.fn()} translate={[0,0,0]} orientation={[1,0,0,0]}/>);
        expect(tree.find('.face').length).toBe(6);
    })

    describe('mouse events',()=>{
        let tree;
        const faceRotationInit=jest.fn();
        beforeAll(()=>{
            tree = shallow(<Cube faceRotationInit={faceRotationInit}
                translate={[0,0,0]} orientation={[1,0,0,0]}/>);
        });

        it('mouse down',()=>{
            expect(tree.instance().state.touchStarted).toBe(false);
            tree.find('.face').first().simulate('mousedown',{stopPropagation:jest.fn()});
            expect(faceRotationInit).toBeCalled();
        });

    });

    describe('touch events',()=>{
        let tree;
        const faceRotationInit=jest.fn();
        beforeAll(()=>{
            tree = shallow(<Cube faceRotationInit={faceRotationInit}
                 translate={[0,0,0]} orientation={[1,0,0,0]}/>);
        });

        it('touch start',()=>{
            expect(tree.instance().state.touchStarted).toBe(false);
            tree.find('.face').first().simulate('touchstart',{stopPropagation:jest.fn()});
            expect(faceRotationInit).toBeCalled();
        });
    });    

});
