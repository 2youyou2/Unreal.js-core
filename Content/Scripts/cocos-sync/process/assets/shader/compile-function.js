"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replaces = [
    ['CalcPixelMaterialInputs', 'surf'],
    [/MaterialFloat\(([^\)]*)\)/g, '$1'],
    // [/Texture2DSampleBias\((.*),(.*),(.*),(.*)\)/g, 'fragTextureLod($1,$3,$4)'],
    [/Texture2DSampleBias\((.*),(.*),(.*),([^\)]*\))/g, 'texture($1,$3)'],
    [/View\.MaterialTextureMipBias/g, '0.'],
    [/\bView\.GameTime\b/g, 'cc_time.x'],
];
replaces.forEach(r => {
    if (typeof r[0] === 'string') {
        r[0] = new RegExp(`\\b${r[0]}\\b`, 'g');
    }
});
function compileFunction(asset, code) {
    let lines = code.surfaceLines;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        for (let j = 0; j < replaces.length; j++) {
            line = line.replace(replaces[j][0], replaces[j][1]);
        }
        lines[i] = line;
    }
}
exports.compileFunction = compileFunction;
