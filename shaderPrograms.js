import { gl } from "./script.js";
import { createProgram } from "./program.js";

export let defaultProgram;
export let reflectionProgram;
export let skyboxProgram;
export let textureProgram;

export async function createPrograms() {
	/**
	 * @type {WebGLProgram}
	 */
	defaultProgram = await createProgram(
		gl,
		"./shader-programs/default/vertex.glsl",
		"./shader-programs/default/fragment.glsl"
	);

	reflectionProgram = await createProgram(
		gl,
		"./shader-programs/reflection/vertex.glsl",
		"./shader-programs/reflection/fragment.glsl"
	);

	skyboxProgram = await createProgram(
		gl,
		"./shader-programs/skybox/vertex.glsl",
		"./shader-programs/skybox/fragment.glsl"
	);

	textureProgram = await createProgram(
		gl,
		"./shader-programs/default-texture/vertex.glsl",
		"./shader-programs/default-texture/fragment.glsl"
	);
}
