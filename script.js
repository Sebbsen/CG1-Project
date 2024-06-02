import { Global } from "./global.js";
import { createProgram } from "./program.js";
import { GameObject } from "./gameObject.js";

("use strict");

document.addEventListener("DOMContentLoaded", () => {
	init();
});

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");

// Neben webgl gibt es auch webgl2 (mehr Funktionen) und webgpu (neuerer Standard)
/** @type {WebGLRenderingContext} */
export let gl = canvas.getContext("webgl");
if (!gl) {
	console.error("WebGL does not work and might not be supported");
}

let then = window.performance.now();

async function init() {
	Global.cameraPosition = [0, 5, -10];
	Global.cameraLookPosition = [0, 0, 0];
	Global.setAspectRation(canvas.width, canvas.height);
	Global.init();

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	let defaultProgram = await createProgram(
		gl,
		"./shader-programs/default/vertex.glsl",
		"./shader-programs/default/fragment.glsl"
	);

	let teapot = new GameObject(
		defaultProgram,
		"./assets/models/teapot.obj",
		[0, -2, 0],
		[0, 0, 0],
		[1, 1, 1],
		false,
		false
	);
	await teapot.prepare();

	let cube = new GameObject(
		defaultProgram,
		"./assets/models/cube.obj",
		[2, 1, 0],
		[0, 0, 0],
		[1, 1, 1],
		true,
		false
	);
	await cube.prepare();

	let suzanne = new GameObject(defaultProgram, "./assets/models/suzanne.obj",
	[0, 0, 3],
	[0, 0, 0],
	[1, 1, 1],
	true,
	false);
	await suzanne.prepare();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	teapot.draw();
	cube.draw();
	suzanne.draw();

	async function loop(now) {
		Global.cameraPosition = [Math.sin(now * 0.001) * 10, 3, Math.cos(now * 0.001) * 10];
		Global.initViewMatrix();
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		teapot.draw();
		cube.draw();
		suzanne.draw();

		updateDebugInfoPanel(now);

		requestAnimationFrame(loop);
	}

	requestAnimationFrame(loop);
}

function updateDebugInfoPanel(now) {
	now *= 0.001;
	const deltaTime = now - then;
	then = now;
	const fps = 1 / deltaTime;
	document.getElementById("fps").textContent = "FPS: " + fps.toFixed(0);
}
