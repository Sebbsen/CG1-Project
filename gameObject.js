import { gl } from "./script.js";
import { Mat4 } from "./mat4.js";
import { Global } from "./global.js";

export class GameObject {
	/**
	 *
	 * @param {WebGLProgram} program
	 */
	constructor({
			name = 'noName', 
			id = 0, 
			program, 
			objFile, 
			translation, 
			rotation, 
			scale, 
			faceCulling, 
			transparent, 
			pickable = false
		}) {
		this.name = name;
		this.id = id;
		this.program = program;
		this.objFile = objFile;
		this.translation = translation;
		this.rotation = rotation;
		this.scale = scale;
		this.faceCulling = faceCulling;
		this.isTransparent = transparent;
		this.pickable = pickable;

		this.vertexCoordinates;
		this.normalCoordinates;
		this.textureCoordinates;
		this.vertexCount = 0;

		this.vertexBufferObject;
		this.normalBufferObject;
		this.textureBufferObject;

		this.worldMatrixUniformLocation;
		this.viewMatrixUniformLocation;
		this.projectionMatrixUniformLocation;

		this.worldMatrix = new Float32Array(16);
		Mat4.identity(this.worldMatrix);
	}

	draw() {
		gl.useProgram(this.program);
		this.loadAttributes();
		this.loadUniforms();

		if (this.faceCulling) {
			gl.enable(gl.CULL_FACE);
		} else {
			gl.disable(gl.CULL_FACE);
		}

		gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
	}

	drawPicking() {
		gl.useProgram(this.program);
		this.loadAttributes();
		this.loadUniforms();

		gl.uniform1i(gl.getUniformLocation(this.program, "uPicking"), 1);
		gl.uniform3fv(gl.getUniformLocation(this.program, "uPickingColor"), [((this.id >> 16) & 0xFF) / 255, ((this.id >> 8) & 0xFF) / 255, (this.id & 0xFF) / 255,]);
		gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
		gl.uniform1i(gl.getUniformLocation(this.program, "uPicking"), 0);
	}

	async prepare() {
		await this.loadModelData(this.objFile);
		this.prepareBuffer();
	}

	// Funktion zum animieren des Objekts
	animateTranslation(from, to, duration) {
        const startTime = performance.now(); // Startzeit speichern

		// Differenz berechnen
        const deltaX = to[0] - from[0];
        const deltaY = to[1] - from[1];
        const deltaZ = to[2] - from[2];

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime; // vergangene Zeit seit Start
            const t = Math.min(elapsedTime / duration, 1); // Normierte Zeit (0 bis 1)

			// Berechne die aktuellen Koordinaten nach der Zeit t
            const currentX = from[0] + deltaX * t;
            const currentY = from[1] + deltaY * t;
            const currentZ = from[2] + deltaZ * t;

            this.translation = [currentX, currentY, currentZ]; // setzen der neuen Position

            if (t < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

	translate(x, y ,z) {
		this.worldMatrix = Mat4.translate(this.worldMatrix, [x, y, z]);
	}

	scale(x, y, z) {
		this.worldMatrix = Mat4.scale(this.worldMatrix, [x, y, z]);
	}

	rotateX(degrees) {
		this.worldMatrix = Mat4.rotateX(this.worldMatrix, degrees / (2 * Math.PI));

		gl.useProgram(this.program);

		gl.uniformMatrix4fv(
			this.worldMatrixUniformLocation,
			false,
			this.worldMatrix
		);
	}
	
	rotateY(degrees) {
		this.worldMatrix = Mat4.rotateY(this.worldMatrix, degrees / Math.PI);

		gl.useProgram(this.program);

		gl.uniformMatrix4fv(
			this.worldMatrixUniformLocation,
			false,
			this.worldMatrix
		);
	}

	setRotationY(degrees) {
		let identity = new Float32Array(16);
		Mat4.identity(identity);

		this.worldMatrix = Mat4.rotateY(identity, degrees);

		gl.useProgram(this.program);

		gl.uniformMatrix4fv(
			this.worldMatrixUniformLocation,
			false,
			this.worldMatrix
		);
	}

	updateWorldMatrix(worldMatrix) {
		this.worldMatrix = worldMatrix;

		gl.useProgram(this.program);

		gl.uniformMatrix4fv(
			this.worldMatrixUniformLocation,
			false,
			worldMatrix
		);
	}

	async loadModelData(pathOBJ) {
		let objFile = await (await fetch(pathOBJ)).text();

		let vertexCoordinates = this.loadOBJVertexCoordinates(objFile);
		let normalCoordinates = this.loadOBJNormalCoordinates(objFile);
		let textureCoordinates = this.loadOBJTextureCoordinates(objFile);

		// console.log("loadModelData() - vertexCoordinates: ", vertexCoordinates);

		let vertexIndices = this.loadOBJVertexIndices(objFile);
		let normalIndices = this.loadOBJNormalIndices(objFile);
		let textureIndices = this.loadOBJTextureIndices(objFile);

		let vertices = [];
		vertexIndices.forEach(function (value, i) {
			vertices.push(vertexCoordinates[value]);
		});
		// console.log("loadModelData() - vertices: ", vertices);

		let normals = [];
		normalIndices.forEach(function (value, i) {
			normals.push(normalCoordinates[value]);
		});

		let textures = [];
		textureIndices.forEach(function (value, i) {
			textures.push(textureCoordinates[value]);
		});

		this.vertexCount = vertices.length;
		this.vertexCoordinates = new Float32Array(vertices.flat());
		this.normalCoordinates = new Float32Array(normals.flat());
		this.textureCoordinates = new Float32Array(textures.flat());

		// console.log("loadModelData() - vertexCoordinates: ", this.vertexCoordinates);
	}

	prepareBuffer() {
		this.vertexBufferObject = gl.createBuffer();
		this.normalBufferObject = gl.createBuffer();
		this.textureBufferObject = gl.createBuffer();

		// console.log(this.vertexBufferObject);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertexCoordinates, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, this.normalCoordinates, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, this.textureCoordinates, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// console.log("prepareBuffer() - vertexCoordinates: ", this.vertexCoordinates);
		// console.log("prepareBuffer() - normalCoordinates: ", this.normalCoordinates);
		// console.log("prepareBuffer() - textureCoordinates: ", this.textureCoordinates);
	}

	loadAttributes() {
		// position
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject);
		let positionAttributeLocation = gl.getAttribLocation(
			this.program,
			"aPosition"
		);
		gl.vertexAttribPointer(
			positionAttributeLocation,
			3,
			gl.FLOAT,
			false,
			3 * Float32Array.BYTES_PER_ELEMENT,
			0 * Float32Array.BYTES_PER_ELEMENT
		);
		gl.enableVertexAttribArray(positionAttributeLocation);

		// normal
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBufferObject);
		let normalAttributeLocation = gl.getAttribLocation(
			this.program,
			"aNormal"
		);
		gl.vertexAttribPointer(
			normalAttributeLocation,
			3,
			gl.FLOAT,
			false,
			3 * Float32Array.BYTES_PER_ELEMENT,
			0 * Float32Array.BYTES_PER_ELEMENT
		);
		gl.enableVertexAttribArray(normalAttributeLocation);

		// texture
		// gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBufferObject);
		// let textureAttributeLocation = gl.getAttribLocation(
		// 	this.program,
		// 	"aTexture"
		// );
		// gl.vertexAttribPointer(
		// 	textureAttributeLocation,
		// 	2,
		// 	gl.FLOAT,
		// 	false,
		// 	2 * Float32Array.BYTES_PER_ELEMENT,
		// 	0 * Float32Array.BYTES_PER_ELEMENT
		// );
		// gl.enableVertexAttribArray(textureAttributeLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	loadUniforms() {
		this.worldMatrixUniformLocation = gl.getUniformLocation(
			this.program,
			"worldMatrix"
		);
		this.viewMatrixUniformLocation = gl.getUniformLocation(
			this.program,
			"viewMatrix"
		);
		this.projectionMatrixUniformLocation = gl.getUniformLocation(
			this.program,
			"projectionMatrix"
		);

		// Mat4.identity(this.worldMatrix);
		// this.scale(this.scale[0], this.scale[1], this.scale[2]);
		// this.translate(this.translation[0], this.translation[1], this.translation[2]);

		gl.uniformMatrix4fv(
			this.worldMatrixUniformLocation,
			false,
			this.worldMatrix
		);
		gl.uniformMatrix4fv(this.viewMatrixUniformLocation, false, Global.viewMatrix);
		gl.uniformMatrix4fv(
			this.projectionMatrixUniformLocation,
			false,
			Global.projectionMatrix
		);
	}

	/**
	 *
	 * @param {string} file
	 * @param {string} type
	 * @returns {number[]}
	 */
	loadOBJCoordinates(file, type) {
		let searchTerm = "";

		switch (type) {
			case "vertex":
				searchTerm = "v ";
				break;
			case "texture":
				searchTerm = "vt ";
				break;
			case "normal":
				searchTerm = "vn ";
				break;
		}

		let objFile = file;
		let lines = objFile.split("\n");

		let vertices = [];

		lines.forEach((line) => {
			if (line.startsWith(searchTerm)) {
				let parts = line.split(" ");

				let arr = [];

				arr.push(parseFloat(parts[1]));
				arr.push(parseFloat(parts[2]));
				if (type != "texture") {
					arr.push(parseFloat(parts[3]));
				}

				vertices.push(arr);
			}
		});
		return vertices;
	}

	loadOBJVertexCoordinates(file) {
		return this.loadOBJCoordinates(file, "vertex");
	}

	loadOBJNormalCoordinates(file) {
		return this.loadOBJCoordinates(file, "normal");
	}

	loadOBJTextureCoordinates(file) {
		return this.loadOBJCoordinates(file, "texture");
	}

	/**
	 *
	 * @param {string} file
	 * @param {string} type
	 * @returns {number[]}
	 */
	loadOBJIndices(file, type) {
		let position = -1;

		switch (type) {
			case "vertex":
				position = 0;
				break;
			case "texture":
				position = 1;
				break;
			case "normal":
				position = 2;
				break;
		}

		if (position === -1) {
			console.error("no valid type specified: ", type);
			return;
		}

		let objFile = file;
		let lines = objFile.split("\n");

		let indices = [];

		lines.forEach((line) => {
			if (line.startsWith("f ")) {
				let parts = line.split(" ");

				for (let i = 1; i < parts.length; i++) {
					let types = parts[i].split("/");
					indices.push(parseFloat(types[position]) - 1.0);
				}
			}
		});
		return indices;
	}

	loadOBJVertexIndices(file) {
		return this.loadOBJIndices(file, "vertex");
	}

	loadOBJTextureIndices(file) {
		return this.loadOBJIndices(file, "texture");
	}

	loadOBJNormalIndices(file) {
		return this.loadOBJIndices(file, "normal");
	}
}
