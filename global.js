import { Mat4 } from "./mat4.js";

export class Global {
	// Kamera
	static cameraPosition = [0, 0, 0];
	static cameraLookPosition = [0, 0, -1];
	static cameraUpDirection = [0, 1, 0];
	static yFOV = Math.PI * 0.25;
	static aspectRatio = 1;
	static near = 0.1;
	static far = 1000.0;

	// Matrizen
	static viewMatrix;
	static projectionMatrix;

	// Uniform-Daten
	static sunPosition = [0, 10, 0];
	static sunDirection = [0, 1, 0];
	static ambientLightColor = [0, 0.1, 0.2, 0.25];
	static lightPosition1 = [0, 2.5, 0];
	static lightColor1 = [1, 1, 1, 1];

	// Provisorische Liste an opaken Objekten
	static opaqueObjects = [];
	// Provisorische Liste an transparenten Objekten
	static transparentObjects = [];

	static init() {
		this.initViewMatrix();
		this.initProjectionMatrix();
	}

	static initViewMatrix() {
		this.viewMatrix = this.lookAt(
			new Float32Array(this.cameraPosition),
			new Float32Array(this.cameraLookPosition),
			new Float32Array(this.cameraUpDirection)
		);
	}

	static initProjectionMatrix() {
		this.projectionMatrix = this.perspective(
			this.yFOV,
			this.aspectRatio,
			this.near,
			this.far
		);
	}

	static lookAt(eye, look, up) {
		if (eye === look) {
			throw new Error("eye and look must not be equal");
		}

		let n = Mat4.subtractVectors(eye, look);
		let u = Mat4.crossProduct(up, n);
		let v = Mat4.crossProduct(n, u);

		n = Mat4.multiplyVectorByScalar(n, 1.0 / Mat4.vectorLength(n));
		u = Mat4.multiplyVectorByScalar(u, 1.0 / Mat4.vectorLength(u));
		v = Mat4.multiplyVectorByScalar(v, 1.0 / Mat4.vectorLength(v));

		let nN = Mat4.multiplyVectorByScalar(n, -1.0);
		let uN = Mat4.multiplyVectorByScalar(u, -1.0);
		let vN = Mat4.multiplyVectorByScalar(v, -1.0);

		let tX = Mat4.dotProduct(uN, eye);
		let tY = Mat4.dotProduct(vN, eye);
		let tZ = Mat4.dotProduct(nN, eye);

		let mRT = new Float32Array(
			[
				[u[0], v[0], n[0], 0],
				[u[1], v[1], n[1], 0],
				[u[2], v[2], n[2], 0],
				[tX, tY, tZ, 1],
			].flat()
		);

		return mRT;
	}

	static perspective(fieldOfViewInRadians, aspectRatio, near, far) {
		// Construct a perspective matrix

		/*
           Field of view - the angle in radians of what's in view along the Y axis
           Aspect Ratio - the ratio of the canvas, typically canvas.width / canvas.height
           Near - Anything before this point in the Z direction gets clipped (outside of the clip space)
           Far - Anything after this point in the Z direction gets clipped (outside of the clip space)
        */

		var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
		var rangeInv = 1 / (near - far);

		return new Float32Array([
			f / aspectRatio,
			0,
			0,
			0,
			0,
			f,
			0,
			0,
			0,
			0,
			(near + far) * rangeInv,
			-1,
			0,
			0,
			near * far * rangeInv * 2,
			0,
		]);
	}

	static setCameraPosition(x, y, z) {
		this.cameraPosition = [x, y, z];
		this.updateViewMatrix();
	}

	static updateViewMatrix() {
		this.initViewMatrix();
	}

	static setAspectRation(width, height) {
		this.aspectRatio = width / height;
		this.updateProjectionMatrix();
	}

	static updateProjectionMatrix() {
		this.projectionMatrix = this.initProjectionMatrix();
	}
}
