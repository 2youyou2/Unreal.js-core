"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("process/base");
const register_1 = require("process/register");
class SyncComponent extends base_1.SyncBase {
    static async sync(comp) {
        return null;
    }
}
exports.SyncComponent = SyncComponent;
register_1.register(SyncComponent, ActorComponent);
