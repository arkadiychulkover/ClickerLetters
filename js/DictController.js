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

let musics = GetValue("musics");
if (!Array.isArray(musics) || musics.length === 0) {
    musics = ["1", "2", "3", "4", "5"];
    AddValue("musics", musics);
}

let locations = GetValue("locations");
if (!Array.isArray(locations) || locations.length === 0) {
    locations = ["1", "2", "3", "4", "5"];
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

let upgrades = GetValue("upgrades") || {
    upgrade_1: { level: 0 },
    upgrade_2: { level: 0 },
    upgrade_3: { level: 0, active: false },
    upgrade_no_caps: { level: 0 },
    upgrade_more_digits: { level: 0 },
    upgrade_no_symbols: { level: 0 }
};

function saveUpgrades() {
    ChangeValue("upgrades", upgrades);
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

export function GetUpgradeLevel(upgradeId) {
    return upgrades[upgradeId]?.level || 0;
}

export function SetUpgradeLevel(upgradeId, level) {
    if (upgrades[upgradeId]) {
        upgrades[upgradeId].level = level;
        saveUpgrades();
        
        if (upgradeId === "upgrade_1") {
            ChangeMoneyCof(1 + level);
        } else if (upgradeId === "upgrade_2") {
            ChangeExpCof(level + 1);
        } else if (upgradeId === "upgrade_3" && level > 0) {
            upgrades[upgradeId].active = true;
        }
        
        return true;
    }
    return false;
}

export function IsUpgradeActive(upgradeId) {
    return upgrades[upgradeId]?.active || false;
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