import { characters, audiences, ideas, contexts } from './data.js';

let currentCharacter, currentAudience, currentContext, currentIdea;
let selectedCharacters = [];
let selectedAudiences = [];
let selectedContexts = [];
let selectedIdeas = [];
let screenWidth;

function updateScreenWidth() {
    const sidePadding = 10;
    screenWidth = window.innerWidth - 2 * sidePadding;
}

function loadSelections() {
    try {
        selectedCharacters = JSON.parse(localStorage.getItem('selectedCharacters')) || [];
        selectedAudiences = JSON.parse(localStorage.getItem('selectedAudiences')) || [];
        selectedContexts = JSON.parse(localStorage.getItem('selectedContexts')) || [];
        selectedIdeas = JSON.parse(localStorage.getItem('selectedIdeas')) || [];
    } catch (e) {}
}

function saveSelections() {
    try {
        localStorage.setItem('selectedCharacters', JSON.stringify(selectedCharacters));
        localStorage.setItem('selectedAudiences', JSON.stringify(selectedAudiences));
        localStorage.setItem('selectedContexts', JSON.stringify(selectedContexts));
        localStorage.setItem('selectedIdeas', JSON.stringify(selectedIdeas));
    } catch (e) {}
}

const PremiumFallback = {
    isPremiumUser: () => false,
    freeCharacters: () => {
        const dayNum = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        const shuffled = [...characters].sort((a, b) => seededRandom(dayNum + characters.indexOf(a)) - seededRandom(dayNum + characters.indexOf(b)));
        return shuffled.slice(0, 3);
    },
    freeAudiences: () => {
        const dayNum = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        const shuffled = [...audiences].sort((a, b) => seededRandom(dayNum + audiences.indexOf(a)) - seededRandom(dayNum + audiences.indexOf(b)));
        return shuffled.slice(0, 3);
    },
    freeContexts: () => {
        const dayNum = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        const shuffled = [...contexts].sort((a, b) => seededRandom(dayNum + contexts.indexOf(a)) - seededRandom(dayNum + contexts.indexOf(b)));
        return shuffled.slice(0, 3);
    },
    freeIdeas: () => {
        const dayNum = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        const shuffled = [...ideas].sort((a, b) => seededRandom(dayNum + ideas.indexOf(a)) - seededRandom(dayNum + ideas.indexOf(b)));
        return shuffled.slice(0, 3);
    },
    checkPremiumStatus: () => {},
    initializeItems: () => {},
    subscribe: (period) => {
        showPopup("Ошибка", "Не удалось загрузить модуль Premium. Попробуйте позже.");
        return false;
    }
};

let Premium = PremiumFallback;

window.addEventListener('load', () => {
    updateScreenWidth();
    loadSelections();
    Premium.checkPremiumStatus();
});

window.addEventListener('resize', () => {
    updateScreenWidth();
    const scenario = document.getElementById("scenario");
    if (scenario?.style.display === "block") {
        generateScenario();
    }
});

function getRandomElement(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

function showPopup(title, desc, image) {
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popup-title");
    const popupImage = document.getElementById("popup-image");
    const popupDescription = document.getElementById("popup-description");

    if (!popup || !popupTitle || !popupImage || !popupDescription) return;

    popupTitle.textContent = title || "Без заголовка";
    popupDescription.innerHTML = desc || "Описание отсутствует";

    if (image) {
        popupImage.src = image;
        popupImage.alt = title;
        popupImage.style.display = 'block';
        popupImage.onerror = () => {
            popupImage.src = 'https://placehold.co/150x150?text=Ошибка';
            popupImage.alt = 'Изображение не загрузилось';
        };
    } else {
        popupImage.style.display = 'none';
        popupImage.src = '';
    }

    popup.style.display = "block";
}

function closePopup() {
    const popup = document.getElementById("popup");
    if (!popup) return;
    popup.style.display = "none";
    const popupImage = document.getElementById("popup-image");
    const popupDescription = document.getElementById("popup-description");
    if (popupImage) popupImage.src = '';
    if (popupDescription) popupDescription.innerHTML = '';
}

function toggleSelection(type, name) {
    let selectedArray;
    if (type === 'character') selectedArray = selectedCharacters;
    else if (type === 'audience') selectedArray = selectedAudiences;
    else if (type === 'context') selectedArray = selectedContexts;
    else if (type === 'idea') selectedArray = selectedIdeas;

    const index = selectedArray.indexOf(name);
    if (index === -1) {
        selectedArray.push(name);
    } else {
        selectedArray.splice(index, 1);
    }

    saveSelections();
}

function showGalleryPopup(category, type) {
    const galleryPopup = document.getElementById("gallery-popup");
    const galleryTitle = document.getElementById("gallery-title");
    const galleryContent = document.getElementById("gallery-content");

    if (!galleryPopup || !galleryTitle || !galleryContent) {
        showPopup("Ошибка", "Не удалось открыть галерею. Попробуйте позже.");
        return;
    }

    let allItems, freeItems;
    switch (type) {
        case 'character':
            allItems = characters;
            freeItems = Premium.freeCharacters;
            break;
        case 'audience':
            allItems = audiences;
            freeItems = Premium.freeAudiences;
            break;
        case 'context':
            allItems = contexts;
            freeItems = Premium.freeContexts;
            break;
        case 'idea':
            allItems = ideas;
            freeItems = Premium.freeIdeas;
            break;
        default:
            showPopup("Ошибка", "Неверный тип галереи.");
            return;
    }

    if (!allItems || allItems.length === 0 || !freeItems) {
        showPopup("Ошибка", "Данные для галереи недоступны.");
        return;
    }

    galleryTitle.textContent = `Выберите ${category}`;
    galleryContent.innerHTML = allItems.map(item => {
        const isFree = freeItems().some(freeItem => freeItem.name === item.name);
        const className = (!Premium.isPremiumUser() && !isFree) ? 'grayscale' : '';
        const isSelected = Premium.isPremiumUser() && (
            (type === 'character' && selectedCharacters.includes(item.name)) ||
            (type === 'audience' && selectedAudiences.includes(item.name)) ||
            (type === 'context' && selectedContexts.includes(item.name)) ||
            (type === 'idea' && selectedIdeas.includes(item.name))
        );
        return `
            <div class="gallery-item">
                ${Premium.isPremiumUser() ? `
                    <div class="checkbox-container">
                        <input type="checkbox" id="${type}-${item.name}" 
                               ${isSelected ? 'checked' : ''} 
                               onchange="toggleSelection('${type}', '${item.name}')">
                    </div>
                ` : ''}
                <img src="${item.image}" alt="${item.name}" class="${className}" 
                     onerror="this.src='https://placehold.co/100x100?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                     onclick="selectItem('${type}', '${item.name}')">
                <div class="label">${item.name}</div>
            </div>
        `;
    }).join('');
    galleryContent.className = 'gallery-grid';

    galleryPopup.style.display = "block";
}

function closeGalleryPopup() {
    const galleryPopup = document.getElementById("gallery-popup");
    if (!galleryPopup) return;
    galleryPopup.style.display = "none";
}

function selectItem(type, name) {
    if (!Premium.isPremiumUser()) {
        const isFree = (type === 'character' && Premium.freeCharacters().some(item => item.name === name)) ||
                      (type === 'audience' && Premium.freeAudiences().some(item => item.name === name)) ||
                      (type === 'context' && Premium.freeContexts().some(item => item.name === name)) ||
                      (type === 'idea' && Premium.freeIdeas().some(item => item.name === name));
        if (!isFree) {
            closeGalleryPopup();
            showPremiumPopup();
            return;
        }
    }

    const scenario = document.getElementById("scenario");
    if (!scenario || scenario.style.display !== "block") return;

    if (type === 'character') {
        currentCharacter = characters.find(c => c.name === name);
        document.getElementById('character-tile').src = currentCharacter.image;
        document.getElementById('character-title').textContent = currentCharacter.name;
    } else if (type === 'audience') {
        currentAudience = audiences.find(a => a.name === name);
        document.getElementById('audience-tile').src = currentAudience.image;
        document.getElementById('audience-title').textContent = currentAudience.name;
    } else if (type === 'context') {
        currentContext = contexts.find(c => c.name === name);
        document.getElementById('context-tile').src = currentContext.image;
        document.getElementById('context-title').textContent = currentContext.name;
    } else if (type === 'idea') {
        currentIdea = ideas.find(i => i.name === name);
        document.getElementById('idea-tile').src = currentIdea.image;
        document.getElementById('idea-title').textContent = currentIdea.name;
    }

    closeGalleryPopup();
}

function showRules() {
    const rulesText = `
        Варианты применения:<br>
        1. Веселая игра в компании.<br>
        2. Тренажер ораторских навыков.<br>
        Подробности ищите в соц. сетях игры.<br><br>
        <b>Ход игры:</b><br>
        1. Нажмите "Новая игра" и получите набор карточек.<br>
        2. Изучите описание карточек, вживитесь в роль.<br>
        3. Донесите идею публике. Для лучшей подготовки пользуйтесь генерацией вашего выступления.<br>
        4. Обсуди с друзьями!
    `;
    showPopup("Как играть", rulesText);
}

function showPremiumPopup() {
    const premiumPopup = document.getElementById('premium-popup');
    if (!premiumPopup) return;
    premiumPopup.style.display = 'block';
}

function closePremiumPopup() {
    const premiumPopup = document.getElementById('premium-popup');
    if (!premiumPopup) return;
    premiumPopup.style.display = 'none';
}

function subscribe(period) {
    const success = Premium.subscribe(period);
    if (success) {
        closePremiumPopup();
        generateScenario();
    }
}

function closeFinishPopup() {
    const finishPopup = document.getElementById("finish-popup");
    if (!finishPopup) return;
    finishPopup.style.display = "none";
    generateScenario();
}

function closeSituationPopup() {
    const situationPopup = document.getElementById("situation-popup");
    if (!situationPopup) return;
    situationPopup.style.display = "none";
}

async function generateSituation(character, audience, context, idea) {
    return `
        Вы — ${character.name}, выступаете перед ${audience.name}. <br>
        Ваша задача — донести идею "${idea.name}" в контексте "${context.name}". <br>
        Представьте, что вы стоите перед аудиторией, готовясь к речи. Ваши слова должны вдохновить и убедить!
    `;
}

async function handleGenerateSituation() {
    if (!currentCharacter || !currentAudience || !currentContext || !currentIdea) {
        showPopup("Ошибка", "Сначала выберите все карточки!");
        return;
    }

    const situationPopup = document.getElementById("situation-popup");
    const situationImage = document.getElementById("situation-image");
    const situationDescription = document.getElementById("situation-description");
    const moreButton = document.getElementById("more-button");

    if (!situationPopup || !situationImage || !situationDescription || !moreButton) return;

    const cardsImages = `
        <div class="cards-preview">
            <img src="${currentCharacter.image}" alt="${currentCharacter.name}" class="card-preview-img" 
                 onerror="this.src='https://placehold.co/80x80?text=Ошибка'; this.alt='Изображение не загрузилось'">
            <img src="${currentAudience.image}" alt="${currentAudience.name}" class="card-preview-img" 
                 onerror="this.src='https://placehold.co/80x80?text=Ошибка'; this.alt='Изображение не загрузилось'">
            <img src="${currentContext.image}" alt="${currentContext.name}" class="card-preview-img" 
                 onerror="this.src='https://placehold.co/80x80?text=Ошибка'; this.alt='Изображение не загрузилось'">
            <img src="${currentIdea.image}" alt="${currentIdea.name}" class="card-preview-img" 
                 onerror="this.src='https://placehold.co/80x80?text=Ошибка'; this.alt='Изображение не загрузилось'">
        </div>
    `;

    moreButton.style.display = "none";
    situationImage.style.display = 'none';
    situationDescription.innerHTML = cardsImages + '<span class="loading-text">создание сценария...</span>';
    situationPopup.style.display = "block";

    let dotCount = 3;
    const loadingInterval = setInterval(() => {
        dotCount = (dotCount % 3) + 1;
        const dots = '.'.repeat(dotCount);
        situationDescription.innerHTML = cardsImages + `<span class="loading-text">создание сценария${dots}</span>`;
    }, 500);

    try {
        const result = await generateSituation(currentCharacter, currentAudience, currentContext, currentIdea);
        clearInterval(loadingInterval);
        if (!result) {
            situationDescription.innerHTML = cardsImages + "Ошибка генерации сценария.";
            return;
        }
        situationImage.style.display = 'none';
        situationDescription.innerHTML = cardsImages + result;
        moreButton.style.display = "inline-block";
    } catch (err) {
        clearInterval(loadingInterval);
        situationImage.style.display = 'none';
        situationDescription.innerHTML = cardsImages + "Произошла ошибка при генерации сценария.";
        moreButton.style.display = "inline-block";
    }
}

function generateScenario() {
    let availableCharacters, availableAudiences, availableContexts, availableIdeas;

    if (Premium.isPremiumUser()) {
        availableCharacters = selectedCharacters.length > 0 ? characters.filter(c => selectedCharacters.includes(c.name)) : characters;
        availableAudiences = selectedAudiences.length > 0 ? audiences.filter(a => selectedAudiences.includes(a.name)) : audiences;
        availableContexts = selectedContexts.length > 0 ? contexts.filter(c => selectedContexts.includes(c.name)) : contexts;
        availableIdeas = selectedIdeas.length > 0 ? ideas.filter(i => selectedIdeas.includes(i.name)) : ideas;
    } else {
        availableCharacters = Premium.freeCharacters();
        availableAudiences = Premium.freeAudiences();
        availableContexts = Premium.freeContexts();
        availableIdeas = Premium.freeIdeas();
    }

    currentCharacter = getRandomElement(availableCharacters) || getRandomElement(Premium.freeCharacters());
    currentAudience = getRandomElement(availableAudiences) || getRandomElement(Premium.freeAudiences());
    currentContext = getRandomElement(availableContexts) || getRandomElement(Premium.freeContexts());
    currentIdea = getRandomElement(availableIdeas) || getRandomElement(Premium.freeIdeas());

    if (!currentCharacter || !currentAudience || !currentContext || !currentIdea) {
        showPopup("Ошибка", "Недостаточно карточек для генерации сценария.");
        return;
    }

    const scenarioText = `
        <div class="tiles-container">
            <div class="tile-block">
                <span class="tile-label">ВЫ</span>
                <img id="character-tile" class="tile" src="${currentCharacter.image}" alt="${currentCharacter.name}" 
                     onerror="this.src='https://placehold.co/160x160?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                     onclick="showPopup('${currentCharacter.name}', '${currentCharacter.desc.replace(/'/g, "\\'")}', '${currentCharacter.image}')">
                <div id="character-title" class="tile-title" onclick="showGalleryPopup('персонажа', 'character')">${currentCharacter.name}</div>
            </div>
            <div class="tile-block">
                <span class="tile-label">ПУБЛИКА</span>
                <img id="audience-tile" class="tile" src="${currentAudience.image}" alt="${currentAudience.name}" 
                     onerror="this.src='https://placehold.co/160x160?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                     onclick="showPopup('${currentAudience.name}', '${currentAudience.desc.replace(/'/g, "\\'")}', '${currentAudience.image}')">
                <div id="audience-title" class="tile-title" onclick="showGalleryPopup('аудиторию', 'audience')">${currentAudience.name}</div>
            </div>
            <div class="tile-block">
                <span class="tile-label">КОНТЕКСТ</span>
                <img id="context-tile" class="tile" src="${currentContext.image}" alt="${currentContext.name}" 
                     onerror="this.src='https://placehold.co/160x160?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                     onclick="showPopup('${currentContext.name}', '${currentContext.desc.replace(/'/g, "\\'")}', '${currentContext.image}')">
                <div id="context-title" class="tile-title" onclick="showGalleryPopup('контекст', 'context')">${currentContext.name}</div>
            </div>
            <div class="tile-block">
                <span class="tile-label">ИДЕЯ</span>
                <img id="idea-tile" class="tile" src="${currentIdea.image}" alt="${currentIdea.name}" 
                     onerror="this.src='https://placehold.co/160x160?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                     onclick="showPopup('${currentIdea.name}', '${currentIdea.desc.replace(/'/g, "\\'")}', '${currentIdea.image}')">
                <div id="idea-title" class="tile-title" onclick="showGalleryPopup('идею', 'idea')">${currentIdea.name}</div>
            </div>
        </div>
        <div class="divider"></div>
        <div class="button-container">
            <button onclick="generateScenario()">Новая игра</button>
            <button onclick="handleGenerateSituation()">Составить речь!</button>
        </div>
    `;

    const scenarioElement = document.getElementById("scenario");
    const initialButtonContainer = document.querySelector("#game-container > .button-container");

    if (!scenarioElement || !initialButtonContainer) return;

    scenarioElement.style.display = "block";
    scenarioElement.innerHTML = scenarioText;
    initialButtonContainer.style.display = "none";
}

try {
    let tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }
} catch (e) {}

window.generateScenario = generateScenario;
window.showRules = showRules;
window.showPremiumPopup = showPremiumPopup;
window.closePremiumPopup = closePremiumPopup;
window.subscribe = subscribe;
window.closePopup = closePopup;
window.closeFinishPopup = closeFinishPopup;
window.closeSituationPopup = closeSituationPopup;
window.showGalleryPopup = showGalleryPopup;
window.closeGalleryPopup = closeGalleryPopup;
window.selectItem = selectItem;
window.toggleSelection = toggleSelection;
window.handleGenerateSituation = handleGenerateSituation;
window.showPopup = showPopup;