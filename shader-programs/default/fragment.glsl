precision mediump float;

varying vec3 fragNormal;
varying vec3 fragPosition;

uniform vec4 emissive;
uniform vec4 ambientLight;
uniform vec4 ambientMaterial;
uniform vec4 diffuseMaterial;

uniform vec3 sunPosition;
uniform vec3 sunDirection;
uniform vec3 lightPosition1;
uniform vec4 lightColor1;

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

float radius(float dist, float radius) {
    return (2.0 / (radius * radius)) * (1.0 - dist / sqrt(dist * dist + radius * radius));
}


void main() {
    if (uPicking) {
        gl_FragColor = vec4(uPickingColor, 1.0);
        return;
    }
    vec3 normal = normalize(fragNormal);


    // Licht-Berechnungen

    // Sonne
    vec3 offset_sun = sunPosition - fragPosition;
    vec3 light_direction_sun = normalize(offset_sun);

    // Deckenleuchte
    vec3 offset_1 = lightPosition1 - fragPosition;
    vec3 light_direction_1 = normalize(offset_1);
    float distance_1 = distance(fragPosition, lightPosition1);
    float attenuation_1 = inverse_square(distance_1);
    vec4 diffuse_light_1 = max(dot(light_direction_1, normal), 0.0) * attenuation_1 * lightColor1;


    // ambient light komponentenweise multipliziert mit material
    vec4 ambient = vec4(ambientLight.r * ambientMaterial.r, ambientLight.g * ambientMaterial.g, ambientLight.b * ambientMaterial.b, ambientLight.a * ambientMaterial.a);

    // max(light vector dot normal, 0) * (light color komponentenweise multipliziert mit material)
    vec4 diffuse = max(dot(normal, light_direction_sun), 0.0) * diffuseMaterial;

    // (max(reflect dot normal, 0))^shininess * (light color komponentenweise multipliziert mit material)
    vec3 reflect_vector = (2.0 * dot(normal, light_direction_sun)) * normal - light_direction_sun;
    float shininess = 60.0;
    vec4 mat_specular = vec4(0.75, 0.75, 0.75, 1.0);
    vec4 specular = pow(max(dot(normal, reflect_vector), 0.0), shininess) * mat_specular;

    // gl_FragColor = emissive + ambient + diffuse + specular;
    // gl_FragColor = emissive + ambient + diffuse + diffuse_light_1 + specular;
    gl_FragColor = emissive + ambient + diffuse_light_1;
    // gl_FragColor = vec4(normal, 1.0);
}