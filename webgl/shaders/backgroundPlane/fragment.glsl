// Varyings
varying vec2 v_uv;
varying vec2 v_uv_r;
varying vec4 v_position;


// Uniforms
uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform vec2 u_texture_size;
uniform float u_alpha;
uniform float u_effect_strength;
uniform float u_transition_progress;

float PI = 3.14159265359;

float scale = 1.0;

void main() {
    vec2 uv = v_uv_r;
    uv = (uv - 0.5) * (1.0 / scale) + 0.5; // scale from center

    float aspect = u_resolution.x / u_resolution.y;

    vec2 disorsion = uv-.5;

    disorsion.x *= aspect; // aspect correction


    // take distance from center
   	float len = length((v_uv-.5) * (1.0 - u_transition_progress) * u_effect_strength);

    // these are the lens parameters
    float k1 = 1.0;
    float k2 = 1.0;
    float k3 = -3.2;

    // higher powers may be added if necessary
    disorsion = disorsion * k1 + disorsion * len * k2 + disorsion * len * len * k3;

    disorsion.x /= aspect; // aspect correction

    uv = disorsion + 0.5;

    vec4 texel = texture2D(u_texture, uv) * u_alpha;

    gl_FragColor = texel;

    // Debug
    // gl_FragColor = vec4(abs(v_position.y), 0.0, 0.0, 1.0);
}
