"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("process/register");
const actor_1 = require("./actor");
class SyncStaticMeshActor extends actor_1.SyncActor {
    static isVisible(actor) {
        return actor.StaticMeshComponent.IsVisible();
    }
    static getComponents(actor) {
        return [actor.StaticMeshComponent];
    }
}
exports.SyncStaticMeshActor = SyncStaticMeshActor;
register_1.register(SyncStaticMeshActor, StaticMeshActor);
