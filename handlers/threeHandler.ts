import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { gsap } from "gsap"
import EventHandler, { EventInvoke, EventParams } from './eventHandler'
import Dispose from '../types/dispose'
import { Mesh } from 'three'

export default class ThreeHandler extends Dispose {
    // Graphics
    canvas: HTMLCanvasElement
    renderer: THREE.Renderer
    camera: THREE.Camera
    scene: THREE.Scene
    orbitControls?: OrbitControls

    // Common
    params: SceneObjectParams
    sizes: ScreenSize
    gsap: GSAP

    // Debuging

    // Event handler
    eventHandler: EventHandler

    // Animation & Tick
    private clock: THREE.Clock;
    private prevElapsedTime: number;
    private elapsedTime: number;
    private deltaTime: number;

    // Post-Processing
    effectComposer: EffectComposer | null;

    constructor(params: SceneObjectParams) {
        super()
        this.eventHandler = new EventHandler(this)
        this.canvas = params.canvas;
        this.scene = params.scene ?? new THREE.Scene()
        this.renderer = params.renderer ?? new THREE.WebGLRenderer({
            canvas: params.canvas,
            antialias: params.antialias
        })
        this.sizes = params.sizes ?? { width: window.innerWidth, height: window.innerHeight }
        this.camera = params.camera ?? new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
        this.orbitControls = params.enableOrbitControls ? new OrbitControls(this.camera, this.canvas as HTMLElement) : undefined
        this.effectComposer = params.enableEffectComposer && this.renderer instanceof THREE.WebGLRenderer ? new EffectComposer(this.renderer) : null
        this.effectComposer?.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.effectComposer?.setSize(this.sizes.width, this.sizes.height)
        this.gsap = gsap

        if (params.enableFullscreen && params.sizes == undefined)
            this.setFullScreen(params.enableResponsive)

        this.clock = new THREE.Clock()
        this.prevElapsedTime = 0
        this.elapsedTime = 0
        this.deltaTime = 0

        // gsap.ticker.add(this.tick)

        this.params = params
        this.init()

        this.tick()

        this.onDispose(() => {
            this.eventHandler.dispose()
        })
    }

    private init() {
        const tick = () => { this.orbitControls?.update() }
        if (this.orbitControls) {
            this.subscribe("startTick", tick)
            this.orbitControls.enableDamping = true;
        }
    }

    private setFullScreen(responsive: boolean | undefined) {

        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight

        if (!responsive) return

        window.addEventListener('resize', () => {
            this.updateSize({ width: window.innerWidth, height: window.innerHeight })
        })
    }

    public updateSize(sizes?: ScreenSize) {
        // Update sizes
        if (sizes) {
            this.sizes.width = sizes.width
            this.sizes.height = sizes.height
        }

        // Update camera
        if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()
        }

        // Update renderer
        this.renderer?.setSize(this.sizes.width, this.sizes.height)
        if (this.renderer instanceof THREE.WebGLRenderer)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    private tick() {
        // Awake
        this.invoke('awakeTick')

        this.elapsedTime = this.clock.getElapsedTime()
        this.deltaTime = this.elapsedTime - this.prevElapsedTime
        this.prevElapsedTime = this.elapsedTime
        const elapsedTime = this.elapsedTime
        const deltaTime = this.deltaTime


        // Start tick
        this.invoke('startTick', elapsedTime, deltaTime)

        this.renderer.render(this.scene, this.camera)

        this.effectComposer?.render()

        window.requestAnimationFrame(() => { this.tick() })

        // End tick
        this.invoke('startTick', elapsedTime, deltaTime)
    }

    setOrbitTarget(point: THREE.Vector3) {
        if (this.orbitControls) {
            this.orbitControls.target = point;
            // const objectPos = props.objectEvent.object.position.clone()
            // const center = baseData.rooms.workspace.focusPoint.clone()
            // const direction = center.clone().sub(objectPos).normalize()
            // const newPos = center.clone().add(direction.clone().multiplyScalar(0.2))
            // handler.gsap.killTweensOf(handler.camera.position)
            // handler.gsap.to(handler.camera.position, {
            //     x: newPos.x,
            //     y: newPos.y,
            //     z: newPos.z,
            //     duration: 0.5,
            //     onUpdate: () => {

            //     }
            // })
        }
    }

    invoke<T extends keyof EventInvoke>(type: T, ...args: EventInvoke[T]) {
        this.eventHandler.emitter.emit(type as string, ...args)
    }

    subscribe<T extends keyof EventParams>(type: T, action: EventParams[T]) {
        this.eventHandler.emitter.on(type as string, action)

        this.onDispose(() => {
            this.eventHandler.emitter.off(type as string, action)
        })
    }

    unsubscribe<T extends keyof EventParams>(type: T, action: EventParams[T]) {
        this.eventHandler.emitter.off(type as string, action)
    }
}

interface SceneObjectParams {
    canvas: HTMLCanvasElement
    sizes?: ScreenSize
    scene?: THREE.Scene
    renderer?: THREE.Renderer
    camera?: THREE.Camera
    antialias?: boolean
    enableGUI?: boolean
    enableStats?: boolean
    enableOrbitControls?: boolean
    enableEffectComposer?: boolean
    enableFullscreen?: boolean
    enableResponsive?: boolean
    enableRaycaster?: boolean
}

interface Size {
    x: number
    y: number
}

interface ScreenSize {
    width: number
    height: number
}