import { identity, lookAt, perspective } from "./matrix-functions/matFunctions.js";

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
	static sunDirection = [0.6, 1, 1];
	// static ambientLightColor = [0.3, 0.5, 0.6, 1];
	static ambientLightColor = [0.3, 0.3, 0.3, 1];
	static fogColor = [0.5, 0.5, 0.5, 1.0];
	static fogNear = 10;
	static fogFar = 100;
	static pointLightPosition1 = [4.5, 0, -2];
	// static pointLightColor1 = [1, 0.8, 0.5, 1];
	static pointLightColor1 = [1, 0.0, 0.0, 1];
	static pointLightPosition2 = [0, 0, -2];
	static pointLightColor2 = [0.5, 0.8, 1.0, 1];

	// Provisorische Liste an opaken Objekten
	static opaqueObjects = [];
	// Provisorische Liste an transparenten Objekten
	static transparentObjects = [];

	// Initialisiere Matrizen
	static init() {
		this.initViewMatrix();
		this.initProjectionMatrix();
	}

	// Initialisiere ViewMatrix
	static initViewMatrix() {
		this.viewMatrix = identity(4);
		lookAt(this.viewMatrix, this.cameraPosition, this.cameraLookPosition, this.cameraUpDirection);
	}

	// Initialisiere Projektionsmatrix
	static initProjectionMatrix() {
		this.projectionMatrix = perspective(this.yFOV, this.aspectRatio, this.near, this.far);
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
