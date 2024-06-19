import { Mat4 } from "./mat4.js";

export class Transformation {
	constructor(type, x, y, z) {
		this.type = type;
		this.values = [x, y, z];
        this.matrix = new Float32Array(16);
        Mat4.identity(this.matrix);

        
        if (type === "translation") {
            this.matrix = Mat4.translate(this.matrix, this.values);
        }

        if (type === "rotation") {
            let xRotationMatrix = new Float32Array(
                [
                    [1, 0, 0, 0],
                    [0, Math.cos(x), Math.sin(x), 0],
                    [0, -Math.sin(x), Math.cos(x), 0],
                    [0, 0, 0, 1],
                ].flat()
            );

            let yRotationMatrix = new Float32Array(
                [
                    [Math.cos(y), 0, -Math.sin(y), 0],
                    [0, 1, 0, 0],
                    [Math.sin(y), 0, Math.cos(y), 0],
                    [0, 0, 0, 1],
                ].flat()
            );

            let zRotationMatrix = new Float32Array(
                [
                    [Math.cos(z), Math.sin(z), 0, 0],
                    [-Math.sin(z), Math.cos(z), 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ].flat()
            );

            this.matrix = Mat4.multiplyMatrices(yRotationMatrix, zRotationMatrix);
            this.matrix = Mat4.multiplyMatrices(xRotationMatrix, this.matrix);
        }

        if (type === "scale") {
            let s = new Float32Array(
                [
                    [x, 0, 0, 0],
                    [0, y, 0, 0],
                    [0, 0, z, 0],
                    [0, 0, 0, 1],
                ].flat()
            );

            this.matrix = s;
        }
	}

    prepare() {

    }
}
