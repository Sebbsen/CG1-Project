precision mediump float;

varying vec3 fragNormal;

uniform bool uPicking;
uniform vec3 uPickingColor;

void main() {
    if (uPicking) {
        gl_FragColor = vec4(uPickingColor, 1.0);
        return;
    }
    
    vec3 normal = normalize(fragNormal);

    // als uniform übergeben
    vec4 emissive = vec4(0.0, 0.0, 0.0, 1.0);

    // ambient light komponentenweise multipliziert mit material
    vec4 ambient = vec4(0.0, 0.0, 0.0, 1.0);

    // max(light vector dot normal, 0) * (light color komponentenweise multipliziert mit material)
    vec3 light = normalize(vec3(0.0, 0.5, 0.8));
    vec4 mat_diffuse = vec4(0.8, 0.35, 0.1, 1.0);
    vec4 diffuse = max(dot(normal, light), 0.0) * vec4(1.0);

    // (max(reflect dot normal, 0))^shininess * (light color komponentenweise multipliziert mit material)
    vec3 reflect_vector = (2.0 * dot(normal, light)) * normal - light;
    float shininess = 60.0;
    vec4 mat_specular = vec4(0.75, 0.75, 0.75, 1.0);
    vec4 specular = pow(max(dot(normal, reflect_vector), 0.0), shininess) * mat_specular;

    gl_FragColor = emissive + ambient + diffuse + specular;
}