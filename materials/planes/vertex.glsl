uniform float segments;
uniform float padding;
uniform vec3 mainColor;
uniform vec3 secondColor;
varying vec2 vUv;
varying float vSegments;
varying float vPadding;
varying vec3 vMainColor;
varying vec3 vSecondColor;

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	vUv = uv;
	vSegments = segments;
	vPadding = padding;
	vMainColor = mainColor;
	vSecondColor = secondColor;
}