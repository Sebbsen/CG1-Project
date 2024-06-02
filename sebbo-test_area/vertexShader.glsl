precision mediump float; // Präzisionsspezifikator hinzufügen
attribute vec3 vertPosition; // geändert von vec2 zu vec3
attribute vec3 vertColor; // zusätzliches Attribut für die Vertexfarbe
varying vec3 fragColor; // für die Übergabe der Farbe an den Fragment Shader
uniform mat4 matrix; // Matrix für die Transformation
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main() {
    fragColor = vertColor; // die Farbe des Vertex an den Fragment Shader weitergeben
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0); // z-Koordinate hinzugefügt und die w-Koordinate als 1.0 gesetzt
}
