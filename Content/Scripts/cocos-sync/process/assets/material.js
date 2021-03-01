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
        else if (asset instanceof MaterialInstance) {
            let shaderData = await shader_1.SyncShader.sync(asset.GetBaseMaterial());
            data.shaderUuid = shaderData && shaderData.uuid;
        }
        // console.warn('material: ' + asset);
        if (asset instanceof Material || asset instanceof MaterialInstance) {
            let material = null;
            let textureInfos = {};
            if (asset instanceof Material) {
                material = asset;
            }
            else if (asset instanceof MaterialInstanceConstant) {
                material = asset.GetBaseMaterial();
            }
            let textureNames = MaterialGraphHelper.GetUsedTextureNames(material);
            textureNames.forEach((name, index) => {
                let expression = material.Expressions.find(e => {
                    if (e instanceof MaterialExpressionTextureBase) {
                        if (e.Texture && (e.Texture.GetName() === name)) {
                            return e;
                        }
                    }
                });
                if (!expression) {
                    console.warn('Can not find expression for texture name : ' + name);
                    return;
                }
                if (expression instanceof MaterialExpressionTextureSampleParameter && asset instanceof MaterialInstanceConstant) {
                    textureInfos[name] = {
                        texture: asset.GetMaterialInstanceTextureParameterValue(expression.ParameterName),
                        index,
                        name: `Material_Texture2D_${index}` //expression.ParameterName
                    };
                }
                else {
                    textureInfos[name] = {
                        texture: expression.Texture,
                        index,
                        name: `Material_Texture2D_${index}`
                    };
                }
            });
            for (let name in textureInfos) {
                // console.warn('Texture Property : ' + name);
                let textureInfo = textureInfos[name];
                let prop = new material_1.SyncMaterialPropertyData;
                prop.type = material_1.SyncMaterialPropertyType.Texture;
                prop.name = textureInfo.name;
                let texData = await texture_1.SyncTexture.sync(textureInfo.texture);
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
register_1.register(SyncMaterial, MaterialInstance);
register_1.register(SyncMaterial, MaterialInstanceConstant);
