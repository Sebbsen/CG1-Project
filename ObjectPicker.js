export class ObjectPicker {
    constructor(gl, canvas, gameObjects) {
        this.gl = gl;
        this.canvas = canvas;
        this.gameObjects = gameObjects;
        this.pickingFramebuffer = null;
        this.pickingTexture = null;

        this.initPicking(); // Initialize the picking framebuffer and texture
    }

    initPicking() {
        const gl = this.gl;
        const canvas = this.canvas;

        // Create and configure the picking texture
        this.pickingTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.pickingTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // Create and configure the picking framebuffer
        this.pickingFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.pickingTexture, 0);

        // Create and attach a renderbuffer for depth testing
        const renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    pick(x, y) {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw each object in picking mode
        this.gameObjects.forEach((obj) => {
            obj.drawPicking();
        });

        // Read pixel data from the picking framebuffer
        const pixels = new Uint8Array(4);
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // Decode the object ID from the pixel data
        const id = (pixels[0] << 16) | (pixels[1] << 8) | pixels[2];
        return this.gameObjects.find(obj => obj.id === id); // Return the picked object
    }
}
