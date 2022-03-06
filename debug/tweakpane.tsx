import React from 'react'
import { Pane } from "tweakpane";
import * as THREE from "three"

interface DebugPane {
	setting: {
		enable: boolean
	},
	pane: Pane | undefined,
	getPane: () => Pane,
	objectPosition: (object: THREE.Object3D) => void,
	objectPositions: (title: string, objects: THREE.Object3D[]) => void,
}

export const debugPane: DebugPane = {
	setting: {
		enable: true
	},
	pane: undefined,
	getPane: () => {
		debugPane.pane = debugPane.pane ? debugPane.pane : new Pane()

		return debugPane.pane
	},
	objectPosition: (object: THREE.Object3D) => {
		if (!debugPane.setting.enable) return

		const pane = new Pane()
		const folder = pane.addFolder({ title: object.name, expanded: true })
		folder.addInput(object, "position")
	},
	objectPositions: (title: string, objects: THREE.Object3D[]) => {
		if (!debugPane.setting.enable) return

		const pane = new Pane()
		const folder = pane.addFolder({ title: title, expanded: true })
		objects.forEach(object => {
			folder.addInput(object, "position")
		})
	},
}

