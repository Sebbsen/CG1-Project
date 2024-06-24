attribute vec4 aPosition;
attribute vec3 aNormal;

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vReflect;

void main() {
    // Transformiert die Position vom Modell- in den Weltkoordinatenraum
    vec4 worldPosition = uWorldMatrix * aPosition;

    // Transformiert die Normalen vom Modell- in den Weltkoordinatenraum
    vec3 worldNormal = mat3(uWorldMatrix) * aNormal;

    // Berechnet die Blickrichtung vom Auge (Kamera) zur Oberfläche
    vec3 eyeToSurfaceDir = normalize(worldPosition.xyz - vec3(uViewMatrix[3]));

    // Berechnet den Reflexionsvektor
    vReflect = reflect(eyeToSurfaceDir, normalize(worldNormal));

    // Setzt die Position des vektors für die Rasterisierung
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
}
