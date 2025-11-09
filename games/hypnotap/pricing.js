// Конфигурация для RevenueCat (Android + iOS)
const pricingConfig = {
    // Product IDs для RevenueCat
    // Эти ID должны совпадать с:
    // - Google Play Console (для Android)
    // - App Store Connect (для iOS)
    productIds: {
        monthly: 'hypnotap_monthly',
        quarterly: 'hypnotap_quarterly', 
        annual: 'hypnotap_annual'
    },
    
    // Entitlement ID из RevenueCat dashboard
    // Одинаковый для всех платформ
    entitlementId: 'premium',
    
    // Fallback цены (показываются пока загружаются реальные из RevenueCat)
    // Используются только для первоначального отображения UI
    fallbackPrices: {
        monthly: {
            formatted: '...',
            loading: true
        },
        quarterly: {
            formatted: '...',
            loading: true
        },
        annual: {
            formatted: '...',
            loading: true
        }
    },
    
    // Определение платформы
    getPlatform() {
        // Проверяем iOS
        if (typeof window.webkit !== 'undefined' && 
            window.webkit.messageHandlers && 
            window.webkit.messageHandlers.revenueCat) {
            return 'ios';
        }
        // Проверяем Android
        if (typeof Android !== 'undefined' && Android.initRevenueCat) {
            return 'android';
        }
        // Web версия (для тестирования)
        return 'web';
    },
    
    // Получить активные цены
    getActivePrices() {
        return this.activePrices || this.fallbackPrices;
    },
    
    // Сохранить загруженные цены
    setActivePrices(prices) {
        this.activePrices = prices;
    }
};

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = pricingConfig;
}