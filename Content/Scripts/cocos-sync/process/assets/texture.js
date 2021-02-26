"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const texture_1 = require("datas/asset/texture");
const register_1 = require("process/register");
const node_1 = require("utils/node");
const asset_1 = require("./asset");
class SyncTexture extends asset_1.SyncAsset {
    static async doSync(asset) {
        let data = new texture_1.SyncTextureData();
        if (asset instanceof Texture2D) {
            data.type = texture_1.TextureType.Texture;
        }
        else if (asset instanceof TextureCube) {
            data.type = texture_1.TextureType.Cube;
        }
        // data.mipmapCount = asset.Source.NumMips;
        data.mipmapCount = 1;
        return data;
    }
    static getDetail(asset, data) {
        let detail = new texture_1.SyncTextureDataDetail;
        detail.format = texture_1.ImageDataFormat.RGBA;
        let mipmap = new texture_1.SyncTextureMipmapDetail;
        mipmap.width = asset.Source.SizeX;
        mipmap.height = asset.Source.SizeY;
        // mipmap.datas = MaterialGraphHelper.GetTextureMipData(asset, 0);
        mipmap.dataPath = node_1.path.join(node_1.path.tempPath, 'mipmap-detail.png');
        MaterialGraphHelper.SaveTextureMipData(asset, mipmap.dataPath, 0);
        detail.mipmaps.push(mipmap);
        return detail;
    }
}
exports.SyncTexture = SyncTexture;
register_1.register(SyncTexture, Texture);
register_1.register(SyncTexture, Texture2D);
