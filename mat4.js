export class Mat4 {
	/**
	 *window.gl
	 * @param {Float32Array} matrix
	 * @param {Float32Array} vector
	 * @returns {Float32Array}
	 */
	static multiplyMatrixVector(matrix, vector) {
		if (matrix.length !== 16 || vector.length !== 4) {
			console.error("Invalid matrix or vector dimensions.");
			console.log(matrix);
			console.log(vector);
			return null;
		}

		var result = new Float32Array(4);

		for (var i = 0; i < 4; i++) {
			result[i] =
				matrix[i] * vector[0] +
				matrix[i + 4] * vector[1] +
				matrix[i + 8] * vector[2] +
				matrix[i + 12] * vector[3];
		}

		return result;
	}

	/**
	 *
	 * @param {Float32Array} matrix
	 * @param {Float32Array} vector
	 * @returns {Float32Array}
	 */
	static multiplyMat4Vec4(matrix, vector) {
		if (matrix.length !== 16 || vector.length !== 4) {
			console.error("Invalid matrix or vector dimensions.");
			return null;
		}

		var result = new Float32Array(4);

		for (var i = 0; i < 4; i++) {
			result[i] =
				matrix[i] * vector[0] +
				matrix[i + 4] * vector[1] +
				matrix[i + 8] * vector[2] +
				matrix[i + 12] * vector[3];
		}

		return result;
	}

	/**
	 *
	 * @param {Float32Array} matrix1
	 * @param {Float32Array} matrix2
	 * @returns {Float32Array}
	 */
	static multiplyMatrices(matrix1, matrix2) {
		if (matrix1.length !== 16 || matrix2.length !== 16) {
			console.error("Invalid matrix dimensions.");
			return null;
		}

		var result = new Float32Array(16);

		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				result[i + j * 4] =
					matrix1[i] * matrix2[j * 4 + 0] +
					matrix1[i + 4] * matrix2[j * 4 + 1] +
					matrix1[i + 8] * matrix2[j * 4 + 2] +
					matrix1[i + 12] * matrix2[j * 4 + 3];
			}
		}

		return result;
	}

	/**
	 *
	 * @param {Float32Array} matrix1
	 * @param {Float32Array} matrix2
	 * @returns {Float32Array}
	 */
	static multiplyMat4(matrix1, matrix2) {
		if (matrix1.length !== 16 || matrix2.length !== 16) {
			console.error("Invalid matrix dimensions.");
			return null;
		}

		var result = new Float32Array(16);

		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				result[i * 4 + j] =
					matrix1[i * 4] * matrix2[j] +
					matrix1[i * 4 + 1] * matrix2[j + 4] +
					matrix1[i * 4 + 2] * matrix2[j + 8] +
					matrix1[i * 4 + 3] * matrix2[j + 12];
			}
		}

		return result;
	}

	static multiply(a, b) {
		let result = new Float32Array(16);

		// 1. Zeile
		result[0] = a[0]*b[0] + a[4]*b[1] + a[8]*b[2] + a[12]*b[3];
		result[4] = a[0]*b[4] + a[4]*b[5] + a[8]*b[6] + a[12]*b[7];
		result[8] = a[0]*b[8] + a[4]*b[9] + a[8]*b[10] + a[12]*b[11];
		result[12] = a[0]*b[12] + a[4]*b[13] + a[8]*b[14] + a[12]*b[15];
		
		// 2. Zeile
		result[0+1] = a[0+1]*b[0] + a[4+1]*b[1] + a[8+1]*b[2] + a[12+1]*b[3];
		result[4+1] = a[0+1]*b[4] + a[4+1]*b[5] + a[8+1]*b[6] + a[12+1]*b[7];
		result[8+1] = a[0+1]*b[8] + a[4+1]*b[9] + a[8+1]*b[10] + a[12+1]*b[11];
		result[12+1] = a[0+1]*b[12] + a[4+1]*b[13] + a[8+1]*b[14] + a[12+1]*b[15];
		
		// 3. Zeile
		result[0+2] = a[0+2]*b[0] + a[4+2]*b[1] + a[8+2]*b[2] + a[12+2]*b[3];
		result[4+2] = a[0+2]*b[4] + a[4+2]*b[5] + a[8+2]*b[6] + a[12+2]*b[7];
		result[8+2] = a[0+2]*b[8] + a[4+2]*b[9] + a[8+2]*b[10] + a[12+2]*b[11];
		result[12+2] = a[0+2]*b[12] + a[4+2]*b[13] + a[8+2]*b[14] + a[12+2]*b[15];
		
		// 4. Zeile
		result[0+3] = a[0+3]*b[0] + a[4+3]*b[1] + a[8+3]*b[2] + a[12+3]*b[3];
		result[4+3] = a[0+3]*b[4] + a[4+3]*b[5] + a[8+3]*b[6] + a[12+3]*b[7];
		result[8+3] = a[0+3]*b[8] + a[4+3]*b[9] + a[8+3]*b[10] + a[12+3]*b[11];
		result[12+3] = a[0+3]*b[12] + a[4+3]*b[13] + a[8+3]*b[14] + a[12+3]*b[15];

		return result;
	}

	/**
	 *
	 * @param {Float32Array} out
	 */
	static identity(out) {        
		for (var i = 0; i < out.length; i++) {
            if (i % 5 == 0) {
                out[i] = 1;
			} else {
                out[i] = 0;
			}
		}
	}

	/**
	 *
	 * @param {Float32Array} out
	 */
	static identityMat4(out) {
		for (var i = 0; i < out.length; i++) {
			if (i % 5 == 0) {
				out[i] = 1;
			} else {
				out[i] = 0;
			}
		}
	}

	/**
	 *
	 * @param {Float32Array} matrix
	 * @param {Float32Array} v
	 */
	static translate(matrix, v) {
		let t = new Float32Array(
			[
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 0, 1, 0],
				[v[0], v[1], v[2], 1],
			].flat()
		);

		return this.multiplyMatrices(matrix, t);
	}

	/**
	 *
	 * @param {Float32Array} matrix
	 * @param {Float32Array} v
	 */
	static scale(matrix, v) {
		let s = new Float32Array(
			[
				[v[0], 0, 0, 0],
				[0, v[1], 0, 0],
				[0, 0, v[2], 0],
				[0, 0, 0, 1],
			].flat()
		);

		return this.multiplyMatrices(matrix, s);
	}

	/**
	 *
	 * @param {Float32Array} matrix
	 * @param {number} angle
	 */
	static rotateX(matrix, angle) {
		let xRotationMatrix = new Float32Array(
			[
				[1, 0, 0, 0],
				[0, Math.cos(angle), Math.sin(angle), 0],
				[0, -Math.sin(angle), Math.cos(angle), 0],
				[0, 0, 0, 1],
			].flat()
		);

		return this.multiplyMatrices(xRotationMatrix, matrix);
	}

	/**
	 *
	 * @param {Float32Array} matrix
	 * @param {number} angle
	 */
	static rotateY(matrix, angle) {
		let yRotationMatrix = new Float32Array(
			[
				[Math.cos(angle), 0, -Math.sin(angle), 0],
				[0, 1, 0, 0],
				[Math.sin(angle), 0, Math.cos(angle), 0],
				[0, 0, 0, 1],
			].flat()
		);

		return this.multiplyMatrices(yRotationMatrix, matrix);
	}

	/**
	 *
	 * @param {Float32Array} matrix
	 * @param {number} angle
	 */
	static rotateZ(matrix, angle) {
		let zRotationMatrix = new Float32Array(
			[
				[Math.cos(angle), Math.sin(angle), 0, 0],
				[-Math.sin(angle), Math.cos(angle), 0, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1],
			].flat()
		);

		return this.multiplyMatrices(zRotationMatrix, matrix);
	}

	/**
	 *
	 * @param {Float32Array} a
	 * @param {Float32Array} b
	 * @returns
	 */
	static subtractVectors(a, b) {
		if (a.length !== 3 || b.length !== 3) {
			throw new Error("Vectors must have three components.");
		}

		return new Float32Array([a[0] - b[0], a[1] - b[1], a[2] - b[2]]);
	}

	/**
	 *
	 * @param {Float32Array} vector
	 * @returns
	 */
	static vectorLength(vector) {
		if (vector.length !== 3) {
			throw new Error("Vector must have three components.");
		}

		const [x, y, z] = vector;
		return Math.sqrt(x * x + y * y + z * z);
	}

	/**
	 *
	 * @param {Float32Array} vector
	 * @param {*} scalar
	 * @returns
	 */
	static multiplyVectorByScalar(vector, scalar) {
		if (vector.length !== 3) {
			throw new Error("Vector must have three components.");
		}

		return vector.map((component) => component * scalar);
	}

	/**
	 *
	 * @param {Float32Array} b
	 * @param {Float32Array} a
	 * @returns
	 */
	static dotProduct(a, b) {
		if (a.length !== 3 || b.length !== 3) {
			console.log("a: ", a);
			console.log("b: ", b);
			throw new Error("Vectors must have three components.");
		}

		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}

	/**
	 *
	 * @param {Float32Array} a
	 * @param {Float32Array} b
	 * @returns
	 */
	static crossProduct(a, b) {
		return [
			a[1] * b[2] - a[2] * b[1],
			a[2] * b[0] - a[0] * b[2],
			a[0] * b[1] - a[1] * b[0],
		];
	}

	static print(matrix) {
		console.log("Matrix:");
		console.log(matrix[0], "\t", matrix[4], "\t", matrix[8], "\t", matrix[12]);
		console.log(matrix[1], "\t", matrix[5], "\t", matrix[9], "\t", matrix[13]);
		console.log(matrix[2], "\t", matrix[6], "\t", matrix[10], "\t", matrix[14]);
		console.log(matrix[3], "\t", matrix[7], "\t", matrix[11], "\t", matrix[15]);
	}
}
