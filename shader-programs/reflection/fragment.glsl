precision mediump float;

varying vec3 vReflect;

uniform samplerCube uSkybox;

void main() {
    gl_FragColor = textureCube(uSkybox, vReflect);
}
