"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vec3 {
    constructor(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
exports.Vec3 = Vec3;
class Vec4 {
    constructor(x, y, z, w) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
exports.Vec4 = Vec4;
class Quat extends Vec4 {
}
exports.Quat = Quat;
class Mat4 {
}
exports.Mat4 = Mat4;
