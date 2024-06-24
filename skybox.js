import { skyboxProgram } from "./shaderPrograms.js";
import { Global } from "./global.js";
import { identity, clone, multiplyMatrices } from "./matrix-functions/matFunctions.js"

// Funktion zum Erstellen einer neuen Skybox
export async function createNewSkybox(gl, images) {

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    // Definieren der Seiten der Skybox mit den entsprechenden Bild-URLs
    const faceInfos = [
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: images.posx },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: images.negx },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: images.posy },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: images.negy },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: images.posz },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: images.negz },
    ];

    // Definieren der Seiten der Skybox mit den entsprechenden Bild-URLs
    faceInfos.forEach((faceInfo) => {
        const { target, url } = faceInfo;
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 256;
        const height = 256;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;

        // Platzhalter-Textur einstellen
        gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

        const image = new Image();
        image.src = url;
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.texImage2D(target, level, internalFormat, format, type, image);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        };
    });

    // Textur-Parameter einstellen
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    // Überprüfen, ob WebGL 2.0 verwendet wird für TEXTURE_WRAP_R
    if (gl instanceof WebGL2RenderingContext) {
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    }

    // Erstellen und Binden eines Positionen-Buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
        -1, -1,  1,
         1, -1,  1,
        -1,  1,  1,
         1,  1,  1,
        -1, -1, -1,
         1, -1, -1,
        -1,  1, -1,
         1,  1, -1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Erstellen und Binden eines Index-Buffers
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indices = new Uint16Array([
        // Vorderseite
        0, 2, 3, 0, 3, 1,
        // Rechte Seite
        1, 3, 7, 1, 7, 5,
        // Rückseite
        5, 7, 6, 5, 6, 4,
        // Linke Seite
        4, 6, 2, 4, 2, 0,
        // Oberseite
        2, 6, 7, 2, 7, 3,
        // Unterseite
        4, 0, 1, 4, 1, 5,
    ]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Rückgabe des erstellten Skybox-Objekts
    return { program: skyboxProgram, positionBuffer, indexBuffer, texture };
}

// Funktion zum Zeichnen der Skybox
export function drawNewSkybox(gl, skybox) {
    gl.useProgram(skybox.program);

    // Attribute und Uniform-Standorte abrufen
    const positionLocation = gl.getAttribLocation(skybox.program, "a_position");
    const viewProjectionLocation = gl.getUniformLocation(skybox.program, "u_viewProjection");
    const textureLocation = gl.getUniformLocation(skybox.program, "u_texture");

    // Positionen-Buffer binden und Attribute einstellen
    gl.bindBuffer(gl.ARRAY_BUFFER, skybox.positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // Index-Buffer binden
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skybox.indexBuffer);

    // Translation aus der View-Matrix entfernen (nur Rotation wird beachtet)
    const viewMatrix = clone(Global.viewMatrix);
	viewMatrix[12] = 0;
	viewMatrix[13] = 0;
	viewMatrix[14] = 0;
	
    // View-Projection-Matrix berechnen
    let viewProjectionMatrix = multiplyMatrices(Global.projectionMatrix, viewMatrix);

    // View-Projection-Matrix und Textur an die Shader übergeben
    gl.uniformMatrix4fv(viewProjectionLocation, false, viewProjectionMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.texture);
    gl.uniform1i(textureLocation, 0);

    // Skybox zeichnen
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}