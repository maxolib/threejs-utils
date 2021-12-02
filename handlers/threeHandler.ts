import * as THREE from 'three'
import events from 'events'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import {gsap} from "gsap"

enum HandlerEvent{
    AwakeTick = "AwakeTick",
    StareTick = "StareTick",
    EndTick = "EndTick",
    EnterObject = "EnterObject",
    LeaveObject = "LeaveObject",
}

export default class ThreeHandler {
    // Graphics
    canvas: HTMLCanvasElement
    renderer: THREE.Renderer
    camera: THREE.Camera
    scene: THREE.Scene
    orbitControls?: OrbitControls

    // Common
    params: SceneObjectParams
    sizes: ScreenSize
    mouse: THREE.Vector2
    gsap: GSAP
    raycaster?: THREE.Raycaster
    hits: THREE.Intersection<THREE.Object3D<THREE.Event>>[]
    currentHit?: THREE.Object3D

    // Debuging

    // Event handler
    emitter: events.EventEmitter;

    // Animation & Tick
    private clock: THREE.Clock;
    private prevElapsedTime: number;
    private elapsedTime: number;
    private deltaTime: number;

    // Post-Processing
    effectComposer: EffectComposer | null;

    constructor(params: SceneObjectParams) {
        this.emitter = new events.EventEmitter()
        this.canvas = params.canvas;
        this.scene = params.scene ?? new THREE.Scene()
        this.renderer = params.renderer ?? new THREE.WebGLRenderer({
            canvas: params.canvas,
            antialias: params.antialias
        })
        this.sizes = params.sizes ?? { width: window.innerWidth, height: window.innerHeight }
        this.mouse = new THREE.Vector2()
        this.camera = params.camera ?? new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
        this.orbitControls = params.enableOrbitControls ? new OrbitControls(this.camera, this.canvas as HTMLElement) : undefined
        this.effectComposer = params.enableEffectComposer && this.renderer instanceof THREE.WebGLRenderer ? new EffectComposer(this.renderer) : null
        this.effectComposer?.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.effectComposer?.setSize(this.sizes.width, this.sizes.height)
        this.gsap = gsap
        if(params.enableRaycaster)
            this.raycaster = new THREE.Raycaster()
        this.hits = []
        if (params.enableFullscreen && params.sizes == undefined)
            this.setFullScreen(params.enableResponsive)

        this.setMouse()

        this.clock = new THREE.Clock()
        this.prevElapsedTime = 0
        this.elapsedTime = 0
        this.deltaTime = 0

        // gsap.ticker.add(this.tick)

        this.params = params
        this.init()

        this.tick()
    }
    private init() {
        if (this.orbitControls) {
            this.onStartTick(() => { this.orbitControls?.update() })
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
    private setMouse() {
        window.addEventListener('mousemove', e => {
            this.mouse.set(e.clientX, e.clientY)
        })
    }

    public updateSize(sizes?: ScreenSize) {
        // Update sizes
        if(sizes){
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

        if (this.emitter) {
            // Awake tick
            this.emitter.emit(HandlerEvent.AwakeTick)

            this.elapsedTime = this.clock.getElapsedTime()
            this.deltaTime = this.elapsedTime - this.prevElapsedTime
            this.prevElapsedTime = this.elapsedTime
            const elapsedTime = this.elapsedTime
            const deltaTime = this.deltaTime

            // Raycast
            if(this.raycaster){
                this.raycaster.setFromCamera(this.mouse, this.camera)
                this.hits = this.raycaster.intersectObjects( this.scene.children );
                if(this.hits.length > 0){
                    if(this.currentHit != this.hits[0].object){
                        this.emitter.emit(HandlerEvent.LeaveObject, this.currentHit)
                        this.currentHit = this.hits[0].object
                        this.emitter.emit(HandlerEvent.EnterObject, this.currentHit)
                    }
                }
                else if(this.currentHit){
                    this.emitter.emit(HandlerEvent.LeaveObject, this.currentHit)
                    this.currentHit = undefined
                }
            }

            // Start tick
            this.emitter.emit(HandlerEvent.StareTick, elapsedTime, deltaTime)

            this.renderer.render(this.scene, this.camera)

            this.effectComposer?.render()

            window.requestAnimationFrame(() => { this.tick() })


            // End tick
            this.emitter.emit(HandlerEvent.EndTick, elapsedTime, deltaTime)
        }
    }

    onAwakeTick(action: () => void) {
        this.emitter.on(HandlerEvent.AwakeTick, action)
    }

    // ...args:any[]
    onStartTick(action: (elaped: number, delta: number) => void) {
        this.emitter.on(HandlerEvent.StareTick, action)
    }
    
    onEndTick(action: (elaped: number, delta: number) => void) {
        this.emitter.on(HandlerEvent.EndTick, action)
    }

    onEnterObject(action: (object: THREE.Object3D) => void) {
        this.emitter.on(HandlerEvent.EnterObject, action)
    }

    onLeaveObject(action: (object: THREE.Object3D) => void) {
        this.emitter.on(HandlerEvent.EndTick, action)
    }

    setOrbitTarget(point: THREE.Vector3){
        if(this.orbitControls)
            this.orbitControls.target = point;
    }
    
    add(target: THREE.Object3D, parent?: THREE.Scene | THREE.Object3D){
        
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