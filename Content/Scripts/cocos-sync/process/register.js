"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classes = new Map();
function register(sclass, uclass) {
    // console.warn(`register : ${uclass} - ${sclass}`);
    exports.classes.set(uclass, sclass);
}
exports.register = register;
