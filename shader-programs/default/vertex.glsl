precision mediump float;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 aPosition;
attribute vec3 aNormal;

varying vec3 fragNormal;

void main() {
    gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(aPosition, 1.0);

    vec4 pos = viewMatrix * worldMatrix * vec4(aPosition, 1.0);
    vec3 normal = (viewMatrix * worldMatrix * vec4(aNormal, 0.0)).xyz;
    normal = normalize(normal);

    fragNormal = normal;
}