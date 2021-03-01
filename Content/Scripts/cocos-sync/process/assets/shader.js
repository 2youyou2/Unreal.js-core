"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shader_1 = require("datas/asset/shader");
const asset_1 = require("./asset");
const compile_1 = require("./shader/compile");
class SyncShader extends asset_1.SyncAsset {
    static getUuid(asset) {
        return asset.GetPathName() + '/shader';
    }
    static async doSync(asset) {
        let code = await compile_1.compile(asset);
        let data = new shader_1.SyncShaderData();
        data.shaderType = shader_1.ShaderType.Source;
        data.source = code.final;
        return data;
    }
}
exports.SyncShader = SyncShader;
