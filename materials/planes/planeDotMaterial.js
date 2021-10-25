"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = __importStar(require("three"));
const vertex_glsl_1 = __importDefault(require("./vertex.glsl"));
const fragment_glsl_1 = __importDefault(require("./fragment.glsl"));
class PlaneDotMaterial extends THREE.ShaderMaterial {
    constructor(params) {
        var _a, _b;
        super(params);
        this.uniforms.segments = { value: (_a = params === null || params === void 0 ? void 0 : params.segments) !== null && _a !== void 0 ? _a : 10 };
        this.uniforms.padding = { value: (_b = params === null || params === void 0 ? void 0 : params.padding) !== null && _b !== void 0 ? _b : .4 };
        this.uniforms.mainColor = { value: (params === null || params === void 0 ? void 0 : params.mainColor) ? new THREE.Color(params.mainColor) : new THREE.Color(0xffffff) };
        this.uniforms.secondColor = { value: (params === null || params === void 0 ? void 0 : params.secondColor) ? new THREE.Color(params.secondColor) : new THREE.Color(0x000000) };
        console.log(this.uniforms);
        this.onBeforeCompile = shader => {
            shader.vertexShader = vertex_glsl_1.default;
            shader.fragmentShader = fragment_glsl_1.default;
        };
    }
}
exports.default = PlaneDotMaterial;
