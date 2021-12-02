import * as THREE from 'three'
import ThreeHandler from '../handlers/threeHandler'

export default class Object3DEvent extends THREE.Object3D{
	handler: ThreeHandler
	constructor(handler: ThreeHandler){
		super()
		this.handler = handler
	}
}