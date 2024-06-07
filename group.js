import { GameObject } from "./gameObject.js";

export class Group {
    constructor(name, translation, rotation, scale) {
        this.name = name;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
        this.children = [];
    }

    addChild(child) {
        if (child instanceof GameObject || child instanceof Group) {
            this.children.push(child);
        } else {
            console.error("Tried to push illegal object to children array of Group: ", this);
        }
    }
}