"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_1 = require("./asset");
var ShaderType;
(function (ShaderType) {
    ShaderType[ShaderType["Standard"] = 0] = "Standard";
    ShaderType[ShaderType["ShaderGraph"] = 1] = "ShaderGraph";
    ShaderType[ShaderType["Source"] = 2] = "Source";
})(ShaderType = exports.ShaderType || (exports.ShaderType = {}));
class SyncShaderData extends asset_1.SyncAssetData {
    constructor() {
        super(...arguments);
        this.name = 'cc.Shader';
        this.shaderType = ShaderType.Source;
        this.source = '';
    }
}
exports.SyncShaderData = SyncShaderData;
