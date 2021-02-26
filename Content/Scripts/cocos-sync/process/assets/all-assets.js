"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("process/register");
class AllAssets {
    static get(uuid) {
        return this.assetsMap.get(uuid);
    }
    static clear() {
        this.assetsMap.clear();
        this.assets.length = 0;
    }
    static add(uuid, pair) {
        this.assetsMap.set(uuid, pair);
        this.assets.push(pair.data);
    }
    static getDetail(uuid) {
        let pair = this.assetsMap.get(uuid);
        let asset = pair.asset;
        if (!asset) {
            console.warn(`getDetail failed with [${uuid}]`);
            return;
        }
        let process = register_1.classes.get(asset.constructor);
        if (!process) {
            console.warn('Get detail process failed : ' + asset.constructor);
            return null;
        }
        let detail = process.getDetail && process.getDetail(pair.asset, pair.data);
        return detail;
    }
}
AllAssets.assetsMap = new Map;
AllAssets.assets = [];
exports.default = AllAssets;
