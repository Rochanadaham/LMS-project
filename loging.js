// Dynamic Base API URL configuration block
// When running locally on your computer, it connects to localhost backend.
// When hosted, change the production URL string to your live Backend deployment link (Render/Railway).
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://your-backend-api-service.onrender.com' // Replace with your actual live backend link later
};

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Dynamic fetch calling backend routing mechanisms 
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            
            // Fixed Redirection Router Paths mapped for the single root directory layout
            if (data.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else if (data.role === 'faculty') {
                window.location.href = 'faculty-dashboard.html';
            } else if (data.role === 'student') {
                window.location.href = 'stu%20dashboard%2010.html'; // Properly escaped space for browser redirection
            }
        } else {
            alert(data.message || 'Login credentials invalid');
        }
    } catch (err) {
        console.error('Authentication transmission error:', err);
        alert('Could not connect to the authentication server.');
    }
});
