"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
const math = require("../../datas/builtin/math");
const node_1 = require("../../datas/node");
const register_1 = require("process/register");
class SyncActor extends base_1.SyncBase {
    static isVisible(actor) {
        return true;
    }
    static async sync(actor) {
        if (!this.isVisible(actor)) {
            return null;
        }
        let nodeData = new node_1.SyncNodeData();
        nodeData.uuid = actor.GetUniqueID().toString();
        nodeData.name = actor.GetDisplayName();
        let Trans = actor.RootComponent.GetRelativeTransform();
        nodeData.position = new math.Vec3(Trans.Translation.X / 100, Trans.Translation.Z / 100, Trans.Translation.Y / 100);
        nodeData.scale = new math.Vec3(Trans.Scale3D.X, Trans.Scale3D.Z, Trans.Scale3D.Y);
        // let euler = new Vector;
        // euler.Vector_Set(90, 0, 0);
        // let fixed = new Quat();
        // fixed.Quat_SetFromEuler(euler);
        let rotation = Trans.Rotation; //.clone().Multiply_QuatQuat(fixed);
        nodeData.rotation = new math.Quat(-rotation.X, -rotation.Z, -rotation.Y, rotation.W);
        // nodeData.rotation = new math.Quat(rotation.X, rotation.Y, rotation.Z, rotation.W);
        let components = this.getComponents(actor);
        for (let i = 0; i < components.length; i++) {
            let data = await syncProcess(components[i]);
            // console.warn('SyncActor components: ' + data);
            if (data) {
                nodeData.components.push(data);
            }
        }
        return nodeData;
    }
    static getComponents(actor) {
        return [];
    }
}
exports.SyncActor = SyncActor;
register_1.register(SyncActor, Actor);
