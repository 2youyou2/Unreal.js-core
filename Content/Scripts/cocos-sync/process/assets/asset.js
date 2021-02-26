"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("process/base");
const all_assets_1 = require("./all-assets");
// @ts-ignore
var path = require('path');
class SyncAsset extends base_1.SyncBase {
    static getPath(asset) {
        return asset.GetPathName();
    }
    static getUuid(asset) {
        return this.getPath(asset);
    }
    static calcPath(asset, assetData) {
        let relPath = this.getPath(asset);
        // console.warn('uuid: ' + relPath);
        let absPath = '';
        if (relPath.startsWith('/Game/')) {
            relPath = relPath.replace('/Game/', '');
        }
        else if (relPath.startsWith('/Engine/')) {
            relPath = relPath.replace('/Engine/', '');
            absPath = path.join(path.engineContentPath, relPath);
        }
        relPath = relPath.substr(0, relPath.length - path.extname(relPath).length);
        relPath += '.uasset';
        assetData.path = relPath;
        assetData.srcPath = absPath;
    }
    static async sync(asset) {
        let uuid = this.getUuid(asset);
        let pair = all_assets_1.default.get(uuid);
        if (pair) {
            return pair.data;
        }
        let assetData = await this.doSync(asset);
        if (assetData) {
            assetData.uuid = uuid;
            this.calcPath(asset, assetData);
            // console.warn('assetData.srcPath : ' + assetData.srcPath);
            all_assets_1.default.add(uuid, {
                asset: asset,
                data: assetData
            });
        }
        return assetData;
    }
    static async doSync(asset) {
        return null;
    }
    static getDetail(asset, data) {
        return null;
    }
}
exports.SyncAsset = SyncAsset;
