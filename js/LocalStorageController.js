"use strict"
const SECRET = "KhdBOamwkXggsvnmsnAiPnIsbdxJtWIcmhnoxHjBxSxolGZRxDPrTPgmQZfmqlVa";

function encrypt(text) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const t = text.charCodeAt(i);
        const k = SECRET.charCodeAt(i % SECRET.length);
        result += String.fromCharCode(t + k);
    }
    return btoa(result);
}

function decrypt(text) {
    text = atob(text);
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const t = text.charCodeAt(i);
        const k = SECRET.charCodeAt(i % SECRET.length);
        result += String.fromCharCode(t - k);
    }
    return result;
}
export function AddValue(key, value) {
    if (localStorage.getItem(key) !== null) return false;

    const encrypted = encrypt(JSON.stringify(value));
    localStorage.setItem(key, encrypted);
    return true;
}

export function ChangeValue(key, value) {
    const encrypted = encrypt(JSON.stringify(value));
    localStorage.setItem(key, encrypted);
    return true;
}

export function GetValue(key) {
    const item = localStorage.getItem(key);
    if (item === null) return null;

    const decrypted = decrypt(item);
    return JSON.parse(decrypted);
}

export function ClearStorage() {
    localStorage.clear();
    return true;
}