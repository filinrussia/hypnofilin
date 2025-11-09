async function generateSituation(guy, girl, situation, quest, showPopup) {
    try {
        const prompt = `
            Опиши ситуацию, где ${guy.name} (описание: ${guy.desc}) и ${girl.name} (описание: ${girl.desc}) находятся в ситуации "${situation.name}" (описание: ${situation.desc}). 
            Их цель: ${quest.name} (описание: ${quest.desc}).
            Опиши, как они взаимодействуют, учитывая их характеры и контекст.
        `;

        console.log('Сформированный prompt:', prompt);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
                'HTTP-Referer': 'https://your-app-domain.com', // Замени на домен твоего приложения
                'X-Title': 'Your App Name' // Опционально, для идентификации приложения
            },
            body: JSON.stringify({
                model: 'mistralai/mixtral-8x7b-instruct', // Пробуем другую модель
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });

        console.log('Статус ответа:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка HTTP:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Ответ API:', JSON.stringify(data, null, 2)); // Форматированный вывод для удобства

        // Проверяем наличие текста в разных форматах
        let generatedText = null;
        if (data.choices && data.choices[0]) {
            if (data.choices[0].message && data.choices[0].message.content) {
                generatedText = data.choices[0].message.content;
            } else if (data.choices[0].text) {
                generatedText = data.choices[0].text;
            }
        } else if (data.message) {
            generatedText = data.message; // Пробуем альтернативное поле
        } else if (data.content) {
            generatedText = data.content; // Ещё одно возможное поле
        }

        if (!generatedText) {
            throw new Error('Ответ API не содержит текст описания');
        }

        return generatedText.trim();
    } catch (err) {
        console.error('Ошибка API:', err);
        console.warn('Использована заглушка из-за ошибки:', err.message);
        showPopup('Ошибка', 'Не удалось сгенерировать описание. Используется базовый текст.');
        return `В ситуации "${situation.name}" ${guy.name} и ${girl.name} пытаются выполнить задание "${quest.name}".`;
    }
}