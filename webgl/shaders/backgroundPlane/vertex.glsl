// Uniforms
uniform vec2 u_resolution;

uniform vec2 u_texture_next_size;

uniform vec2 u_texture_size;

// Varyings
varying vec2 v_uv;

varying vec2 v_uv_r_next;

varying vec2 v_uv_r_active;

varying vec4 v_position;

vec2 resized_uv(vec2 inital_uv, vec2 resolution, vec2 aspect_ratio)
{
	vec2 ratio = vec2(
		min((resolution.x / resolution.y) / (aspect_ratio.x / aspect_ratio.y), 1.0),
		min((resolution.y / resolution.x) / (aspect_ratio.y / aspect_ratio.x), 1.0)
	);

	vec2 resized_uv = vec2(
		inital_uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
		inital_uv.y * ratio.y + (1.0 - ratio.y) * 0.5
	);

	return resized_uv;
}

float cubicPulse( float c, float w, float x ){
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

void main() {
    v_uv = uv;

    vec4 glPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    v_position = glPos;
    v_position.xyz /= v_position.w;

    // Resize
    v_uv_r_active = resized_uv(v_uv, u_resolution, u_texture_size);
    v_uv_r_next = resized_uv(v_uv, u_resolution, u_texture_next_size);

	// Output
    gl_Position = glPos;
}
