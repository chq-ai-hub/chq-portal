/**
 * CHQ Portal Framework v1.0.0
 * Router & Pagination Module
 * Copyright © 2026 CHQ Company. All rights reserved.
 * Author & Principal Architect: Richard Chen (ChenHongQiang)
 */

const Router = {
  pages: [],
  currentIndex: 0,
  categories: new Set(),

  // Initialize router
  async init() {
    await this.loadPages();
    this.renderSidebar();
    this.renderBreadcrumb();
    this.bindEvents();
    this.loadFromHash();
    this.updateUI();
  },

  // Load pages configuration
  async loadPages() {
    try {
      const response = await fetch('pages/pages.json?v=' + Date.now());
      if (!response.ok) throw new Error('Failed to load pages config');
      const data = await response.json();
      this.pages = data.pages || [];
      this.extractCategories();
    } catch (err) {
      console.warn('Using default pages:', err);
      this.pages = this.getDefaultPages();
      this.extractCategories();
    }
  },

  // Default demo pages (fallback)
  getDefaultPages() {
    return [
      {
        id: 'welcome',
        title: '欢迎使用 CHQ Portal',
        file: 'pages/_welcome.html',
        category: '系统',
        version: '1.0.0',
        date: '2026-07-16',
        description: 'CHQ Portal 框架欢迎页'
      }
    ];
  },

  // Extract unique categories
  extractCategories() {
    this.categories.clear();
    this.pages.forEach(p => this.categories.add(p.category || '未分类'));
  },

  // Render sidebar navigation
  renderSidebar() {
    const sidebar = document.getElementById('sidebar-nav');
    if (!sidebar) return;

    const cats = Array.from(this.categories);
    let html = '';

    cats.forEach(cat => {
      const catPages = this.pages.filter(p => (p.category || '未分类') === cat);
      html += `
        <div class="nav-category">
          <div class="nav-category-title">
            <span class="nav-category-icon">◆</span>
            <span>${this.escapeHtml(cat)}</span>
          </div>
          <div class="nav-pages">
            ${catPages.map((page, idx) => {
              const globalIdx = this.pages.indexOf(page);
              const isActive = globalIdx === this.currentIndex;
              return `
                <button class="nav-page-btn ${isActive ? 'active' : ''}" 
                        data-index="${globalIdx}" 
                        onclick="Router.goTo(${globalIdx})"
                        title="${this.escapeHtml(page.description || '')}">
                  <span class="nav-page-num">${String(globalIdx + 1).padStart(2, '0')}</span>
                  <span class="nav-page-title">${this.escapeHtml(page.title)}</span>
                  ${page.version ? `<span class="nav-page-ver">v${page.version}</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    sidebar.innerHTML = html;
  },

  // Render breadcrumb
  renderBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    if (!breadcrumb || this.pages.length === 0) return;
    
    const page = this.pages[this.currentIndex];
    breadcrumb.innerHTML = `
      <span class="bc-item">CHQ Portal</span>
      <span class="bc-separator">/</span>
      <span class="bc-item">${this.escapeHtml(page.category || '未分类')}</span>
      <span class="bc-separator">/</span>
      <span class="bc-item active">${this.escapeHtml(page.title)}</span>
    `;
  },

  // Navigate to page by index
  goTo(index) {
    if (index < 0 || index >= this.pages.length) return;
    
    this.currentIndex = index;
    this.loadPage(this.pages[index]);
    this.updateHash();
    this.updateUI();
    this.renderSidebar(); // Re-render to update active state
    this.renderBreadcrumb();
  },

  // Load page into iframe
  loadPage(page) {
    const iframe = document.getElementById('content-frame');
    const loader = document.getElementById('page-loader');
    if (!iframe) return;

    if (loader) loader.classList.remove('hidden');
    
    iframe.style.opacity = '0';
    iframe.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      iframe.src = page.file;
      iframe.onload = () => {
        iframe.style.opacity = '1';
        iframe.style.transform = 'scale(1)';
        if (loader) loader.classList.add('hidden');
      };
      iframe.onerror = () => {
        iframe.srcdoc = this.getErrorPage(page.file);
        iframe.style.opacity = '1';
        iframe.style.transform = 'scale(1)';
        if (loader) loader.classList.add('hidden');
      };
    }, 200);
  },

  // Error page template
  getErrorPage(filePath) {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">
      <style>
        body { 
          background: #0a0a0f; 
          color: #f5f5f7; 
          font-family: -apple-system, sans-serif;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height: 100vh; 
          margin: 0;
          text-align: center;
        }
        .error-box { padding: 40px; }
        .error-icon { font-size: 64px; margin-bottom: 20px; }
        .error-title { font-size: 24px; margin-bottom: 12px; }
        .error-desc { color: #a1a1a6; font-size: 14px; }
        .error-file { 
          background: rgba(255,255,255,0.05); 
          padding: 8px 16px; 
          border-radius: 8px; 
          margin-top: 16px;
          font-family: monospace;
          font-size: 12px;
          color: #c9a227;
        }
      </style>
      </head>
      <body>
        <div class="error-box">
          <div class="error-icon">⚠️</div>
          <div class="error-title">页面加载失败</div>
          <div class="error-desc">文件可能不存在或路径有误</div>
          <div class="error-file">${filePath}</div>
        </div>
      </body>
      </html>
    `;
  },

  // Next page
  next() {
    if (this.currentIndex < this.pages.length - 1) {
      this.goTo(this.currentIndex + 1);
    } else {
      this.showToast('已经是最后一页了', 'info');
    }
  },

  // Previous page
  prev() {
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
    } else {
      this.showToast('已经是第一页了', 'info');
    }
  },

  // Update URL hash
  updateHash() {
    const page = this.pages[this.currentIndex];
    if (page) {
      window.location.hash = `page=${page.id}`;
    }
  },

  // Load from URL hash
  loadFromHash() {
    const hash = window.location.hash;
    const match = hash.match(/page=([^&]+)/);
    if (match) {
      const pageId = decodeURIComponent(match[1]);
      const index = this.pages.findIndex(p => p.id === pageId);
      if (index !== -1) {
        this.currentIndex = index;
        this.loadPage(this.pages[index]);
      }
    } else if (this.pages.length > 0) {
      this.loadPage(this.pages[0]);
    }
  },

  // Update UI elements
  updateUI() {
    const currentEl = document.getElementById('current-page');
    const totalEl = document.getElementById('total-pages');
    const progressEl = document.getElementById('progress-bar');
    const titleEl = document.getElementById('page-title');
    const verEl = document.getElementById('page-version');
    const dateEl = document.getElementById('page-date');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');

    if (currentEl) currentEl.textContent = this.currentIndex + 1;
    if (totalEl) totalEl.textContent = this.pages.length;
    if (progressEl) {
      const pct = ((this.currentIndex + 1) / this.pages.length) * 100;
      progressEl.style.width = pct + '%';
    }

    const page = this.pages[this.currentIndex];
    if (page) {
      if (titleEl) titleEl.textContent = page.title;
      if (verEl) verEl.textContent = page.version ? `v${page.version}` : '';
      if (dateEl) dateEl.textContent = page.date || '';
    }

    if (prevBtn) prevBtn.disabled = this.currentIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentIndex === this.pages.length - 1;
  },

  // Bind keyboard and mouse events
  bindEvents() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          this.next();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          this.prev();
          break;
        case 'Home':
          e.preventDefault();
          this.goTo(0);
          break;
        case 'End':
          e.preventDefault();
          this.goTo(this.pages.length - 1);
          break;
      }
    });

    // Mouse wheel with shift
    document.addEventListener('wheel', (e) => {
      if (e.shiftKey) {
        e.preventDefault();
        if (e.deltaY > 0) this.next();
        else this.prev();
      }
    }, { passive: false });

    // Hash change
    window.addEventListener('hashchange', () => this.loadFromHash());
  },

  // Search pages
  search(query) {
    if (!query) {
      this.renderSidebar();
      return;
    }
    const q = query.toLowerCase();
    const filtered = this.pages.filter(p => 
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
    this.renderFilteredSidebar(filtered);
  },

  // Render filtered results
  renderFilteredSidebar(filtered) {
    const sidebar = document.getElementById('sidebar-nav');
    if (!sidebar) return;

    if (filtered.length === 0) {
      sidebar.innerHTML = '<div class="nav-empty">未找到匹配页面</div>';
      return;
    }

    sidebar.innerHTML = `
      <div class="nav-category">
        <div class="nav-category-title">
          <span class="nav-category-icon">🔍</span>
          <span>搜索结果 (${filtered.length})</span>
        </div>
        <div class="nav-pages">
          ${filtered.map((page) => {
            const globalIdx = this.pages.indexOf(page);
            const isActive = globalIdx === this.currentIndex;
            return `
              <button class="nav-page-btn ${isActive ? 'active' : ''}" 
                      data-index="${globalIdx}" 
                      onclick="Router.goTo(${globalIdx})">
                <span class="nav-page-num">${String(globalIdx + 1).padStart(2, '0')}</span>
                <span class="nav-page-title">${this.escapeHtml(page.title)}</span>
                ${page.version ? `<span class="nav-page-ver">v${page.version}</span>` : ''}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // Show toast notification
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  },

  // Escape HTML
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // Get pages data (for external use)
  getPages() {
    return this.pages;
  },

  // Get current page
  getCurrentPage() {
    return this.pages[this.currentIndex];
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('sidebar-nav')) {
    Router.init();
  }
});

window.Router = Router;
