precision mediump float;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 vertPosition;
attribute vec3 vertNormal;
attribute vec2 vertTexture;

varying vec4 fragColor;
varying vec3 fragNormal;
varying vec2 fragTexture;
varying highp vec2 fragTexCoord;

void main() {
    gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(vertPosition, 1.0);

    vec4 pos = viewMatrix * worldMatrix * vec4(vertPosition, 1.0);
    vec3 normal = (viewMatrix * worldMatrix * vec4(vertNormal, 0.0)).xyz;
    normal = normalize(normal);

    fragNormal = normal;
    fragTexCoord = vertTexture;
}