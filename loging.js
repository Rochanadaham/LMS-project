// =============================================================================
// loging.js — Authentication & Login Logic
// FIXED: Removed hardcoded localhost:3000 and old subfolder paths.
// Uses a dynamic API_BASE that works on localhost AND on any deployed server.
// =============================================================================

// ─── Dynamic API Base Configuration ──────────────────────────────────────────
// On GitHub Pages (static only) this won't reach a real backend.
// When running locally with Node/Express, it hits your local server.
// When deployed to a live server, update PRODUCTION_API_URL below.

const PRODUCTION_API_URL = ''; // e.g. 'https://your-api-server.com' — leave blank if same origin

const API_BASE = (() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000'; // Local Express server
  }
  return PRODUCTION_API_URL || window.location.origin; // Same-origin fallback
})();

// ─── Helper: Make API calls ───────────────────────────────────────────────────
async function apiPost(endpoint, body) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Send cookies for session-based auth
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Server error' }));
    throw new Error(err.message || `HTTP ${response.status}`);
  }
  return response.json();
}

async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    credentials: 'include'
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// ─── Login Handler ────────────────────────────────────────────────────────────
async function handleLogin(event) {
  if (event) event.preventDefault();

  const username = document.getElementById('username')?.value?.trim();
  const password = document.getElementById('password')?.value?.trim();
  const errorEl  = document.getElementById('login-error');

  if (!username || !password) {
    if (errorEl) errorEl.textContent = 'Please enter your username and password.';
    return;
  }

  try {
    // FIXED: was '/LMS/API/login' or 'localhost:3000/login' — now uses API_BASE
    const data = await apiPost('/api/login', { username, password });

    if (data.role === 'student') {
      // FIXED: was 'LMS/Public/stu dashboard 10.html' — now root-relative
      window.location.href = 'stu dashboard 10.html';
    } else if (data.role === 'faculty') {
      window.location.href = 'faculty-dashboard.html';
    } else if (data.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
  } catch (err) {
    console.error('Login error:', err);
    if (errorEl) errorEl.textContent = err.message || 'Login failed. Please try again.';
  }
}

// ─── Logout Handler ───────────────────────────────────────────────────────────
async function handleLogout() {
  try {
    await apiPost('/api/logout', {});
  } catch (e) {
    // Ignore logout errors — just redirect
  }
  // FIXED: was absolute path — now root-relative
  window.location.href = 'loging 1.html';
}

// ─── Auto-attach form listener on DOMContentLoaded ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
});
