import * as THREE from 'three'
import events from 'events'
import EventEmitter from 'events';

export default class LoadingHandler {
    manager: THREE.LoadingManager
    event: events.EventEmitter
    constructor() {
        this.event = new EventEmitter()
        this.manager = new THREE.LoadingManager()
        this.manager.onLoad = () => {
            this.event.emit("onLoad")
        }
        this.manager.onStart = () => {
            this.event.emit("onStart")
        }
        this.manager.onProgress = (url, loaded, total) => {
            this.event.emit("onProgress", url, loaded, total)
        }
        this.manager.onError = () => {
            this.event.emit("onError")
        }
    }

    onLoadedAddListener(action: () => void){
        this.event.on("onLoad", action)
    }
    onLoadedRemoveListener(action: () => void){
        this.event.removeListener("onLoad", action)
    }
    onStartAddListener(action: () => void){
        this.event.on("onStart", action)
    }
    onStartRemoveListener(action: () => void){
        this.event.removeListener("onStart", action)
    }
    onProgressAddListener(action: (url: string, loaded: number, total: number) => void){
        this.event.on("onProgress", action)
    }
    onProgressRemoveListener(action: () => void){
        this.event.removeListener("onProgress", action)
    }
    onErrorAddListener(action: () => void){
        this.event.on("onError", action)
    }
    onErrorRemoveListener(action: () => void){
        this.event.removeListener("onError", action)
    }

}