"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_1 = require("./asset");
var ImageDataFormat;
(function (ImageDataFormat) {
    ImageDataFormat[ImageDataFormat["RGBA"] = 0] = "RGBA";
    ImageDataFormat[ImageDataFormat["RGBE"] = 1] = "RGBE";
})(ImageDataFormat = exports.ImageDataFormat || (exports.ImageDataFormat = {}));
var TextureType;
(function (TextureType) {
    TextureType[TextureType["Texture"] = 0] = "Texture";
    TextureType[TextureType["Cube"] = 1] = "Cube";
})(TextureType = exports.TextureType || (exports.TextureType = {}));
class SyncTextureMipmapDetail {
}
exports.SyncTextureMipmapDetail = SyncTextureMipmapDetail;
class SyncTextureDataDetail {
    constructor() {
        this.mipmaps = [];
    }
}
exports.SyncTextureDataDetail = SyncTextureDataDetail;
class SyncTextureData extends asset_1.SyncAssetData {
    constructor() {
        super(...arguments);
        this.name = 'cc.Texture';
    }
}
exports.SyncTextureData = SyncTextureData;
