export let cameraX = 0;
export let cameraY = 0;
export let cameraZ = -8;
export let cameraRotX = 0;
export let cameraRotY = 0;
export let speed = 0.05;
export let sensitivity = 0.001;
export let keys = {};
import {lookAt} from "./matrix-functions/matFunctions.js"

// initialisiert die Kamera mit den event listener 
export function initCamera(canvas) {
    window.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    });

    // blendet die Maus aus und locked die maus im canvas
    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === canvas) {
            console.log('Pointer locked');
            document.addEventListener('mousemove', updateCameraRotation);
        } else {
            console.log('Pointer unlocked');
            document.removeEventListener('mousemove', updateCameraRotation);
        }
    });
}   

// Aktualisiert die Kamerarotation basierend auf der Mausbewegung
function updateCameraRotation(event) {
    let deltaX = event.movementX;
    let deltaY = event.movementY;

    cameraRotX -= deltaX * sensitivity;
    cameraRotY -= deltaY * sensitivity;

    // Clamping
    cameraRotY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotY));
}

// Aktualisiert die Kameraposition und -richtung basierend auf Benutzereingaben und aktualisiert die viewMatrix entsprechend
export function updateCamera(viewMatrix) {
    if (keys['w']) {
        cameraX += speed * Math.sin(cameraRotX);
        cameraZ += speed * Math.cos(cameraRotX);
    }
    if (keys['s']) {
        cameraX -= speed * Math.sin(cameraRotX);
        cameraZ -= speed * Math.cos(cameraRotX);
    }
    if (keys['d']) {
        cameraX -= speed * Math.cos(cameraRotX);
        cameraZ += speed * Math.sin(cameraRotX);
    }
    if (keys['a']) {
        cameraX += speed * Math.cos(cameraRotX);
        cameraZ -= speed * Math.sin(cameraRotX);
    }

    if (keys[' ']) {
        cameraY += speed;
    }
    if (keys['f']) {
        cameraY -= speed;
    }

    // Berechnet die Blickrichtung der Kamera
    let cameraDirection = [
        Math.sin(cameraRotX) * Math.cos(cameraRotY),
        Math.sin(cameraRotY),
        Math.cos(cameraRotX) * Math.cos(cameraRotY)
    ];

    let centerX = cameraX + cameraDirection[0];
    let centerY = cameraY + cameraDirection[1];
    let centerZ = cameraZ + cameraDirection[2];

    // Update viewMatrix
    lookAt(viewMatrix, [cameraX, cameraY, cameraZ], [centerX, centerY, centerZ], [0, 1, 0]);
}