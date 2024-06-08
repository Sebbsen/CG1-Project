import { gl } from "./script.js";
import { createProgram } from "./program.js";

export let defaultProgram;
export let skyboxProgram;

export async function createPrograms() {
    /**
     * @type {WebGLProgram}
     */
    defaultProgram = await createProgram(
        gl,
        "./shader-programs/default/vertex.glsl",
        "./shader-programs/default/fragment.glsl"
    );
    skyboxProgram = await createProgram(
        gl,
        "./shader-programs/skybox/vertex.glsl",
        "./shader-programs/skybox/fragment.glsl"
    );


}
