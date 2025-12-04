"use strict";

import { AddValue, ChangeValue, GetValue } from "./LocalStorageController.js";

/* ---------------- ИНИЦИАЛИЗАЦИЯ ---------------- */

const defaultLettersDict = [
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    ..."abcdefghijklmnopqrstuvwxyz",
    '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+',
    ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@',
    '^', '_', '`', '|', '~'
];

let letters = GetValue("letters");
if (!Array.isArray(letters) || letters.length === 0) {
    letters = [...defaultLettersDict];
    AddValue("letters", letters);
}

let musics = GetValue("musics") || ["1", "2", "3"];
let locations = GetValue("locations") || ["1", "2", "3"];
let money = GetValue("money") || 0;
let moneyCoef = GetValue("moneyCoef") || 1;
let expCoef = GetValue("expCoef") || 1;
let indexofMus = GetValue("indexofMus") || 0;
let indexofLoc = GetValue("indexofLoc") || 0;
let expLvl = GetValue("expLvl") || 0;
let curMusic = GetValue("curMusic") || musics[0];
let curLocation = GetValue("curLocation") || locations[0];

/* ---------------- ФУНКЦИИ ДЛЯ БУКВ ---------------- */

export function AddLetter(symbol) {
    if (!letters.includes(symbol)) {
        letters.push(symbol);
        ChangeValue("letters", letters);
        return true;
    }
    return false;
}

export function DeleteChar(symbol) {
    const index = letters.indexOf(symbol);
    if (index !== -1) {
        letters.splice(index, 1);
        ChangeValue("letters", letters);
        return true;
    }
    return false;
}

/* ---------------- ИЗМЕНЕНИЕ КОЭФФИЦИЕНТОВ ---------------- */

export function ChangeMoneyCof(number) {
    if (moneyCoef !== number) {
        moneyCoef = number;
        ChangeValue("moneyCoef", moneyCoef);
        return true;
    }
    return false;
}

export function ChangeExpCof(number) {
    if (expCoef !== number) {
        expCoef = number;
        ChangeValue("expCoef", expCoef);
        return true;
    }
    return false;
}

/* ---------------- ДЕНЬГИ ---------------- */

export function ChangeMoney(number) {
    if (money !== number) {
        money = number;
        ChangeValue("money", money);
        return true;
    }
    return false;
}

/* ---------------- ЛОКАЦИИ ---------------- */

export function ChangeLoc(index) {
    if (index < locations.length) {
        indexofLoc = index;
        curLocation = locations[index];
        ChangeValue("indexofLoc", indexofLoc);
        ChangeValue("curLocation", curLocation);
        return true;
    }
    return false;
}

/* ---------------- МУЗЫКА ---------------- */

export function ChangeMusic(index) {
    if (index < musics.length) {
        indexofMus = index;
        curMusic = musics[index];
        ChangeValue("indexofMus", indexofMus);
        ChangeValue("curMusic", curMusic);
        return true;
    }
    return false;
}

/* ---------------- УРОВНИ ---------------- */

export function ChangeExpLvl(value) {
    if (expLvl !== value) {
        expLvl = value;
        ChangeValue("expLvl", expLvl);
        return true;
    }
    return false;
}

/* ---------------- ГЕТТЕРЫ ---------------- */

export function GetDict() {
    return letters;
}

export function GetMoneyCof() {
    return moneyCoef;
}

export function GetExpCof() {
    return expCoef;
}

export function GetMoney() {
    return money;
}

export function GetIndexLocation() {
    return indexofLoc;
}

export function GetLocations() {
    return locations;
}

export function GetMusics() {
    return musics;
}

export function GetIndexMus() {
    return indexofMus;
}

export function GetExpLvl() {
    return expLvl;
}

export function GetCurMusic() {
    return curMusic;
}

export function GetCurLocation() {
    return curLocation;
}

export function GetLevelOfUpgrade(tag) {
    // пример: возвращаем 1 для пассивного клика, иначе 0
    if (tag === "TagOfPasiveUpgrade") return 1;
    return 0;
}

export function GetRandomDictLetter() {
    if (!letters || letters.length === 0) return null;
    const idx = Math.floor(Math.random() * letters.length);
    return letters[idx];
}
