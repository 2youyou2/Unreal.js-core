"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function replaceAll(str, from, to) {
    while (str.indexOf(from) !== -1) {
        str = str.replace(from, to);
    }
    return str;
}
exports.replaceAll = replaceAll;
