const Progress = {
    goals: [],

    init() {
        this.loadGoals();
        this.renderGoals();
    },

    loadGoals() {
        const savedGoals = localStorage.getItem('progressGoals');
        if (savedGoals) {
            this.goals = JSON.parse(savedGoals);
        }
    },

    saveGoals() {
        localStorage.setItem('progressGoals', JSON.stringify(this.goals));
    },

    addGoal(name) {
        if (!name || name.trim() === '') {
            showPopup('Ошибка', 'Название цели не может быть пустым.');
            return;
        }
        if (name.length > 20) {
            showPopup('Ошибка', 'Название цели не может быть длиннее 20 символов.');
            return;
        }
        if (this.goals.some(goal => goal.name === name)) {
            showPopup('Ошибка', 'Цель с таким названием уже существует.');
            return;
        }
        this.goals.push({ name, progress: 0 });
        this.saveGoals();
        this.renderGoals();
        this.renderProgressPopup();
    },

    removeGoal(name) {
        this.goals = this.goals.filter(goal => goal.name !== name);
        this.saveGoals();
        this.renderGoals();
        this.renderProgressPopup();
    },

    updateProgress(name, progress) {
        const goal = this.goals.find(goal => goal.name === name);
        if (goal) {
            goal.progress = Math.max(0, Math.min(5, progress));
            this.saveGoals();
            this.renderGoals();
            this.renderProgressPopup();
        }
    },

    showProgressPopup() {
        const popup = document.getElementById('progress-popup');
        if (!popup) return;
        popup.style.display = 'block';
        this.renderProgressPopup();
    },

    closeProgressPopup() {
        const popup = document.getElementById('progress-popup');
        if (popup) popup.style.display = 'none';
    },

    getSquareColor(progress) {
        const colors = [
        '#D40000', // Красный
        '#FF7F00', // Ярко-оранжевый
        '#FFBF00', // Золотисто-жёлтый
        '#34C759', // Салатовый
        '#007AFF'  // Синий 
        ];
        return colors[progress - 1] || '#D1D1D6'; // Gray for 0
    },

    renderGoals() {
        const goalsContainer = document.getElementById('goals-container');
        if (!goalsContainer) return;

        if (this.goals.length === 0) {
            goalsContainer.innerHTML = '<p style="text-align: center; color: #D1D1D6;">Нет активных целей.</p>';
            return;
        }

        goalsContainer.innerHTML = this.goals.slice(0, 5).map(goal => {
            const squares = Array.from({ length: 5 }, (_, i) => {
                const isFilled = i < goal.progress;
                const color = isFilled ? this.getSquareColor(goal.progress) : '#D1D1D6';
                return `<span style="font-size: 30px; cursor: pointer; color: ${color}; margin-right: 1px; line-height: 48px;" onclick="Progress.updateProgress('${goal.name}', ${i + 1})">${isFilled ? '■' : '□'}</span>`;
            }).join('');
            return `
                <div class="goal-item" style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing) 0; height: 48px; width: 100%;">
                    <span style="flex: 1; font-size: 16px; line-height: 48px;">${goal.name}</span>
                    <div style="display: flex; gap: 0;">${squares}</div>
                </div>
            `;
        }).join('');
    },

    renderProgressPopup() {
        const goalsContainer = document.getElementById('progress-goals-container');
        if (!goalsContainer) return;

        if (this.goals.length === 0) {
            goalsContainer.innerHTML = '<p style="text-align: center; color: #D1D1D6;">Нет активных целей.</p>';
            return;
        }

        goalsContainer.innerHTML = this.goals.map(goal => {
            const squares = Array.from({ length: 5 }, (_, i) => {
                const isFilled = i < goal.progress;
                const color = isFilled ? this.getSquareColor(goal.progress) : '#D1D1D6';
                return `<span style="font-size: 30px; cursor: pointer; color: ${color}; margin-right: 1px; line-height: 48px;" onclick="Progress.updateProgress('${goal.name}', ${i + 1})">${isFilled ? '■' : '□'}</span>`;
            }).join('');
            return `
                <div class="goal-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0; height: 48px; width: 100%;">
                    <span style="flex: 1; font-size: 16px; line-height: 48px;">${goal.name}</span>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <div style="display: flex; gap: 0;">${squares}</div>
                        <button onclick="Progress.removeGoal('${goal.name}')" style="background: none; border: none; color: #8E8E93; font-size: 20px; cursor: pointer; line-height: 48px; width: 24px; text-align: center;">✕</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    handleAddGoal() {
        const input = document.getElementById('progress-goal-input');
        if (input) {
            this.addGoal(input.value.trim());
            input.value = '';
        }
    }
};