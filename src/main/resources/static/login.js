
const LOGIN_API_URL = '/api/auth/login';

const form = document.getElementById('loginForm');
const errorBox = document.getElementById('errorBox');
const toggleBtn = document.getElementById('togglePass');
const passInput = document.getElementById('password');

toggleBtn.addEventListener('click', () => {
    const isHidden = passInput.type === 'password';
    passInput.type = isHidden ? 'text' : 'password';
    toggleBtn.textContent = isHidden ? 'மறை' : 'காட்டு';
});

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    errorBox.style.display = 'none';

    const payload = {
        username: form.username.value.trim(),
        password: form.password.value
    };

    try {
        const response = await fetch(LOGIN_API_URL, {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = '/members.html';
        } else if (response.status === 401) {
            errorBox.textContent = 'பயனர்பெயர் அல்லது கடவுச்சொல் தவறு.';
            errorBox.style.display = 'block';
        } else {
            throw new Error('Server error: ' + response.status);
        }
    } catch (err) {
        errorBox.textContent = 'இணைப்பு பிரச்சனை — சிறிது நேரம் கழித்து முயற்சிக்கவும்.';
        errorBox.style.display = 'block';
    }
});