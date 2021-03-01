"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MaterialCodes {
    constructor() {
        this.properties_temp = '';
        this.properties = '';
        this.properties_block = '';
        this.properties_sampler_block = '';
        this.surfaceLines = [];
        this.surface = '';
        this.final = '';
        // indent
        this.properties_temp_indent = '      ';
        this.properties_block_indent = '    ';
        this.properties_sampler_block_indent = '  ';
    }
}
exports.MaterialCodes = MaterialCodes;
