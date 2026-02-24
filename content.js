let timeout;
let twitchUserTags;

// Вычитываем из хранилища сохрненные ранее настройки
function readTags() {
	chrome.storage.sync.get(['twitchUserTags'], function(result) {
		console.log('[readTags] result.twitchUserTags='+result.twitchUserTags);
        if (!result.twitchUserTags) return;
        twitchUserTags = JSON.parse(result.twitchUserTags);
		console.log('[readTags] twitchUserTags='+JSON.stringify(twitchUserTags));
    });	
}

// Добавляем span с тегом, если не был добавлен ранее
function addUsertagSpan(elem, userTag) {
	// Проверяем, существует ли уже элемент span с классом ns_twitch_usertag внутри
	if (!elem.querySelector('.ns_twitch_usertag')) {
		console.log('[addUsertagSpan] add span '+userTag);
		const span = document.createElement('span');     // Создаем новый элемент span
		span.setAttribute('class', 'ns_twitch_usertag'); // Добавляем элементу класс ns_twitch_usertag
		span.textContent = ' (' + userTag + ')';         // Задаем текст для span
		elem.appendChild(span);                          // Добавляем span в elem
	}
}

// Основная работа - поиск элементов для патча в чате и патч
function addChatUserTags() {
	console.log('[addChatUserTags] twitchUserTags='+JSON.stringify(twitchUserTags));
    // Находим все элементы span с классом 'chat-line__username-container'
    const chatSpans = document.querySelectorAll('span.chat-author__display-name');
    // Добавляем в каждый из них новый span-элемент
    chatSpans.forEach(elem => {
		//console.log('addChatUserTags elem.textContent='+elem.textContent);
		if ((twitchUserTags) && (Object.hasOwn(twitchUserTags, elem.textContent))) {
			console.log('[addChatUserTags] add '+twitchUserTags[elem.textContent]+' to '+elem.textContent);
			addUsertagSpan(elem, twitchUserTags[elem.textContent]);
		}
    });
}

// Основная работа - поиск элементов для патча в всплывающих панелях и патч
function addPopupUserTags() {
	console.log('[addPopupUserTags] twitchUserTags='+JSON.stringify(twitchUserTags));
    // Находим все элементы h4 с классом 'CoreText-sc-1txzju1-0'
    const chatSpans = document.querySelectorAll('h4.CoreText-sc-1txzju1-0');
    // Добавляем в каждый из них новый span-элемент
    chatSpans.forEach(elem => {
		//console.log('addPopupUserTags elem.textContent='+elem.textContent);
		if ((twitchUserTags) && (Object.hasOwn(twitchUserTags, elem.textContent))) {
			console.log('[addPopupUserTags] add '+twitchUserTags[elem.textContent]+' to '+elem.textContent);
			addUsertagSpan(elem, twitchUserTags[elem.textContent]);
		}
    });
}

function addUserTags() {
	addChatUserTags();
	addPopupUserTags();
}

// Инициализация - цикл основной работы для существующих элементов
function initTags() {
	// Вычитываем из хранилища сохрненные ранее настройки
	readTags();
    addUserTags();
}

// Создаем наблюдатель за изменениями в DOM
const observer = new MutationObserver((mutations) => {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
		// Вычитываем из хранилища сохрненные ранее настройки
		readTags();
		// Для изменений делаем основную работу
		mutations.forEach(() => {
			addUserTags(); // Вызываем функцию при каждом изменении
		});
    }, 100); // Установите задержку (в миллисекундах) по вашему усмотрению
});

const chatroom = document.getElementsByClassName('chat-room__content');
// Наблюдаем за всем документом
observer.observe(document.body, {
    childList: true, // Следим за добавлением/удалением дочерних узлов
    subtree: true    // Следим за всеми потомками
});

// Вызываем функцию инициализацию для обработки уже существующих элементов
initTags();
