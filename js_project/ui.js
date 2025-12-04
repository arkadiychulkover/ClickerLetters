const TRANSLATIONS = {
    RU: {
        settings_title: "Настройки", lang_label: "Язык", music_vol: "Музыка", sound_vol: "Звуки",
        upgrades_title: "Улучшения", upg1_title: "Больше валюты", upg1_desc: "Больше денег за нажатие",
        upg2_title: "Опыт x2", upg2_desc: "Ускоренная прокачка уровня",
        upg3_title: "Авто-клик", upg3_desc: "Пассивный доход валюты"
    },
    EN: {
        settings_title: "Settings", lang_label: "Language", music_vol: "Music", sound_vol: "SFX",
        upgrades_title: "Upgrades", upg1_title: "More Money", upg1_desc: "More cash per click",
        upg2_title: "XP x2", upg2_desc: "Faster level up",
        upg3_title: "Auto-click", upg3_desc: "Passive income"
    },
    UA: {
        settings_title: "Налаштування", lang_label: "Мова", music_vol: "Музика", sound_vol: "Звуки",
        upgrades_title: "Покращення", upg1_title: "Більше валюти", upg1_desc: "Більше грошей за клік",
        upg2_title: "Досвід x2", upg2_desc: "Прискорена прокачка",
        upg3_title: "Авто-клік", upg3_desc: "Пасивний дохід"
    }
};

const UI_STATE = {
    currentLang: "RU",
    backgrounds: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
    musicTracks: ["moodmode_-_Japanese_Garden.mp3"],
    bgIndex: 0,
    musicIndex: 0
};

let soundVolume = 50;
const settingsPanel = document.getElementById('SettingsPanel');

/* INIT LISTENERS*/
function initListeners() {
    
    document.getElementById("OpenSettings").onclick = () => {
        document.getElementById("SettingsPanel").classList.remove("hidden");
    };
    

    
    
    document.getElementById("CloseSettings").onclick = () => {
        document.getElementById("SettingsPanel").classList.add("hidden");
    };

    
    document.getElementById("MusicSlider").oninput = (e) => {
        let volume = e.target.value / 100;
        document.getElementById("bgMusic").volume = volume;
    };

    
    document.getElementById("SoundSlider").oninput = (e) => {
        let volume = e.target.value / 100;
        document.getElementById("clickSound").volume = volume;
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

    
    document.body.addEventListener('click', () => {
        const music = document.getElementById("bgMusic");
        if (music && music.paused) {
            music.play().catch(() => {});
        }
    }, { once: true });
    
    
    const upgradePanel = document.getElementById("ChangeLevelOfUpgrade");
    if(upgradePanel) {
        upgradePanel.onclick = (e) => {
            const btn = e.target.closest('.buy-btn');
            if (btn && !btn.classList.contains('disabled')) {
                playSfx(); 
            }
        };
    }
}

/*Language switcher*/
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


initListeners();

/* PRIVATE FUNCTIONS*/

function ChangeMusicVol(e, lambda) {
    const volume = e.target.value;
    const music = document.getElementById('bgMusic');

    if (music) {
        music.volume = volume / 100;
    }

    if (lambda) lambda(volume);
    return true;
}

function ChangeSoundVol(e, lambda) {
    soundVolume = e.target.value;

    if (lambda) lambda(soundVolume);
    return true;
}

function ChangeLanguage(e, lambda) {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return false;

    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const newLang = btn.dataset.target;
    UI_STATE.currentLang = newLang;

    applyTranslations(newLang);

    if (lambda) lambda(newLang);
    return true;
}

function ChangeLevelOfUpgrade(e, lambda) {
    const btn = e.target.closest('.upgrade-item');
    if (!btn || btn.classList.contains('disabled')) return false;

    const id = btn.id;
    const priceEl = btn.querySelector(".price");
    if (!priceEl) return false;

    const price = parseInt(priceEl.innerText);
    const moneyEl = document.getElementById("moneyValue");
    let money = parseInt(moneyEl.innerText);

    if (money < price) return false;

    money -= price;
    moneyEl.innerText = money;

    if (id === 'upgrade_1') {
        DictController.ChangeMoneyCof(1);
    }
    else if (id === 'upgrade_2') {
        DictController.ChangeExpCof(1);
    }
    else if (id === 'upgrade_3') {
        setInterval(() => {
            const el = document.getElementById('moneyValue');
            el.innerText = parseInt(el.innerText) + 1;
        }, 1000);
    }
    else if (id === 'upgrade_no_caps') {
        DictController.DeleteChar('CAPS_LOCK_MODE');
    }
    else if (id === 'upgrade_more_digits') {
        DictController.AddLetter('0-9');
    }
    else if (id === 'upgrade_no_symbols') {
        DictController.DeleteChar('SPECIAL_SYMBOLS');
    }

    if (lambda) lambda(id);
    return true;
}

/*PUBLIC FUNCTIONS*/

export function GetVolume() {
    return parseInt(soundVolume);
}

export function GetLanguage() {
    return UI_STATE.currentLang;
}

export function GetAmountOfValute() {
    const el = document.getElementById('moneyValue');
    return el ? parseInt(el.innerText) : 0;
}

export function GetLevelOfUpgrade(id) {
    return 0; 
}

export function ChangeLevelOfVacaBuular(lv) {
    const el = document.getElementById('currentLevel');
    if (el) {
        el.innerText = lv;
        return true;
    }
    return false;
}

export function ChangeShkalaOfVacaBuular(percent) {
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
        el.innerText = amount;
        return true;
    }
    return false;
}

export function ChangeBacgroundImg(isInit = false) {
    const bgLayer = document.getElementById('bgLayer');

    if (!isInit) {
        UI_STATE.bgIndex = (UI_STATE.bgIndex + 1) % UI_STATE.backgrounds.length;
    }

    const newImg = UI_STATE.backgrounds[UI_STATE.bgIndex];

    if (bgLayer && newImg) {
        bgLayer.style.backgroundImage = `url('${newImg}')`;
        return true;
    }
    return false;
}

export function ChangeBackgroundMusic(isInit = false) {
    const audio = document.getElementById('bgMusic');

    if (!isInit) {
        UI_STATE.musicIndex = (UI_STATE.musicIndex + 1) % UI_STATE.musicTracks.length;
    }

    const newMusic = UI_STATE.musicTracks[UI_STATE.musicIndex];

    if (audio && newMusic) {
        audio.src = newMusic;
        audio.play().catch(e => console.error("Music play failed:", e));
        return true;
    }
    return false;
}

export function InitAudio() {
    ChangeBackgroundMusic(true);

    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);

    return true;
}




function handleFirstInteraction() {
    if (typeof InitAudio === 'function') {
        InitAudio();
    }
}

document.addEventListener('click', handleFirstInteraction, { once: true });
document.addEventListener('keydown', handleFirstInteraction, { once: true });
