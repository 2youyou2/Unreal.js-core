"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replaces = [
    // ['float2', 'vec2'],
    // ['float3', 'vec3'],
    // ['float4', 'vec4'],
    // ['lerp', 'mix'],
    // ['MaterialFloat', 'float'],
    // ['MaterialFloat2', 'vec2'],
    // ['MaterialFloat3', 'vec3'],
    // ['MaterialFloat4', 'vec4'],
    ['in out', 'inout'],
    [/([0-9\.]+)f/g, '$1'],
    [/\(MaterialFloat3x3\)/g, ''],
    [/(\.\w)(\.\w)/g, '$1'],
];
replaces.forEach(r => {
    if (typeof r[0] === 'string') {
        r[0] = new RegExp(`\\b${r[0]}\\b`, 'g');
    }
});
function compileGlsl(code) {
    let lines = code.split('\n');
    let generatedLines = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.startsWith('#line ')) {
            continue;
        }
        for (let j = 0; j < replaces.length; j++) {
            line = line.replace(replaces[j][0], replaces[j][1]);
        }
        generatedLines.push(line);
    }
    return generatedLines.join('\n');
}
exports.compileGlsl = compileGlsl;
