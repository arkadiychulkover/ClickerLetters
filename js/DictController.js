import { ChangeValue } from "./LocalStorageController.js";
let letters = [];
let backgrounds = [];
let musics = [];
// let locations = [];
// let curMusic = "";
// let curtLocation = "";
// let money = Number(document.getElementsByClassName("curencyAmount")[0].textContent) || 0;
let money =  0;
let moneyCoef = 1;
let expCoef = 1;
let indexofMus = 0;
let indexofLoc = 0;
let indexofImg = "";
export function AddLetter(symbol) {
    if (!symbol in letters) {
        letters.push(symbol);
        ChangeValue("letters", letters);
        return true;
    }
    return false;
}
export function DeleteChar(symbol) {
    const index = letters.indexOf(symbol);
    if (index !== -1) {
        letters.splice(index,1);
        ChangeValue("letters", letters);
        return true;
    }
    return false;
}
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
export function ChangeMoney(number) {
    if(money !== number){
        money = number;
        ChangeValue("money", number);
        return true;
    }
    return false;
}
export function ChangeLoc(number){
    if(number in locations){
        indexofLoc = number;
        curtLocation = locations[number];
        ChangeValue("curLocation",curtLocation);
        return true;
    }else{
        return false;
    }
}
export function ChangeMusic(index){
    if(number in musics){
        indexofMus = index;
        curMusic = musics[indexofMus];
        ChangeValue("curMusic",curMusic);
        return true;
    }else{
        return false;
    }
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
export function GetDict() {
    return letters;
}
export function GetLoc(index){
    return locations[index];
}
export function GetMusic(index){
    return musics[index];
}
export function GetIndexMus(){
    return indexofMus;
}