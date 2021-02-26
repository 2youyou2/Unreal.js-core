"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let deferred = [];
let valid = true;
function defer(fn) {
    if (!valid) {
        process.nextTick(fn);
    }
    else {
        deferred.push(fn);
    }
}
exports.defer = defer;
function flush() {
    valid = false;
    let q = deferred.slice();
    deferred.length = 0;
    q.forEach(fn => fn());
}
exports.flush = flush;
function reset() {
    flush();
    valid = true;
}
exports.reset = reset;
