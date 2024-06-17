import { gl } from "../script.js";
import { GameObject } from "../gameObject.js";

export class VideoObject extends GameObject {
	constructor({
		name = "noName",
		id = 0,
		program,
		objFile,
		translation,
		rotation,
		scale,
		faceCulling,
		transparent,
		pickable = false,
		disabled = false,
		emissive = [0, 0, 0, 1],
		ambientMaterial = [0.1, 0.2, 0.5, 1],
		diffuseMaterial = [1, 1, 1, 1],
		specularMaterial = [1, 1, 1, 1],
		shininess = 50.0,
		video,
	}) {
		super({
			name,
			id,
			program,
			objFile,
			translation,
			rotation,
			scale,
			faceCulling,
			transparent,
			pickable,
			disabled,
			emissive,
			ambientMaterial,
			diffuseMaterial,
			specularMaterial,
			shininess,
		});
		this.video = video;
		this.videoTexture;
		this.videoSrc;
		this.copyVideo = false;
		this.playing = false;
		this.timeupdate = false;
	}

	prepareBuffer() {
		super.prepareBuffer();

		let videoSrc = document.getElementById(this.video);
		videoSrc.playsInline = true;
		videoSrc.muted = true;
		videoSrc.loop = true;
		this.videoSrc = videoSrc;

		videoSrc.addEventListener(
			"playing",
			() => {
				this.playing = true;
				this.checkReady();
			},
			true
		);

		videoSrc.addEventListener(
			"timeupdate",
			() => {
				this.timeupdate = true;
				this.checkReady();
			},
			true
		);

		videoSrc.play();

		let video = gl.createTexture();
		this.videoTexture = video;
		gl.activeTexture(gl.TEXTURE0 + this.id);
		gl.bindTexture(gl.TEXTURE_2D, video);

		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			1,
			1,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			new Uint8Array([0, 0, 255, 255])
		);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		// gl.texParameteri(
		// 	gl.TEXTURE_2D,
		// 	gl.TEXTURE_MIN_FILTER,
		// 	gl.LINEAR_MIPMAP_LINEAR
		// );
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		// gl.texImage2D(
		// 	gl.TEXTURE_2D,
		// 	0,
		// 	gl.RGBA,
		// 	gl.RGBA,
		// 	gl.UNSIGNED_BYTE,
		// 	videoSrc
		// );
	}

	loadAttributes() {
		super.loadAttributes();

		// video texture
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBufferObject);
		let textureAttributeLocation = gl.getAttribLocation(
			this.program,
			"aTexture"
		);
		gl.vertexAttribPointer(
			textureAttributeLocation,
			2,
			gl.FLOAT,
			false,
			2 * Float32Array.BYTES_PER_ELEMENT,
			0 * Float32Array.BYTES_PER_ELEMENT
		);
		gl.enableVertexAttribArray(textureAttributeLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	loadUniforms() {
		super.loadUniforms();

		gl.uniform1i(gl.getUniformLocation(this.program, "texture"), this.id);
	}

	draw() {
		if (this.disabled) return;

		if (this.copyVideo) {
		    this.updateTexture();
		}
		// this.updateTexture();

		gl.useProgram(this.program);
		this.loadAttributes();
		this.loadUniforms();

		gl.activeTexture(gl.TEXTURE0 + this.id);
		gl.bindTexture(gl.TEXTURE_2D, this.videoTexture);
		gl.uniform1i(gl.getUniformLocation(this.program, "texture"), this.id);

		if (this.faceCulling) {
			gl.enable(gl.CULL_FACE);
		} else {
			gl.disable(gl.CULL_FACE);
		}

		gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
	}

	checkReady() {
		if (this.playing && this.timeupdate) {
			this.copyVideo = true;
		}
	}

	updateTexture() {
		gl.bindTexture(gl.TEXTURE_2D, this.videoTexture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			this.videoSrc
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	}
}
