"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// fs
// @ts-ignore
exports.fs = require('fs');
// @ts-ignore
exports.path = require('path');
exports.fs.writeFileSync = function (path, content) {
    // @ts-ignore
    Context.WriteStringToFile(path, content);
};
exports.fs.remove = async function (path) {
    let code = `
    var fse = require('fs-extra');
    fse.removeSync('${formatPath(path)}')
    `;
    await runNode(code);
};
// path
exports.path.contentPath = Context.GetDir('GameContent');
if (!exports.path.isAbsolute(exports.path.contentPath)) {
    exports.path.contentPath = exports.path.join(process.cwd(), exports.path.contentPath);
}
exports.path.projectPath = exports.path.join(exports.path.contentPath, '../');
exports.path.tempPath = exports.path.join(exports.path.projectPath, 'Temp/CocosSync');
exports.path.staticPath = exports.path.join(exports.path.projectPath, 'Plugins/cocos-sync-unreal/ts/static');
exports.path.engineContentPath = Context.GetDir('EngineContent');
if (!exports.path.isAbsolute(exports.path.engineContentPath)) {
    exports.path.engineContentPath = exports.path.join(process.cwd(), exports.path.engineContentPath);
}
exports.path.enginePath = exports.path.join(exports.path.engineContentPath, '../');
// utils
function runProc(proc, resolve, reject) {
    if (proc) {
        let jsonStr = '';
        let kick = () => {
            // read from pipe!
            let res = proc.ReadFromPipe();
            // console.warn(res);
            if (res) {
                jsonStr += res;
            }
            // if process is still running
            if (proc.IsRunning()) {
                process.nextTick(kick);
            }
            else {
                // console.warn('jsonStr : ' + jsonStr);
                let json = { result: null };
                try {
                    json = JSON.parse(jsonStr);
                }
                catch (err) {
                    reject(err);
                    return;
                }
                resolve(json.result);
            }
        };
        kick();
    }
    else {
        reject("Failed to create process");
        // console.warn("Failed to create process");
    }
}
async function runNode(code, cwd = '') {
    return new Promise((resolve, reject) => {
        let execPath = exports.path.join(exports.path.projectPath, 'Plugins/cocos-sync-unreal/ts', cwd);
        // console.warn('execPath : ' + execPath);
        code = `
        function _tempFunc_ () {
            ${code}
        }
        let result = _tempFunc_();
        console.log(JSON.stringify({result:result}))
        `;
        let proc = JavascriptProcess.Create('node', `-e "${code};"`, true, false, false, 0, execPath, true);
        runProc(proc, resolve, reject);
    });
}
exports.runNode = runNode;
async function runNodePath(scriptPath, cwd = '') {
    return new Promise((resolve, reject) => {
        let execPath = exports.path.join(exports.path.projectPath, 'Plugins/cocos-sync-unreal/ts', cwd);
        // console.warn('execPath : ' + execPath);
        let proc = JavascriptProcess.Create('node', `${scriptPath}`, true, false, false, 0, execPath, true);
        runProc(proc, resolve, reject);
    });
}
exports.runNodePath = runNodePath;
function formatPath(p) {
    return p.replace(/\\/g, '/');
}
exports.formatPath = formatPath;
