import { Global } from "./global.js";
import { GameObject } from "./gameObject.js";
import { Group } from "./group.js";
import {
	defaultProgram,
	reflectionProgram,
	textureProgram,
	transparentProgram,
	videoProgram,
} from "./shaderPrograms.js";
import { gl } from "./script.js";
import { Mat4 } from "./mat4.js";
import { Transformation } from "./transformation.js";
import { TextureObject } from "./objects/textureObject.js";
import { VideoObject } from "./objects/videoObject.js";

export class SceneGraph {
	constructor() {
		// Inhalt des Szenengraphen
		this.data = [];
		this.allGroups = [];
		this.allObjects = [];
		this.pickableObjects = [];

		// Werden erst zum Zeichnen verwendet.
		this.opaqueObjects = [];
		this.transparentObjects = [];
	}

	async init(path) {
		const response = await fetch(path);
		const sceneGraphData = await response.json();

		let elements = sceneGraphData.children;

		elements.forEach(async (element) => {
			if (element.type === "object") {
				if (element.program === "defaultProgram") {
					let gameObject = new GameObject({
						program: defaultProgram,
						objFile: element.objFile,
						translation: element.translation,
						rotation: element.rotation,
						scale: element.scale,
						faceCulling: element.faceCulling,
						transparent: element.transparent,
						id: element.id,
						name: element.name,
						pickable: element.pickable,
						diffuseMaterial: element.diffuseMaterial
							? element.diffuseMaterial
							: [0, 0, 0, 1],
						specularMaterial: element.specularMaterial
							? element.specularMaterial
							: [0, 0, 0, 1],
					});
					await gameObject.prepare();
	
					this.data.push(gameObject);
	
					this.allObjects.push(gameObject);
					if (gameObject.pickable) {
						this.pickableObjects.push(gameObject);
					}
				} else if (element.program === "reflectionProgram") {
					let gameObject = new GameObject({
						program: reflectionProgram,
						objFile: element.objFile,
						translation: element.translation,
						rotation: element.rotation,
						scale: element.scale,
						faceCulling: element.faceCulling,
						transparent: element.transparent,
						id: element.id,
						name: element.name,
						pickable: element.pickable,
						diffuseMaterial: element.diffuseMaterial
							? element.diffuseMaterial
							: [0, 0, 0, 1],
						specularMaterial: element.specularMaterial
							? element.specularMaterial
							: [0, 0, 0, 1],
					});
					await gameObject.prepare();
	
					this.data.push(gameObject);
	
					this.allObjects.push(gameObject);
					if (gameObject.pickable) {
						this.pickableObjects.push(gameObject);
					}
				} else if (element.program === "transparentProgram") {
					let gameObject = new GameObject({
						program: transparentProgram,
						objFile: element.objFile,
						translation: element.translation,
						rotation: element.rotation,
						scale: element.scale,
						faceCulling: element.faceCulling,
						transparent: element.transparent,
						id: element.id,
						name: element.name,
						pickable: element.pickable,
						diffuseMaterial: element.diffuseMaterial
							? element.diffuseMaterial
							: [0, 0, 0, 1],
						specularMaterial: element.specularMaterial
							? element.specularMaterial
							: [0, 0, 0, 1],
					});
					await gameObject.prepare();
	
					this.data.push(gameObject);
	
					this.allObjects.push(gameObject);
					if (gameObject.pickable) {
						this.pickableObjects.push(gameObject);
					}
				} else if (element.program === "textureProgram") {
					let gameObject = new TextureObject({
						program: textureProgram,
						objFile: element.objFile,
						texture: element.texture,
						translation: element.translation,
						rotation: element.rotation,
						scale: element.scale,
						faceCulling: element.faceCulling,
						transparent: element.transparent,
						id: element.id,
						name: element.name,
						pickable: element.pickable,
						diffuseMaterial: element.diffuseMaterial
							? element.diffuseMaterial
							: [0, 0, 0, 1],
						specularMaterial: element.specularMaterial
							? element.specularMaterial
							: [0, 0, 0, 1],
					});
					await gameObject.prepare();

					this.data.push(gameObject);
					this.allObjects.push(gameObject);
					if (gameObject.pickable) {
						this.pickableObjects.push(gameObject);
					}
				} else if (element.program === "videoProgram") {
					let gameObject = new VideoObject({
						program: videoProgram,
						objFile: element.objFile,
						video: element.video,
						translation: element.translation,
						rotation: element.rotation,
						scale: element.scale,
						faceCulling: element.faceCulling,
						transparent: element.transparent,
						id: element.id,
						name: element.name,
						pickable: element.pickable,
						diffuseMaterial: element.diffuseMaterial
							? element.diffuseMaterial
							: [0, 0, 0, 1],
						specularMaterial: element.specularMaterial
							? element.specularMaterial
							: [0, 0, 0, 1],
					});
					await gameObject.prepare();

					this.data.push(gameObject);
					this.allObjects.push(gameObject);
					if (gameObject.pickable) {
						this.pickableObjects.push(gameObject);
					}
				}
			}

			if (element.type === "group") {
				let group = new Group(
					element.name,
					element.translation,
					element.rotation,
					element.scale
				);

				this.allGroups.push(group);

				// Iteriere über die Gruppe
				await this.loadGroup(group, element.children);

				this.data.push(group);
			}
		});

		return this;
	}

	async loadGroup(group, children) {
		if (children.length === 0) return null;

		children.forEach(async (element) => {
			if (element.type === "object") {
				if (element.program === "defaultProgram") {
					let gameObject = new GameObject({
						program: defaultProgram,
						objFile: element.objFile,
						translation: element.translation,
						rotation: element.rotation,
						scale: element.scale,
						faceCulling: element.faceCulling,
						transparent: element.transparent,
						id: element.id,
						name: element.name,
						pickable: element.pickable,
						diffuseMaterial: element.diffuseMaterial
							? element.diffuseMaterial
							: [0, 0, 0, 1],
						specularMaterial: element.specularMaterial
							? element.specularMaterial
							: [0, 0, 0, 1],
					});
					await gameObject.prepare();
	
					group.children.push(gameObject);
	
					this.allObjects.push(gameObject);
					if (gameObject.pickable) {
						this.pickableObjects.push(gameObject);
					}
				} else if (element.program === "reflectionProgram") {
					let gameObject = new GameObject({
						program: reflectionProgram,
						objFile: element.objFile,
						translation: element.translation,
						rotation: element.rotation,
						scale: element.scale,
						faceCulling: element.faceCulling,
						transparent: element.transparent,
						id: element.id,
						name: element.name,
						pickable: element.pickable,
						diffuseMaterial: element.diffuseMaterial
							? element.diffuseMaterial
							: [0, 0, 0, 1],
						specularMaterial: element.specularMaterial
							? element.specularMaterial
							: [0, 0, 0, 1],
					});
					await gameObject.prepare();
	
					group.children.push(gameObject);
	
					this.allObjects.push(gameObject);
					if (gameObject.pickable) {
						this.pickableObjects.push(gameObject);
					}
				} else if (element.program === "transparentProgram") {
					let gameObject = new GameObject({
						program: transparentProgram,
						objFile: element.objFile,
						translation: element.translation,
						rotation: element.rotation,
						scale: element.scale,
						faceCulling: element.faceCulling,
						transparent: element.transparent,
						id: element.id,
						name: element.name,
						pickable: element.pickable,
						diffuseMaterial: element.diffuseMaterial
							? element.diffuseMaterial
							: [0, 0, 0, 1],
						specularMaterial: element.specularMaterial
							? element.specularMaterial
							: [0, 0, 0, 1],
					});
					await gameObject.prepare();
	
					group.children.push(gameObject);
	
					this.allObjects.push(gameObject);
					if (gameObject.pickable) {
						this.pickableObjects.push(gameObject);
					}
				} else if (element.program === "textureProgram") {
					let gameObject = new TextureObject({
						program: textureProgram,
						objFile: element.objFile,
						texture: element.texture,
						translation: element.translation,
						rotation: element.rotation,
						scale: element.scale,
						faceCulling: element.faceCulling,
						transparent: element.transparent,
						id: element.id,
						name: element.name,
						pickable: element.pickable,
						diffuseMaterial: element.diffuseMaterial
							? element.diffuseMaterial
							: [0, 0, 0, 1],
						specularMaterial: element.specularMaterial
							? element.specularMaterial
							: [0, 0, 0, 1],
					});
					await gameObject.prepare();

					group.children.push(gameObject);

					this.allObjects.push(gameObject);
					if (gameObject.pickable) {
						this.pickableObjects.push(gameObject);
					}
				} else if (element.program === "videoProgram") {
					let gameObject = new VideoObject({
						program: videoProgram,
						objFile: element.objFile,
						video: element.video,
						translation: element.translation,
						rotation: element.rotation,
						scale: element.scale,
						faceCulling: element.faceCulling,
						transparent: element.transparent,
						id: element.id,
						name: element.name,
						pickable: element.pickable,
						diffuseMaterial: element.diffuseMaterial
							? element.diffuseMaterial
							: [0, 0, 0, 1],
						specularMaterial: element.specularMaterial
							? element.specularMaterial
							: [0, 0, 0, 1],
					});
					await gameObject.prepare();

					group.children.push(gameObject);
					
					this.allObjects.push(gameObject);
					if (gameObject.pickable) {
						this.pickableObjects.push(gameObject);
					}
				}
			}

			if (element.type === "group") {
				let newgroup = new Group(
					element.name,
					element.translation,
					element.rotation,
					element.scale
				);

				this.allGroups.push(newgroup);

				await this.loadGroup(newgroup, element.children);

				group.children.push(newgroup);
			}
		});
	}

	draw() {
		// Leere die Listen zum Zeichnen der Objekte.
		this.opaqueObjects = [];
		this.transparentObjects = [];

		// Durchlaufe den Szenengraphen
		this.data.forEach((element) => {
			// Wenn es sich um ein Objekt handelt, füge es zur Liste hinzu.
			if (element instanceof GameObject) {
				// Lokale Transformationsliste
				let transformations = [];

				// Füge Transformationen des Objekts zur Transformationsliste hinzu.
				let translation = new Transformation(
					"translation",
					element.translation[0],
					element.translation[1],
					element.translation[2]
				);
				let rotation = new Transformation(
					"rotation",
					element.rotation[0],
					element.rotation[1],
					element.rotation[2]
				);
				let scale = new Transformation(
					"scale",
					element.scale[0],
					element.scale[1],
					element.scale[2]
				);
				transformations.push(scale);
				transformations.push(rotation);
				transformations.push(translation);

				// Initialisiere die finale Transformationsmatrix als Identitätsmatrix.
				let finalTransformation = new Float32Array(16);
				Mat4.identity(finalTransformation);

				// Multipliziere alle Matrizen des Pfades zu diesem Objekt.
				transformations.forEach((transformation) => {
					finalTransformation = Mat4.multiply(
						transformation.matrix,
						finalTransformation
					);
				});

				// Setze die WorldMatrix des Objekts zur finalen Transformation.
				element.worldMatrix = finalTransformation;

				// Das Objekt ist opak.
				if (element.isTransparent === false) {
					this.opaqueObjects.push(element);
				}
				// Das Objekt ist transparent.
				else {
					this.transparentObjects.push(element);
				}
			}

			// Wenn es sich um eine Gruppe handelt, schau die Kinder an.
			if (element instanceof Group) {
				// Füge Transformationen der Gruppe zur Transformationsliste hinzu.
				let transformations = [];
				let translation = new Transformation(
					"translation",
					element.translation[0],
					element.translation[1],
					element.translation[2]
				);
				let rotation = new Transformation(
					"rotation",
					element.rotation[0],
					element.rotation[1],
					element.rotation[2]
				);
				let scale = new Transformation(
					"scale",
					element.scale[0],
					element.scale[1],
					element.scale[2]
				);
				transformations.push(translation);
				transformations.push(rotation);
				transformations.push(scale);

				this.drawGroup(element, transformations);
			}
		});

		// Listen sind fertig eingelesen und Objekte können gezeichnet werden.
		this.opaqueObjects.forEach((object) => {
			if (object.program === reflectionProgram) {
				gl.useProgram(reflectionProgram);

				// Binden der Skybox-Textur
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, Global.skybox.texture); // assuming skybox is accessible here
				const skyboxLocation = gl.getUniformLocation(
					reflectionProgram,
					"uSkybox"
				);
				gl.uniform1i(skyboxLocation, 0);

				// Übergeben der Matrizen-Uniforms
				const worldMatrixLocation = gl.getUniformLocation(
					reflectionProgram,
					"uWorldMatrix"
				);
				const viewMatrixLocation = gl.getUniformLocation(
					reflectionProgram,
					"uViewMatrix"
				);
				const projectionMatrixLocation = gl.getUniformLocation(
					reflectionProgram,
					"uProjectionMatrix"
				);

				gl.uniformMatrix4fv(
					worldMatrixLocation,
					false,
					object.worldMatrix
				);
				gl.uniformMatrix4fv(
					viewMatrixLocation,
					false,
					Global.viewMatrix
				);
				gl.uniformMatrix4fv(
					projectionMatrixLocation,
					false,
					Global.projectionMatrix
				);

				// Zeichnen des Objekts
				object.draw();
			} else {
				object.draw();
			}
		});

		// Sortiere transparente Objekte.
		this.transparentObjects.sort((a, b) => {
			let distA = Math.sqrt(
				Math.pow(Global.cameraPosition[0] - a.translation[0], 2) +
					Math.pow(Global.cameraPosition[1] - a.translation[1], 2) +
					Math.pow(Global.cameraPosition[2] - a.translation[2], 2)
			);
			let distB = Math.sqrt(
				Math.pow(Global.cameraPosition[0] - b.translation[0], 2) +
					Math.pow(Global.cameraPosition[1] - b.translation[1], 2) +
					Math.pow(Global.cameraPosition[2] - b.translation[2], 2)
			);
			return distB - distA;
		});

		// Aktiviere Blending
		gl.depthMask(false);
		gl.enable(gl.BLEND);
		gl.blendEquation(gl.FUNC_ADD);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// Zeichne transparente Objekte
		this.transparentObjects.forEach((object) => {
			object.draw();
		});

		gl.disable(gl.BLEND);
		gl.depthMask(true);
	}

	drawGroup(group, previousTransformations) {
		group.children.forEach((element) => {
			// Wenn es sich um ein Objekt handelt, füge es zur Liste hinzu.
			if (element instanceof GameObject) {
				// Füge Transformationen des Objekts zur Transformationsliste hinzu.
				let transformations = Array.from(previousTransformations);
				let translation = new Transformation(
					"translation",
					element.translation[0],
					element.translation[1],
					element.translation[2]
				);
				let rotation = new Transformation(
					"rotation",
					element.rotation[0],
					element.rotation[1],
					element.rotation[2]
				);
				let scale = new Transformation(
					"scale",
					element.scale[0],
					element.scale[1],
					element.scale[2]
				);
				transformations.push(translation);
				transformations.push(rotation);
				transformations.push(scale);

				// Kehre die Reihenfolge um, damit die Transformationen in der richtigen Reihenfolge multipliziert werden.
				transformations.reverse();

				// Initialisiere die finale Transformationsmatrix als Identitätsmatrix.
				let finalTransformation = new Float32Array(16);
				Mat4.identity(finalTransformation);

				// Multipliziere alle Matrizen des Pfades zu diesem Objekt.
				transformations.forEach((transformation) => {
					finalTransformation = Mat4.multiply(
						transformation.matrix,
						finalTransformation
					);
				});

				// Setze die WorldMatrix des Objekts zur finalen Transformation.
				element.worldMatrix = finalTransformation;

				// Füge das Objekt der Objektliste hinzu.
				// Das Objekt ist opak.
				if (element.isTransparent === false) {
					this.opaqueObjects.push(element);
				}
				// Das Objekt ist transparent.
				else {
					this.transparentObjects.push(element);
				}
			}

			// Wenn es sich um eine Gruppe handelt, schau die Kinder an.
			if (element instanceof Group) {
				// Füge Transformationen der Gruppe zur Transformationsliste hinzu.
				let transformations = Array.from(previousTransformations);
				let translation = new Transformation(
					"translation",
					element.translation[0],
					element.translation[1],
					element.translation[2]
				);
				let rotation = new Transformation(
					"rotation",
					element.rotation[0],
					element.rotation[1],
					element.rotation[2]
				);
				let scale = new Transformation(
					"scale",
					element.scale[0],
					element.scale[1],
					element.scale[2]
				);
				transformations.push(translation);
				transformations.push(rotation);
				transformations.push(scale);

				this.drawGroup(element, transformations);
			}
		});
	}
}
