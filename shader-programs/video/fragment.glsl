precision mediump float;

varying vec3 fragNormal;
varying vec3 fragPosition;
varying highp vec2 fragTextureCoord;

uniform vec4 emissive;

uniform sampler2D texture;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform bool uPicking;
uniform vec3 uPickingColor;


void main() {
    if (uPicking) {
        gl_FragColor = vec4(uPickingColor, 1.0);
        return;
    }
    vec3 normal = normalize(fragNormal);

    vec3 displayNormal = (normal + vec3(1.0)) / 2.0;

    highp vec4 texColor = texture2D(texture, fragTextureCoord);

    gl_FragColor = emissive + texColor;
    // gl_FragColor = vec4(displayNormal, 1.0) + texColor;
    // gl_FragColor = vec4(fragTextureCoord, 0.0, 1.0);
}