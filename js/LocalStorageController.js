"use strict";

const SECRET = "KhdBOamwkXggsvnmsnAiPnIsbdxJtWIcmhnoxHjBxSxolGZRxDPrTPgmQZfmqlVa";

function _xorTransform(str, secret) {
    let out = "";
    for (let i = 0; i < str.length; i++) {
        const a = str.charCodeAt(i);
        const b = secret.charCodeAt(i % secret.length);
        out += String.fromCharCode(a ^ b);
    }
    return out;
}

export function encrypt(text) {
    const x = _xorTransform(text, SECRET);
    return btoa(unescape(encodeURIComponent(x)));
}

export function decrypt(text) {
    try {
        const decoded = decodeURIComponent(escape(atob(text)));
        return _xorTransform(decoded, SECRET);
    } catch (e) {
        console.warn("decrypt failed", e);
        return null;
    }
}

export function ChangeValue(key, value) {
    try {
        const json = JSON.stringify(value);
        const enc = encrypt(json);
        localStorage.setItem(key, enc);
        return true;
    } catch (e) {
        console.error("ChangeValue error", e);
        return false;
    }
}

export function AddValue(key, value) {
    if (localStorage.getItem(key) !== null) return false;
    return ChangeValue(key, value);
}

export function GetValue(key) {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    const dec = decrypt(item);
    if (dec === null) return null;
    try {
        return JSON.parse(dec);
    } catch (e) {
        console.warn("GetValue parse failed", e);
        return null;
    }
}

export function ClearStorage() {
    localStorage.clear();
    return true;
}
