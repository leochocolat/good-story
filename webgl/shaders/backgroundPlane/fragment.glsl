// Varyings
varying vec2 v_uv;
varying vec2 v_uv_r;

// Uniforms
uniform sampler2D u_texture;

void main() {
    gl_FragColor = texture2D(u_texture, v_uv_r);
}
