document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const regScreen = document.getElementById('registration-screen');
    const selScreen = document.getElementById('selection-screen');
    const welcomeMsg = document.getElementById('welcome-msg');
    const nameInput = document.getElementById('user-name-input');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const changeProfileBtn = document.getElementById('change-profile-btn');
    const coffeeBtns = document.querySelectorAll('.coffee-btn');
    const successOverlay = document.getElementById('success-overlay');
    const timerSec = document.getElementById('timer-sec');
    
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('open-settings');
    const closeSettingsBtn = document.getElementById('close-settings');
    const saveSettingsBtn = document.getElementById('save-settings');
    const sheetUrlInput = document.getElementById('sheet-url-input');
    const openQrBtn = document.getElementById('open-qr');

    // State
    let userName = localStorage.getItem('coffee_userName');
    // Google'dan alınan YENİ Web App URL'si buraya eklendi
    let sheetUrl = 'https://script.google.com/macros/s/AKfycbxHrd-yB2okadNhOEgRxVNh7EffEA4ZK2BBPwOlkBNIPUoR4aDcP7BqujEHlJA20i161Q/exec';

    // Init Page
    const init = () => {
        if (userName) {
            showSelectionScreen();
        } else {
            showRegistrationScreen();
        }
    };

    const showRegistrationScreen = () => {
        regScreen.classList.remove('hidden');
        selScreen.classList.add('hidden');
    };

    const showSelectionScreen = () => {
        regScreen.classList.add('hidden');
        selScreen.classList.remove('hidden');
        welcomeMsg.textContent = `Hoş geldin ${userName}!`;
        sheetUrlInput.value = sheetUrl || '';
    };

    // Actions
    saveProfileBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            userName = name;
            localStorage.setItem('coffee_userName', name);
            showSelectionScreen();
        } else {
            alert('Lütfen ismini girer misin?');
        }
    });

    changeProfileBtn.addEventListener('click', () => {
        if (confirm('İsmini değiştirmek istediğine emin misin?')) {
            localStorage.removeItem('coffee_userName');
            userName = null;
            showRegistrationScreen();
        }
    });

    coffeeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            const price = btn.getAttribute('data-price');
            logCoffee(type, price);
        });
    });

    const logCoffee = async (type, price) => {
        // 1. Başarı ekranını hemen göster
        showSuccessOverlay();

        // 2. Veriyi hazırla
        const logData = {
            name: userName,
            coffeeType: type,
            price: price,
            timestamp: new Date().toLocaleString('tr-TR')
        };

        console.log('Veri gönderiliyor:', logData);

        // 3. Google Sheets'e gönder
        if (sheetUrl && sheetUrl.startsWith('http')) {
            // Google Apps Script için en güvenli yöntem veriyi text/plain olarak 
            // ama JSON formatında göndermektir (CORS hatalarını önlemek için)
            fetch(sheetUrl, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logData)
            })
            .then(() => {
                console.log('Google Sheets mesajı gönderildi (no-cors mode)');
            })
            .catch(err => {
                console.error('Gönderim sırasında hata oluştu:', err);
                alert('Veri gönderilemedi, lütfen internetinizi kontrol edin.');
            });
        } else {
            alert('Google Sheet bağlantısı kurulmamış. Ayarları kontrol edin.');
        }
    };

    const showSuccessOverlay = () => {
        successOverlay.classList.remove('hidden');
        let timeLeft = 3;
        timerSec.textContent = timeLeft;
        
        const countdown = setInterval(() => {
            timeLeft--;
            timerSec.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                successOverlay.classList.add('hidden');
            }
        }, 1000);
    };

    // Settings
    openSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    saveSettingsBtn.addEventListener('click', () => {
        sheetUrl = sheetUrlInput.value.trim();
        localStorage.setItem('coffee_sheetUrl', sheetUrl);
        settingsModal.classList.add('hidden');
        alert('URL Kaydedildi!');
    });

    // QR Page
    openQrBtn.addEventListener('click', () => {
        window.location.href = 'qr.html';
    });

    init();
});
