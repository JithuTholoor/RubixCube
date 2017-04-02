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

    describe('will unmount events',()=>{
        let tree;
        const rotateCubesMock= jest.fn()
        beforeAll(()=>{
            tree = shallow(<Cube rotateCubes={rotateCubesMock} translate={[0,0,0]} orientation={[1,0,0,0]}/>);
        });

        it('willUnmount events umount mouseup event',()=>{
            tree.unmount();
            tree.simulate('mousedown');
            expect(tree.instance()).toBe(null);
        });
    })

    describe('mouse events',()=>{
        let tree;
        const rotateCubesMock= jest.fn()
        beforeAll(()=>{
            tree = shallow(<Cube rotateCubes={rotateCubesMock} translate={[0,0,0]} orientation={[1,0,0,0]}/>);
        });

        it('mouse down',()=>{
            expect(tree.instance().state.touchStarted).toBe(false);
            tree.find('.face').first().simulate('mousedown',{stopPropagation:jest.fn()});
            expect(tree.instance().state.touchStarted).toBe(true);
        });

        it('mouse move',()=>{
            tree.find('.face').first().simulate('mousemove',{clientX:1,clientY:1});
            expect(tree.instance().state.touchStarted).toBe(true);
            expect(tree.instance().state.mousePoint).toEqual({x:1,y:1});
            expect(rotateCubesMock).toBeCalled();
        });

        it('mouse up',()=>{
            tree.instance().onTouchEnd();
            expect(tree.instance().state.touchStarted).toBe(false);
        });
    });

    describe('touch events',()=>{
        let tree;
        const rotateCubesMock= jest.fn()
        beforeAll(()=>{
            tree = shallow(<Cube rotateCubes={rotateCubesMock} translate={[0,0,0]} orientation={[1,0,0,0]}/>);
        });

        it('touch start',()=>{
            expect(tree.instance().state.touchStarted).toBe(false);
            tree.find('.face').first().simulate('touchstart',{stopPropagation:jest.fn()});
            expect(tree.instance().state.touchStarted).toBe(true);
        });

        it('touch move',()=>{
            tree.find('.face').first().simulate('touchmove',{stopPropagation:jest.fn(), targetTouches:[{clientX:1,clientY:1}]});
            expect(tree.instance().state.touchStarted).toBe(true);
            expect(tree.instance().state.mousePoint).toEqual({x:1,y:1});
            expect(rotateCubesMock).toBeCalled();
        });
    });    

});
