import * as THREE from "three"
import { Mesh } from "three";
import LoadingHandler from "../handlers/loadingHandler";

export default class MeshLoadable extends Mesh{
    loadingManager: LoadingHandler
    constructor(geometry?: THREE.BufferGeometry | undefined, material?: THREE.Material | THREE.Material[] | undefined){
        super(geometry, material)
        this.loadingManager = new LoadingHandler()
    }
}