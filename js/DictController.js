"use strict";

import { AddValue, ChangeValue, GetValue } from "./LocalStorageController.js";

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

// Обновляем массивы до 5 элементов
let musics = GetValue("musics");
if (!Array.isArray(musics) || musics.length === 0) {
    musics = ["1", "2", "3", "4", "5"]; // 5 музыкальных треков
    AddValue("musics", musics);
}

let locations = GetValue("locations");
if (!Array.isArray(locations) || locations.length === 0) {
    locations = ["1", "2", "3", "4", "5"]; // 5 локаций
    AddValue("locations", locations);
}

let money = GetValue("money") || 0;
let moneyCoef = GetValue("moneyCoef") || 1;
let expCoef = GetValue("expCoef") || 1;
let indexofMus = GetValue("indexofMus") || 0;
let indexofLoc = GetValue("indexofLoc") || 0;
let expLvl = GetValue("expLvl") || 0;
let curMusic = GetValue("curMusic") || musics[0];
let curLocation = GetValue("curLocation") || locations[0];

// Загрузка апгрейдов из хранилища
let upgrades = GetValue("upgrades") || {
    upgrade_1: { level: 0 },
    upgrade_2: { level: 0 },
    upgrade_3: { level: 0, active: false },
    upgrade_no_caps: { level: 0 },
    upgrade_more_digits: { level: 0 },
    upgrade_no_symbols: { level: 0 }
};

// Функция для сохранения апгрейдов
function saveUpgrades() {
    ChangeValue("upgrades", upgrades);
}

// Функция для удаления всех заглавных букв
function removeAllUppercase() {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    letters = letters.filter(letter => !uppercase.includes(letter));
    ChangeValue("letters", letters);
    return true;
}

// Функция для добавления всех цифр
function addAllDigits() {
    const digits = "0123456789".split('');
    let added = false;
    digits.forEach(digit => {
        if (!letters.includes(digit)) {
            letters.push(digit);
            added = true;
        }
    });
    if (added) {
        ChangeValue("letters", letters);
    }
    return added;
}

// Функция для удаления всех спецсимволов
function removeAllSymbols() {
    const symbols = ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+',
        ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@',
        '^', '_', '`', '|', '~'];
    letters = letters.filter(letter => !symbols.includes(letter));
    ChangeValue("letters", letters);
    return true;
}

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

export function ChangeMoney(number) {
    if (money !== number) {
        money = number;
        ChangeValue("money", money);
        return true;
    }
    return false;
}

export function ChangeLoc(index) {
    console.warn("Changing location to index:", index);
    console.warn("Locations array length:", locations.length);
    
    if (index < locations.length && index >= 0) {
        indexofLoc = index;
        curLocation = locations[index];
        ChangeValue("indexofLoc", indexofLoc);
        ChangeValue("curLocation", curLocation);
        return true;
    } else {
        console.error("Invalid location index:", index);
        return false;
    }
}

export function ChangeMusic(index) {
    console.warn("Changing music to index:", index);
    console.warn("Music array length:", musics.length);
    
    if (index < musics.length && index >= 0) {
        indexofMus = index;
        curMusic = musics[index];
        ChangeValue("indexofMus", indexofMus);
        ChangeValue("curMusic", curMusic);
        return true;
    } else {
        console.error("Invalid music index:", index);
        return false;
    }
}

export function ChangeExpLvl(value) {
    if (expLvl !== value) {
        expLvl = value;
        ChangeValue("expLvl", expLvl);
        return true;
    }
    return false;
}

// Функции для работы с апгрейдами
export function GetUpgradeLevel(upgradeId) {
    return upgrades[upgradeId]?.level || 0;
}

export function SetUpgradeLevel(upgradeId, level) {
    if (upgrades[upgradeId]) {
        const oldLevel = upgrades[upgradeId].level;
        upgrades[upgradeId].level = level;
        
        // Применяем эффекты апгрейдов при повышении уровня
        if (level > oldLevel) {
            if (upgradeId === "upgrade_1") {
                // Каждый уровень upgrade_1 дает +1 к множителю денег
                ChangeMoneyCof(1 + level);
                console.log(`Money coefficient updated to: ${1 + level}`);
            } else if (upgradeId === "upgrade_2") {
                // Каждый уровень upgrade_2 дает x2 к опыту (1, 2, 4, 8...)
                const newExpCoef = Math.pow(2, level);
                ChangeExpCof(newExpCoef);
                console.log(`Experience coefficient updated to: ${newExpCoef}`);
            } else if (upgradeId === "upgrade_3") {
                // Активируем автокликер при первом уровне
                upgrades[upgradeId].active = level > 0;
                console.log(`Auto-clicker ${level > 0 ? 'activated' : 'deactivated'}`);
            } else if (upgradeId === "upgrade_no_caps" && level === 1) {
                // Удаляем заглавные буквы при первом уровне
                removeAllUppercase();
                console.log("Uppercase letters removed from dictionary");
            } else if (upgradeId === "upgrade_more_digits" && level === 1) {
                // Добавляем цифры при первом уровне
                addAllDigits();
                console.log("Digits added to dictionary");
            } else if (upgradeId === "upgrade_no_symbols" && level === 1) {
                // Удаляем спецсимволы при первом уровне
                removeAllSymbols();
                console.log("Special symbols removed from dictionary");
            }
        }
        
        saveUpgrades();
        return true;
    }
    return false;
}

export function IsUpgradeActive(upgradeId) {
    return upgrades[upgradeId]?.active || false;
}

export function GetAutoClickerInterval() {
    const level = GetUpgradeLevel("upgrade_3");
    if (level === 0) return 0;
    
    // Базовая скорость: 1 клик в секунду (1000ms)
    // Каждый уровень уменьшает интервал на 150ms
    // Минимальный интервал: 300ms
    const baseInterval = 1000;
    const reductionPerLevel = 150;
    const calculated = baseInterval - (level - 1) * reductionPerLevel;
    return Math.max(300, calculated);
}

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
    if (tag === "TagOfPasiveUpgrade") return GetUpgradeLevel("upgrade_3") || 0;
    return 0;
}

export function GetRandomDictLetter() {
    if (!letters || letters.length === 0) return null;
    const idx = Math.floor(Math.random() * letters.length);
    return letters[idx];
}