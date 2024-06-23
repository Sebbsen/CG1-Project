import { gl } from "../script.js";
import { GameObject } from "../gameObject.js";

export class MultiTextureObject extends GameObject {
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
		textureColor,
		textureNormal,
		textureRoughness,
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
		this.textureColor = textureColor;
		this.textureNormal = textureNormal;
		this.textureRoughness = textureRoughness;
	}

	prepareBuffer() {
		super.prepareBuffer();

		let textureColorSrc = document.getElementById(this.textureColor);
		let textureColor = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0 + this.id);
		gl.bindTexture(gl.TEXTURE_2D, textureColor);
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
			textureColorSrc
		);
		gl.generateMipmap(gl.TEXTURE_2D);
		
		let textureNormalSrc = document.getElementById(this.textureNormal);
		let textureNormal = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0 + this.id + 1);
		gl.bindTexture(gl.TEXTURE_2D, textureNormal);
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
			textureNormalSrc
		);
		gl.generateMipmap(gl.TEXTURE_2D);
		
		let textureRoughnessSrc = document.getElementById(this.textureRoughness);
		let textureRoughness = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0 + this.id + 2);
		gl.bindTexture(gl.TEXTURE_2D, textureRoughness);
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
			textureRoughnessSrc
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

		gl.uniform1i(gl.getUniformLocation(this.program, "textureColor"), this.id);
		gl.uniform1i(gl.getUniformLocation(this.program, "textureNormal"), this.id + 1);
		gl.uniform1i(gl.getUniformLocation(this.program, "textureRoughness"), this.id + 2);
	}
}
