"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("process/register");
const asset_1 = require("./asset");
const material_1 = require("datas/asset/material");
const shader_1 = require("./shader");
const texture_1 = require("./texture");
class SyncMaterial extends asset_1.SyncAsset {
    static async doSync(asset) {
        let data = new material_1.SyncMaterialData();
        if (asset instanceof Material) {
            let shaderData = await shader_1.SyncShader.sync(asset);
            data.shaderUuid = shaderData && shaderData.uuid;
        }
        if (asset instanceof Material) {
            let textureNames = MaterialGraphHelper.GetUsedTextureNames(asset);
            for (let i = 0; i < textureNames.length; i++) {
                let name = textureNames[i];
                // console.warn('UsedTexture : ' + name);
                let prop = new material_1.SyncMaterialPropertyData;
                prop.type = material_1.SyncMaterialPropertyType.Texture;
                prop.name = `Material_Texture2D_${i}`;
                let textures = asset.CachedExpressionData.ReferencedTextures;
                let texture = textures.find(t => t.GetName() === name);
                let texData = await texture_1.SyncTexture.sync(texture);
                prop.value = texData && texData.uuid;
                data.properties.push(prop);
            }
        }
        return data;
    }
}
exports.SyncMaterial = SyncMaterial;
register_1.register(SyncMaterial, MaterialInterface);
register_1.register(SyncMaterial, Material);
