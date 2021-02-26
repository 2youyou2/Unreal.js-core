"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SyncSceneData {
    constructor() {
        this.children = [];
        this.exportBasePath = '';
        this.projectPath = '';
        this.assetBasePath = '';
        this.forceSyncAsset = '';
        this.forceSyncAssetTypes = [];
        this.assets = [];
    }
}
exports.SyncSceneData = SyncSceneData;
