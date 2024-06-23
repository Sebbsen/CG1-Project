import { Global } from "./global.js";
import { createProgram } from "./program.js";
import { GameObject } from "./gameObject.js";
import { ObjectPicker } from "./objectPicker.js";
import { createNewSkybox, drawNewSkybox } from "./skybox.js";
import { initCamera, sensitivity, updateCamera } from "./camera.js";
import { SceneGraph } from "./sceneGraph.js";
import { createPrograms, defaultProgram, textureProgram, videoProgram } from "./shaderPrograms.js";
import { GameManager } from "./gameManager.js";
import { TextureObject } from "./objects/textureObject.js";
import { VideoObject } from "./objects/videoObject.js";
import { MultiTextureObject } from "./objects/multiTextureObject.js";

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
export let deltaTime = 1;

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
	// await sceneGraph.init("./sceneGraphSolarSystemDemo.json");
	// await sceneGraph.init("./sceneGraph.json");
	await sceneGraph.init("./sceneGraphDemoSzene.json");
	console.log(sceneGraph);

	const pickableObjects = sceneGraph.pickableObjects;

	// Init Object Picker
	const objectPicker = new ObjectPicker(gl, canvas, pickableObjects);


	// define skybox images
	const skybox = await createNewSkybox(gl, {
		negx: "assets/skybox/nx.png",
		negy: "assets/skybox/ny.png",
		negz: "assets/skybox/nz.png",
		posx: "assets/skybox/px.png",
		posy: "assets/skybox/py.png",
		posz: "assets/skybox/pz.png",
	});

	Global.skybox = skybox;

	const gameManager = new GameManager(sceneGraph.pickableObjects);

	const solarSystem = sceneGraph.allGroups.find((group) => group.name === "Sonnensystem");
	const earthGroup = sceneGraph.allGroups.find((group) => group.name === "Erdgruppe");

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

		// KONTINUIERLICHE ANIMATIONEN
		if (solarSystem) {
			const startRotY = solarSystem.rotation;
			const endRotY = [startRotY[0], startRotY[1] - 1, startRotY[2]];
			solarSystem.animateRotationPerFrame(startRotY, endRotY);
		}
		
		if (earthGroup) {
			const startRotY = earthGroup.rotation;
			const endRotY = [startRotY[0], startRotY[1] - 1, startRotY[2]];
			earthGroup.animateRotationPerFrame(startRotY, endRotY);
		}

		sceneGraph.draw();

		updateDebugInfoPanel(now);

		requestAnimationFrame(loop);
	}

	requestAnimationFrame(loop);

	// ANIMATION BEISPIEL
	// Animieren eines bestimmten Objekts
	// const ObjectToAnimate = sceneGraph.allObjects.find(
	// 	(obj) => obj.name === "Erde"
	// ); // Beispielobjekt "Erde"
	// if (ObjectToAnimate) {
	// 	const startPos = ObjectToAnimate.translation;
	// 	const endPos = [startPos[0] - 1, startPos[1] - 1, startPos[2]];
	// 	ObjectToAnimate.animateTranslation(startPos, endPos, 2000); // Animation in 2000ms
	// }

	//Pick Object
	canvas.addEventListener("click", (event) => {
		const x = canvas.width / 2;
		const y = canvas.height / 2;
		const pickedObj = objectPicker.pick(x, y);
		console.log("Picked Obj:", pickedObj);
		if (pickedObj) {
			console.log("Picked ID:", pickedObj.id);
			document.getElementById("picked_obj").textContent =
				"Picked Obj: " + pickedObj.name;
			gameManager.handlePickedObject(pickedObj);
		}
	});

	function updateDebugInfoPanel(now) {
		now *= 0.001;
		deltaTime = now - then;
		then = now;
		const fps = 1 / deltaTime;
		document.getElementById("fps").textContent = "FPS: " + fps.toFixed(0);
	}
}
