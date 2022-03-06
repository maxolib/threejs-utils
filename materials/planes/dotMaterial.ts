import { debugPane } from './../../debug/tweakpane';
import * as THREE from 'three'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import { IUniform, ShaderMaterialParameters } from 'three'
import { Pane } from 'tweakpane'

interface DotMaterialParameters extends THREE.MeshBasicMaterialParameters {
	segments?: number | undefined
	mainColor?: THREE.ColorRepresentation | undefined
	secondColor?: THREE.ColorRepresentation | undefined
	padding?: number | undefined
}
export default class DotMaterial extends THREE.MeshBasicMaterial {
	data
	temp
	constructor(params?: DotMaterialParameters | undefined) {
		super(params)
		this.data = {
			segments: { value: params?.segments ?? 10 },
			padding: { value: params?.padding ?? .4 },
			mainColor: { value: params?.mainColor ? new THREE.Color(params.mainColor) : new THREE.Color(0xffffff) },
			secondColor: { value: params?.secondColor ? new THREE.Color(params.secondColor) : new THREE.Color(0x000000) },
		}
		this.temp = {
			mainColor: params?.mainColor ? params.mainColor : 0xffffff,
			secondColor: params?.secondColor ? params.secondColor : 0x000000,
		}

		this.onBeforeCompile = shader => {
			shader.uniforms = { ...shader.uniforms, ...this.data }
			shader.vertexShader = vertexShader
			shader.fragmentShader = fragmentShader
		}
	}

	debug() {
		const pane = debugPane.getPane() as Pane
		const planeDebug = pane.addFolder({ title: "Plane" })
		planeDebug.addInput(this.temp, "mainColor", { view: "color", label: "main" }).on("change", (event) => {
			this.data.mainColor.value = new THREE.Color(event.value)
		})
		planeDebug.addInput(this.temp, "secondColor", { view: "color", label: "second" }).on("change", (event) => {
			this.data.secondColor.value = new THREE.Color(event.value)
		})
		planeDebug.addInput(this.data.segments, "value", {step: 0.2, label: "segment"})
		planeDebug.addInput(this.data.padding, "value", {label: "padding"})
	}
}