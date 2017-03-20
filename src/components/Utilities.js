export const toRadians = (angle) => (angle * (Math.PI / 180));
export const toDegrees = (angle) => (angle * (180 / Math.PI));

export const calcPosition=(position,roationVector,angleOfRotation)=>{
        const cos = (angle) => (Math.cos(toRadians(angle)));
        const sin = (angle) => (Math.sin(toRadians(angle)));
        const ux = roationVector[0];
        const uy = roationVector[1];
        const uz = roationVector[2];
        const angle = angleOfRotation;
        let x = position[0] * (cos(angle) + ux * ux * (1 - cos(angle))) +
            position[1] * (ux * uy * (1 - cos(angle)) - uz * sin(angle)) +
            position[2] * (ux * uz * (1 - cos(angle)) + uy * sin(angle))

        let y = position[0] * (uy * ux * (1 - cos(angle)) + uz * sin(angle)) +
            position[1] * (cos(angle) + uy * uy * (1 - cos(angle))) +
            position[2] * (uy * uz * (1 - cos(angle)) - ux * sin(angle))

        let z = position[0] * (uz * ux * (1 - cos(angle)) - uy * sin(angle)) +
            position[1] * (uz * uy * (1 - cos(angle)) + ux * sin(angle)) +
            position[2] * (cos(angle) + uz * uz * (1 - cos(angle)))
        return [x, y, z];
    }