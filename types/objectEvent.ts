import * as THREE from 'three'
import ThreeHandler from '../handlers/threeHandler'
import events from 'events'
import { PointerEvent } from '../handlers/eventHandler'
import Dispose from './dispose'

export type ObjectEventInvoke = {
    onEnter: [event: PointerEvent],
    onLeave: [event: PointerEvent], 
    onClick: [event: PointerEvent], 
    onTouch: [event: PointerEvent], 
    onClickMove: [event: PointerEvent],
    onTouchMove: [event: PointerEvent],
}

export type ObjectEventParams = {
    onEnter: (event: PointerEvent) => void,
    onLeave: (event: PointerEvent) => void,
    onClick: (event: PointerEvent) => void,
    onTouch: (event: PointerEvent) => void,
    onClickMove: (event: PointerEvent) => void,
    onTouchMove: (event: PointerEvent) => void,
}
export default class ObjectEvent extends Dispose {
	handler: ThreeHandler
	object: THREE.Object3D
    emitter: events.EventEmitter

	constructor(handler: ThreeHandler, object: THREE.Object3D){
		super()

		this.handler = handler
		this.object = object
		this.emitter = new events.EventEmitter()
		this.handler.eventHandler.add(this)
		this.onDispose(() => {
			handler.scene.remove(object)
		})
	}

	invoke<T extends keyof ObjectEventInvoke>(type: T, ...args: ObjectEventInvoke[T]){
		this.emitter.emit(type as string, ...args)
	}

	subscribe<T extends keyof ObjectEventParams>(type: T, action: ObjectEventParams[T]){
		this.emitter.on(type as string, action)

		this.onDispose(() =>{
			this.emitter.off(type as string, action)
		})
	}

	unsubscribe<T extends keyof ObjectEventParams>(type: T, action: ObjectEventParams[T]){
		this.emitter.off(type as string, action)
	}

	unsubscribeAll<T extends keyof ObjectEventParams>(type: T){
		this.emitter.removeAllListeners(type as string)
	}
}