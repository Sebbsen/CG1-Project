precision mediump float;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexture;

varying vec3 fragNormal;
varying vec3 fragPosition;
varying highp vec2 fragTextureCoord;
varying float fogDepth;

void main() {
    gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(aPosition, 1.0);

    vec4 pos = viewMatrix * worldMatrix * vec4(aPosition, 1.0);
    vec3 normal = (worldMatrix * vec4(aNormal, 0.0)).xyz;
    normal = normalize(normal);

    fragNormal = normal;
    fragPosition = (worldMatrix * vec4(aPosition, 1.0)).xyz;
    fragTextureCoord = aTexture;
    fogDepth = -(viewMatrix * worldMatrix * vec4(aPosition, 1.0)).z;
}