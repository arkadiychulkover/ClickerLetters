"use strict";

import {
  GetDict,
  GetMoney,
  GetExpCof,
  GetMoneyCof,
  GetExpLvl,
  ChangeExpLvl,
  ChangeMoney,
  GetIndexLocation,
  GetIndexMus,
  GetLevelOfUpgrade,
  GetRandomDictLetter
} from "./DictController.js";

import {
  ChangeBackgroundMusic,
  ChangeBacgroundImg,
  ChangeLevelOfVacabuular,
  ChangeShkalaOfVacabular,
  ChangeAmountOfValute,
  GetLevelOfUpgrade as UIGetLevelOfUpgrade,
  gameStarted  // CHANGED!!! New string
} from "./Ui.js";

const lettersZone = document.getElementById("lettersZone");

const activeLetters = new Map();
let spawnLoopRunning = false;
let passiveClickRunning = false;

const BASE_SPAWN_DELAY = 3000;
const MIN_SPAWN_DELAY = 200;
const LETTER_LIFE = 3000;

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function makeKeyboardEvent(key) {
  return new KeyboardEvent("keydown", {
    key: key,
    code: `Key${key.toUpperCase()}`,
    bubbles: true,
  });
}

function createLetterElement(letter) {
  const el = document.createElement("div");
  el.classList.add("letter", `letter-${letter}`);
  el.textContent = letter;
  el.style.position = "absolute";

  const safe = 10;

  const zoneRect = lettersZone.getBoundingClientRect();

  const x = Math.random() * (zoneRect.width - safe * 2) + safe;
  const y = Math.random() * (zoneRect.height - safe * 2) + safe;

  el.style.left = x + "px";
  el.style.top = y + "px";

  return el;
}


function spawnLetter(letter) {
  if (!gameStarted) return;
  if (activeLetters.has(letter)) return;

  const el = createLetterElement(letter);
  const meta = { el, key: letter, removed: false, timeoutId: null };

  activeLetters.set(letter, meta);
  lettersZone.appendChild(el);

  el.addEventListener("click", () => virtualKeyHandled(letter));

  meta.timeoutId = setTimeout(() => {
    if (!meta.removed) removeLetter(letter);
  }, LETTER_LIFE);
}

function removeLetter(key) {
  const meta = activeLetters.get(key);

  if (!meta || meta.removed) return;
  meta.removed = true;

  if (meta.timeoutId) {
    clearTimeout(meta.timeoutId);
    meta.timeoutId = null;
  }

  if (meta.el && meta.el.parentNode === lettersZone) {
    lettersZone.removeChild(meta.el);
  }

  activeLetters.delete(key);
}

function getRandomActiveLetter() {
  const keys = Array.from(activeLetters.keys());

  if (keys.length === 0) return null;

  return keys[Math.floor(Math.random() * keys.length)];
}

async function virtualKeyHandled(key) {
  if (!gameStarted) return;
  
  if (!activeLetters.has(key)) return;
  const meta = activeLetters.get(key);
  
  if (!meta || meta.removed) return;
  meta.el.classList.add("correct");
  await sleep(200);

  removeLetter(key);

  const moneyCof = GetMoneyCof();
  const expCof = GetExpCof();
  const moneyToAdd = Math.floor(1 * moneyCof);
  const expToAdd = Math.floor(1 * expCof);
  const oldExp = GetExpLvl();
  const newExp = oldExp + expToAdd;
  const newMoney = GetMoney() + moneyToAdd;

  ChangeMoney(newMoney);
  ChangeAmountOfValute(newMoney);
  ChangeExpLvl(newExp);

  const locationIndex = GetIndexLocation();
  const oldLvl = Math.floor(oldExp / 100);
  const newLvl = Math.floor(newExp / 100);

  if (newLvl > oldLvl) {
    ChangeLevelOfVacabuular(newLvl);

    if (newLvl > locationIndex && locationIndex < 5) {
      ChangeBacgroundImg(newLvl);
      const indexMusic = GetIndexMus();
      ChangeBackgroundMusic(indexMusic + 1);
    }
  }

  const percent = newExp % 100;
  ChangeShkalaOfVacabular(percent);

  console.log(`+${moneyToAdd} money, +${expToAdd} exp`);
}

async function startSpawnLoop() {
  if (spawnLoopRunning) return;
  spawnLoopRunning = true;

  try {
    while (spawnLoopRunning) {

      if (!gameStarted) {
        await sleep(100);
        continue;
      }

      const dict = GetDict();
      if (!Array.isArray(dict) || dict.length === 0) {
        await sleep(500);
        continue;
      }

      const letter = GetRandomDictLetter();
      if (letter) spawnLetter(letter);

      const currentLevel = Math.floor(GetExpLvl() / 100);

      let delay = LETTER_LIFE / (1 + currentLevel * 0.5);

      delay = Math.max(delay, MIN_SPAWN_DELAY);

      delay *= 0.9 + Math.random() * 0.2;

      await sleep(delay);
    }
  } finally {
    spawnLoopRunning = false;
  }
}


async function startPassiveClickLoop() {
  if (passiveClickRunning) return;
  passiveClickRunning = true;

  
  while (passiveClickRunning) {

      if (!gameStarted) {
          await sleep(100);
          continue;
      }

      const key = getRandomActiveLetter();
      if (key) {
          document.dispatchEvent(makeKeyboardEvent(key));
      }

      const lvl = GetLevelOfUpgrade("TagOfPasiveUpgrade");

      const maxLevel = 31;
      const maxDelay = 3.0;
      const minDelay = 0.1;

      const progress = Math.min(Math.max(lvl, 0), maxLevel) / maxLevel;
      const delay = maxDelay - progress * (maxDelay - minDelay);

      await sleep(delay * 1000);
  }
}


document.addEventListener("keydown", async (e) => {
  if (!gameStarted) {
    e.preventDefault();
    return;
  }
  
  const key = String(e.key || "");
  console.log(key + " on klava");
  if (!key) return;
  if (!activeLetters.has(key)) return;
  await virtualKeyHandled(key);
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("letter")) {
    if (!gameStarted) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
}, true);


function init() {
  startSpawnLoop();
  startPassiveClickLoop();
  
}

init();