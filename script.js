// Переключение темы
const themeToggle = document.getElementById('theme-toggle');
let isDarkTheme = false;

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
});

// PWA установка
let deferredPrompt;
const installPrompt = document.getElementById('install-prompt');
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPrompt.style.display = 'block';
});

installBtn.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('Пользователь установил приложение');
        }
        deferredPrompt = null;
        installPrompt.style.display = 'none';
    });
});

// Стих дня и уведомления
const verses = [
    "Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного... (Иоанна 3:16)",
    "Блаженны чистые сердцем, ибо они Бога узрят. (Матфея 5:8)",
    "Господь — Пастырь мой; я ни в чем не буду нуждаться. (Псалом 22:1)"
];
let verseRead = false;

const verseContainer = document.getElementById('verse-container');
const dailyVerse = document.getElementById('daily-verse');
const readVerseBtn = document.getElementById('read-verse');

function showVerse() {
    const today = new Date().toDateString();
    const verseIndex = new Date().getDay() % verses.length;
    dailyVerse.textContent = verses[verseIndex];
    verseRead = true;
}

readVerseBtn.addEventListener('click', () => {
    showVerse();
    checkNotifications();
});

// Уведомления
function checkNotifications() {
    if (!verseRead) {
        setTimeout(() => {
            alert('Пожалуйста, прочтите стих дня!');
            checkNotifications();
        }, 60000); // Повтор каждую минуту
    } else if (Notification.permission === 'granted') {
        sendNotification('Напоминание', 'Время утренней молитвы: 06:00–07:00');
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                sendNotification('Напоминание', 'Время утренней молитвы: 06:00–07:00');
            }
        });
    }
}

function sendNotification(title, body) {
    new Notification(title, { body });
}

// Запуск уведомлений при загрузке
window.onload = () => {
    checkNotifications();
};
