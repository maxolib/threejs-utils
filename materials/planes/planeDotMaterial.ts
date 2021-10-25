import * as THREE from 'three'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import { ShaderMaterialParameters } from 'three'

interface PlaneDotMaterialParameters extends ShaderMaterialParameters{
	segments?: number | undefined
	mainColor?: THREE.ColorRepresentation | undefined
	secondColor?: THREE.ColorRepresentation | undefined
	padding?: number | undefined
}
export default class PlaneDotMaterial extends THREE.ShaderMaterial{
	constructor(params?: PlaneDotMaterialParameters | undefined){
		super(params)
		
		this.uniforms.segments = { value: params?.segments ?? 10 }
		this.uniforms.padding = { value: params?.padding ?? .4 }
		this.uniforms.mainColor = { value: params?.mainColor ? new THREE.Color(params.mainColor) : new THREE.Color(0xffffff) }
		this.uniforms.secondColor = { value: params?.secondColor ? new THREE.Color(params.secondColor) : new THREE.Color(0x000000) }
		console.log(this.uniforms);
		this.onBeforeCompile = shader => {
			
			shader.vertexShader = vertexShader
			shader.fragmentShader = fragmentShader
		}
	}
}