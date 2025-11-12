// ===== theme.js =====
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
  
    // === Apply saved theme ===
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
  
    if (themeBtn) {
      themeBtn.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Night Mode';
      themeBtn.addEventListener('click', () => {
        const current = body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Night Mode';
      });
    }
  
    function applyTheme(mode) {
      if (mode === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
      } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
      }
    }
  
    // === USER AUTH SYSTEM ===
    const authContainer = document.getElementById('auth-container');
    const savedUser = localStorage.getItem('user');
  
    if (authContainer) {
      if (savedUser) {
        // Already logged in
        authContainer.innerHTML = `
          <span class="user-name">👋 Welcome, ${savedUser}</span>
          <button id="logout-btn" class="btn btn-outline">Logout</button>
        `;
        document.getElementById('logout-btn').addEventListener('click', () => {
          localStorage.removeItem('user');
          location.reload();
        });
      } else {
        // Show Login / Register
        authContainer.innerHTML = `
          <button id="login-btn" class="btn btn-outline">Login</button>
          <button id="register-btn" class="btn btn-primary">Register</button>
        `;
        setupAuthModals();
      }
    }
  
    // === Simple modals for login/register ===
    function setupAuthModals() {
      const modal = document.createElement('div');
      modal.id = 'auth-modal';
      modal.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.7);display:none;
        align-items:center;justify-content:center;z-index:9999;
      `;
      modal.innerHTML = `
        <div style="background:white;padding:2rem;border-radius:10px;max-width:350px;text-align:center;">
          <h3 id="auth-title">Login</h3>
          <input id="username-input" type="text" placeholder="Username" style="width:100%;padding:.5rem;margin-bottom:1rem;border-radius:8px;border:1px solid #ccc;">
          <button id="auth-submit" class="btn btn-primary" style="width:100%;">Continue</button>
          <p style="margin-top:.5rem;"><a href="#" id="close-auth">Cancel</a></p>
        </div>
      `;
      document.body.appendChild(modal);
  
      // Handlers
      document.getElementById('login-btn').addEventListener('click', () => openModal('Login'));
      document.getElementById('register-btn').addEventListener('click', () => openModal('Register'));
  
      function openModal(type) {
        document.getElementById('auth-title').textContent = type;
        modal.style.display = 'flex';
      }
  
      document.getElementById('close-auth').addEventListener('click', e => {
        e.preventDefault();
        modal.style.display = 'none';
      });
  
      document.getElementById('auth-submit').addEventListener('click', () => {
        const name = document.getElementById('username-input').value.trim();
        if (name) {
          localStorage.setItem('user', name);
          modal.style.display = 'none';
          location.reload();
        } else {
          alert('Please enter your username');
        }
      });
    }
  });
  