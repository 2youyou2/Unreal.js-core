"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_1 = require("./asset");
class SyncSubMeshData {
    constructor() {
        this.vertices = [];
        this.uv = [];
        this.uv1 = [];
        this.normals = [];
        this.colors = [];
        this.boneWeights = [];
        this.tangents = [];
        this.indices = [];
    }
}
exports.SyncSubMeshData = SyncSubMeshData;
class SyncMeshData extends asset_1.SyncAssetData {
    constructor() {
        super(...arguments);
        this.name = 'cc.Mesh';
    }
}
exports.SyncMeshData = SyncMeshData;
class SyncMeshDataDetail {
    constructor() {
        this.subMeshes = [];
    }
}
exports.SyncMeshDataDetail = SyncMeshDataDetail;
