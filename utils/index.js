let base64urlUnescape = function(str) {
    str += Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
}
let base64urlDecode = function(str) {
    return Buffer.from(base64urlUnescape(str), 'base64').toString();
}


exports.base64urlUnescape = base64urlUnescape
exports.base64urlDecode = base64urlDecode
