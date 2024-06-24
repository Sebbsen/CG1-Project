// Diese Klasse ermöglicht das Auswählen von Objekten in der 3D Szene
export class ObjectPicker {
    constructor(gl, canvas, gameObjects) {
        this.gl = gl;
        this.canvas = canvas;
        this.gameObjects = gameObjects;
        this.pickingFramebuffer = null;
        this.pickingTexture = null;

        this.initPicking(); // Instant init
    }

    // Initialisiert den Picking-Framebuffer und die Textur
    initPicking() {
        const gl = this.gl;
        const canvas = this.canvas;

        // Erstelle und konfiguriere die Picking-Textur
        this.pickingTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.pickingTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // Erstelle und konfiguriere den Picking-Framebuffer
        this.pickingFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.pickingTexture, 0);

        // Erstelle und füge einen Renderbuffer für die Tiefenprüfung hinzu
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

        // Zeichne jedes Objekt im Picking-Modus
        this.gameObjects.forEach((obj) => {
            obj.drawPicking();
        });

        // Lese die Pixeldaten vom Picking-Framebuffer
        const pixels = new Uint8Array(4);
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // Dekodiere die Objekt-ID aus den Pixeldaten
        const id = (pixels[0] << 16) | (pixels[1] << 8) | pixels[2];
        return this.gameObjects.find(obj => obj.id === id); // Rückgabe des ausgewählten Objekts
    }
}
