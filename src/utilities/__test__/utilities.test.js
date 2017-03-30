import {
    toRadians,
    toDegrees,
    calcPosition,
    calculateResultantAngle,
    getCubePositionDiffrence,
    getTouchPositions
} from './../utilities';

describe('utilities',()=>{

    describe('toRadians',()=>{

        it('test - 1',()=>{
            const result=toRadians(90);
            expect(result).toBe(1.5707963267948966);
        });

        it('test - 2',()=>{
            const result=toRadians(0);
            expect(result).toBe(0);
        });

        it('test - 3',()=>{
            const result=toRadians(180);
            expect(result).toBe(3.141592653589793);
        });

    });

    describe('toDegrees',()=>{

        it('test - 1',()=>{
            const result=toDegrees(1.5707963267948966);
            expect(result).toBe(90);
        });

        it('test - 2',()=>{
            const result=toDegrees(0);
            expect(result).toBe(0);
        });

        it('test - 3',()=>{
            const result=toDegrees(3.141592653589793);
            expect(result).toBe(180);
        });

    });

    describe('calcPosition',()=>{

        it('test - 1',()=>{
            const result=calcPosition([1,0,0],[1,0,0],90);
            expect(result).toEqual([1,0,0]);
        });

        it('test - 2',()=>{
            const result=calcPosition([1,0,0],[0,1,0],0);
            expect(result).toEqual([1,0,0]);
        });

        it('test - 3',()=>{
            const result=calcPosition([1,0,0],[0,1,0],10);
            expect(result).toEqual([0.984807753012208,0,-0.17364817766693033]);
        });

    });

    describe('calculateResultantAngle',()=>{
        
        it('test - 1',()=>{
            const result=calculateResultantAngle(0,[1,0,0],[1,0,0],90);
            expect(result.gama).toBe(90);
            expect(result.rotationVector).toEqual([1,0,0]);
        });

        it('test - 2',()=>{
            const result=calculateResultantAngle(0,[1,0,0],[0,1,0],90);
            expect(result.gama).toBe(90);
            expect(result.rotationVector).toEqual([0,1,0]);
        });

        it('test - 3',()=>{
            const result=calculateResultantAngle(90,[1,0,0],[0,1,0],90);
            expect(result.gama).toBe(119.99999999999999);
            expect(result.rotationVector).toEqual([0.5773502691896258,0.5773502691896258,0.5773502691896256]);
        });

    });

    describe('getCubePositionDiffrence',()=>{
        it('test - 1',()=>{
            const result=getCubePositionDiffrence([50,50,0],[0,0,0],50,50);
            expect(result).toBe(0);
        });

        it('test - 2',()=>{
            const result=getCubePositionDiffrence([50,50,0],[15,45,0],50,50);
            expect(result).toBe(47.43416490252569);
        });
    });

    describe('getTouchPositions',()=>{

        it('Mouse click',()=>{
            const result=getTouchPositions({clientX:50,clientY:50});
            expect(result).toEqual({clientX:50,clientY:50});
        });

        it('device touch',()=>{
            const result=getTouchPositions({targetTouches:[{clientX:50,clientY:50}]});
            expect(result).toEqual({clientX:50,clientY:50});
        });

    });
});

