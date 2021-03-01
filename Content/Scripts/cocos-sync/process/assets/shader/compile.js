"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("utils/node");
const code_1 = require("./code");
const compile_function_1 = require("./compile-function");
const compile_properties_1 = require("./compile-properties");
const compile_inputs_1 = require("./compile-inputs");
const compile_chunk_1 = require("./compile-chunk");
const compile_defines_1 = require("./compile-defines");
const utils_1 = require("utils/utils");
const unreal_to_glsl_1 = require("./unreal-to-glsl");
async function compile(asset) {
    let glsl = await unreal_to_glsl_1.unrealToGlsl(asset);
    let code = new code_1.MaterialCodes;
    code.surface = glsl;
    code.surfaceLines = code.surface.split('\n');
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
    final = compile_inputs_1.compileInputs(final);
    final = compile_defines_1.compileDefines(final);
    code.final = final;
    node_1.fs.writeFileSync(node_1.path.join(node_1.path.tempPath, `shaders/${asset.GetPathName()}.effect`), final);
    return code;
}
exports.compile = compile;
