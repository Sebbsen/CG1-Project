'use strict'
import { initCamera, updateCamera, cameraX, cameraY, cameraZ, cameraRotX, cameraRotY, speed, sensitivity, keys } from './camera.js';


let init = async function () {
    console.log('start');
    let canvas = document.getElementById('cg1-canvas');
    /**
     * @type {WebGLRenderingContext}
     */
    let gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
    }

    initCamera(canvas);

    // create shader program
    let vertexTextResponse = await fetch('./shaders/vertexShader.glsl');
    let vertexText = await vertexTextResponse.text();

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexText)
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    }

    let fragmentTextResponse = await fetch('./shaders/fragmentShader.glsl');
    let fragmentText = await fragmentTextResponse.text();

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentText);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(fragmentShader));
    }

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
    }

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); // enable faces properly overlapping
   
    gl.enable(gl.CULL_FACE); // Diese Zeile aktiviert das Face Culling. Ohne diese Zeile würde WebGL alle Dreiecke zeichnen, unabhängig davon, in welche Richtung sie zeigen.
    gl.frontFace(gl.CCW); // Diese Zeile definiert, welche Dreiecke als "vorne" angesehen werden, basierend auf der Reihenfolge ihrer Eckpunkte. gl.CCW steht für "Counter Clockwise". Das bedeutet, dass Dreiecke, deren Eckpunkte in gegen den Uhrzeigersinn aufgezählt werden, als "vorne" angesehen werden.
    gl.cullFace(gl.BACK); // Diese Zeile bestimmt, welche Dreiecke "ausgeschnitten" (nicht gezeichnet) werden, wenn das Face Culling aktiviert ist. gl.BACK bedeutet, dass die "rückwärtigen" Dreiecke (diejenigen, die von der Kamera weg zeigen) nicht gezeichnet werden.


    // create triangle buffer
    let boxVertices = [
         // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
    ];

    var boxIndices = [
        // Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
    ]
    let boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    let boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);


    

    // draw
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute (X, Y, Z)
        gl.FLOAT, // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    // Color
    gl.vertexAttribPointer(
        colorAttribLocation, 
        3, // Number of elements per attribute (r, g, b)
        gl.FLOAT, // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex (inklusive Position)
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(colorAttribLocation);

    var mWorldLocation = gl.getUniformLocation(program, 'mWorld');
    var mViewLocation = gl.getUniformLocation(program, 'mView');
    var mProjLocation = gl.getUniformLocation(program, 'mProj');
    // Set the uniform color
    

    let worldMatrix = new Float32Array(16);
    let viewMatrix = new Float32Array(16);
    let projMatrix = new Float32Array(16);

    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    //projMatrix = perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);


    gl.uniformMatrix4fv(mWorldLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(mViewLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(mProjLocation, gl.FALSE, projMatrix);

    let counter = 0;
    let angle = 0;
    let identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    function loop() {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI; // 6 Sekunden für eine Umdrehung
        mat4.rotate(worldMatrix, identityMatrix, 0, [0, 1, 0]);
        gl.uniformMatrix4fv(mWorldLocation, gl.FALSE, worldMatrix);

        updateCamera(viewMatrix, mat4, gl, mViewLocation);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
        counter++;
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

window.onload = init;