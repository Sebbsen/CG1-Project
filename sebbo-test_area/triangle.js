'use strict'

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



    /* CAMERA MOVEMENT START */
    // init camera vars
    let cameraX = 0; 
    let cameraY = 0; 
    let cameraZ = -8; 
    let speed = 0.05;
    let cameraRotX = 0;
    let cameraRotY = 0;
    let sensitivity = 0.005;

    // add keyboard listeners
    let keys = {};

    window.addEventListener('keydown', function(event) {
        keys[event.key] = true;
    });

    window.addEventListener('keyup', function(event) {
        keys[event.key] = false;
    });

    // add mouse listener
    // update camera rotation based on mouse movement
    let lastMouseX = null;
    let lastMouseY = null;

    canvas.addEventListener('mousemove', function(event) {
        if (lastMouseX !== null && lastMouseY !== null) {
            let deltaX = event.clientX - lastMouseX;
            let deltaY = event.clientY - lastMouseY;

            cameraRotX += deltaX * sensitivity;
            cameraRotY -= deltaY * sensitivity;
        }

        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        console.log(cameraRotX, cameraRotY);
    });
    /* CAMERA MOVEMENT END */


    
    // my Matrix things
    function matrixMultiply4x4(a, b) {
        const out = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                out[i + j * 4] = 0;
                for (let k = 0; k < 4; k++) {
                    out[i + j * 4] += a[i + k * 4] * b[k + j * 4];
                }
            }
        }
        return out;
    }

    function identity() {
        // einheitsmatrix
        // 1  0  0  0
        // 0  2  0  0
        // 0  0  3  0
        // 0  0  0  4
        const result = new Float32Array(16);
        result[0] = 1;
        result[5] = 1;
        result[10] = 1;
        result[15] = 1;
        return result;
    }


    const translate = (inMat, translationsVector) => {
        // translate teil der Matrix
        // 1  0  0  a
        // 0  1  0  b
        // 0  0  1  c
        // 0  0  0  1
        const translationsmatrix = identity();
        // translate teil der Matrix anpassen
        translationsmatrix[12] = translationsVector[0];
        translationsmatrix[13] = translationsVector[1];
        translationsmatrix[14] = translationsVector[2];
        const out = matrixMultiply4x4(translationsmatrix, inMat);
        return out;
    }


    const scale = (out, inMat, skalierungsVector) => {
        // scale teil der Matrix
        // a  0  0  0
        // 0  b  0  0
        // 0  0  c  0
        // 0  0  0  1
        const skalierungsmatrix = identity();
        // scale teil der Matrix anpassen
        skalierungsmatrix[0] = skalierungsVector[0];
        skalierungsmatrix[5] = skalierungsVector[1];
        skalierungsmatrix[10] = skalierungsVector[2];
        out = matrixMultiply4x4(skalierungsmatrix, inMat);
    }

    const rotatez = (out, inMat, rotateAngleZ) => {
        // rotatez teil der Matrix
        // a  c  0  0
        // b  d  0  0
        // 0  0  1  0
        // 0  0  0  2
        const rotateMat = identity();
        const c = Math.cos(rotateAngleZ);
        const s = Math.sin(rotateAngleZ);

        rotateMat[0] = c;
        rotateMat[1] = s;
        rotateMat[4] = -s;
        rotateMat[5] = c;
        return matrixMultiply4x4(rotateMat, inMat);
    }

    const VecCross = (a, b) => {
        return [
            a[1] * b[2] - a[2] * b[1], 
            a[2] * b[0] - a[0] * b[2], 
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    const VecMinus = (a, b) => {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }

    const VecNormalize = (a) => {
        const length = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        return [a[0] / length, a[1] / length, a[2] / length];
    }

    const VecSkalar = (a,b) => {
        let result = a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
        return result;
    }

    const VecMultipl = (x, v) => {
        return [
            x * v[0],
            x * v[1],
            x * v[2],
        ]
    }

    const lookAt = (out, eye, look, up) => {
        // 𝑛 = Eye − Lookc
        // 𝑢 = Up × 𝑛
        // 𝑣 = 𝑛 × 𝑢
        const n = VecMinus(eye, look);
        const u = VecCross(up, n);
        const v = VecCross(n, u);
        // Drehung im Raum, sodass die Sichtachse 𝑛 in 𝑧 gedreht wird und der Vektor 𝑣 parallel zu 𝑦 ist
        let nNormal = VecNormalize(n);
        let uNormal = VecNormalize(u);
        let vNormal = VecNormalize(v);
        
        let translateVec = [
            VecSkalar(VecMultipl(-1, uNormal), eye),
            VecSkalar(VecMultipl(-1, vNormal), eye),
            VecSkalar(VecMultipl(-1, nNormal), eye)
        ];

        let viewMatrix = [
            uNormal[0], vNormal[0], nNormal[0], 0,
            uNormal[1], vNormal[1], nNormal[1], 0,
            uNormal[2], vNormal[2], nNormal[2], 0,
            translateVec[0], translateVec[1],translateVec[2], 1
        ]

        viewMatrix = new Float32Array(viewMatrix);

        out = viewMatrix
        return out;
    }

    const perspective = (out, fovy, aspect, near, far) => {
        const f = 1.0 / Math.tan((fovy / 2) * (Math.PI / 180));
        const nf = 1 / (near - far);
        let projectionMatrix = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        ]

        //TODO IN COLS
        projectionMatrix = new Float32Array(projectionMatrix);
        out = projectionMatrix;
        return projectionMatrix;
    }


    // create shader program
    let vertexTextResponse = await fetch('./vertexShader.glsl');
    let vertexText = await vertexTextResponse.text();

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexText)
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    }

    let fragmentTextResponse = await fetch('./fragmentShader.glsl');
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

    identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
    //viewMatrix = lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);

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
        mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
        gl.uniformMatrix4fv(mWorldLocation, gl.FALSE, worldMatrix);
        /* CAMERA MOVEMENT START */
        // Update camera position based on WASD input
        if (keys['w']) {
            cameraZ += speed;
        }
        if (keys['s']) {
            cameraZ -= speed;
        }
        if (keys['a']) {
            cameraX += speed;
        }
        if (keys['d']) {
            cameraX -= speed;
        }

        // Update camera rotation based on mouse input
        let cameraDirection = [
            Math.sin(cameraRotX),
            Math.cos(cameraRotX) * Math.sin(cameraRotY),
            Math.cos(cameraRotX) * Math.cos(cameraRotY)
        ];
    
        let centerX = cameraX + cameraDirection[0];
        //let centerY = 0;
        //let centerZ = 0;
        let centerY = cameraY - cameraDirection[1];
        let centerZ = cameraZ + cameraDirection[2];

        // Update camera view matrix
        viewMatrix = lookAt(viewMatrix, [cameraX, cameraY, cameraZ], [centerX, centerY, centerZ + 1], [0, 1, 0]);
        gl.uniformMatrix4fv(mViewLocation, gl.FALSE, viewMatrix);
        /* CAMERA MOVEMENT END */

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
        counter++;
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

window.onload = init;