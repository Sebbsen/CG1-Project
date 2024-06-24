import { identity, translateMatrix, rotateX, rotateY, rotateZ, scaleMatrix } from "./matrix-functions/matFunctions.js";
import {Mat4} from "./mat4.js";

export class Transformation {
	constructor(type, x, y, z) {
		this.type = type;
		this.values = [x, y, z];
        this.matrix = identity(4);

        
        if (type === "translation") {
            this.matrix = translateMatrix(this.matrix, this.values);
        }

        if (type === "rotation") {            
            this.matrix = rotateZ(this.matrix, z);
            this.matrix = rotateY(this.matrix, y);
            this.matrix = rotateX(this.matrix, x);
        }

        if (type === "scale") {
            this.matrix = scaleMatrix(this.matrix, this.values);
        }
	}
}
