"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("utils/node");
const compile_chunk_1 = require("./compile-chunk");
const unreal_to_hlsl_1 = require("./unreal-to-hlsl");
async function hlslToGlsl(hlsl) {
    let convert = compile_chunk_1.compileChunk(node_1.path.join(node_1.path.staticPath, 'shader/unreal/convert.hlsl'));
    convert = convert.replace('{{CalcPixelMaterialInputs}}', hlsl);
    convert = unreal_to_hlsl_1.unrealToHlsl(convert);
    convert = compileDefines(convert);
    convert = convert.replace(/Parameters\.TexCoords\[(\w)\]/g, 'Parameters.TexCoords_$1');
    fs.writeFileSync(node_1.path.join(node_1.path.tempPath, `shaders/${asset.GetPathName()}_convert.hlsl`), convert);
    let hlslparser = `
    var hlslParser = require('./hlslparser');

    var parseHLSL = hlslParser.cwrap('parseHLSL', 'number', [
      'string',
      'string',
      'string',
    ]);
    
    var source = 
    \`
    ${convert}
    \`

    var entryName = 'PixelShaderFunction';
    
    var shaderType = 'fs';
    
    var result = ''
    global.HLSLParser = {
      onError: function (reason) {
        console.error(reason);
      },
      onSuccess: function (code) {
        result = code;
      },
    };
    
    parseHLSL(source, entryName, shaderType);

    return result;
  `;
    let glsl;
    try {
        glsl = await runNode(hlslparser, 'libs/hlslparser');
    }
    catch (err) {
        let lines = convert.split('\n');
        lines = lines.map((line, index) => {
            return `  ${index} : ` + line;
        });
        // console.error(lines.join('\n'))
        glsl = err;
        glsl += '\n';
        glsl += lines.join('\n');
        fs.writeFileSync(node_1.path.join(node_1.path.tempPath, `shaders/${asset.GetPathName()}.glsl`), glsl);
        throw glsl;
    }
    // start = glsl.indexOf('uniform float BEGINECONVERT');
    // end = glsl.indexOf('uniform float ENDCONVERT', start);
    let glslLines = glsl.split('\n');
    let generatedLines = [];
    let shouldAddToGenerated = false;
    for (let i = 0; i < glslLines.length; i++) {
        if (glslLines[i].indexOf('uniform float BEGINE_CONVERT') !== -1) {
            shouldAddToGenerated = true;
            continue;
        }
        else if (glslLines[i].indexOf('uniform float END_CONVERT') !== -1) {
            shouldAddToGenerated = false;
            continue;
        }
        else if (glslLines[i].indexOf('#line ') !== -1) {
            continue;
        }
        if (shouldAddToGenerated) {
            generatedLines.push(glslLines[i]);
        }
    }
    glsl = generatedLines.join('\n');
}
exports.hlslToGlsl = hlslToGlsl;
