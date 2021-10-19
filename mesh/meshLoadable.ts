import * as THREE from "three"
import { Mesh } from "three";
import LoadingHandler from "../handlers/loadingHandler";

export default class MeshLoadable extends Mesh{
    loadingHandler: LoadingHandler
    
    public get loadingManager(): THREE.LoadingManager{
        return this.loadingHandler.manager
    }

    constructor(geometry?: THREE.BufferGeometry | undefined, material?: THREE.Material | THREE.Material[] | undefined){
        super(geometry, material)
        this.loadingHandler = new LoadingHandler()
    }
}