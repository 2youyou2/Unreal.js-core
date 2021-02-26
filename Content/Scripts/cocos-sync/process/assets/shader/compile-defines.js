"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commentTest = /^[ 	]*\/\//;
const ifTest = /^[ 	]*#if/;
const endifTest = /^[ 	]*#endif/;
const ignores = [
    'GBUFFER_HAS_TANGENT',
    'MATERIAL_TANGENTSPACENORMAL',
    'PARTICLE_SPRITE_FACTORY'
];
const ignoreRegs = ignores.map(i => {
    return new RegExp(`#if +!*${i}`);
});
function compileDefines(code) {
    // console.warn('compileDefines ------------')
    let lines = code.split('\n');
    let defineChunks = [];
    let defineStack = [];
    let ignoreChunks = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (commentTest.exec(line)) {
            // console.warn(line)
            continue;
        }
        if (ifTest.exec(line)) {
            // console.warn(line)
            let chunk = [i];
            defineChunks.push(chunk);
            defineStack.push(chunk);
            let ignore = false;
            ignoreRegs.forEach(i => {
                if (i.exec(line)) {
                    ignore = true;
                }
            });
            if (ignore) {
                ignoreChunks.push(chunk);
            }
        }
        if (endifTest.exec(line)) {
            // console.warn(line)
            let chunk = defineStack.pop();
            chunk.push(i);
        }
    }
    let genreatedLines = [];
    for (let i = 0; i < lines.length; i++) {
        let ignore = false;
        for (let j = 0; j < ignoreChunks.length; j++) {
            let chunk = ignoreChunks[j];
            // console.warn(i + ' : ' + chunk[0] + ' : ' + chunk[1])
            if (i >= chunk[0] && i <= chunk[1]) {
                ignore = true;
                continue;
            }
        }
        if (ignore) {
            continue;
        }
        genreatedLines.push(lines[i]);
    }
    return genreatedLines.join('\n');
}
exports.compileDefines = compileDefines;
