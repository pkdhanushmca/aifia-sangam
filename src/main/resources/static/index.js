const MEMBER_API_URL = '/api/members';

const form = document.getElementById('sangamForm');
const successBox = document.getElementById('successBox');
const errorBox = document.getElementById('errorBox');
const submitBtn = form.querySelector('.submit-btn');

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    successBox.style.display = 'none';
    errorBox.style.display = 'none';

    // Build the JSON body the API expects (MemberRequest on the backend)
    const payload = {
        fullName: form.fullName.value.trim(),
        age: form.age.value ? Number(form.age.value) : null,
        mobile: form.mobile.value.trim(),
        area: form.area.value.trim(),
        occupation: form.occupation.value.trim(),
        interest: form.interest.value,
        message: form.message.value.trim(),
        agreedToPrinciples: form.agree.checked
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'சமர்ப்பிக்கிறது...';

    try {
        const response = await fetch(MEMBER_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
   
        if (response.ok) {
            successBox.style.display = 'block';
            form.reset();
            successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (response.status === 400) {
            // Validation errors from the backend, e.g. { "mobile": "10 இலக்க..." }
            const errors = await response.json();
            const messages = Object.values(errors).join(' · ');
            errorBox.textContent = messages || 'தகவல்களை சரிபார்க்கவும்.';
            errorBox.style.display = 'block';
        } else {
            throw new Error('Server error: ' + response.status);
        }
    } catch (err) {
        // Network failure, API not reachable, CORS not configured, etc.
        errorBox.textContent = 'இணைப்பு பிரச்சனை — சிறிது நேரம் கழித்து முயற்சிக்கவும். (' + err.message + ')';
        errorBox.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'விவரங்களை சமர்ப்பிக்கவும்';
    }
});
