precision mediump float;

uniform sampler2D texture;

varying vec4 fragColor;
varying vec3 fragNormal;
varying vec2 fragTexture;
varying highp vec2 fragTexCoord;

void main() {
    vec3 normal = normalize(fragNormal);

    // texture
    vec4 texColor = texture2D(texture, fragTexCoord);

    // als uniform übergeben
    vec4 emissive = vec4(0.0, 0.0, 0.0, 1.0);

    // ambient light komponentenweise multipliziert mit material
    vec4 ambient = vec4(0.0, 0.0, 0.0, 1.0);

    // max(light vector dot normal, 0) * (light color komponentenweise multipliziert mit material)
    vec3 light = normalize(vec3(0.0, 0.5, 0.8));
    vec4 mat_diffuse = vec4(0.8, 0.35, 0.1, 1.0);
    // vec4 diffuse = max(dot(normal, light), 0.0) * mat_diffuse;
    vec4 diffuse = max(dot(normal, light), 0.0) * texColor;

    // (max(reflect dot normal, 0))^shininess * (light color komponentenweise multipliziert mit material)
    vec3 reflect = (2.0 * dot(normal, light)) * normal - light;
    float shininess = 60.0;
    vec4 mat_specular = vec4(0.75, 0.75, 0.75, 1.0);
    vec4 specular = pow(max(dot(normal, reflect), 0.0), shininess) * mat_specular;

    gl_FragColor = emissive + ambient + diffuse + specular;
}