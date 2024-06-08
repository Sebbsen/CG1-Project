import { GameObject } from "./gameObject.js";
import { Group } from "./group.js";
import { defaultProgram } from "./shaderPrograms.js";
import { gl } from "./script.js";
import { Mat4 } from "./mat4.js";
import { Transformation } from "./transformation.js";

export class SceneGraph {
	constructor() {
        // Inhalt des Szenengraphen
		this.data = [];
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
				let program = defaultProgram;
				if (element.program === "defaultProgram") {
					program = defaultProgram;
				}

				let gameObject = new GameObject({
					program: program,
					objFile: element.objFile,
					translation: element.translation,
					rotation: element.rotation,
					scale: element.scale,
					faceCulling: element.faceCulling,
					transparent: element.transparent,
					id: element.id,
					name: element.name,
					pickable: element.pickable,
				});
				await gameObject.prepare();

				this.data.push(gameObject);

				this.allObjects.push(gameObject);
				if (gameObject.pickable) {
					this.pickableObjects.push(gameObject);
				}
			}

			if (element.type === "group") {
				let group = new Group(
					element.name,
					element.translation,
					element.rotation,
					element.scale
				);

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
                let program = defaultProgram;
				if (element.program === "defaultProgram") {
					program = defaultProgram;
				}

				let gameObject = new GameObject({
					program: program,
					objFile: element.objFile,
					translation: element.translation,
					rotation: element.rotation,
					scale: element.scale,
					faceCulling: element.faceCulling,
					transparent: element.transparent,
					id: element.id,
					name: element.name,
					pickable: element.pickable,
				});

				await gameObject.prepare();
				
				group.children.push(gameObject);

				this.allObjects.push(gameObject);
				if (gameObject.pickable) {
					this.pickableObjects.push(gameObject);
				}
			}

			if (element.type === "group") {
				let newgroup = new Group(
					element.name,
					element.translation,
					element.rotation,
					element.scale
				);

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
				let translation = new Transformation("translation", element.translation[0], element.translation[1], element.translation[2]);
				let rotation = new Transformation("rotation", element.rotation[0], element.rotation[1], element.rotation[2]);
				let scale = new Transformation("scale", element.scale[0], element.scale[1], element.scale[2]);
				transformations.push(scale);
				transformations.push(rotation);
				transformations.push(translation);

				// Initialisiere die finale Transformationsmatrix als Identitätsmatrix.
				let finalTransformation = new Float32Array(16);
				Mat4.identity(finalTransformation);

				// Multipliziere alle Matrizen des Pfades zu diesem Objekt.
				transformations.forEach((transformation) => {
                    finalTransformation = Mat4.multiply(transformation.matrix, finalTransformation);
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
				let translation = new Transformation("translation", element.translation[0], element.translation[1], element.translation[2]);
				let rotation = new Transformation("rotation", element.rotation[0], element.rotation[1], element.rotation[2]);
				let scale = new Transformation("scale", element.scale[0], element.scale[1], element.scale[2]);
				transformations.push(translation);
				transformations.push(rotation);
				transformations.push(scale);

			    this.drawGroup(element, transformations);
			}
		});

        // Listen sind fertig eingelesen und Objekte können gezeichnet werden.
        this.opaqueObjects.forEach((object) => {
            object.draw();
        });
	}

	drawGroup(group, previousTransformations) {
		group.children.forEach((element) => {
            // Wenn es sich um ein Objekt handelt, füge es zur Liste hinzu.
			if (element instanceof GameObject) {
				// Füge Transformationen des Objekts zur Transformationsliste hinzu.
				let transformations = Array.from(previousTransformations);
				let translation = new Transformation("translation", element.translation[0], element.translation[1], element.translation[2]);
				let rotation = new Transformation("rotation", element.rotation[0], element.rotation[1], element.rotation[2]);
				let scale = new Transformation("scale", element.scale[0], element.scale[1], element.scale[2]);
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
					finalTransformation = Mat4.multiply(transformation.matrix, finalTransformation);
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
                let translation = new Transformation("translation", element.translation[0], element.translation[1], element.translation[2]);
				let rotation = new Transformation("rotation", element.rotation[0], element.rotation[1], element.rotation[2]);
				let scale = new Transformation("scale", element.scale[0], element.scale[1], element.scale[2]);
				transformations.push(translation);
				transformations.push(rotation);
				transformations.push(scale);

				this.drawGroup(element, transformations);
			}
		});
	}
}
