"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
function sendStr(msg) {
    if (!exports.client) {
        console.warn('CocosSync WebSocket not inited.');
        return;
    }
    memory.exec(str2ab(msg), ab => {
        exports.client.SendMemory(ab.byteLength);
    });
}
exports.sendStr = sendStr;
function sendObj(obj) {
    let str = JSON.stringify(obj);
    // console.log(str);
    sendStr(str);
}
exports.sendObj = sendObj;
let callbacks = {};
exports.client = null;
function callback(opts) {
    callbacks = opts;
}
exports.callback = callback;
let started = false;
function stop() {
    started = false;
    exports.client.Dispose();
}
exports.stop = stop;
function start() {
    started = true;
    exports.client = JavascriptWebSocket.Connect("127.0.0.1:8878");
    exports.client.OnConnected.Add(() => {
        if (callbacks.OnConnected) {
            callbacks.OnConnected();
        }
    });
    exports.client.OnReceived.Add(() => {
        let ab = new ArrayBuffer(exports.client.GetReceivedBytes());
        memory.exec(ab, () => {
            exports.client.CopyBuffer();
            let msg = ab2str(ab);
            if (callbacks.OnReceived) {
                callbacks.OnReceived(msg);
            }
        });
    });
    exports.client.OnError.Add(() => {
        console.error('Socket error : ');
    });
    function tick() {
        if (!started) {
            return;
        }
        exports.client.Tick();
        process.nextTick(tick);
    }
    tick();
}
exports.start = start;
