"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PixelMaterialInputsReplace = {
    'EmissiveColor': 'emissive',
    'Opacity': 'albedo.a',
    'BaseColor': 'albedo.rgb',
    'Metallic': 'metallic',
    'Roughness': 'roughness',
    'AmbientOcclusion': 'occlusion',
    'Specular': 'specular',
    'Normal': 'normal',
};
const replaces = [
    ['FPixelMaterialInputs', 'StandardSurface'],
    ['PixelMaterialInputs', 'materialSurface'],
    [/Parameters.TexCoords\[([0-9]*)\]/g, 'Parameters.TexCoords_$1'],
    [/(.*materialSurface.albedo.rgb *= *)(.*);/g, '$1vec3($2);'],
];
replaces.forEach(r => {
    if (typeof r[0] === 'string') {
        r[0] = new RegExp(`\\b${r[0]}\\b`, 'g');
    }
});
const ignores = [
    'Parameters.TwoSidedSign'
];
function compileInputs(code) {
    // 
    let generatedLines = [];
    let lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let newLine = line;
        if (newLine.indexOf('PixelMaterialInputs.') !== -1) {
            for (let name in PixelMaterialInputsReplace) {
                newLine = newLine.replace(new RegExp(`\\bPixelMaterialInputs.${name}\\b`, 'g'), `materialSurface.${PixelMaterialInputsReplace[name]}`);
            }
            if (newLine === line) {
                continue;
            }
        }
        for (let j = 0; j < replaces.length; j++) {
            newLine = newLine.replace(replaces[j][0], replaces[j][1]);
        }
        if (ignores.find(i => {
            return line.indexOf(i) !== -1;
        })) {
            continue;
        }
        generatedLines.push(newLine);
    }
    return generatedLines.join('\n');
}
exports.compileInputs = compileInputs;
