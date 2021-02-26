"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("utils/node");
let test = /#include *<(\..*)>/;
function compileChunk(basePath, chunkPaths) {
    if (!chunkPaths) {
        chunkPaths = [];
    }
    if (!node_1.fs.existsSync(basePath)) {
        return '';
    }
    let code = node_1.fs.readFileSync(basePath, 'utf8');
    let lines = code.split('\n');
    let generatedLines = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let result = test.exec(line);
        let chunkPath = result && result[1];
        if (chunkPath) {
            if (!chunkPath.endsWith('.chunk')) {
                chunkPath += '.chunk';
            }
            let absChunkPath = node_1.path.join(node_1.path.dirname(basePath), chunkPath);
            // console.warn('chunkPath : ' + chunkPath)
            // console.warn('absChunkPath : ' + absChunkPath)
            if (chunkPaths.indexOf(absChunkPath) !== -1) {
                continue;
            }
            chunkPaths.push(absChunkPath);
            line = compileChunk(absChunkPath, chunkPaths);
        }
        generatedLines.push(line);
    }
    return generatedLines.join('\n');
}
exports.compileChunk = compileChunk;
