import { Global } from "./global.js";
import { createProgram } from "./program.js";
import { GameObject } from "./gameObject.js";
import { ObjectPicker } from "./objectPicker.js";
import { createNewSkybox, drawNewSkybox } from "./skybox.js";
import { initCamera, sensitivity, updateCamera } from "./camera.js";
import { SceneGraph } from "./sceneGraph.js";
import { createPrograms, defaultProgram } from "./shaderPrograms.js";
import { GameManager } from "./gameManager.js";

("use strict");

document.addEventListener("DOMContentLoaded", () => {
	init();
});

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

	await createPrograms();

	let sceneGraph = new SceneGraph();
	await sceneGraph.init("./sceneGraphSolarSystemDemo.json");
	//sceneGraph.init("./sceneGraph.json");
	console.log(sceneGraph);

	const pickableObjects = sceneGraph.pickableObjects;
	
	const objectPicker = new ObjectPicker(gl, canvas, pickableObjects); 

	// Init Object Picker

	// define skybox images
	const skybox = await createNewSkybox(gl, {
		negx: 'assets/skybox/nx.png',
		negy: 'assets/skybox/ny.png',
		negz: 'assets/skybox/nz.png',
		posx: 'assets/skybox/px.png',
		posy: 'assets/skybox/py.png',
		posz: 'assets/skybox/pz.png',
	});

	const gameManager = new GameManager();

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

		sceneGraph.draw();

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
			gameManager.handlePickedObject(pickedObj);
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
