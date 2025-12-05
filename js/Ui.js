"use strict"

import { GetValue, ChangeValue, AddValue } from "./LocalStorageController.js";

const TRANSLATIONS = {
    RU: {
        settings_title: "Настройки", 
        lang_label: "Язык", 
        music_vol: "Музыка", 
        sound_vol: "Звуки",
        upgrades_title: "Улучшения", 
        upg1_title: "Больше валюты", 
        upg1_desc: "Больше денег за нажатие",
        upg2_title: "Опыт x2", 
        upg2_desc: "Ускоренная прокачка уровня",
        upg3_title: "Авто-клик", 
        upg3_desc: "Пассивный доход валюты",
        upg4_title: "Удалить капслок",
        upg4_desc: "Удаляет Заглавные буквы с каждым уровнем",
        upg5_title: "Добавить цифры",
        upg5_desc: "Добавляет цифры с каждым уровнем",
        upg6_title: "Удалить спецсимволы",
        upg6_desc: "Удаляет спецсимволи с каждым уровнем"
    },
    EN: 
    {
        settings_title: "Settings", 
        lang_label: "Language", 
        music_vol: "Music", 
        sound_vol: "SFX",
        upgrades_title: "Upgrades", 

        upg1_title: "More Money", 
        upg1_desc: "More cash per click",

        upg2_title: "XP x2", 
        upg2_desc: "Faster level up",

        upg3_title: "Auto-click", 
        upg3_desc: "Passive income",

        upg4_title: "Remove Caps Lock",
        upg4_desc: "Removes uppercase letters every level",

        upg5_title: "Add Numbers",
        upg5_desc: "Adds numbers every level",

        upg6_title: "Remove Special Characters",
        upg6_desc: "Removes special characters every level"
    },
    UA: 
    {
        settings_title: "Налаштування", 
        lang_label: "Мова", 
        music_vol: "Музика", 
        sound_vol: "Звуки",
        upgrades_title: "Покращення", 

        upg1_title: "Більше валюти", 
        upg1_desc: "Більше грошей за клік",

        upg2_title: "Досвід x2", 
        upg2_desc: "Швидше підвищення рівня",

        upg3_title: "Авто-клік", 
        upg3_desc: "Пасивний дохід",

        upg4_title: "Прибрати капслок",
        upg4_desc: "Зменшує кількість великих букв з кожним рівнем",

        upg5_title: "Додати цифри",
        upg5_desc: "Додає цифри з кожним рівнем",

        upg6_title: "Прибрати спецсимволи",
        upg6_desc: "Прибирає спецсимволи з кожним рівнем"
    }
};

const UI_STATE = {
    currentLang: "RU",
    backgrounds: ["http://www.superbis.com.ua/wp-content/uploads/2025/12/1.jpg",  // CHANGED!!!
                    "http://www.superbis.com.ua/wp-content/uploads/2025/12/2.jpg",
                    "http://www.superbis.com.ua/wp-content/uploads/2025/12/3.jpg",
                    "http://www.superbis.com.ua/wp-content/uploads/2025/12/4.jpg",
                    "http://www.superbis.com.ua/wp-content/uploads/2025/12/5.jpg"],
    musicTracks: ["http://www.superbis.com.ua/wp-content/uploads/2025/12/1.mp3",
                    "http://www.superbis.com.ua/wp-content/uploads/2025/12/2.mp3",
                    "http://www.superbis.com.ua/wp-content/uploads/2025/12/3.mp3",
                    "http://www.superbis.com.ua/wp-content/uploads/2025/12/4.mp3",
                    "http://www.superbis.com.ua/wp-content/uploads/2025/12/5.mp3"],
    bgIndex: 0,
    musicIndex: 0,
    upgrades: {
        upgrade_1: { level: 0, basePrice: 100, price: 100, maxLvl: 50 },
        upgrade_2: { level: 0, basePrice: 250, price: 250, maxLvl: 37 },
        upgrade_3: { level: 0, basePrice: 500, price: 500, active: false, maxLvl: 31 },
        upgrade_no_caps: { level: 0, basePrice: 300, price: 300, maxLvl: 27 },
        upgrade_more_digits: { level: 0, basePrice: 400, price: 400, maxLvl: 12 },
        upgrade_no_symbols: { level: 0, basePrice: 500, price: 500, maxLvl: 28 }
    },
    autoClickInterval: null
};

export let gameStarted = false; // CHANGED!!!
let soundVolume = 50;
let musicVolume = 50;

function calcPrice(basePrice, level) {
    return Math.floor(basePrice * Math.pow(1.5, level));
}

function loadUpgradesFromStorage() { // CHANGED!!! New function
    const saved = GetValue("game_upgrades");
    if (!saved || typeof saved !== "object") return;
    
    Object.keys(saved).forEach(upgradeId => {
        const target = UI_STATE.upgrades[upgradeId];
        const source = saved[upgradeId];
        
        if (target && source) {
            target.level = source.level || 0;
            target.price = calcPrice(target.basePrice, target.level);
            
            if (upgradeId === "upgrade_3" && target.level > 0 && !target.active) {
                target.active = true;
                startAutoClick();
            }
        }
    });
    
    updateUpgradesUI();
}

function saveUpgradesToStorage() { // CHANGED!!! New function
    const out = {};
    Object.entries(UI_STATE.upgrades).forEach(([id, upgrade]) => {
        out[id] = {
            level: upgrade.level || 0,
            basePrice: upgrade.basePrice
        };
    });
    ChangeValue("game_upgrades", out);
}

function saveLanguageToStorage() { // CHANGED!!! New function
    ChangeValue("game_language", UI_STATE.currentLang);
}

function loadLanguageFromStorage() {  // CHANGED!!! New function
    const savedLang = GetValue("game_language");
    if (savedLang && TRANSLATIONS[savedLang]) {
        UI_STATE.currentLang = savedLang;
    }
}

function updateUpgradeElement(upgradeId) { // CHANGED!!! New function
    const upgrade = UI_STATE.upgrades[upgradeId];
    const el = document.getElementById(upgradeId);
    if (!el) return;
    
    const priceEl = el.querySelector(".price");
    const descEl = el.querySelector(".upgrade-info p");
    const btn = el.querySelector(".buy-btn");
    
    if (upgrade.maxLvl !== undefined && upgrade.level >= upgrade.maxLvl) {
        if (priceEl) priceEl.innerText = "Макс. уровень";
        if (btn) btn.disabled = true;
    } else {
        if (priceEl) priceEl.innerText = `Ł${upgrade.price}`;
        if (btn) btn.disabled = false;
    }
    
    if (descEl && descEl.dataset.lang) {
        const baseDesc = TRANSLATIONS[UI_STATE.currentLang][descEl.dataset.lang];
        if (baseDesc) {
            descEl.innerText = `${baseDesc} (Уровень: ${upgrade.level})`;
        }
    }
}

function updateUpgradesUI() { // CHANGED!!! New function
    Object.keys(UI_STATE.upgrades).forEach(upgradeId => {
        updateUpgradeElement(upgradeId);
    });
}

function initListeners() {
    document.getElementById("OpenSettings").onclick = () => {
        document.getElementById("SettingsPanel").classList.remove("hidden");
    };
    
    document.getElementById("CloseSettings").onclick = () => {
        document.getElementById("SettingsPanel").classList.add("hidden");
    };

    const musicSlider = document.getElementById("MusicSlider");
    musicSlider.value = musicVolume;
    musicSlider.oninput = (e) => {
        if (!gameStarted) return;
        musicVolume = e.target.value;
        document.getElementById("bgMusic").volume = musicVolume / 100;
    };

    const soundSlider = document.getElementById("SoundSlider");
    soundSlider.value = soundVolume;
    soundSlider.oninput = (e) => {
        if (!gameStarted) return;
        soundVolume = e.target.value;
        document.getElementById("clickSound").volume = soundVolume / 100;
    };
    
    const langBtns = document.querySelectorAll(".lang-btn");
    langBtns.forEach(btn => {
        btn.onclick = () => {
            if (!gameStarted) return;
            langBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            applyLanguage(btn.getAttribute("data-target"));
        };
    });

    document.getElementById("GetMoney").onclick = () => {
        if (!gameStarted) return;
        addMoney(1);
        playSfx();
    };

    document.getElementById("ChangeLevelOfUpgrade").onclick = (e) => {
        const btn = e.target.closest('.buy-btn');
        if (btn) {
            const upgradeItem = btn.closest('.upgrade-item');
            if (upgradeItem) {
                buyUpgrade(upgradeItem.id);
            }
        }
    };

    document.body.addEventListener('click', () => {
        const music = document.getElementById("bgMusic");
        if (music && music.paused) {
            music.play().catch(() => {});
        }
    }, { once: true });
}

function applyLanguage(lang) {   // CHANGED!!!
    UI_STATE.currentLang = lang;
    const texts = TRANSLATIONS[lang];
    
    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.getAttribute("data-lang");
        if (texts[key]) {
            el.innerText = texts[key];
        }
    });
    
    updateUpgradesUI();  // CHANGED!!! New string
    
    saveLanguageToStorage();
}

function playSfx() {
    const sfx = document.getElementById("clickSound");
    if (sfx) {
        sfx.currentTime = 0;
        sfx.play().catch(() => {});
    }
}

function addMoney(amount) {
    if (!gameStarted) return false;
    
    const el = document.getElementById("moneyValue");
    if (el) {
        let currentMoney = parseInt(el.innerText.replace('Ł', '')) || 0;
        
        if (UI_STATE.upgrades.upgrade_1.level > 0) {
            amount *= (1 + UI_STATE.upgrades.upgrade_1.level * 2);
        }
        
        currentMoney += amount;
        el.innerText = `Ł${currentMoney}`;
        
        ChangeValue("game_money", currentMoney);
        
        addExperience(1);
        return true;
    }
    return false;
}

function addExperience(amount) {
    if (!gameStarted) return;
    
    if (UI_STATE.upgrades.upgrade_2.level > 0) {
        amount *= (1 + UI_STATE.upgrades.upgrade_2.level * 0.25);
    }
    
    const currentLevelEl = document.getElementById("currentLevel");
    const progressBar = document.getElementById("SetTimeRange");
    const progressText = document.querySelector(".progress-text");
    
    if (!currentLevelEl || !progressBar || !progressText) return;
    
    let currentLevel = parseInt(currentLevelEl.innerText) || 1;
    let currentPercent = parseFloat(progressBar.style.width) || 0;
    
    currentPercent += amount;
    
    if (currentPercent >= 100) {
        currentLevel++;
        currentPercent = currentPercent - 100;
        currentLevelEl.innerText = currentLevel;
    }
    
    progressBar.style.width = `${currentPercent}%`;
    progressText.innerText = `${Math.floor(currentPercent)}%`;
    
    const totalExp = (currentLevel - 1) * 100 + currentPercent;
    ChangeValue("game_experience", totalExp);
}

function buyUpgrade(upgradeId) {
    if (!gameStarted) return false;
    
    const upgrade = UI_STATE.upgrades[upgradeId];
    if (!upgrade) return false;
    
    if (upgrade.maxLvl !== undefined && upgrade.level >= upgrade.maxLvl) {
        return false;
    }
    
    const moneyEl = document.getElementById("moneyValue");
    const currentMoney = parseInt(moneyEl.innerText.replace('Ł', '')) || 0;
    
    if (currentMoney < upgrade.price) {
        alert("Недостаточно денег!");
        return false;
    }
    
    const newMoney = currentMoney - upgrade.price;
    moneyEl.innerText = `Ł${newMoney}`;
    
    ChangeValue("game_money", newMoney);
    
    upgrade.level++;
    upgrade.price = calcPrice(upgrade.basePrice, upgrade.level);
    
    updateUpgradeElement(upgradeId);
    applyUpgradeEffect(upgradeId); 
    saveUpgradesToStorage();// CHANGED!!!
    
    playSfx();
    return true;
}

function startAutoClick() {
    if (UI_STATE.autoClickInterval) {
        clearInterval(UI_STATE.autoClickInterval);
    }
    
    const delay = Math.max(0, 3.0 - (UI_STATE.upgrades.upgrade_3.level * 0.1));
    UI_STATE.autoClickInterval = setInterval(() => {
        addMoney(1);
    }, delay * 1000);
}

function applyUpgradeEffect(upgradeId) {
    switch(upgradeId) {
        case 'upgrade_1':
            break;
            
        case 'upgrade_2':
            break;
            
        case 'upgrade_3':
            if (!UI_STATE.upgrades.upgrade_3.active && UI_STATE.upgrades.upgrade_3.level > 0) {
                UI_STATE.upgrades.upgrade_3.active = true;
                startAutoClick();
            } else if (UI_STATE.upgrades.upgrade_3.level > 0) {
                startAutoClick();
            }
            break;
            
        case 'upgrade_no_caps':
            if (typeof DictController !== 'undefined' && DictController.DeleteChar) {
                DictController.DeleteChar('CAPS_LOCK_MODE');
            }
            break;
            
        case 'upgrade_more_digits':
            if (typeof DictController !== 'undefined' && DictController.AddLetter) {
                DictController.AddLetter('0-9');
            }
            break;
            
        case 'upgrade_no_symbols':
            if (typeof DictController !== 'undefined' && DictController.DeleteChar) {
                DictController.DeleteChar('SPECIAL_SYMBOLS');
            }
            break;
    }
}

export function GetVolume() {
    return parseInt(soundVolume);
}

export function GetLanguage() {
    return UI_STATE.currentLang;
}

export function GetAmountOfValute() {
    const el = document.getElementById('moneyValue');
    return el ? parseInt(el.innerText.replace('Ł', '')) || 0 : 0;
}

export function GetLevelOfUpgrade(id) {
    return UI_STATE.upgrades[id]?.level || 0;
}

export function ChangeLevelOfVacabuular(lv) {
    const el = document.getElementById('currentLevel');
    if (el) {
        el.innerText = lv;
        return true;
    }
    return false;
}

export function ChangeShkalaOfVacabular(percent) {
    const bar = document.getElementById('SetTimeRange');
    const text = document.querySelector('.progress-text');

    if (bar) {
        bar.style.width = percent + '%';
        if (text) text.innerText = Math.floor(percent) + '%';
        return true;
    }
    return false;
}

export function ChangeAmountOfValute(amount) {
    const el = document.getElementById('moneyValue');
    if (el) {
        el.innerText = `Ł${amount}`;
        ChangeValue("game_money", amount);
        return true;
    }
    return false;
}

export function ChangeBacgroundImg(index = 0) {
    const bgLayer = document.getElementById('bgLayer');

    if (index > UI_STATE.backgrounds.length) {
        console.error("index error")
        return false;
    }
    else
    {
        UI_STATE.bgIndex = index;
    }

    const newImg = UI_STATE.backgrounds[UI_STATE.bgIndex];

    if (bgLayer && newImg) {
        const img = new Image();
        img.src = newImg;
        img.onload = () => {
            bgLayer.style.backgroundImage = `url('${newImg}')`;
            bgLayer.style.transition = 'background-image 0.5s ease';
        };
        console.log("bg changed");
        return true;
    }
    console.error("Wrong element get");
    return false;
}

export function ChangeBackgroundMusic(index = 0) {
    const audio = document.getElementById('bgMusic');

    if (index >= UI_STATE.musicTracks.length) {
        console.error("index error");
        return false;
    } else {
        UI_STATE.musicIndex = index;
    }

    const newTrack = UI_STATE.musicTracks[UI_STATE.musicIndex];

    if (audio && newTrack) {
        const tempAudio = new Audio();
        tempAudio.src = newTrack;

        tempAudio.oncanplaythrough = () => {
            const wasPlaying = !audio.paused;

            audio.src = newTrack;
            audio.volume = musicVolume / 100;

            if (wasPlaying) {
                audio.play().catch(() => console.log("Автовоспроизведение заблокировано"));
            }

            console.log("music changed");
        };

        tempAudio.onerror = () => {
            console.error("Ошибка загрузки трека");
        };

        return true;
    }

    console.error("Wrong element get");
    return false;
}

export function InitAudio() {
    const audio = document.getElementById('bgMusic');
    if (audio) {
        audio.volume = musicVolume / 100;
    }
    return true;
}

function loadGameData() {  // CHANGED!!! New function
    const savedMoney = GetValue("game_money");
    if (savedMoney !== null) {
        ChangeAmountOfValute(savedMoney);
    }
    
    const savedExp = GetValue("game_experience");
    if (savedExp !== null) {
        const level = Math.floor(savedExp / 100);
        const percent = savedExp % 100;
        
        ChangeLevelOfVacabuular(level);
        ChangeShkalaOfVacabular(percent);
    }
    
    loadLanguageFromStorage();
    loadUpgradesFromStorage();
}

document.addEventListener('DOMContentLoaded', () => {   // CHANGED!!! New string
    loadGameData(); // CHANGED!!!
    initListeners();
    applyLanguage(UI_STATE.currentLang);
    InitAudio();
    
    if (UI_STATE.upgrades.upgrade_3.level > 0) {
        startAutoClick();
    }
});

export function preloadAssets() {
    const assets = [
        ...UI_STATE.backgrounds,
        ...UI_STATE.musicTracks
    ];
    
    assets.forEach(src => {
        if (src.endsWith('.jpg') || src.endsWith('.png')) {
            const img = new Image();
            img.src = src;
        }
    });
}

const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');

function closeStartScreen() {
    startScreen.style.opacity = "0";
    setTimeout(() => {
        startScreen.style.display = "none";
        gameStarted = true;
    }, 500);
}

if (startBtn) {
    startBtn.addEventListener("click", closeStartScreen);
}
