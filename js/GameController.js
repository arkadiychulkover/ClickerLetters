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
  GetRandomDictLetter,
  ChangeMusic,
  ChangeLoc
} from "./DictController.js";

import {
  ChangeBackgroundMusic,
  ChangeBacgroundImg,
  ChangeLevelOfVacabuular,
  ChangeShkalaOfVacabular,
  ChangeAmountOfValute,
  GetLevelOfUpgrade as UIGetLevelOfUpgrade,
  GetIndexLocation as UIGetIndexLocation,
  GetIndexMus as UIGetIndexMus
} from "./Ui.js";

const lettersZone = document.getElementById("lettersZone");

const activeLetters = new Map();
let spawnLoopRunning = false;
let passiveClickRunning = false;

const BASE_SPAWN_DELAY = 2000;
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
  const letterEl = document.createElement("div");

  letterEl.classList.add("letter", `letter-${letter}`);
  letterEl.textContent = letter;
  letterEl.style.position = "absolute";

  letterEl.style.left = `${Math.floor(Math.random() * 100)}%`;
  letterEl.style.top = `${Math.floor(Math.random() * 100)}%`;

  return letterEl;
}

function spawnLetter(letter) {
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

  const oldLvl = Math.floor(oldExp / 100);
  const newLvl = Math.floor(newExp / 100);

  if (newLvl > oldLvl) {
    ChangeLevelOfVacabuular(newLvl);
    
    // Определяем, на какую локацию нужно перейти в зависимости от уровня
    // Например: каждые 5 уровней меняем локацию (уровни: 5, 10, 15, 20, 25)
    const LEVELS_PER_LOCATION = 5;
    const currentLocationIndex = GetIndexLocation();
    
    // Рассчитываем целевую локацию (0-4 для 5 локаций)
    const targetLocationIndex = Math.min(Math.floor((newLvl - 1) / LEVELS_PER_LOCATION), 4);
    
    console.log(`Level: ${newLvl}, Current location: ${currentLocationIndex}, Target location: ${targetLocationIndex}`);
    
    if (targetLocationIndex > currentLocationIndex) {
      console.log(`Changing location to ${targetLocationIndex}`);
      
      // Меняем фон
      ChangeBacgroundImg(targetLocationIndex);
      
      // Меняем музыку (можно привязать к локации или использовать отдельную логику)
      const targetMusicIndex = targetLocationIndex; // или другая логика
      ChangeBackgroundMusic(targetMusicIndex);
      
      // Сохраняем изменения
      ChangeLoc(targetLocationIndex);
      ChangeMusic(targetMusicIndex);
      
      console.log(`Location changed to ${targetLocationIndex}, music to ${targetMusicIndex}`);
    }
    
    // Обновляем прогресс шкалы
    const percent = newExp % 100;
    ChangeShkalaOfVacabular(percent);
    
    console.log(`+${moneyToAdd} money, +${expToAdd} exp, level: ${newLvl}`);
  } else {
    // Если уровень не изменился, просто обновляем прогресс
    const percent = newExp % 100;
    ChangeShkalaOfVacabular(percent);
  }
}

async function startSpawnLoop() {
  if (spawnLoopRunning) return;
  spawnLoopRunning = true;

  try {
    while (spawnLoopRunning) {
      const dict = GetDict();

      if (!Array.isArray(dict) || dict.length === 0) {
        await sleep(1000);
        continue;
      }

      const letter = GetRandomDictLetter();

      if (letter) spawnLetter(letter);

      const level = GetExpLvl();
      const speedFactor = 1 + level / 5;
      let delay = Math.max(MIN_SPAWN_DELAY, BASE_SPAWN_DELAY / speedFactor);

      delay = Math.floor(delay * (0.6 + Math.random() * 0.8));
      await sleep(delay / 10);
    }
  } finally {
    spawnLoopRunning = false;
  }
}

function stopSpawnLoop() {
  spawnLoopRunning = false;
}

async function startPassiveClickLoop() {
  if (passiveClickRunning) return;
  passiveClickRunning = true;
  try {
    while (passiveClickRunning) {
      const key = getRandomActiveLetter();
      if (key) {
        const ev = makeKeyboardEvent(key);
        document.dispatchEvent(ev);
      }
      const upgradeSpeed = GetLevelOfUpgrade("TagOfPasiveUpgrade");
      const delaySecs = Math.max(0.3, upgradeSpeed || 1);
      await sleep(delaySecs * 100);
    }
  } finally {
    passiveClickRunning = false;
  }
}

function stopPassiveClickLoop() {
  passiveClickRunning = false;
}

document.addEventListener("keydown", async (e) => {
  const key = String(e.key || "");
  console.log(key + " on klava");
  if (!key) return;
  if (!activeLetters.has(key)) return;
  await virtualKeyHandled(key);
});

// Функция для восстановления сохраненного состояния
function restoreGameState() {
  const savedLocIndex = GetIndexLocation();
  const savedMusIndex = GetIndexMus();
  
  console.log(`Restoring game state: location=${savedLocIndex}, music=${savedMusIndex}`);
  
  // Восстанавливаем фон и музыку
  ChangeBacgroundImg(savedLocIndex);
  ChangeBackgroundMusic(savedMusIndex);
}

function init() {
  // Восстанавливаем сохраненное состояние
  restoreGameState();
  
  // Запускаем игровые циклы
  startSpawnLoop();
  startPassiveClickLoop();
}

init();