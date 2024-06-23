import { gl } from "./script.js";
import { createProgram } from "./program.js";

export let defaultProgram;
export let reflectionProgram;
export let skyboxProgram;
export let textureProgram;
export let multiTextureProgram;
export let videoProgram;
export let transparentProgram;

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
	
	multiTextureProgram = await createProgram(
		gl,
		"./shader-programs/multi-texture/vertex.glsl",
		"./shader-programs/multi-texture/fragment.glsl"
	);
	
	videoProgram = await createProgram(
		gl,
		"./shader-programs/video/vertex.glsl",
		"./shader-programs/video/fragment.glsl"
	);
	
	transparentProgram = await createProgram(
		gl,
		"./shader-programs/default-transparent/vertex.glsl",
		"./shader-programs/default-transparent/fragment.glsl"
	);
}
