"use strict";

import { 
    GetDict, 
    ChangeMoney, 
    GetMoney, 
    GetExpCof, 
    GetMoneyCof,
    GetExpLvl,
    ChangeExpLvl,
    GetIndexLocation,
    GetIndexMus,
    ChangeMusic,
    ChangeLoc
} from "./DictController.js";

import { 
    GetLevelOfUpgrade,
    ChangeBackgroundMusic,
    ChangeBacgroundImg,
    ChangeLevelOfVacabuular,
    ChangeShkalaOfVacabular,
    ChangeAmountOfValute
} from "./Ui.js";

let curentKeys = [];
let currentLettersDivs = [];
let currentLettersDivsClases = [];
let lettersZone = document.getElementById("lettersZone");

document.addEventListener('keydown', async (e) => 
{
    let key = e.key.toLowerCase();
    if (!ValidateKey(key)) return;

    let divLet = GetLetObjFromName(key);
    if (!divLet) return;

    divLet.classList.add("correct");//тупо зеленая
    await sleep(200);

    if (divLet.parentNode)
        lettersZone.removeChild(divLet);

    DeletLetFromArrays(key);

    let keyIdx = curentKeys.indexOf(key);
    if (keyIdx !== -1) curentKeys.splice(keyIdx, 1);

    let moneyCof = GetMoneyCof();
    let expCof = GetExpCof();

    let moneyToAdd = Math.floor(1 * moneyCof);
    let expToAdd = Math.floor(1 * expCof);

    let oldExp = GetExpLvl();
    let newExp = oldExp + expToAdd;

    let newMoney = GetMoney() + moneyToAdd;
    ChangeMoney(newMoney);
    ChangeAmountOfValute(newMoney);

    ChangeExpLvl(newExp);

    let locationIndex = GetIndexLocation();

    let oldLvl = Math.floor(oldExp / 100);
    let newLvl = Math.floor(newExp / 100);

    if (newLvl > oldLvl)
    {
        ChangeLevelOfVacabuular(newLvl);

        if (newLvl > locationIndex && locationIndex < 5)
        {
            ChangeLoc(newLvl);
            ChangeBacgroundImg(newLvl);

            let indexMusic = GetIndexMus();
            ChangeMusic(indexMusic + 1);
            ChangeBackgroundMusic(indexMusic + 1);
        }
    }

    let percent = newExp % 100;
    ChangeShkalaOfVacabular(percent);

    console.log(`+${moneyToAdd} money, +${expToAdd} exp`);
});


function ValidateKey(key)
{
    return curentKeys.includes(key);
}

function DeletLetFromArrays(key)
{
    let index = currentLettersDivsClases.indexOf(key);

    if (index !== -1)
    {
        currentLettersDivsClases.splice(index, 1);
        currentLettersDivs.splice(index, 1);
    }
}

function GetLetObjFromName(name)
{
    let index = currentLettersDivsClases.indexOf(name);
    return index !== -1 ? currentLettersDivs[index] : null;
}

async function SpawnLetter(letter)
{
    let letterEl = document.createElement("div");

    letterEl.classList.add("letter", letter); //анимауия 3 секунды 1 проявление 2 ничего 3 удаление медленное
    letterEl.textContent = letter;

    currentLettersDivs.push(letterEl);
    currentLettersDivsClases.push(letter);
    curentKeys.push(letter);

    lettersZone.appendChild(letterEl);

    DeleteLetter(letterEl, letter);
}

async function DeleteLetter(letterEl, key)
{
    await sleep(3000);

    if (!letterEl || !letterEl.parentNode) return;

    lettersZone.removeChild(letterEl);
    DeletLetFromArrays(key);

    let i = curentKeys.indexOf(key);
    if (i !== -1) curentKeys.splice(i, 1);
}

function GetRandomLetter()
{
    let dict = GetDict();
    let randInd = Math.floor(Math.random() * dict.length);
    return dict[randInd];
}

function GetRandomLetterFromCurrent()
{
    if (curentKeys.length === 0) return null;
    return curentKeys[Math.floor(Math.random() * curentKeys.length)];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function SpawnLettersInTimer()
{
    let letter = GetRandomLetter();
    SpawnLetter(letter);

    let baseDelay = 5000;
    let level = GetExpLvl();

    let speedFactor = 1 + (level / 5);
    let delay = Math.max(200, baseDelay / speedFactor);

    delay = delay * (0.6 + Math.random() * 0.8);

    setTimeout(SpawnLettersInTimer, delay);
}

async function PasiveClickLetter()
{
    let key = GetRandomLetterFromCurrent();
    if (key) MakeVirtualKeyDown(key);

    let upgradeSpeed = GetLevelOfUpgrade("TagOfPasiveUpgrade");
    let delay = Math.max(0.3, upgradeSpeed);

    setTimeout(PasiveClickLetter, delay * 1000);
}

function MakeVirtualKeyDown(key)
{
    let event = new KeyboardEvent("keydown", {
        key: key,
        code: `Key${key.toUpperCase()}`,
        bubbles: true
    });

    document.dispatchEvent(event);
}

SpawnLettersInTimer();
PasiveClickLetter();