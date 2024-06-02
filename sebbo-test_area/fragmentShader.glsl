precision mediump float; // Präzisionsspezifikator hinzufügen
varying vec3 fragColor; // von Vertex Shader erhalten

void main() {
    gl_FragColor = vec4(fragColor, 1.0); // setzen Sie die Farbe des Fragments
}
