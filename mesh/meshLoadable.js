"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
const loadingHandler_1 = __importDefault(require("../handlers/loadingHandler"));
class MeshLoadable extends three_1.Mesh {
    constructor(geometry, material, loadingHandler) {
        super(geometry, material);
        this.loadingHandler = loadingHandler !== null && loadingHandler !== void 0 ? loadingHandler : new loadingHandler_1.default();
    }
    get loadingManager() {
        return this.loadingHandler.manager;
    }
}
exports.default = MeshLoadable;
