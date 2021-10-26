import * as THREE from 'three'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import { IUniform, ShaderMaterialParameters } from 'three'

interface DotMaterialParameters extends THREE.MeshBasicMaterialParameters{
	segments?: number | undefined
	mainColor?: THREE.ColorRepresentation | undefined
	secondColor?: THREE.ColorRepresentation | undefined
	padding?: number | undefined
}
export default class DotMaterial extends THREE.MeshBasicMaterial{
	constructor(params?: DotMaterialParameters | undefined){
		super(params)

		this.onBeforeCompile = shader => {
			shader.uniforms.segments = { value: params?.segments ?? 10 }
			shader.uniforms.padding = { value: params?.padding ?? .4 }
			shader.uniforms.mainColor = { value: params?.mainColor ? new THREE.Color(params.mainColor) : new THREE.Color(0xffffff) }
			shader.uniforms.secondColor = { value: params?.secondColor ? new THREE.Color(params.secondColor) : new THREE.Color(0x000000) }
			shader.vertexShader = vertexShader
			shader.fragmentShader = fragmentShader
		}
		// this.setValues(params as THREE.ShaderMaterialParameters)
	}
}