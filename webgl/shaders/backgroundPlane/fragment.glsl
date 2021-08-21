// Varyings
varying vec2 v_uv;
varying vec2 v_uv_r;

// Uniforms
uniform sampler2D u_texture;
uniform float u_alpha;

void main() {
    gl_FragColor = texture2D(u_texture, v_uv_r) * u_alpha;
}
