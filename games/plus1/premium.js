console.log("premium.js loaded successfully");

window.Premium = {
    isPremium: false,
    isPremiumUser: function() {
        return this.isPremium;
    },
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
        console.log("Premium mode:", this.isPremium ? "Active" : "Inactive");
    },
    initializeItems: () => {
        console.log("Premium items initialized");
    },
    subscribe: function(period) {
        this.isPremium = true;
        console.log(`Subscribed to Premium for ${period}`);
        return true;
    }
};