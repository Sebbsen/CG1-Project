import { Global } from "./global.js";
import { createProgram } from "./program.js";
import { GameObject } from "./gameObject.js";
import { initCamera, updateCamera } from "./camera.js";

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
	initCamera(canvas);
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

	let teapot = new GameObject({
		program: defaultProgram,
		objFile: "./assets/models/teapot.obj",
		translation: [0, -2, 0],
		rotation: [0, 0, 0],
		scale: [1, 1, 1],
		faceCulling: false,
		transparent: false,
		id: 1,
		name: "Teapot"
	});
	await teapot.prepare();
	
	let cube = new GameObject({
		program: defaultProgram,
		objFile: "./assets/models/cube.obj",
		translation: [2, 1, 0],
		rotation: [0, 0, 0],
		scale: [1, 1, 1],
		faceCulling: true,
		transparent: false,
		id: 2,
		name: "Cube"
	});
	await cube.prepare();
	
	let suzanne = new GameObject({
		program: defaultProgram,
		objFile: "./assets/models/suzanne.obj",
		translation: [0, 0, 3],
		rotation: [0, 0, 0],
		scale: [1, 1, 1],
		faceCulling: true,
		transparent: false,
		id: 3,
		name: "Suzanne"
	});
	await suzanne.prepare();

	// Create Picking Texture and Framebuffer
	const pickingTexture = createPickingTexture(gl, canvas.width, canvas.height);
	const pickingFramebuffer = createPickingFramebuffer(gl, pickingTexture);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	teapot.draw();
	cube.draw();
	suzanne.draw();

	async function loop(now) {
		// TODO: replace mat4 with own mat implementation
		updateCamera(Global.viewMatrix, mat4);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		teapot.draw();
		cube.draw();
		suzanne.draw();

		updateDebugInfoPanel(now);

		requestAnimationFrame(loop);
	}

	requestAnimationFrame(loop);

	function pick(x, y) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, pickingFramebuffer);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		teapot.drawWithPickingID(1);
		cube.drawWithPickingID(2);
		suzanne.drawWithPickingID(3);

		const pixels = new Uint8Array(4);
		gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		let color = pixels;
		const id = (color[0] << 16) | (color[1] << 8) | color[2];
		console.log('Picked ID:', id);
	}

	function createPickingTexture(gl, width, height) {
		const pickingTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, pickingTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
		return pickingTexture;
	}

	function createPickingFramebuffer(gl, pickingTexture) {
		const pickingFramebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, pickingFramebuffer);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickingTexture, 0);

		const renderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		return pickingFramebuffer;
	}

	canvas.addEventListener('click', (event) => {
		const x = canvas.width/2;
		const y = canvas.height/2;
		pick(x, y);
	});

	function updateDebugInfoPanel(now) {
		now *= 0.001;
		const deltaTime = now - then;
		then = now;
		const fps = 1 / deltaTime;
		document.getElementById("fps").textContent = "FPS: " + fps.toFixed(0);
	}


}
