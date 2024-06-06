import { Global } from "./global.js";
import { createProgram } from "./program.js";
import { GameObject } from "./gameObject.js";
import { initCamera, updateCamera } from "./camera.js";
import { ObjectPicker } from "./ObjectPicker.js";
import { createNewSkybox, drawNewSkybox } from "./skybox.js";

("use strict");

document.addEventListener("DOMContentLoaded", () => {
	init();
});

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");

// Neben webgl gibt es auch webgl2 (mehr Funktionen) und webgpu (neuerer Standard)
/** @type {WebGLRenderingContext} */
export let gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
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

	const response = await fetch("./gameObjects.json");
	const gameObjectsData = await response.json();

	const gameObjects = await Promise.all(gameObjectsData.map(async (data) => {
		let program = defaultProgram;
		if (data.program === "defaultProgram") {
			program = defaultProgram;
		}
		// Add more conditions if there are more programs

		let gameObject = new GameObject({
			program: program,
			objFile: data.objFile,
			translation: data.translation,
			rotation: data.rotation,
			scale: data.scale,
			faceCulling: data.faceCulling,
			transparent: data.transparent,
			id: data.id,
			name: data.name
		});
		await gameObject.prepare();
		return gameObject;
	}));

	// Init Object Picker
	const objectPicker = new ObjectPicker(gl, canvas, gameObjects);

	// define skybox images
	const skybox = await createNewSkybox(gl, {
		negx: 'assets/skybox/nx.png',
		negy: 'assets/skybox/ny.png',
		negz: 'assets/skybox/nz.png',
		posx: 'assets/skybox/px.png',
		posy: 'assets/skybox/py.png',
		posz: 'assets/skybox/pz.png',
	});

	async function loop(now) {
		// TODO: replace mat4 with own mat implementation
		updateCamera(Global.viewMatrix, mat4);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Draw the skybox first
		gl.depthFunc(gl.LEQUAL); // Change the depth function to LEQUAL for skybox
		drawNewSkybox(gl, skybox);
		gl.clear(gl.DEPTH_BUFFER_BIT); // Clear the depth buffer after drawing the skybox

		// Then draw the game objects
		gl.depthFunc(gl.LESS); // Restore the depth function
		gameObjects.forEach(obj => obj.draw());

		updateDebugInfoPanel(now);

		requestAnimationFrame(loop);
	}

	requestAnimationFrame(loop);


	//Pick Object
	canvas.addEventListener('click', (event) => {
        const x = canvas.width/2;
        const y = canvas.height/2;
        const pickedObj = objectPicker.pick(x, y);
		console.log('Picked Obj:', pickedObj);
        if (pickedObj) {
            console.log('Picked ID:', pickedObj.id);
            document.getElementById("picked_obj").textContent = "Picked Obj: " + pickedObj.name;
        }
    });

	function updateDebugInfoPanel(now) {
		now *= 0.001;
		const deltaTime = now - then;
		then = now;
		const fps = 1 / deltaTime;
		document.getElementById("fps").textContent = "FPS: " + fps.toFixed(0);
	}
}

// New Skybox functions




