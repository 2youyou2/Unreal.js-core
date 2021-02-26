"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("utils/node");
const code_1 = require("./code");
const compile_function_1 = require("./compile-function");
const compile_glsl_1 = require("./compile-glsl");
const compile_properties_1 = require("./compile-properties");
const compile_inputs_1 = require("./compile-inputs");
const compile_chunk_1 = require("./compile-chunk");
const compile_defines_1 = require("./compile-defines");
const utils_1 = require("utils/utils");
const compile_hlsl_1 = require("./compile-hlsl");
async function compile(asset) {
    let code = new code_1.MaterialCodes;
    asset.bAllowDevelopmentShaderCompile = false;
    let content = MaterialGraphHelper.CompileMaterial(asset);
    let start = content.indexOf('void CalcPixelMaterialInputs');
    let end = content.indexOf('}', start);
    code.surface = content.substring(start, end + 1);
    code.surfaceLines = code.surface.split('\n');
    let hlsl = compile_hlsl_1.compileHlsl(code.surface);
    node_1.fs.writeFileSync(node_1.path.join(node_1.path.tempPath, `shaders/${asset.GetPathName()}.hlsl`), hlsl);
    let hlslparser = `
    var hlslParser = require('./hlslparser');

    var parseHLSL = hlslParser.cwrap('parseHLSL', 'number', [
      'string',
      'string',
      'string',
    ]);
    
    var source = \`${hlsl}\`;
    
    var entryName = 'PixelShaderFunction';
    
    var shaderType = 'fs';
    
    global.HLSLParser = {
      onError: function (reason) {
        // console.error(e);
        // statusLabel.textContent = reason;
      },
      onSuccess: function (code) {
        // errorLabel.textContent = statusLabel.textContent = '';
        // source.value = code;
        console.log(code);
        // var fs = require('fs');
        // fs.writeFileSync('./test_out.glsl', code);
      },
    };
    
    parseHLSL(source, entryName, shaderType);
    `;
    let glsl = await node_1.runNode(hlslparser, 'libs/hlslparser');
    node_1.fs.writeFileSync(node_1.path.join(node_1.path.tempPath, `shaders/${asset.GetPathName()}.glsl`), glsl);
    compile_properties_1.compileProperties(asset, code);
    compile_function_1.compileFunction(asset, code);
    console.warn('----------------------');
    code.surface = code.surfaceLines.join('\n');
    code.surface = '\n' + code.surface;
    // let final = fs.readFileSync(path.join(path.staticPath, 'shader/standard.effect'), 'utf8');
    let final = compile_chunk_1.compileChunk(node_1.path.join(node_1.path.staticPath, 'shader/unreal/standard.effect'));
    for (let name in code) {
        final = utils_1.replaceAll(final, `{{${name}}}`, code[name]);
    }
    final = compile_glsl_1.compileGlsl(final);
    final = compile_inputs_1.compileInputs(final);
    final = compile_defines_1.compileDefines(final);
    code.final = final;
    node_1.fs.writeFileSync(node_1.path.join(node_1.path.tempPath, `shaders/${asset.GetPathName()}.effect`), final);
    return code;
}
exports.compile = compile;
