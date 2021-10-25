import * as THREE from 'three'
import { PointsMaterialParameters } from 'three';
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
export default class PointsDirectionMaterial extends THREE.PointsMaterial{
	constructor(params?: PointsMaterialParameters | undefined, direction?: THREE.Vector3){
		super(params)
		this.onBeforeCompile = shader => {
			shader.vertexShader = vertexShader
			shader.fragmentShader = fragmentShader
		}
	}
}