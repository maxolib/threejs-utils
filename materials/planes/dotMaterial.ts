import * as THREE from 'three'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import { IUniform, ShaderMaterialParameters } from 'three'

interface DotMaterialParameters extends ShaderMaterialParameters{
	segments?: number | undefined
	mainColor?: THREE.ColorRepresentation | undefined
	secondColor?: THREE.ColorRepresentation | undefined
	padding?: number | undefined
}
export default class DotMaterial extends THREE.MeshBasicMaterial{
    uniforms?: { [uniform: string]: IUniform } | undefined;
	constructor(params?: DotMaterialParameters | undefined){
		super(params)
		this.uniforms = {}
		this.uniforms.segments = { value: params?.segments ?? 10 }
		this.uniforms.padding = { value: params?.padding ?? .4 }
		this.uniforms.mainColor = { value: params?.mainColor ? new THREE.Color(params.mainColor) : new THREE.Color(0xffffff) }
		this.uniforms.secondColor = { value: params?.secondColor ? new THREE.Color(params.secondColor) : new THREE.Color(0x000000) }

		this.onBeforeCompile = shader => {
			shader.vertexShader = vertexShader
			shader.fragmentShader = fragmentShader
		}
	}
}