// ===== Login Page Logic =====

// Demo credentials
const VALID_CREDENTIALS = {
    email: 'admin@staffhub.com',
    password: 'admin123'
};

// ===== Check if already logged in =====
(function checkAuth() {
    const session = localStorage.getItem('staffhub_session');
    if (session) {
        try {
            const data = JSON.parse(session);
            if (data.loggedIn) {
                window.location.href = 'index.html';
            }
        } catch (e) { /* ignore */ }
    }
})();

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const togglePassword = document.getElementById('toggle-password');

    // Pre-fill if remembered
    const remembered = localStorage.getItem('staffhub_remember');
    if (remembered) {
        try {
            const data = JSON.parse(remembered);
            emailInput.value = data.email || '';
            document.getElementById('remember-me').checked = true;
        } catch (e) { /* ignore */ }
    }

    // ===== Toggle Password Visibility =====
    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        const eyeIcon = togglePassword.querySelector('.eye-icon');
        const eyeOffIcon = togglePassword.querySelector('.eye-off-icon');
        eyeIcon.style.display = isPassword ? 'none' : 'block';
        eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    });

    // ===== Clear errors on input =====
    emailInput.addEventListener('input', () => clearError('email'));
    passwordInput.addEventListener('input', () => clearError('password'));

    // ===== Form Submit =====
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset errors
        clearError('email');
        clearError('password');

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        let hasError = false;

        // Validate email
        if (!email) {
            showError('email', 'Email address is required');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            hasError = true;
        }

        // Validate password
        if (!password) {
            showError('password', 'Password is required');
            hasError = true;
        } else if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            hasError = true;
        }

        if (hasError) return;

        // Show loading state
        setLoading(true);

        // Simulate network delay for realism
        await delay(1200);

        // Check credentials
        if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
            // Remember me
            const rememberMe = document.getElementById('remember-me').checked;
            if (rememberMe) {
                localStorage.setItem('staffhub_remember', JSON.stringify({ email }));
            } else {
                localStorage.removeItem('staffhub_remember');
            }

            // Save session
            localStorage.setItem('staffhub_session', JSON.stringify({
                loggedIn: true,
                user: {
                    name: 'Admin User',
                    email: email,
                    role: 'HR Manager',
                    avatar: 'A'
                },
                loginTime: new Date().toISOString()
            }));

            // Success animation
            loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            loginBtn.querySelector('.btn-text').textContent = '✓ Welcome back!';
            setLoading(false);

            // Redirect after brief pause
            await delay(600);
            window.location.href = 'index.html';
        } else {
            setLoading(false);

            // Shake animation
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);

            if (email !== VALID_CREDENTIALS.email) {
                showError('email', 'No account found with this email');
            } else {
                showError('password', 'Incorrect password. Try again.');
            }
        }
    });

    // ===== Social Login Buttons (demo) =====
    document.getElementById('google-btn').addEventListener('click', () => {
        showDemoAlert('Google Sign-In is not available in demo mode.');
    });

    document.getElementById('microsoft-btn').addEventListener('click', () => {
        showDemoAlert('Microsoft Sign-In is not available in demo mode.');
    });

    // ===== Keyboard: Enter to submit =====
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
    });
});

// ===== Helper Functions =====

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(field, message) {
    const group = document.getElementById(`${field}-group`);
    const errorEl = document.getElementById(`${field}-error`);
    group.classList.add('error');
    errorEl.textContent = message;
}

function clearError(field) {
    const group = document.getElementById(`${field}-group`);
    const errorEl = document.getElementById(`${field}-error`);
    group.classList.remove('error');
    errorEl.textContent = '';
}

function setLoading(loading) {
    const btn = document.getElementById('login-btn');
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');

    if (loading) {
        btn.classList.add('loading');
        text.style.display = 'none';
        loader.style.display = 'flex';
    } else {
        btn.classList.remove('loading');
        text.style.display = 'inline';
        loader.style.display = 'none';
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showDemoAlert(message) {
    // Create a small toast-like notification
    const existing = document.querySelector('.demo-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'demo-toast';
    toast.style.cssText = `
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(20px);
        background: rgba(17,24,39,0.95); border: 1px solid rgba(99,102,241,0.2);
        border-radius: 10px; padding: 14px 24px; color: #94a3b8; font-size: 0.85rem;
        font-family: 'Inter', sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000; opacity: 0; transition: all 0.3s ease;
        backdrop-filter: blur(12px);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== Add shake animation CSS dynamically =====
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 50%, 90% { transform: translateX(-6px); }
        30%, 70% { transform: translateX(6px); }
    }
    .shake { animation: shake 0.5s ease; }
`;
document.head.appendChild(style);
