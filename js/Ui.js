"use strict"

import { ChangeMoney } from "../js/DictController.js";

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
        upg6_desc: "Удаляет спецсимволы с каждым уровнем"
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
    backgrounds: ["../assets/1.jpg", "../assets/2.jpg", "../assets/3.jpg", "../assets/4.jpg", "../assets/5.jpg"],
    musicTracks: ["../assets/1.mp3", "../assets/2.mp3", "../assets/3.mp3", "../assets/4.mp3", "../assets/5.mp3"],
    bgIndex: 0,
    musicIndex: 0,
    upgrades: {
        upgrade_1: { level: 0, basePrice: 100, price: 100 },
        upgrade_2: { level: 0, basePrice: 250, price: 250 },
        upgrade_3: { level: 0, basePrice: 500, price: 500, active: false },
        upgrade_no_caps: { level: 0, basePrice: 300, price: 300 },
        upgrade_more_digits: { level: 0, basePrice: 400, price: 400 },
        upgrade_no_symbols: { level: 0, basePrice: 500, price: 500 }
    },
    autoClickInterval: null
};

let soundVolume = 50;
let musicVolume = 50;

function initListeners() {
    // Открытие настроек
    document.getElementById("OpenSettings").onclick = () => {
        document.getElementById("SettingsPanel").classList.remove("hidden");
    };
    
    // Закрытие настроек
    document.getElementById("CloseSettings").onclick = () => {
        document.getElementById("SettingsPanel").classList.add("hidden");
    };

    // Управление музыкой
    const musicSlider = document.getElementById("MusicSlider");
    musicSlider.value = musicVolume;
    musicSlider.oninput = (e) => {
        musicVolume = e.target.value;
        document.getElementById("bgMusic").volume = musicVolume / 100;
    };

    // Управление звуками
    const soundSlider = document.getElementById("SoundSlider");
    soundSlider.value = soundVolume;
    soundSlider.oninput = (e) => {
        soundVolume = e.target.value;
        document.getElementById("clickSound").volume = soundVolume / 100;
    };
    
    // Кнопки языков
    const langBtns = document.querySelectorAll(".lang-btn");
    langBtns.forEach(btn => {
        btn.onclick = () => {
            langBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            applyLanguage(btn.getAttribute("data-target"));
        };
    });

    // Клик по основной кнопке для заработка
    document.getElementById("GetMoney").onclick = () => {
        addMoney(1);
        playSfx();
    };

    // Обработчик покупки улучшений
    document.getElementById("ChangeLevelOfUpgrade").onclick = (e) => {
        const btn = e.target.closest('.buy-btn');
        if (btn) {
            const upgradeItem = btn.closest('.upgrade-item');
            if (upgradeItem) {
                buyUpgrade(upgradeItem.id);
            }
        }
    };

    // Автовоспроизведение музыки при первом взаимодействии
    document.body.addEventListener('click', () => {
        const music = document.getElementById("bgMusic");
        if (music && music.paused) {
            music.play().catch(() => {});
        }
    }, { once: true });
}

function applyLanguage(lang) {
    UI_STATE.currentLang = lang;
    const texts = TRANSLATIONS[lang];
    
    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.getAttribute("data-lang");
        if (texts[key]) {
            el.innerText = texts[key];
        }
    });
}

function playSfx() {
    const sfx = document.getElementById("clickSound");
    if (sfx) {
        sfx.currentTime = 0;
        sfx.play().catch(() => {});
    }
}

function addMoney(amount) {
    const el = document.getElementById("moneyValue");
    if (el) {
        let currentMoney = parseInt(el.innerText.replace('Ł', '')) || 0;
        // Учет улучшения для увеличения дохода
        if (UI_STATE.upgrades.upgrade_1.level > 0) {
            amount *= (1 + UI_STATE.upgrades.upgrade_1.level);
        }
        currentMoney += amount;
        el.innerText = `Ł${currentMoney}`;
        
        // Увеличение опыта при клике
        addExperience(1);
        return true;
    }
    return false;
}

function addExperience(amount) {
    // Учет улучшения для ускорения прокачки
    if (UI_STATE.upgrades.upgrade_2.level > 0) {
        amount *= 2;
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
}

function buyUpgrade(upgradeId) {
    const upgrade = UI_STATE.upgrades[upgradeId];
    if (!upgrade) return false;
    
    const moneyEl = document.getElementById("moneyValue");
    const currentMoney = parseInt(moneyEl.innerText.replace('Ł', '')) || 0;
    
    if (currentMoney < upgrade.price) {
        alert("Недостаточно денег!");
        return false;
    }
    
    const newMoney = currentMoney - upgrade.price;
    moneyEl.innerText = `Ł${newMoney}`;
    ChangeMoney(newMoney);
    
    upgrade.level++;
    upgrade.price = Math.floor(upgrade.basePrice * Math.pow(1.5, upgrade.level));
    
    const upgradeElement = document.getElementById(upgradeId);
    if (upgradeElement) {
        const priceElement = upgradeElement.querySelector(".price");
        if (priceElement) {
            priceElement.innerText = `Ł${upgrade.price}`;
        }
        
        // Обновление уровня улучшения в описании
        const descElement = upgradeElement.querySelector(".upgrade-info p");
        if (descElement && descElement.dataset.lang) {
            const baseDesc = TRANSLATIONS[UI_STATE.currentLang][descElement.dataset.lang];
            descElement.innerText = `${baseDesc} (Уровень: ${upgrade.level})`;
        } else if (descElement) {
            const baseText = descElement.innerText.split('(')[0].trim();
            descElement.innerText = `${baseText} (Уровень: ${upgrade.level})`;
        }
    }
    
    applyUpgradeEffect(upgradeId);
    
    playSfx();
    return true;
}

function applyUpgradeEffect(upgradeId) {
    switch(upgradeId) {
        case 'upgrade_1':
            break;
            
        case 'upgrade_2':
            break;
            
        case 'upgrade_3':
            if (!UI_STATE.upgrades.upgrade_3.active) {
                UI_STATE.upgrades.upgrade_3.active = true;
                UI_STATE.autoClickInterval = setInterval(() => {
                    addMoney(1);
                }, 1000);
            }
            break;
            
        case 'upgrade_no_caps':
            DictController.DeleteChar('CAPS_LOCK_MODE');
            break;
            
        case 'upgrade_more_digits':
            DictController.AddLetter('0-9');
            break;
            
        case 'upgrade_no_symbols':
            DictController.DeleteChar('SPECIAL_SYMBOLS');
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
        return true;
    }
    return false;
}

export function ChangeBacgroundImg(index = 0) {
    const bgLayer = document.getElementById('bgLayer');

    console.warn("Bg index: "+ index)
    if (index > UI_STATE.backgrounds.length) {
        console.error("index error bg")
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
        console.error("index error mus");
        return false;
    } else {
        UI_STATE.musicIndex = index;
    }

    const newTrack = UI_STATE.musicTracks[UI_STATE.musicIndex];
    console.warn("Mus index: "+ index)

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

export function GetIndexLocation() {
    return UI_STATE.bgIndex;
}

export function GetIndexMus() {
    return UI_STATE.musicIndex;
}

document.addEventListener('DOMContentLoaded', () => {
    initListeners();
    applyLanguage(UI_STATE.currentLang);
    
    try 
    {
        let level = getElementById("InitAudio");
        level.innerText = GetExpLvl();
    } 
    catch (error) {
        console.error("Error loading saved state:", error);
        // Устанавливаем значения по умолчанию
    }
    
    InitAudio();
    
    Object.keys(UI_STATE.upgrades).forEach(upgradeId => {
        const element = document.getElementById(upgradeId);
        if (element) {
            const priceElement = element.querySelector(".price");
            if (priceElement) {
                priceElement.innerText = `Ł${UI_STATE.upgrades[upgradeId].price}`;
            }
        }
    });
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
    }, 500);
}

startBtn.addEventListener("click", closeStartScreen);
//ChangeBackgroundMusic(1);
//ChangeBacgroundImg(3);