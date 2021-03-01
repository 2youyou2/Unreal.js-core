"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("utils/node");
const compile_chunk_1 = require("./compile-chunk");
const compile_defines_1 = require("./compile-defines");
const unreal_to_hlsl_1 = require("./unreal-to-hlsl");
async function unrealToGlsl(asset) {
    asset.bAllowDevelopmentShaderCompile = false;
    let content = MaterialGraphHelper.CompileMaterial(asset);
    let start = content.indexOf('void CalcPixelMaterialInputs');
    let end = content.indexOf('}', start);
    let unreal = content.substring(start, end + 1);
    let convert = compile_chunk_1.compileChunk(node_1.path.join(node_1.path.staticPath, 'shader/unreal/convert.hlsl'));
    convert = convert.replace('{{CalcPixelMaterialInputs}}', unreal);
    convert = unreal_to_hlsl_1.unrealToHlsl(convert);
    convert = compile_defines_1.compileDefines(convert);
    convert = convert.replace(/Parameters\.TexCoords\[(\w)\]/g, 'Parameters.TexCoords_$1');
    node_1.fs.writeFileSync(node_1.path.join(node_1.path.tempPath, `shaders/${asset.GetPathName()}_convert.hlsl`), convert);
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
        glsl = await node_1.runNode(hlslparser, 'libs/hlslparser');
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
        node_1.fs.writeFileSync(node_1.path.join(node_1.path.tempPath, `shaders/${asset.GetPathName()}.glsl`), glsl);
        throw glsl;
    }
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
    return generatedLines.join('\n');
}
exports.unrealToGlsl = unrealToGlsl;
