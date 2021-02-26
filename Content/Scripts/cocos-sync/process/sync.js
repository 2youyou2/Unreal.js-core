"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./actors");
require("./components");
require("./assets");
const register_1 = require("./register");
async function sync(obj) {
    if (!obj) {
        console.error('syncProcess obj is ' + obj);
        return null;
    }
    // console.warn(`sync ${obj.constructor}`);
    let process = register_1.classes.get(obj.constructor);
    if (process) {
        // console.warn(`process ${obj.constructor}`);
        let result;
        try {
            result = await process.sync(obj);
        }
        catch (err) {
            console.error(err);
        }
        return result;
    }
    else {
        console.warn('Can not find process for : ' + obj.constructor);
    }
    return null;
}
exports.default = sync;
globalThis.syncProcess = sync;
