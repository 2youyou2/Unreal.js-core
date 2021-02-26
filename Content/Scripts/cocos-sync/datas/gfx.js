"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CullMode;
(function (CullMode) {
    CullMode[CullMode["NONE"] = 0] = "NONE";
    CullMode[CullMode["FRONT"] = 1] = "FRONT";
    CullMode[CullMode["BACK"] = 2] = "BACK";
})(CullMode = exports.CullMode || (exports.CullMode = {}));
var BlendFactor;
(function (BlendFactor) {
    BlendFactor[BlendFactor["ZERO"] = 0] = "ZERO";
    BlendFactor[BlendFactor["ONE"] = 1] = "ONE";
    BlendFactor[BlendFactor["SRC_ALPHA"] = 2] = "SRC_ALPHA";
    BlendFactor[BlendFactor["DST_ALPHA"] = 3] = "DST_ALPHA";
    BlendFactor[BlendFactor["ONE_MINUS_SRC_ALPHA"] = 4] = "ONE_MINUS_SRC_ALPHA";
    BlendFactor[BlendFactor["ONE_MINUS_DST_ALPHA"] = 5] = "ONE_MINUS_DST_ALPHA";
    BlendFactor[BlendFactor["SRC_COLOR"] = 6] = "SRC_COLOR";
    BlendFactor[BlendFactor["DST_COLOR"] = 7] = "DST_COLOR";
    BlendFactor[BlendFactor["ONE_MINUS_SRC_COLOR"] = 8] = "ONE_MINUS_SRC_COLOR";
    BlendFactor[BlendFactor["ONE_MINUS_DST_COLOR"] = 9] = "ONE_MINUS_DST_COLOR";
    BlendFactor[BlendFactor["SRC_ALPHA_SATURATE"] = 10] = "SRC_ALPHA_SATURATE";
    BlendFactor[BlendFactor["CONSTANT_COLOR"] = 11] = "CONSTANT_COLOR";
    BlendFactor[BlendFactor["ONE_MINUS_CONSTANT_COLOR"] = 12] = "ONE_MINUS_CONSTANT_COLOR";
    BlendFactor[BlendFactor["CONSTANT_ALPHA"] = 13] = "CONSTANT_ALPHA";
    BlendFactor[BlendFactor["ONE_MINUS_CONSTANT_ALPHA"] = 14] = "ONE_MINUS_CONSTANT_ALPHA";
})(BlendFactor = exports.BlendFactor || (exports.BlendFactor = {}));
