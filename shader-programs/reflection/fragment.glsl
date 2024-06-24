precision mediump float;

varying vec3 vReflect;

uniform samplerCube uSkybox;

void main() {
    // Berechnet die Farbe des Pixels, indem die Cube-Map mit dem Reflexionsvektor "abgetastet" wird
    gl_FragColor = textureCube(uSkybox, vReflect);
}
