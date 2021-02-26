"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_1 = require("datas/asset/asset");
const shader_1 = require("./shader");
var SyncMaterialPropertyType;
(function (SyncMaterialPropertyType) {
    //
    // Summary:
    //     The property holds a Vector4 value representing a color.
    SyncMaterialPropertyType[SyncMaterialPropertyType["Color"] = 0] = "Color";
    //
    // Summary:
    //     The property holds a Vector4 value.
    SyncMaterialPropertyType[SyncMaterialPropertyType["Vector"] = 1] = "Vector";
    //
    // Summary:
    //     The property holds a floating number value.
    SyncMaterialPropertyType[SyncMaterialPropertyType["Float"] = 2] = "Float";
    //
    // Summary:
    //     The property holds a floating number value in a certain range.
    SyncMaterialPropertyType[SyncMaterialPropertyType["Range"] = 3] = "Range";
    //
    // Summary:
    //     The property holds a Texture object.
    SyncMaterialPropertyType[SyncMaterialPropertyType["Texture"] = 4] = "Texture";
})(SyncMaterialPropertyType = exports.SyncMaterialPropertyType || (exports.SyncMaterialPropertyType = {}));
class SyncMaterialPropertyData {
}
exports.SyncMaterialPropertyData = SyncMaterialPropertyData;
class SyncPassStateData {
}
exports.SyncPassStateData = SyncPassStateData;
class SyncMaterialData extends asset_1.SyncAssetData {
    constructor() {
        super(...arguments);
        this.name = 'cc.Material';
        this.shaderType = shader_1.ShaderType.Source;
        this.properties = [];
        this.defines = [];
    }
}
exports.SyncMaterialData = SyncMaterialData;
