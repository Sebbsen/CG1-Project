precision mediump float;

varying vec3 fragNormal;
varying vec3 fragPosition;
varying highp vec2 fragTextureCoord;
varying float fogDepth;

uniform vec4 emissive;
uniform vec4 ambientLight;
uniform vec4 ambientMaterial;
uniform vec4 diffuseMaterial;
uniform vec4 specularMaterial;
uniform float shininess;

uniform vec3 sunPosition;
uniform vec3 sunDirection;

uniform vec4 fogColor;
uniform float fogNear;
uniform float fogFar;

uniform vec3 pointLightPosition1;
uniform vec4 pointLightColor1;
uniform vec3 pointLightPosition2;
uniform vec4 pointLightColor2;

uniform sampler2D texture;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform bool uPicking;
uniform vec3 uPickingColor;

float inverse_square(float dist) {
    return 1.0 / (dist * dist);
}

float quadratic(float dist, float a, float b, float c) {
    return 1.0 / (dist * dist * a + dist * b + c);
}

float radius(float dist, float radius, float c) {
    return (2.0 / (radius * radius)) * (1.0 - dist / sqrt(dist * dist + radius * radius)) + c;
}


void main() {
    if (uPicking) {
        gl_FragColor = vec4(uPickingColor, 1.0);
        return;
    }
    vec3 normal = normalize(fragNormal);

    vec4 texColor = texture2D(texture, fragTextureCoord);


    // Licht-Berechnungen
    // Point Lights
    vec3 point_light_direction_1 = normalize(pointLightPosition1 - fragPosition);
    float distance_1 = distance(fragPosition, pointLightPosition1);
    // float attenuation_1 = quadratic(distance_1, 0.1, 0.0, 0.1);
    float attenuation_1 = radius(distance_1, 3.0, 0.25);
    vec4 diffuse_point_light_1 = max(dot(point_light_direction_1, normal), 0.0) * attenuation_1 * pointLightColor1;

    vec3 point_light_direction_2 = normalize(pointLightPosition2 - fragPosition);
    float distance_2 = distance(fragPosition, pointLightPosition2);
    float attenuation_2 = quadratic(distance_2, 0.3, 0.0, 0.1);
    vec4 diffuse_point_light_2 = max(dot(point_light_direction_2, normal), 0.0) * attenuation_2 * pointLightColor2;


    // ambient light komponentenweise multipliziert mit material
    vec4 ambient = vec4(ambientLight.r * texColor.r, ambientLight.g * texColor.g, ambientLight.b * texColor.b, ambientLight.a * texColor.a);

    // max(light vector dot normal, 0) * (light color komponentenweise multipliziert mit material)
    vec4 diffuse = max(dot(normal, normalize(sunDirection)), 0.0) * texColor;

    // (max(reflect dot normal, 0))^shininess * (light color komponentenweise multipliziert mit material)
    vec3 reflect_vector = (2.0 * dot(normal, normalize(sunDirection))) * normal - normalize(sunDirection);
    vec4 specular = pow(max(dot(normal, reflect_vector), 0.0), shininess) * texColor;

    vec4 color = emissive + ambient + diffuse + diffuse_point_light_1 + diffuse_point_light_2 + specular;

    float fogAmount = smoothstep(fogNear, fogFar, fogDepth);

    gl_FragColor = mix(color, fogColor, fogAmount);
}