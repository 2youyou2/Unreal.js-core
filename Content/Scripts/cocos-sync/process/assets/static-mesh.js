"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("process/register");
const asset_1 = require("./asset");
const mesh_1 = require("../../datas/asset/mesh");
const math_1 = require("datas/builtin/math");
class SyncStaticMesh extends asset_1.SyncAsset {
    static async doSync(asset) {
        let data = new mesh_1.SyncMeshData();
        data.meshName = asset.GetName();
        return data;
    }
    static getDetail(asset, data) {
        let detail = new mesh_1.SyncMeshDataDetail;
        let min = new math_1.Vec3(Infinity, Infinity, Infinity);
        let max = new math_1.Vec3(-Infinity, -Infinity, -Infinity);
        let numSections = asset.GetNumSections(0);
        if (!asset.bAllowCPUAccess) {
            asset.SetAllowCPUAccess(true);
        }
        for (let i = 0; i < numSections; i++) {
            let subMeshData = new mesh_1.SyncSubMeshData();
            let out = asset.GetSectionFromStaticMesh(0, 0);
            let vertices = out.Vertices;
            for (let i = 0; i < vertices.length; i++) {
                let x = vertices[i].X / 100;
                let y = vertices[i].Z / 100;
                let z = vertices[i].Y / 100;
                min.x = Math.min(min.x, x);
                min.y = Math.min(min.y, y);
                min.z = Math.min(min.z, z);
                max.x = Math.max(max.x, x);
                max.y = Math.max(max.y, y);
                max.z = Math.max(min.z, z);
                subMeshData.vertices.push(x, y, z);
            }
            let normals = out.Normals;
            for (let i = 0; i < normals.length; i++) {
                subMeshData.normals.push(normals[i].X, normals[i].Z, normals[i].Y);
            }
            let uvs = out.UVs;
            for (let i = 0; i < uvs.length; i++) {
                subMeshData.uv.push(uvs[i].X, uvs[i].Y);
            }
            let tangents = out.Tangents;
            for (let i = 0; i < tangents.length; i++) {
                subMeshData.tangents.push(tangents[i].TangentX.X, tangents[i].TangentX.Z, tangents[i].TangentX.Y);
            }
            subMeshData.indices = out.Triangles;
            detail.subMeshes.push(subMeshData);
        }
        // asset.SourceModels.forEach((model, index) => {
        //     let rawMesh = asset.LoadRawMesh(index).OutMesh;
        //     globalThis.rawMesh = rawMesh;
        //     let subMeshData = new SyncSubMeshData();
        //     let VertexPositions = rawMesh.VertexPositions;
        //     for (let i = 0; i < VertexPositions.length; i++) {
        //         let x = VertexPositions[i].X;
        //         let y = VertexPositions[i].Y;
        //         let z = VertexPositions[i].Z;
        //         min.x = Math.min(min.x, x);
        //         min.y = Math.min(min.y, y);
        //         min.z = Math.min(min.z, z);
        //         max.x = Math.max(max.x, x);
        //         max.y = Math.max(max.y, y);
        //         max.z = Math.max(min.z, z);
        //         subMeshData.vertices.push(x, y, z);
        //     }
        //     let indices = rawMesh.WedgeIndices;
        //     globalThis.testIndices = indices;
        //     console.log('indices[0] : ' + indices[0])
        //     for (let i = 0; i < indices.length; i++) {
        //         subMeshData.indices.push(indices[i]);
        //     }
        //     detail.subMeshes.push(subMeshData);
        // })
        detail.min = min;
        detail.max = max;
        return detail;
    }
}
exports.SyncStaticMesh = SyncStaticMesh;
register_1.register(SyncStaticMesh, StaticMesh);
