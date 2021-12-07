import ThreeHandler from "./threeHandler"
import * as THREE from 'three'
import events from 'events'
import ObjectEvent from "../types/objectEvent"
import Dispose from "../types/dispose"

export interface PointerEvent {
	coordinate: THREE.Vector2
	target?: ObjectEvent
}

export type EventInvoke = {
	awakeTick: [],
	startTick: [elapsed: number, delta: number],
	endTick: [elapsed: number, delta: number],
	onEnter: [event: PointerEvent],
	onLeave: [event: PointerEvent],
	onClick: [event: PointerEvent],
	onTouch: [event: PointerEvent],
	onClickMove: [event: PointerEvent],
	onTouchMove: [event: PointerEvent],
}

export type EventParams = {
	awakeTick: () => void,
	startTick: (elapsed: number, delta: number) => void,
	endTick: (elapsed: number, delta: number) => void,
	onEnter: (event: PointerEvent) => void,
	onLeave: (event: PointerEvent) => void,
	onClick: (event: PointerEvent) => void,
	onTouch: (event: PointerEvent) => void,
	onClickMove: (event: PointerEvent) => void,
	onTouchMove: (event: PointerEvent) => void,
}

export default class EventHandler extends Dispose {
	handler: ThreeHandler
	emitter: events.EventEmitter = new events.EventEmitter()
	coordinate: THREE.Vector2 = new THREE.Vector2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)

	raycaster: THREE.Raycaster = new THREE.Raycaster()
	intersacts: THREE.Intersection<THREE.Object3D<THREE.Event>>[] = []
	currentHit?: THREE.Object3D
	candidateClick?: THREE.Object3D
	targets: ObjectEvent[] = []

	constructor(handler: ThreeHandler) {
		super()
		this.handler = handler

		this.setCoordinate()
		this.setClicked()
		this.subscribe('awakeTick', () => {
			if (this.raycaster) {
				this.raycaster.setFromCamera(this.coordinate, this.handler.camera)

				this.intersacts = this.raycaster.intersectObjects(this.handler.scene.children);
				if (this.intersacts.length > 0) {
					if (this.currentHit != this.intersacts[0].object) {
						var target = this.targets.find(x => x.object == this.currentHit)
						if (target)
							target.invoke("onLeave", { coordinate: this.coordinate.clone(), target })
						this.currentHit = this.intersacts[0].object
						var target = this.targets.find(x => x.object == this.currentHit)
						target?.invoke('onEnter', { coordinate: this.coordinate.clone(), target })
					}
				}
				else if (this.currentHit) {
					target?.invoke("onLeave", { coordinate: this.coordinate.clone(), target })
					this.currentHit = undefined
				}
			}
		})
	}

	add(target: ObjectEvent) {
		this.targets.push(target)
	}

	remove(target: ObjectEvent) {
		this.targets.filter(x => target != x)
	}

	invoke<T extends keyof EventInvoke>(type: T, ...args: EventInvoke[T]) {
		this.emitter.emit(type as string, ...args)
	}

	subscribe<T extends keyof EventParams>(type: T, action: EventParams[T]) {
		this.emitter.on(type as string, action)

		this.onDispose(() => {
			this.emitter.off(type as string, action)
		})
	}

	unsubscribe<T extends keyof EventParams>(type: T, action: EventParams[T]) {
		this.emitter.off(type as string, action)
	}

	private setCoordinate() {
		window.addEventListener('mousemove', e => {
			this.coordinate.set((e.clientX / this.handler.sizes.width) * 2 - 1, 1 - (e.clientY / this.handler.sizes.height) * 2)
		})
		this.onDispose(() => {
			window.removeEventListener('mousemove', e => {
				this.coordinate.set((e.clientX / this.handler.sizes.width) * 2 - 1, 1 - (e.clientY / this.handler.sizes.height) * 2)
			})
		})
	}

	private setClicked() {
		window.addEventListener('mousedown', e => {
			this.candidateClick = this.currentHit
		})
		window.addEventListener('mouseup', e => {
			if (this.currentHit && this.currentHit == this.candidateClick) {
				var target = this.targets.find(x => x.object == this.currentHit)
				if (target)
					target.invoke('onClick', { coordinate: this.coordinate.clone(), target })
			}
		})
		this.onDispose(() => {

			window.removeEventListener('mousedown', e => {
				this.candidateClick = this.currentHit
			})
			window.removeEventListener('mouseup', e => {
				if (this.currentHit && this.currentHit == this.candidateClick) {
					var target = this.targets.find(x => x.object == this.currentHit)
					if (target)
						target.invoke('onClick', { coordinate: this.coordinate.clone(), target })
				}
			})
		})
	}
}