import { gl } from "../script.js";
import { GameObject } from "../gameObject.js";

export class TextureObject extends GameObject {
	constructor({
		name = "noName",
		id = 0,
		program,
		objFile,
		translation = [0, 0, 0],
		rotation = [0, 0, 0],
		scale = [1, 1, 1],
		faceCulling = true,
		transparent = false,
		pickable = false,
		disabled = false,
		emissive = [0, 0, 0, 1],
		ambientMaterial = [0.1, 0.2, 0.5, 1],
		diffuseMaterial = [1, 1, 1, 1],
		specularMaterial = [1, 1, 1, 1],
		shininess = 50.0,
		texture,
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
		this.texture = texture;
	}

	prepareBuffer() {
		super.prepareBuffer();

		let textureSrc = document.getElementById(this.texture);
		let texture = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER,
			gl.LINEAR_MIPMAP_LINEAR
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			textureSrc
		);
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	loadAttributes() {
		super.loadAttributes();

		// texture
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

		gl.uniform1i(gl.getUniformLocation(this.program, "texture"), 0);
	}
}
