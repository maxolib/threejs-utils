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
const events_1 = __importDefault(require("events"));
class LoadingHandler {
    constructor() {
        this.event = new events_1.default();
        this.manager = new THREE.LoadingManager();
        this.manager.onLoad = () => {
            this.event.emit("onLoad");
        };
        this.manager.onStart = () => {
            this.event.emit("onStart");
        };
        this.manager.onProgress = (url, loaded, total) => {
            this.event.emit("onProgress", url, loaded, total);
        };
        this.manager.onError = () => {
            this.event.emit("onError");
        };
    }
    onLoadedAddListener(action) {
        this.event.on("onLoad", action);
    }
    onLoadedRemoveListener(action) {
        this.event.removeListener("onLoad", action);
    }
    onStartAddListener(action) {
        this.event.on("onStart", action);
    }
    onStartRemoveListener(action) {
        this.event.removeListener("onStart", action);
    }
    onProgressAddListener(action) {
        this.event.on("onProgress", action);
    }
    onProgressRemoveListener(action) {
        this.event.removeListener("onProgress", action);
    }
    onErrorAddListener(action) {
        this.event.on("onError", action);
    }
    onErrorRemoveListener(action) {
        this.event.removeListener("onError", action);
    }
}
exports.default = LoadingHandler;
