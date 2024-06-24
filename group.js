import { GameObject } from "./gameObject.js";
import { deltaTime } from "./script.js";

export class Group {
    constructor(name, translation, rotation, scale) {
        this.name = name;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
        this.children = [];
    }

	// Füge der Gruppe ein Kind hinzu
    addChild(child) {
        if (child instanceof GameObject || child instanceof Group) {
            this.children.push(child);
        } else {
            console.error("Tried to push illegal object to children array of Group: ", this);
        }
    }

	// Animiere die Translation kontinuierlich
    animateTranslationPerFrame(from, to) {
		// Differenz berechnen
		const deltaX = to[0] - from[0];
		const deltaY = to[1] - from[1];
		const deltaZ = to[2] - from[2];

		const currentX = from[0] + deltaX * deltaTime;
		const currentY = from[1] + deltaY * deltaTime;
		const currentZ = from[2] + deltaZ * deltaTime;

		this.translation = [currentX, currentY, currentZ]; // setzen der neuen Translation
	}
    
	// Animiere die Rotation kontinuierlich
    animateRotationPerFrame(from, to) {
		// Differenz berechnen
		const deltaX = to[0] - from[0];
		const deltaY = to[1] - from[1];
		const deltaZ = to[2] - from[2];

		const currentX = from[0] + deltaX * deltaTime;
		const currentY = from[1] + deltaY * deltaTime;
		const currentZ = from[2] + deltaZ * deltaTime;

		this.rotation = [currentX, currentY, currentZ]; // setzen der neuen Rotation
	}
    
	// Animiere die Skalierung kontinuierlich
    animateScalePerFrame(from, to) {
		// Differenz berechnen
		const deltaX = to[0] - from[0];
		const deltaY = to[1] - from[1];
		const deltaZ = to[2] - from[2];

		const currentX = from[0] + deltaX * deltaTime;
		const currentY = from[1] + deltaY * deltaTime;
		const currentZ = from[2] + deltaZ * deltaTime;

		this.scale = [currentX, currentY, currentZ]; // setzen der neuen Skalierung
	}
}