import React, { Component } from 'react';
import Cube from './Cube';
import {toDegrees,toRadians} from './Utilities';

class CubeContainer extends Component {

    constructor(props){
        super(props);
        this.calcPosition=this.calcPosition.bind(this);
        this.moveCubes=this.moveCubes.bind(this);
        this.getOrientation=this.getOrientation.bind(this);
        this.directionChange=this.directionChange.bind(this);
        this.angleChange=this.angleChange.bind(this);
        this.state={
            positions:[
                [0, 0, 0],
                [-50, 0, 0],
                [50, 0, 0],
                [0, -50, 0],
                [0, 50, 0],
                [-50, -50, 0],
                [-50, 50, 0],
                [50, -50, 0],
                [50, 50, 0],
                
                [0, 0, -50],
                [-50, 0, -50],
                [50, 0, -50],
                [0, -50, -50],
                [0, 50, -50],                
                [-50, -50, -50],
                [-50, 50, -50],
                [50, -50, -50],
                [50, 50, -50],

                [0, 0, 50],
                [-50, 0, 50],
                [50, 0, 50],
                [0, -50, 50],
                [0, 50, 50],                
                [-50, -50, 50],
                [-50, 50, 50],
                [50, -50, 50],
                [50, 50, 50],
                ]
            ,angleOfRotation:0,roationVector:[1,0,0]};
        this.state.movedPositions=this.state.positions;
        this.state.prevRoationVector=this.state.roationVector;
        this.state.prevAngleOfRotation=this.state.angleOfRotation;
        this.calculateResultantAngle=this.calculateResultantAngle.bind(this);
        this.turn=this.turn.bind(this);
        this.onTouchStart=this.onTouchStart.bind(this);
        this.onTouchMove=this.onTouchMove.bind(this);
        this.onTouchEnd=this.onTouchEnd.bind(this);
    }

    
    moveCubes(){
        let arr=this.state.positions.slice();
        for(let i=0;i<arr.length;i++){
            arr[i]=this.calcPosition(this.state.positions[i]);
        }
        this.setState({movedPositions:arr});
    }

    calcPosition(position) {
        const cos=(angle)=>(Math.cos(toRadians(angle)));
        const sin=(angle)=>(Math.sin(toRadians(angle)));
        const ux=this.state.roationVector[0];
        const uy=this.state.roationVector[1];
        const uz=this.state.roationVector[2];
        const angle=this.state.angleOfRotation;
        let x=position[0]*(cos(angle)+ux*ux*(1-cos(angle)))+
              position[1]*(ux*uy*(1-cos(angle))-uz*sin(angle))+
              position[2]*(ux*uz*(1-cos(angle))+uy*sin(angle))

        let y=position[0]*(uy*ux*(1-cos(angle))+uz*sin(angle))+
              position[1]*(cos(angle)+uy*uy*(1-cos(angle)))+
              position[2]*(uy*uz*(1-cos(angle))-ux*sin(angle))

        let z=position[0]*(uz*ux*(1-cos(angle))-uy*sin(angle))+
              position[1]*(uz*uy*(1-cos(angle))+ux*sin(angle))+
              position[2]*(cos(angle)+uz*uz*(1-cos(angle)))
        return [x,y,z];
    }

    getOrientation(){        
        return [this.state.roationVector[0],
        this.state.roationVector[1],
        this.state.roationVector[2],
        this.state.angleOfRotation]
    }

    directionChange(eve){
       this.setState({roationVector:eve.target.value.split(',')});
       
    }

    angleChange(eve){
        this.calculateResultantAngle(eve.target.value)
    }

    calculateResultantAngle(alpha){
        const cos=(angle)=>(Math.cos(toRadians(angle)));
        const sin=(angle)=>(Math.sin(toRadians(angle)));

        const mx=this.state.prevRoationVector[0];
        const my=this.state.prevRoationVector[1];
        const mz=this.state.prevRoationVector[2]; 

        const lx=this.state.roationVector[0];
        const ly=this.state.roationVector[1];
        const lz=this.state.roationVector[2];

        const beta=this.state.prevAngleOfRotation;

        const gama=2*toDegrees(Math.acos(
            cos(alpha/2)*cos(beta/2) - sin(alpha/2)*sin(beta/2)*(lx*mx+ly*my+lz*mz)
        ));

        const nx=(
            sin(alpha/2)*cos(beta/2)*lx+
            cos(alpha/2)*sin(beta/2)*mx+
            sin(alpha/2)*sin(beta/2)*(ly*mz-lz*my)
            )/sin(gama/2);
        
        const ny=(
            sin(alpha/2)*cos(beta/2)*ly+
            cos(alpha/2)*sin(beta/2)*my+
            sin(alpha/2)*sin(beta/2)*(lz*mx-lx*mz)
            )/sin(gama/2);
        
        const nz=(
            sin(alpha/2)*cos(beta/2)*lz+
            cos(alpha/2)*sin(beta/2)*mz+
            sin(alpha/2)*sin(beta/2)*(lx*my-ly*mx)
            )/sin(gama/2);

        this.setState(
            {prevAngleOfRotation:this.state.angleOfRotation,
            prevRoationVector:this.state.roationVector,
            angleOfRotation:gama,
            roationVector:[nx,ny,nz]},this.moveCubes);
    }

    turn(){
        this.calculateResultantAngle();
    }

    onTouchStart(eve){
        this.setState({touchStarted:true,mousePoint:{x:eve.clientX,y:eve.clientY}})
    }

    onTouchMove(eve){
        if(this.state.touchStarted && eve.clientY-this.state.mousePoint.y!=0)
        {
            var diff=eve.clientY-this.state.mousePoint.y;            
            this.setState({mousePoint:{x:eve.clientX,y:eve.clientY}},()=>{this.calculateResultantAngle(diff)});    
        }
    }

    onTouchEnd(){
        this.setState({touchStarted:false,mousePoint:{}})
    }

    render() {
        return (
            <div>
                <div style={{position: 'absolute',zIndex:1,width:'150px'}}>
                    <input type="text" style={{'min-width':'50px'}} value={this.state.roationVector.join()} onChange={this.directionChange}/>
                    <input type="number" style={{'width':'50px'}} value={this.state.angleOfRotation} onChange={this.angleChange}/>
                    <button onClick={this.turn}>Turn</button>
                    {this.state.mousePoint?this.state.mousePoint.y:''}
                </div>
                <div className="cube-container"
                onMouseDown={this.onTouchStart}
                onTouchStart= {this.onTouchStart}
                onMouseMove= {this.onTouchMove}
                onTouchMove= {this.onTouchMove}
                onMouseUp= {this.onTouchEnd}
                onTouchEnd= {this.onTouchEnd}>
                    {this.state.positions.map((val,index)=>{
                        return (
                            <Cube translate={this.state.movedPositions[index]} orientation={this.getOrientation()}/>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default CubeContainer;
