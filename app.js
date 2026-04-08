document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const regScreen = document.getElementById('registration-screen');
    const selScreen = document.getElementById('selection-screen');
    const welcomeMsg = document.getElementById('welcome-msg');
    const nameInput = document.getElementById('user-name-input');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const changeProfileBtn = document.getElementById('change-profile-btn');
    const coffeeBtns = document.querySelectorAll('.coffee-btn');
    
    // New V2 Elements
    const balanceBadge = document.getElementById('balance-badge');
    const userQuotaSpan = document.getElementById('user-quota');
    const paymentModal = document.getElementById('payment-modal');
    const paymentTimerSpan = document.getElementById('payment-timer');
    const closePaymentBtn = document.getElementById('close-payment');
    const copyPhoneBtn = document.getElementById('copy-phone');
    
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('open-settings');
    const closeSettingsBtn = document.getElementById('close-settings');
    const saveSettingsBtn = document.getElementById('save-settings');
    const sheetUrlInput = document.getElementById('sheet-url-input');
    const openQrBtn = document.getElementById('open-qr');

    // State
    let userName = localStorage.getItem('coffee_userName');
    let sheetUrl = 'https://script.google.com/macros/s/AKfycbxHrd-yB2okadNhOEgRxVNh7EffEA4ZK2BBPwOlkBNIPUoR4aDcP7BqujEHlJA20i161Q/exec';

    // Init Page
    const init = () => {
        if (userName) {
            showSelectionScreen();
            fetchUserQuota(); // Load balance on start
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
    };

    // Fetch Quota from Google Sheets
    const fetchUserQuota = async () => {
        if (!userName || !sheetUrl) return;
        
        try {
            // Google Apps Script doGet used here
            // Note: Cloud functions often need a proxy or handle CORS specially. 
            // We use the same URL but with GET params.
            const response = await fetch(`${sheetUrl}?name=${encodeURIComponent(userName)}`);
            const quota = await response.text();
            
            if (quota && !isNaN(quota)) {
                userQuotaSpan.textContent = quota;
                balanceBadge.classList.remove('hidden');
            }
        } catch (err) {
            console.error('Quota Fetch Error:', err);
        }
    };

    // Actions
    saveProfileBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            userName = name;
            localStorage.setItem('coffee_userName', name);
            showSelectionScreen();
            fetchUserQuota();
        } else {
            alert('Lütfen ismini girer misin?');
        }
    });

    changeProfileBtn.addEventListener('click', () => {
        if (confirm('İsmini değiştirmek istediğine emin misin?')) {
            localStorage.removeItem('coffee_userName');
            userName = null;
            showRegistrationScreen();
            balanceBadge.classList.add('hidden');
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
        // 1. Show Payment Modal
        showPaymentModal();

        // 2. Prepare Data
        const logData = {
            name: userName,
            coffeeType: type,
            price: price,
            timestamp: new Date().toLocaleString('tr-TR')
        };

        // 3. Send to Google Sheets
        if (sheetUrl) {
            fetch(sheetUrl, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logData)
            }).then(() => {
                // Update quota locally after a short delay to allow background processing
                setTimeout(fetchUserQuota, 2000);
            });
        }
    };

    const showPaymentModal = () => {
        paymentModal.classList.remove('hidden');
        let timeLeft = 10;
        paymentTimerSpan.textContent = timeLeft;
        
        const countdown = setInterval(() => {
            timeLeft--;
            paymentTimerSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                closeModal();
            }
        }, 1000);

        // Store interval to clear if manually closed
        paymentModal.dataset.intervalId = countdown;
    };

    const closeModal = () => {
        paymentModal.classList.add('hidden');
        if (paymentModal.dataset.intervalId) {
            clearInterval(paymentModal.dataset.intervalId);
        }
    };

    closePaymentBtn.addEventListener('click', closeModal);

    // Copy Phone Number
    copyPhoneBtn.addEventListener('click', () => {
        const phone = "05322109021";
        navigator.clipboard.writeText(phone).then(() => {
            const originalText = copyPhoneBtn.innerHTML;
            copyPhoneBtn.innerHTML = "Kopyalandı! ✅";
            setTimeout(() => {
                copyPhoneBtn.innerHTML = originalText;
            }, 2000);
        });
    });

    // Settings
    openSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    saveSettingsBtn.addEventListener('click', () => {
        const newUrl = sheetUrlInput.value.trim();
        if (newUrl) {
            sheetUrl = newUrl;
            localStorage.setItem('coffee_sheetUrl', sheetUrl);
            alert('URL Güncellendi!');
        }
        settingsModal.classList.add('hidden');
    });

    // QR Page
    openQrBtn.addEventListener('click', () => {
        window.location.href = 'qr.html';
    });

    init();
});
