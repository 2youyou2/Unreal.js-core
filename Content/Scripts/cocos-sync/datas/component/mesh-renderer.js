"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
class SyncLightMapSetting {
}
exports.SyncLightMapSetting = SyncLightMapSetting;
class SyncMeshRendererProbe {
}
exports.SyncMeshRendererProbe = SyncMeshRendererProbe;
class SyncMeshRendererData extends component_1.SyncComponentData {
    constructor() {
        super(...arguments);
        this.name = 'cc.MeshRenderer';
        this.materilas = [];
        this.probes = [];
    }
}
exports.SyncMeshRendererData = SyncMeshRendererData;
