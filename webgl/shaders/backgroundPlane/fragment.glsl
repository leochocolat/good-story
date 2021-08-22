// Varyings
varying vec2 v_uv;

varying vec2 v_uv_r_next;

varying vec2 v_uv_r_active;

varying vec4 v_position;

// Uniforms
uniform vec2 u_resolution;

uniform sampler2D u_texture_next;
uniform vec2 u_texture_next_size;

uniform sampler2D u_texture;
uniform vec2 u_texture_size;

uniform float u_alpha;
uniform float u_effect_strength;
uniform float u_zoom_progress;
uniform float u_transition_progress;

float PI = 3.14159265359;

float scale = 1.1;

void main() {
    vec2 uv_next = v_uv_r_next;
    uv_next = (uv_next - 0.5) * (1.0 / scale) + 0.5; // scale from center

    vec2 uv_active = v_uv_r_active;
    uv_active = (uv_active - 0.5) * (1.0 / scale) + 0.5; // scale from center

    float aspect = u_resolution.x / u_resolution.y;

    vec2 disorsion_next = uv_next-.5;
    disorsion_next.x *= aspect; // aspect correction

    vec2 disorsion_active = uv_active-.5;
    disorsion_active.x *= aspect; // aspect correction

    // take distance from center
   	float len = length((v_uv-.5) * (1.0 - u_zoom_progress) * u_effect_strength);

    // these are the lens parameters
    float k1 = 1.0;
    float k2 = 1.0;
    float k3 = -3.2;

    disorsion_next = disorsion_next * k1 + disorsion_next * len * k2 + disorsion_next * len * len * k3;
    disorsion_next.x /= aspect; // aspect correction

    uv_next = disorsion_next + 0.5;

    disorsion_active = disorsion_active * k1 + disorsion_active * len * k2 + disorsion_active * len * len * k3;
    disorsion_active.x /= aspect; // aspect correction

    uv_active = disorsion_active + 0.5;

    vec4 texel_next = texture2D(u_texture_next, uv_next);

    vec4 texel_active = texture2D(u_texture, uv_active);

    vec4 texel = mix(texel_active, texel_next, u_transition_progress);

    gl_FragColor = texel * u_alpha;

    // Debug
    // gl_FragColor = vec4(abs(v_position.y), 0.0, 0.0, 1.0);
}
