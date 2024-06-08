attribute vec4 aPosition;
attribute vec3 aNormal;

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vReflect;

void main() {
    vec4 worldPosition = uWorldMatrix * aPosition;
    vec3 worldNormal = mat3(uWorldMatrix) * aNormal;

    vec3 eyeToSurfaceDir = normalize(worldPosition.xyz - vec3(uViewMatrix[3]));
    vReflect = reflect(eyeToSurfaceDir, normalize(worldNormal));

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
}
