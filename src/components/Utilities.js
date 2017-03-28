export const toRadians = (angle) => (angle * (Math.PI / 180));
export const toDegrees = (angle) => (angle * (180 / Math.PI));

/**Return is new position based on current position and resultant roation */
export const calcPosition = (position, roationVector, angleOfRotation) => {
    const cos = (angle) => (Math.cos(toRadians(angle)));
    const sin = (angle) => (Math.sin(toRadians(angle)));
    const ux = roationVector[0];
    const uy = roationVector[1];
    const uz = roationVector[2];
    const angle = angleOfRotation;
    let x = position[0] * (cos(angle) + ux * ux * (1 - cos(angle))) +
        position[1] * (ux * uy * (1 - cos(angle)) - uz * sin(angle)) +
        position[2] * (ux * uz * (1 - cos(angle)) + uy * sin(angle));

    let y = position[0] * (uy * ux * (1 - cos(angle)) + uz * sin(angle)) +
        position[1] * (cos(angle) + uy * uy * (1 - cos(angle))) +
        position[2] * (uy * uz * (1 - cos(angle)) - ux * sin(angle));

    let z = position[0] * (uz * ux * (1 - cos(angle)) - uy * sin(angle)) +
        position[1] * (uz * uy * (1 - cos(angle)) + ux * sin(angle)) +
        position[2] * (cos(angle) + uz * uz * (1 - cos(angle)));
    return [x, y, z];
};

/**Return is new angle of rotatio and rotation vecctor */
export const calculateResultantAngle = (alpha, roationVector, currentRotationVector, beta) => {

    const cos = (angle) => (Math.cos(toRadians(angle)));
    const sin = (angle) => (Math.sin(toRadians(angle)));

    const lx = roationVector[0];
    const ly = roationVector[1];
    const lz = roationVector[2];

    const mx = currentRotationVector[0];
    const my = currentRotationVector[1];
    const mz = currentRotationVector[2];

    const gamaInverse=cos(alpha / 2) * cos(beta / 2) - sin(alpha / 2) * sin(beta / 2) * (lx * mx + ly * my + lz * mz);
    const gama = 2 * toDegrees(Math.acos(
            Math.abs(gamaInverse)>1?gamaInverse/Math.abs(gamaInverse):gamaInverse
        ));

    const nx = ((
        sin(alpha / 2) * cos(beta / 2) * lx +
        cos(alpha / 2) * sin(beta / 2) * mx +
        sin(alpha / 2) * sin(beta / 2) * (ly * mz - lz * my)
    ) / sin(gama / 2));

    const ny = ((
        sin(alpha / 2) * cos(beta / 2) * ly +
        cos(alpha / 2) * sin(beta / 2) * my +
        sin(alpha / 2) * sin(beta / 2) * (lz * mx - lx * mz)
    ) / sin(gama / 2))

    const nz = ((
        sin(alpha / 2) * cos(beta / 2) * lz +
        cos(alpha / 2) * sin(beta / 2) * mz +
        sin(alpha / 2) * sin(beta / 2) * (lx * my - ly * mx)
    ) / sin(gama / 2))
    return { gama, rotationVector: [isNaN(nx) || !isFinite(nx)?1:nx, isNaN(ny)||!isFinite(nx)?1:ny, isNaN(nz)||!isFinite(nx)?1:nz] };
};

export const getCubePositionDiffrence=(movedPosition,currentPosition,xMove,yMove)=>{
    const xDiff=(currentPosition[0]+xMove) - movedPosition[0];
    const yDiff=(currentPosition[1]+yMove) - movedPosition[1];
    return Math.sqrt(xDiff*xDiff + yDiff*yDiff);
};

export const getTouchPositions=(eve)=>{
    if(eve.targetTouches){
        return {clientX:eve.targetTouches[0].clientX,clientY:eve.targetTouches[0].clientY};
    }else{
        return {clientX: eve.clientX, clientY: eve.clientY};
    }
};
