"use strict";
/// <reference path="../CppPlugin/UnrealJS/Content/Scripts/typings/ue.d.ts">/>
Object.defineProperty(exports, "__esModule", { value: true });
const all_assets_1 = require("process/assets/all-assets");
const options_1 = require("process/options");
const node_1 = require("utils/node");
const sync_1 = require("./process/sync");
const net = require("./utils/net");
const scene_1 = require("./datas/scene");
const shader_1 = require("datas/asset/shader");
const material_1 = require("datas/asset/material");
let sceneData = null;
let startTime = 0;
async function begin() {
    console.log('begin export to cocos');
    console.log('--------------------');
    startTime = Date.now();
    all_assets_1.default.clear();
    sceneData = new scene_1.SyncSceneData();
    options_1.default.reset();
    // world.ExecuteConsoleCommand('r.CompileShadersForDevelopment = 0', null);
    // if (!KismetSystemLibrary.GetConsoleVariableIntValue('r.ShaderDevelopmentMode') ||
    //     !KismetSystemLibrary.GetConsoleVariableIntValue('r.DumpShaderDebugInfo')) {
    // world.ExecuteConsoleCommand('r.ShaderDevelopmentMode = 1', null);
    // world.ExecuteConsoleCommand('r.DumpShaderDebugInfo = 1', null);
    // options.recompileShader = true;
    // }
}
function end() {
    console.warn('CocosSync : get all assets');
    console.warn('AllAssets.assets length : ' + all_assets_1.default.assets.length);
    sceneData.assetBasePath = node_1.path.contentPath;
    sceneData.projectPath = node_1.path.projectPath;
    sceneData.assets = all_assets_1.default.assets;
    sceneData.exportBasePath = 'Exported-unreal';
    sceneData.forceSyncAssetTypes.push(new shader_1.SyncShaderData().name);
    sceneData.forceSyncAssetTypes.push(new material_1.SyncMaterialData().name);
    // sceneData.forceSyncAssetTypes.push(new SyncTextureData().name);
    net.sendObj({
        msg: 'sync-datas',
        data: sceneData
    });
    sceneData = null;
    // world.ExecuteConsoleCommand('r.CompileShadersForDevelopment = 1', null);
    console.log(`End exporting to cocos : ${(Date.now() - startTime) / 1000}s`);
}
async function exportWorld() {
    console.warn('exportWorld');
    await begin();
    let engine = Root.GetEngine();
    let actors = engine.GetEditorWorld().GetAllActorsOfClass(Actor).OutActors;
    for (let i = 0; i < actors.length; i++) {
        let actor = actors[i];
        if (actor.bHiddenEd || actor.bHidden || actor.bHiddenEdLevel || actor.bHiddenEdLayer || actor.IsTemporarilyHiddenInEditor(true)) {
            continue;
        }
        let nodeData = await sync_1.default(actor);
        if (nodeData) {
            sceneData.children.push(nodeData);
        }
    }
    end();
}
async function exportSelectedActors() {
    console.warn('exportSelectedActors');
    await begin();
    let engine = Root.GetEngine();
    let actors = engine.GetSelectedSet(Actor).GetSelectedObjects().Out.map(o => o);
    for (let i = 0; i < actors.length; i++) {
        let actor = actors[i];
        if (actor.bHiddenEd || actor.bHidden || actor.bHiddenEdLevel || actor.bHiddenEdLayer || actor.IsTemporarilyHiddenInEditor(true)) {
            continue;
        }
        let nodeData = await sync_1.default(actor);
        if (nodeData) {
            sceneData.children.push(nodeData);
        }
    }
    end();
}
async function exportSelectedAssets() {
    console.warn('exportSelectedAssets');
    await begin();
    let engine = Root.GetEngine();
    let textures = engine.GetSelectedSet(Texture).GetSelectedObjects().Out.map(o => o);
    for (let i = 0; i < textures.length; i++) {
        let data = await sync_1.default(textures[i]);
        sceneData.assets.push(data);
    }
    end();
}
function createNetFunc(func) {
    net.callback({
        OnConnected() {
            console.log('connected to server 8878');
            try {
                func();
            }
            catch (err) {
                console.error(err);
            }
        },
        OnReceived(msgStr) {
            // console.warn(msgStr);
            let msg;
            if (typeof msgStr === 'string') {
                try {
                    msg = JSON.parse(msgStr);
                }
                catch (err) {
                    console.error(err);
                    return;
                }
            }
            if (msg.msg === 'get-asset-detail') {
                console.warn('get-asset-detail : ' + msg.uuid);
                let startTime = Date.now();
                let detail = all_assets_1.default.getDetail(msg.uuid);
                let getDetailTime = Date.now();
                console.warn(`get-asset-detail : getDetail: ${(getDetailTime - startTime) / 1000}s`);
                let tempDetailPath = node_1.path.join(node_1.path.tempPath, 'asset-detail.json');
                node_1.fs.writeFileSync(tempDetailPath, JSON.stringify(detail));
                let saveTime = Date.now();
                console.warn(`get-asset-detail : save file: ${(saveTime - getDetailTime) / 1000}s`);
                net.sendObj({
                    msg: 'get-asset-detail',
                    data: {
                        path: tempDetailPath,
                        uuid: msg.uuid
                    }
                });
                let sendTime = Date.now();
                console.warn(`get-asset-detail : send message: ${(sendTime - saveTime) / 1000}s`);
            }
        }
    });
    net.start();
}
function cocosSyncWorld() {
    createNetFunc(exportWorld);
}
exports.cocosSyncWorld = cocosSyncWorld;
function cocosSyncSelectedActors() {
    createNetFunc(exportSelectedActors);
}
exports.cocosSyncSelectedActors = cocosSyncSelectedActors;
function cocosSyncSelectedAssets() {
    createNetFunc(exportSelectedAssets);
}
exports.cocosSyncSelectedAssets = cocosSyncSelectedAssets;
function stopSync() {
    net.stop();
}
exports.stopSync = stopSync;
globalThis.stopSync = stopSync;
