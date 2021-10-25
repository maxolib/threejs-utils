varying vec2 vUv;
varying float vSegments;
varying float vPadding;
varying vec3 vMainColor;
varying vec3 vSecondColor;
#include <fog_pars_fragment>

void main() {
	vec2 uv = vec2(vUv);
	uv.y = mod(uv.y * vSegments, 1.);
	uv.x = mod(uv.x * vSegments, 1.);
	float strength = step(vPadding, distance(uv, vec2(0.5, 0.5)));
	vec3 mixedColor = mix(vMainColor, vSecondColor, strength);
	gl_FragColor = vec4( mixedColor,0.);
	#include <fog_fragment>
}