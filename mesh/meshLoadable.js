"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
const loadingHandler_1 = __importDefault(require("../handlers/loadingHandler"));
class MeshLoadable extends three_1.Mesh {
    constructor(geometry, material) {
        super(geometry, material);
        this.loadingManager = new loadingHandler_1.default();
    }
}
exports.default = MeshLoadable;
