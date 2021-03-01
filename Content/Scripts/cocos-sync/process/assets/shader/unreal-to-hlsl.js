"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replaces = [
    ['in out', 'inout'],
    ['MaterialFloat', 'float'],
    ['MaterialFloat2', 'float2'],
    ['MaterialFloat3', 'float3'],
    ['MaterialFloat4', 'float4'],
    ['MaterialFloat3x3', 'float3x3'],
    ['MaterialFloat4x4', 'float4x4'],
    ['Texture2D', 'sampler2D'],
    ['TextureCube', 'samplerCUBE'],
    ['SamplerState', 'int'],
    [/\bMaterial\./g, 'Material_'],
    [/\bView\./g, 'View_'],
    [/\bResolvedViewStruct\./g, 'ResolvedViewStruct_'],
    [/\bPrimitiveStruct\./g, 'PrimitiveStruct_'],
];
replaces.forEach(r => {
    if (typeof r[0] === 'string') {
        r[0] = new RegExp(`\\b${r[0]}\\b`, 'g');
    }
});
function unrealToHlsl(code) {
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
exports.unrealToHlsl = unrealToHlsl;
