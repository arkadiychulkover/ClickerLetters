"use strict"

import { 
    GetDict, 
    ChangeMoney, 
    GetMoney, 
    GetExpCof, 
    GetMoneyCof, 
    GetTimeRange ,
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
    if(!ValidateKey(key)) return;

    let divLet = GetLetObjFromName(key);
    if(divLet == null) return;

    divLet.classList.add("correct");
    await sleep(200);

    if (divLet.parentNode)
        lettersZone.removeChild(divLet);

    DeletLetFromArrays(key);

    let keyIndex = curentKeys.indexOf(key);
    if (keyIndex !== -1) curentKeys.splice(keyIndex, 1);

    let moneyCof = GetMoneyCof();
    let expCof = GetExpCof();
    let money = GetMoney();
    let expLvl = GetExpLvl();

    let levelOfMoneyUpgrade = GetLevelOfUpgrade("moneyUpgrade");
    let levelOfExpUpgrade = GetLevelOfUpgrade("expUpgrade");

    let moneyToAdd = Math.floor(1 * moneyCof * levelOfMoneyUpgrade);
    let expToAdd = Math.floor(1 * expCof * levelOfExpUpgrade);

    let newLvlExp = expLvl + expToAdd;

    ChangeMoney(money + moneyToAdd);
    ChangeExpLvl(expLvl + expToAdd);

    ChangeAmountOfValute(money + moneyToAdd);

    if (Math.floor(expLvl/100) < Math.floor((expLvl + expToAdd)/100))
    {
        let indexLocation = GetIndexLocation();
        let indexMusic = GetIndexMus(); 

        ChangeLoc((indexLocation + 1));
        ChangeMusic((indexMusic + 1));

        ChangeBackgroundMusic((indexMusic + 1));
        ChangeBacgroundImg((indexLocation + 1));

        let percent = newLvlExp - Math.floor(newLvlExp / 100) * 100;
        ChangeLevelOfVacabuular(Math.floor(newLvlExp / 100));
        ChangeShkalaOfVacabular(percent);
    }

    console.log(`You earned ${moneyToAdd} money and ${expToAdd} exp!`);
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
    if(index !== -1)
        return currentLettersDivs[index];
    return null;
}

async function SpawnLetter(letter)
{
    let letterEl = document.createElement("div");

    letterEl.classList.add("letter", letter);
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

    let index = curentKeys.indexOf(key);
    if (index !== -1) curentKeys.splice(index, 1);
}

function GetRandomLetter()
{
    let dict = GetDict();
    let randInd = Math.floor(Math.random() * dict.length);
    return dict[randInd];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function SpawnLettersInTimer()
{
    let letter = GetRandomLetter();
    SpawnLetter(letter);

    let delay = Math.random() * GetTimeRange();
    setTimeout(SpawnLettersInTimer, delay);
}

SpawnLettersInTimer();