/**
 * CHQ Portal Framework v1.0.0
 * Authentication Module
 * Copyright © 2026 CHQ Company. All rights reserved.
 * Author & Principal Architect: Richard Chen (ChenHongQiang)
 */

const AUTH_CONFIG = {
  // Default credentials (change after first login)
  username: 'admin',
  passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // "password" hashed
  tokenKey: 'chq_portal_auth_token',
  userKey: 'chq_portal_user',
  sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
};

// Simple SHA-256 hash for password
async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate auth token
function generateToken(username) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return btoa(`${username}:${timestamp}:${random}`);
}

// Login handler
async function handleLogin(username, password, remember = false) {
  try {
    const inputHash = await sha256(password);
    
    if (username !== AUTH_CONFIG.username || inputHash !== AUTH_CONFIG.passwordHash) {
      return { success: false, message: '用户名或密码错误' };
    }

    const token = generateToken(username);
    const expiry = remember ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + AUTH_CONFIG.sessionDuration;
    
    const authData = {
      token,
      username,
      expiry,
      loginAt: new Date().toISOString(),
    };

    localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(authData));
    localStorage.setItem(AUTH_CONFIG.userKey, username);
    
    return { success: true, message: '登录成功' };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, message: '登录发生错误，请重试' };
  }
}

// Check authentication status
function checkAuth() {
  try {
    const authData = JSON.parse(localStorage.getItem(AUTH_CONFIG.tokenKey));
    if (!authData) return false;
    
    if (Date.now() > authData.expiry) {
      logout();
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Logout
function logout() {
  localStorage.removeItem(AUTH_CONFIG.tokenKey);
  localStorage.removeItem(AUTH_CONFIG.userKey);
  window.location.href = 'index.html';
}

// Get current user
function getCurrentUser() {
  return localStorage.getItem(AUTH_CONFIG.userKey) || 'Guest';
}

// Protect route
function requireAuth() {
  if (!checkAuth()) {
    window.location.href = 'index.html';
  }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  // If on login page and already authenticated, redirect to main
  if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    if (checkAuth()) {
      window.location.href = 'main.html';
    }
  }
});

// Export for global use
window.CHQAuth = {
  login: handleLogin,
  logout,
  checkAuth,
  getCurrentUser,
  requireAuth,
  sha256,
};
