export let cameraX = 0;
export let cameraY = 0;
export let cameraZ = -8;
export let cameraRotX = 0;
export let cameraRotY = 0;
export let speed = 0.05;
export let sensitivity = 0.005;
export let keys = {};

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

function updateCameraRotation(event) {
    let deltaX = event.movementX;
    let deltaY = event.movementY;

    cameraRotX += deltaX * sensitivity;
    cameraRotY -= deltaY * sensitivity;
}

export function updateCamera(viewMatrix, mat4, gl, mViewLocation) {
    if (keys['w']) {
        cameraZ += speed * Math.cos(cameraRotX);
        cameraX += speed * Math.sin(cameraRotX);
    }
    if (keys['s']) {
        cameraZ -= speed * Math.cos(cameraRotX);
        cameraX -= speed * Math.sin(cameraRotX);
    }
    if (keys['a']) {
        cameraX += speed * Math.cos(cameraRotX);
        cameraZ -= speed * Math.sin(cameraRotX);
    }
    if (keys['d']) {
        cameraX -= speed * Math.cos(cameraRotX);
        cameraZ += speed * Math.sin(cameraRotX);
    }

    let cameraDirection = [
        Math.sin(cameraRotX),
        Math.cos(cameraRotX) * Math.sin(cameraRotY),
        Math.cos(cameraRotX) * Math.cos(cameraRotY)
    ];

    let centerX = cameraX + cameraDirection[0];
    let centerY = cameraY - cameraDirection[1];
    let centerZ = cameraZ + cameraDirection[2];

    mat4.lookAt(viewMatrix, [cameraX, cameraY, cameraZ], [centerX, centerY, centerZ + 1], [0, 1, 0]);
    gl.uniformMatrix4fv(mViewLocation, gl.FALSE, viewMatrix);
}
