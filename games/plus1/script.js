let currentGuy, currentGirl, currentSituation, currentQuest;
let selectedGuys = [];
let selectedGirls = [];
let selectedSituations = [];
let selectedQuests = [];
let screenWidth; // Переменная для хранения ширины экрана

// Функция для получения текущей ширины экрана с учетом боковых отступов
function updateScreenWidth() {
    const sidePadding = 10; // Боковые отступы 10px с каждой стороны
    screenWidth = window.innerWidth - 2 * sidePadding; // Вычитаем 20px (10px слева + 10px справа)
    console.log("Updated screenWidth:", screenWidth);
}

function loadSelections() {
    selectedGuys = JSON.parse(localStorage.getItem('selectedGuys')) || [];
    selectedGirls = JSON.parse(localStorage.getItem('selectedGirls')) || [];
    selectedSituations = JSON.parse(localStorage.getItem('selectedSituations')) || [];
    selectedQuests = JSON.parse(localStorage.getItem('selectedQuests')) || [];
}

function saveSelections() {
    localStorage.setItem('selectedGuys', JSON.stringify(selectedGuys));
    localStorage.setItem('selectedGirls', JSON.stringify(selectedGirls));
    localStorage.setItem('selectedSituations', JSON.stringify(selectedSituations));
    localStorage.setItem('selectedQuests', JSON.stringify(selectedQuests));
}

// Заглушка для Premium
const PremiumFallback = {
    isPremiumUser: () => false,
    freeGuys: () => {
        const dayNum = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        const shuffled = [...allGuys].sort((a, b) => seededRandom(dayNum + allGuys.indexOf(a)) - seededRandom(dayNum + allGuys.indexOf(b)));
        return shuffled.slice(0, 3);
    },
    freeGirls: () => {
        const dayNum = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        const shuffled = [...allGirls].sort((a, b) => seededRandom(dayNum + allGirls.indexOf(a)) - seededRandom(dayNum + allGirls.indexOf(b)));
        return shuffled.slice(0, 3);
    },
    freeSituations: () => {
        const dayNum = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        const shuffled = [...situations].sort((a, b) => seededRandom(dayNum + situations.indexOf(a)) - seededRandom(dayNum + situations.indexOf(b)));
        return shuffled.slice(0, 3);
    },
    freeQuests: () => {
        const dayNum = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        const shuffled = [...quests].sort((a, b) => seededRandom(dayNum + quests.indexOf(a)) - seededRandom(dayNum + quests.indexOf(b)));
        return shuffled.slice(0, 3);
    },
    checkPremiumStatus: () => {
        console.log("Premium.js not loaded, using fallback free mode");
    },
    initializeItems: () => {
        console.log("Premium.js not loaded, using fallback free mode");
    },
    subscribe: (period) => {
        showPopup("Ошибка", "Не удалось загрузить модуль Premium. Попробуйте позже.");
        return false;
    }
};

// Функция для ожидания загрузки объекта Premium
function waitForPremium(callback, maxAttempts = 50, attempt = 0) {
    if (window.Premium) {
        callback(window.Premium);
    } else if (attempt >= maxAttempts) {
        console.error("Premium failed to load after maximum attempts. Using fallback free mode...");
        showPopup("Ошибка", "Не удалось загрузить модуль Premium. Продолжаем в бесплатном режиме.");
        callback(PremiumFallback);
    } else {
        console.log("Waiting for Premium to be defined... Attempt:", attempt + 1);
        setTimeout(() => waitForPremium(callback, maxAttempts, attempt + 1), 100);
    }
}

let Premium = PremiumFallback;

// Инициализация ширины экрана при загрузке и при изменении размера окна
window.addEventListener('load', () => {
    console.log("Window load event triggered");
    updateScreenWidth();
    loadSelections();
    waitForPremium((premiumInstance) => {
        Premium = premiumInstance;
        Premium.checkPremiumStatus();
    });
});

window.addEventListener('resize', () => {
    updateScreenWidth();
    // Перегенерируем сценарий, чтобы обновить размеры
    if (document.getElementById("scenario").style.display === "block") {
        generateScenario();
    }
});

function getRandomElement(array) {
    if (array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

function showPopup(title, desc, image) {
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popup-title");
    const popupImage = document.getElementById("popup-image");
    const popupDescription = document.getElementById("popup-description");

    popupTitle.textContent = title;

    if (image) {
        popupImage.src = image;
        popupImage.alt = title;
        popupImage.onerror = function() {
            this.src = 'https://placehold.co/150x150?text=Ошибка';
            this.alt = 'Изображение не загрузилось';
        };
        popupImage.style.display = 'block';
    } else {
        popupImage.style.display = 'none';
    }

    if (!desc.includes('|')) {
        popupDescription.innerHTML = desc;
    } else {
        const sections = desc.split('|').map(section => section.trim());

        let html = '';

        if (sections[0]) {
            html += `<div class="description-section">${sections[0]}</div>`;
        }

        if (sections[1]) {
            const phrases = sections[1].split(';').map(item => item.trim()).filter(item => item);
            if (phrases.length > 0) {
                const phrasesList = phrases.slice(1).map(phrase => `<div class="description-item">${phrase}</div>`).join('');
                html += `<div class="description-section"><strong>${phrases[0]}</strong>${phrasesList}</div>`;
            }
        }

        if (sections[2]) {
            const behaviors = sections[2].split(';').map(item => item.trim()).filter(item => item);
            if (behaviors.length > 0) {
                const behaviorsList = behaviors.slice(1).map(behavior => `<div class="description-item">${behavior}</div>`).join('');
                html += `<div class="description-section"><strong>${behaviors[0]}</strong>${behaviorsList}</div>`;
            }
        }

        popupDescription.innerHTML = html;
    }

    popup.style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    const popupImage = document.getElementById("popup-image");
    const popupDescription = document.getElementById("popup-description");
    popupImage.src = '';
    popupImage.style.display = 'none';
    popupDescription.innerHTML = '';
}

function toggleSelection(type, name) {
    let selectedArray;
    if (type === 'guy') selectedArray = selectedGuys;
    else if (type === 'girl') selectedArray = selectedGirls;
    else if (type === 'situation') selectedArray = selectedSituations;
    else if (type === 'quest') selectedArray = selectedQuests;

    const index = selectedArray.indexOf(name);
    if (index === -1) {
        selectedArray.push(name);
    } else {
        selectedArray.splice(index, 1);
    }

    if (type === 'quest' || type === 'situation') {
        const item = type === 'quest' ? quests.find(q => q.name === name) : situations.find(s => s.name === name);
        const category = item.category;
        const categoryItems = type === 'quest' ? quests.filter(q => q.category === category) : situations.filter(s => s.category === category);
        const allSelected = Premium.isPremiumUser() && categoryItems.every(item => selectedArray.includes(item.name));
        const categoryCheckbox = document.getElementById(`category-${category}`);
        if (categoryCheckbox) categoryCheckbox.checked = allSelected;
    }

    saveSelections();
}

function toggleCategorySelection(category, type) {
    let items, selectedArray;
    if (type === 'quest') {
        items = quests.filter(q => q.category === category);
        selectedArray = selectedQuests;
    } else if (type === 'situation') {
        items = situations.filter(s => s.category === category);
        selectedArray = selectedSituations;
    }

    const isChecked = document.getElementById(`category-${category}`).checked;
    if (isChecked) {
        items.forEach(item => {
            if (!selectedArray.includes(item.name)) selectedArray.push(item.name);
        });
    } else {
        items.forEach(item => {
            const index = selectedArray.indexOf(item.name);
            if (index !== -1) selectedArray.splice(index, 1);
        });
    }

    items.forEach(item => {
        const checkbox = document.getElementById(`${type}-${item.name}`);
        if (checkbox) checkbox.checked = isChecked;
    });

    saveSelections();
}

function showGalleryPopup(category, allItems, freeItems, type) {
    const galleryPopup = document.getElementById("gallery-popup");
    const galleryTitle = document.getElementById("gallery-title");
    const galleryContent = document.getElementById("gallery-content");

    if (!galleryPopup || !galleryTitle || !galleryContent) {
        console.error('Gallery elements not found');
        return;
    }

    galleryTitle.textContent = `Выберите ${category}`;

    if (type === 'guy' || type === 'girl') {
        galleryContent.innerHTML = allItems.map(item => {
            const isFree = freeItems().some(freeItem => freeItem.name === item.name);
            const className = (!Premium.isPremiumUser() && !isFree) ? 'grayscale' : '';
            const isSelected = Premium.isPremiumUser() && (
                (type === 'guy' && selectedGuys.includes(item.name)) ||
                (type === 'girl' && selectedGirls.includes(item.name))
            );
            return `
                <div class="gallery-item">
                    ${Premium.isPremiumUser() ? `
                        <div class="checkbox-container">
                            <input type="checkbox" ${isSelected ? 'checked' : ''} 
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
    } else if (type === 'situation') {
        console.log('Opening situations gallery with items:', allItems);
        const categoryOrder = ["Клуб", "Улица", "Дома", "Разное"];
        const categories = { "Клуб": [], "Улица": [], "Дома": [], "Разное": [] };

        allItems.forEach(item => {
            if (!item.category) {
                console.error('Item missing category:', item);
            }
            if (categories[item.category]) {
                categories[item.category].push(item);
            } else {
                console.warn('Unknown category for item:', item);
            }
        });

        let html = '';
        categoryOrder.forEach(catName => {
            const items = categories[catName];
            console.log(`Category ${catName} has ${items.length} items`);
            if (items.length > 0) {
                const allSelected = Premium.isPremiumUser() && items.every(item => selectedSituations.includes(item.name));
                html += `
                    <div class="category-block">
                        <div class="category-header">
                            <h3 class="category-title">${catName}</h3>
                            ${Premium.isPremiumUser() ? `
                                <div class="category-checkbox">
                                    <input type="checkbox" id="category-${catName}" 
                                           ${allSelected ? 'checked' : ''} 
                                           onchange="toggleCategorySelection('${catName}', 'situation')">
                                </div>
                            ` : ''}
                        </div>
                        <div class="category-items">`;
                html += items.map(item => {
                    const isFree = freeItems().some(freeItem => freeItem.name === item.name);
                    const className = (!Premium.isPremiumUser() && !isFree) ? 'grayscale' : '';
                    const isSelected = Premium.isPremiumUser() && selectedSituations.includes(item.name);
                    return `
                        <div class="gallery-item">
                            ${Premium.isPremiumUser() ? `
                                <div class="checkbox-container">
                                    <input type="checkbox" id="situation-${item.name}" 
                                           ${isSelected ? 'checked' : ''} 
                                           onchange="toggleSelection('situation', '${item.name}')">
                                </div>
                            ` : ''}
                            <img src="${item.image}" alt="${item.name}" class="${className}" 
                                 onerror="this.src='https://placehold.co/100x100?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                                 onclick="selectItem('${type}', '${item.name}')">
                            <div class="label">${item.name}</div>
                        </div>
                    `;
                }).join('');
                html += `</div></div>`;
            }
        });
        console.log('Generated HTML:', html);
        galleryContent.innerHTML = html;
        galleryContent.className = '';
    } else if (type === 'quest') {
        const categoryOrder = ["Знакомство", "Общение", "Влечение"];
        const categories = {
            "Знакомство": [],
            "Общение": [],
            "Влечение": []
        };

        allItems.forEach(item => {
            if (categories[item.category]) categories[item.category].push(item);
        });

        let html = '';
        categoryOrder.forEach(catName => {
            const items = categories[catName];
            if (items.length > 0) {
                const allSelected = Premium.isPremiumUser() && items.every(item => selectedQuests.includes(item.name));
                html += `
                    <div class="category-block">
                        <div class="category-header">
                            <h3 class="category-title">${catName}</h3>
                            ${Premium.isPremiumUser() ? `
                                <div class="category-checkbox">
                                    <input type="checkbox" id="category-${catName}" 
                                           ${allSelected ? 'checked' : ''} 
                                           onchange="toggleCategorySelection('${catName}', 'quest')">
                                </div>
                            ` : ''}
                        </div>
                        <div class="category-items">`;
                html += items.map(item => {
                    const isFree = freeItems().some(freeItem => freeItem.name === item.name);
                    const className = (!Premium.isPremiumUser() && !isFree) ? 'grayscale' : '';
                    const isSelected = Premium.isPremiumUser() && selectedQuests.includes(item.name);
                    return `
                        <div class="gallery-item">
                            ${Premium.isPremiumUser() ? `
                                <div class="checkbox-container">
                                    <input type="checkbox" id="quest-${item.name}" 
                                           ${isSelected ? 'checked' : ''} 
                                           onchange="toggleSelection('quest', '${item.name}')">
                                </div>
                            ` : ''}
                            <img src="${item.image}" alt="${item.name}" class="${className}" 
                                 onerror="this.src='https://placehold.co/100x100?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                                 onclick="selectItem('${type}', '${item.name}')">
                            <div class="label">${item.name}</div>
                        </div>
                    `;
                }).join('');
                html += `</div></div>`;
            }
        });
        galleryContent.innerHTML = html;
        galleryContent.className = '';
    }

    galleryPopup.style.display = "block";
}

function closeGalleryPopup() {
    document.getElementById("gallery-popup").style.display = "none";
}

function selectItem(type, name) {
    if (!Premium.isPremiumUser()) {
        const isFree = (type === 'guy' && Premium.freeGuys().some(item => item.name === name)) ||
                      (type === 'girl' && Premium.freeGirls().some(item => item.name === name)) ||
                      (type === 'situation' && Premium.freeSituations().some(item => item.name === name)) ||
                      (type === 'quest' && Premium.freeQuests().some(item => item.name === name));
        if (!isFree) {
            closeGalleryPopup();
            showPremiumPopup();
            return;
        }
    }
    if (type === 'guy') {
        currentGuy = allGuys.find(g => g.name === name);
        document.getElementById('guy-tile').src = currentGuy.image;
        document.getElementById('guy-title').textContent = currentGuy.name;
    } else if (type === 'girl') {
        currentGirl = allGirls.find(g => g.name === name);
        document.getElementById('girl-tile').src = currentGirl.image;
        document.getElementById('girl-title').textContent = currentGirl.name;
    } else if (type === 'situation') {
        currentSituation = situations.find(s => s.name === name);
        document.getElementById('situation-tile').src = currentSituation.image;
        document.getElementById('situation-card-title').textContent = currentSituation.name;
    } else if (type === 'quest') {
        currentQuest = quests.find(q => q.name === name);
        document.getElementById('quest-tile').src = currentQuest.image;
        document.getElementById('quest-title').textContent = currentQuest.name;
    }
    closeGalleryPopup();
}

function showRules() {
    const rulesText = `
        Варианты применения:<br>
        1. Веселая игра в компании.<br>
        2. Тренажер навыков соблазнения.<br>
        3. Практический инструмент для соблазнения.<br>
        Подробности ищите в соц. сетях игры.<br><br>
        <b>Ход игры:</b><br>
        1. Нажмите "Новая игра" и получите набор карточек.<br>
        2. Изучите описание карточек, вживитесь в роль.<br>
        3. Отыграйте задание.<br>
        4. Обсуди с друзьями!
    `;
    showPopup("Как играть", rulesText);
}

function showPremiumPopup() {
    document.getElementById('premium-popup').style.display = 'block';
}

function closePremiumPopup() {
    document.getElementById('premium-popup').style.display = 'none';
}

function subscribe(period) {
    const success = Premium.subscribe(period);
    if (success) {
        closePremiumPopup();
        generateScenario();
    }
}

function closeFinishPopup() {
    document.getElementById("finish-popup").style.display = "none";
    generateScenario();
}

function closeSituationPopup() {
    document.getElementById("situation-popup").style.display = "none";
}

function generateScenario() {
    let availableGuys, availableGirls, availableSituations, availableQuests;

    if (Premium.isPremiumUser()) {
        availableGuys = selectedGuys.length > 0 ? allGuys.filter(guy => selectedGuys.includes(guy.name)) : allGuys;
        availableGirls = selectedGirls.length > 0 ? allGirls.filter(girl => selectedGirls.includes(girl.name)) : allGirls;
        availableSituations = selectedSituations.length > 0 ? situations.filter(situation => selectedSituations.includes(situation.name)) : situations;
        availableQuests = selectedQuests.length > 0 ? quests.filter(quest => selectedQuests.includes(quest.name)) : quests;
    } else {
        availableGuys = Premium.freeGuys();
        availableGirls = Premium.freeGirls();
        availableSituations = Premium.freeSituations();
        availableQuests = Premium.freeQuests();
    }

    console.log('Full situations array:', situations);
    console.log('Available situations:', availableSituations);

    currentGuy = getRandomElement(availableGuys) || getRandomElement(Premium.freeGuys());
    currentGirl = getRandomElement(availableGirls) || getRandomElement(Premium.freeGirls());
    currentSituation = getRandomElement(availableSituations) || getRandomElement(Premium.freeSituations());
    currentQuest = getRandomElement(availableQuests) || getRandomElement(Premium.freeQuests());

    if (!currentGuy || !currentGirl || !currentSituation || !currentQuest) {
        showPopup("Ошибка", "Выберите хотя бы одну карточку в каждой категории для премиум-режима.");
        return;
    }

    const scenarioText = `
        <div class="tiles-container">
            <div class="tile-block">
                <span class="tile-label">МУЖЧИНА</span>
                <img id="guy-tile" class="guy-tile" src="${currentGuy.image}" alt="${currentGuy.name}" 
                     onerror="this.src='https://placehold.co/160x160?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                     onclick="showPopup(currentGuy.name, currentGuy.desc, currentGuy.image)">
                <div id="guy-title" class="tile-title" onclick="showGalleryPopup('мужчину', allGuys, Premium.freeGuys, 'guy')">${currentGuy.name}</div>
            </div>
            <div class="tile-block">
                <span class="tile-label">ЖЕНЩИНА</span>
                <img id="girl-tile" class="girl-tile" src="${currentGirl.image}" alt="${currentGirl.name}" 
                     onerror="this.src='https://placehold.co/160x160?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                     onclick="showPopup(currentGirl.name, currentGirl.desc, currentGirl.image)">
                <div id="girl-title" class="tile-title" onclick="showGalleryPopup('женщину', allGirls, Premium.freeGirls, 'girl')">${currentGirl.name}</div>
            </div>
            <div class="tile-block">
                <span class="tile-label">СИТУАЦИЯ</span>
                <img id="situation-tile" class="tile" src="${currentSituation.image}" alt="${currentSituation.name}" 
                     onerror="this.src='https://placehold.co/160x160?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                     onclick="showPopup(currentSituation.name, currentSituation.desc, currentSituation.image)">
                <div id="situation-card-title" class="tile-title" onclick="showGalleryPopup('ситуацию', situations, Premium.freeSituations, 'situation')">${currentSituation.name}</div>
            </div>
            <div class="tile-block">
                <span class="tile-label">ЗАДАНИЕ</span>
                <img id="quest-tile" class="tile" src="${currentQuest.image}" alt="${currentQuest.name}" 
                     onerror="this.src='https://placehold.co/160x160?text=Ошибка'; this.alt='Изображение не загрузилось'" 
                     onclick="showPopup(currentQuest.name, currentQuest.desc, currentQuest.image)">
                <div id="quest-title" class="tile-title" onclick="showGalleryPopup('задание', quests, Premium.freeQuests, 'quest')">${currentQuest.name}</div>
            </div>
        </div>
        <div class="divider"></div>
        <div class="button-container">
            <button onclick="generateScenario()">Новая игра</button>
            <button onclick="handleGenerateSituation()">ИИ-описание</button>
            <button onclick="showRules()">Как играть</button>
            <button onclick="showPremiumPopup()" id="premium-btn">Премиум</button>
        </div>
    `;

    const scenarioElement = document.getElementById("scenario");
    scenarioElement.style.display = "block";
    scenarioElement.innerHTML = scenarioText;
    document.querySelector("#game-container > .button-container").style.display = "none";
}

async function handleGenerateSituation() {
    if (!currentGuy || !currentGirl || !currentSituation || !currentQuest) {
        showPopup("Ошибка", "Сначала выберите все карточки!");
        return;
    }

    const situationPopup = document.getElementById("situation-popup");
    const situationImage = document.getElementById("situation-image");
    const situationDescription = document.getElementById("situation-description");
    const moreButton = document.getElementById("more-button");

    const cardsImages = `
        <div class="cards-preview">
            <img src="${currentGuy.image}" alt="${currentGuy.name}" class="card-preview-img" 
                 onerror="this.src='https://placehold.co/80x80?text=Ошибка'; this.alt='Изображение не загрузилось'">
            <img src="${currentGirl.image}" alt="${currentGirl.name}" class="card-preview-img" 
                 onerror="this.src='https://placehold.co/80x80?text=Ошибка'; this.alt='Изображение не загрузилось'">
            <img src="${currentSituation.image}" alt="${currentSituation.name}" class="card-preview-img" 
                 onerror="this.src='https://placehold.co/80x80?text=Ошибка'; this.alt='Изображение не загрузилось'">
            <img src="${currentQuest.image}" alt="${currentQuest.name}" class="card-preview-img" 
                 onerror="this.src='https://placehold.co/80x80?text=Ошибка'; this.alt='Изображение не загрузилось'">
        </div>
    `;

    moreButton.style.display = "none";
    
    situationImage.style.display = 'none';
    situationDescription.innerHTML = cardsImages + '<span class="loading-text">создание ситуации...</span>';
    situationPopup.style.display = "block";

    let dotCount = 3;
    const loadingInterval = setInterval(() => {
        dotCount = (dotCount % 3) + 1;
        const dots = '.'.repeat(dotCount);
        situationDescription.innerHTML = cardsImages + `<span class="loading-text">создание ситуации${dots}</span>`;
    }, 500);

    try {
        const result = await generateSituation(currentGuy, currentGirl, currentSituation, currentQuest, showPopup);
        clearInterval(loadingInterval);
        if (!result) return;
        situationImage.style.display = 'none';
        situationDescription.innerHTML = cardsImages + result;
        moreButton.style.display = "inline-block";
    } catch (err) {
        clearInterval(loadingInterval);
        console.error("Ошибка в handleGenerateSituation:", err);
        situationImage.style.display = 'none';
        situationDescription.innerHTML = cardsImages + "Произошла ошибка при генерации сцены.";
        moreButton.style.display = "inline-block";
    }
}

let tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

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
window.toggleCategorySelection = toggleCategorySelection;
window.handleGenerateSituation = handleGenerateSituation;
window.showPopup = showPopup;