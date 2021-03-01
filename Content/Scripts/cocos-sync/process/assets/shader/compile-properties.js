"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("utils/utils");
function compileProperties(asset, code) {
    let lines = code.surfaceLines;
    let VectorNames = MaterialGraphHelper.GetVectorParameterNames(asset);
    let ScalarNames = MaterialGraphHelper.GetScalarParameterNames(asset);
    if (VectorNames[0] === 'SelectionColor') {
        VectorNames.shift();
    }
    // console.warn('VectorNames : ' + VectorNames.join(', '))
    // console.warn('ScalarNames : ' + ScalarNames.join(', '))
    let VectorExpressions = VectorNames.map(vn => {
        let e = asset.Expressions.find(e => {
            if (e instanceof MaterialExpressionVectorParameter) {
                if (e.ParameterName === vn) {
                    return e;
                }
            }
        });
        if (!e) {
            console.error('Can not find parameter expression for : ' + vn);
        }
        return e;
    });
    let ScalarExpressions = ScalarNames.map(vn => {
        let e = asset.Expressions.find(e => {
            if (e instanceof MaterialExpressionScalarParameter) {
                if (e.ParameterName === vn) {
                    return e;
                }
            }
        });
        if (!e) {
            console.error('Can not find parameter expression for : ' + vn);
        }
        return e;
    });
    // let TextureExpressions = asset.Expressions.filter(e => {
    //     console.warn(e + ' : ' + e.GetName())
    //     MaterialExpressionTextureSample
    //     return e instanceof MaterialExpressionTextureBase
    // }) as MaterialExpressionTextureBase[]
    // TextureExpressions.forEach(e => {
    //     console.warn(e + ' : ' + e.GetName() + ' : ' + e.SamplerType)
    // })
    let textures = asset.CachedExpressionData.ReferencedTextures;
    console.warn(' ');
    // console.warn('textures.length : ' + textures.length);
    let vectorExpress = /Material_VectorExpressions\[([0-9]*)\]/g;
    let scalarExpress = /\(Material_ScalarExpressions\[([0-9]*)\]\)\.(\w)/g;
    let vectorIndex = 0;
    let maxVectorIndex = -1;
    let vectorMap = {};
    let scalarIndex = 0;
    let maxScalarIndex = -1;
    let scalarMap = {};
    let components = ['x', 'y', 'z', 'w'];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.startsWith('#line ')) {
            continue;
        }
        let iter = line.matchAll(vectorExpress);
        let res = iter.next();
        if (!res.done) {
            while (!res.done) {
                let index = parseFloat(res.value[1]);
                if (vectorMap[index] == undefined) {
                    vectorMap[index] = vectorIndex++;
                }
                let from = `Material_VectorExpressions[${index}]`;
                let to = `Material_VectorExpressions_${vectorMap[index]}`;
                maxVectorIndex = Math.max(maxVectorIndex, vectorMap[index]);
                line = utils_1.replaceAll(line, from, to);
                res = iter.next();
            }
        }
        iter = line.matchAll(scalarExpress);
        res = iter.next();
        if (!res.done) {
            while (!res.done) {
                let index = parseFloat(res.value[1]);
                let component = res.value[2];
                let componentIndex = components.indexOf(component);
                let name = index + '_' + component;
                if (scalarMap[name] === undefined) {
                    scalarMap[name] = scalarIndex++;
                }
                let newIndex = (scalarMap[name] / 4) | 0;
                let newComponentIndex = scalarMap[name] % 4;
                maxScalarIndex = Math.max(maxScalarIndex, newIndex);
                let from = `\(Material_ScalarExpressions[${index}]\).${components[componentIndex]}`;
                let to = `Material_ScalarExpressions_${newIndex}.${components[newComponentIndex]}`;
                line = utils_1.replaceAll(line, from, to);
                res = iter.next();
            }
        }
        line = line.replace(/Material\.Texture2D_/g, 'Material_Texture2D_');
        lines[i] = line;
    }
    // console.warn('maxVectorIndex: ' + maxVectorIndex);
    // console.warn('maxScalarIndex: ' + maxScalarIndex);
    // for (let name in vectorMap) {
    //     console.warn(name + ' : ' + vectorMap[name]);
    // }
    // for (let name in scalarMap) {
    //     console.warn(name + ' : ' + scalarMap[name]);
    // }
    console.warn('properties  1111');
    // properties
    if ((VectorExpressions.length > 0 && (maxVectorIndex > -1)) || (ScalarExpressions.length > 0 && (maxScalarIndex > -1)) || textures.length > 0) {
        code.properties_temp += "properties: &props\n";
        if (maxVectorIndex > -1) {
            VectorExpressions.forEach((e, index) => {
                code.properties_temp += code.properties_temp_indent;
                code.properties_temp += `${e.ParameterName}: { value: [${e.DefaultValue.R}, ${e.DefaultValue.G}, ${e.DefaultValue.B}, ${e.DefaultValue.A}], target: Material_VectorExpressions_${index} }\n`;
            });
        }
        if (maxScalarIndex > -1) {
            ScalarExpressions.forEach((e, index) => {
                let finalIndex = (index / 4) | 0;
                let componentIndex = index % 4;
                code.properties_temp += code.properties_temp_indent;
                code.properties_temp += `${e.ParameterName}: { value: ${e.DefaultValue}, target: Material_ScalarExpressions_${finalIndex}.${components[componentIndex]} }\n`;
            });
        }
        textures.forEach((t, index) => {
            // console.warn(t + ' : ' + t.GetName())
            code.properties_temp += code.properties_temp_indent;
            code.properties_temp += `Material_Texture2D_${index}: { value: white }\n`;
        });
        code.properties = 'properties: *props';
    }
    console.warn('properties  2222');
    // uniforms
    if (VectorExpressions.length > 0 || ScalarExpressions.length > 0) {
        code.properties_block += "\n";
        code.properties_block += 'uniform SharedUBOs_Properties {';
        for (let i = 0; i <= maxVectorIndex; i++) {
            code.properties_block += code.properties_block_indent;
            code.properties_block += `vec4 Material_VectorExpressions_${i};\n`;
        }
        code.properties_block += "\n";
        for (let i = 0; i <= maxScalarIndex; i++) {
            code.properties_block += code.properties_block_indent;
            code.properties_block += `vec4 Material_ScalarExpressions_${i};\n`;
        }
        code.properties_block += '};';
    }
    code.properties_sampler_block += "\n";
    textures.forEach((t, index) => {
        // console.warn(t + ' : ' + t.GetName())
        code.properties_sampler_block += code.properties_sampler_block_indent;
        code.properties_sampler_block += `uniform sampler2D Material_Texture2D_${index};\n`;
    });
}
exports.compileProperties = compileProperties;
