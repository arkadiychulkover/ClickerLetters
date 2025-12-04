import { ChangeValue, GetValue, AddValue } from "./LocalStorageController.js";

// Функция для проверки и инициализации значения в хранилище
function ValidateStorage(key, defaultValue) {
    let value = GetValue(key);
    if (value === null) {
        AddValue(key, defaultValue);
        return defaultValue;
    }
    return value;
}

// Инициализация переменных
let letters = ValidateStorage("letters", []);
let musics = ValidateStorage("musics", ["1","2","3"]);
let locations = ValidateStorage("locations", ["1","2","3"]);
let money = ValidateStorage("money", 0);
let moneyCoef = ValidateStorage("moneyCoef", 1);
let expCoef = ValidateStorage("expCoef", 1);
let indexofMus = ValidateStorage("indexofMus", 0);
let indexofLoc = ValidateStorage("indexofLoc", 0);
let expLvl = ValidateStorage("expLvl", 0);
let curMusic = ValidateStorage("curMusic", musics[0]);
let curLocation = ValidateStorage("curLocation", locations[0]);

// Работа с буквами
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

// Работа с коэффициентами
export function ChangeMoneyCof(number) {
    if (number !== moneyCoef) {
        moneyCoef = number;
        ChangeValue("moneyCoef", moneyCoef);
        return true;
    }
    return false;
}

export function ChangeExpCof(number) {
    if (number !== expCoef) {
        expCoef = number;
        ChangeValue("expCoef", expCoef);
        return true;
    }
    return false;
}

// Работа с деньгами
export function ChangeMoney(number) {
    if (money !== number) {
        money = number;
        ChangeValue("money", money);
        return true;
    }
    return false;
}

// Смена локации
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

// Смена музыки
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

// Опыт
export function ChangeExpLvl(value) {
    if (value !== expLvl) {
        expLvl = value;
        ChangeValue("expLvl", expLvl);
        return true;
    }
    return false;
}

// Геттеры
export function GetDict() {
    return ValidateStorage("letters", []);
}

export function GetMoneyCof() {
    return ValidateStorage("moneyCoef", 1);
}

export function GetExpCof() {
    return ValidateStorage("expCoef", 1);
}

export function GetMoney() {
    return ValidateStorage("money", 0);
}

export function GetIndexLocation(index) {
    const locs = ValidateStorage("locations", ["1","2","3"]);
    return locs[index];
}

export function GetMusic(index) {
    const mus = ValidateStorage("musics", ["1","2","3"]);
    return mus[index];
}

export function GetIndexMus() {
    return ValidateStorage("indexofMus", 0);
}

export function GetExpLvl() {
    return ValidateStorage("expLvl", 0);
}

export function GetCurMusic() {
    return ValidateStorage("curMusic", musics[0]);
}

export function GetCurLocation() {
    return ValidateStorage("curLocation", locations[0]);
}
