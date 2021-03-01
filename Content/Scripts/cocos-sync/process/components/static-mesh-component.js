"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mesh_renderer_1 = require("datas/component/mesh-renderer");
const register_1 = require("process/register");
const component_1 = require("./component");
class SyncStaticMeshComponent extends component_1.SyncComponent {
    static async sync(comp) {
        if (!comp.StaticMesh) {
            return null;
        }
        let meshRendererData = new mesh_renderer_1.SyncMeshRendererData();
        let data = await syncProcess(comp.StaticMesh);
        meshRendererData.mesh = data && data.uuid;
        let materials = comp.GetMaterials();
        // let materials = comp.StaticMesh.StaticMaterials;
        // console.warn('materials.length : ' + materials.length)
        meshRendererData.materilas = [];
        for (let i = 0; i < materials.length; i++) {
            let data = await syncProcess(materials[i]);
            console.warn('material : ' + materials[i].GetName());
            if (data) {
                meshRendererData.materilas.push(data.uuid);
            }
        }
        return meshRendererData;
    }
}
exports.SyncStaticMeshComponent = SyncStaticMeshComponent;
register_1.register(SyncStaticMeshComponent, StaticMeshComponent);
