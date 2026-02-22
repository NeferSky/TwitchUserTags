// Обработчик при полной загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Вычитываем из хранилища настройки при открытии страницы настроек
    chrome.storage.sync.get(['twitchUserTags'], function(result) {
        document.querySelector('#jsonInput').value = result.twitchUserTags || '';
    });
});

// Обработчик нажатия кнопки Сохранить
document.getElementById('btnSave').addEventListener('click', saveJson);

// Функция сохранения введённого JSON
function saveJson() {
    const inputValue = document.querySelector('#jsonInput').value.trim();
    try {
		console.log('[saveJson] inputValue='+inputValue);
        const parsedJson = JSON.parse(inputValue);
		console.log('[saveJson] parsedJson='+JSON.stringify(parsedJson));
        if (!Object(parsedJson)) throw new Error('Некорректный формат JSON');
    
        chrome.storage.sync.set({'twitchUserTags': inputValue}, function() {
            alert('Сохранено');
        });
    } catch(e) {
        alert(`Ошибка сохранения: ${e.message}`);
    }
}