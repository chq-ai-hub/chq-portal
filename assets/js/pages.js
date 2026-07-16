/**
 * CHQ Portal Framework v1.0.0
 * Page Configuration Manager
 * Copyright © 2026 CHQ Company. All rights reserved.
 * Author & Principal Architect: Richard Chen (ChenHongQiang)
 */

const PageManager = {
  // Validate a page entry
  validatePage(page) {
    const errors = [];
    if (!page.id) errors.push('缺少 id 字段');
    if (!page.title) errors.push('缺少 title 字段');
    if (!page.file) errors.push('缺少 file 字段');
    if (!/^[a-zA-Z0-9_-]+$/.test(page.id)) errors.push('id 只能包含字母、数字、下划线和横线');
    return errors;
  },

  // Generate page ID from filename
  generateId(filename) {
    return filename
      .replace(/\.html?$/i, '')
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase()
      .substring(0, 50);
  },

  // Extract version from filename
  extractVersion(filename) {
    const match = filename.match(/[vV](\d+\.\d+(?:\.\d+)?)/);
    return match ? match[1] : '1.0.0';
  },

  // Auto-detect pages from file list (for future enhancement)
  async autoDetect() {
    // This would require a server-side component or build step
    // For GitHub Pages, we use the JSON configuration approach
    console.log('Auto-detect requires build step. Use pages/pages.json instead.');
  },

  // Export configuration template
  getConfigTemplate() {
    return {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      pages: [
        {
          id: "example-page",
          title: "示例页面",
          file: "pages/example_v1.0.0.html",
          category: "示例分类",
          version: "1.0.0",
          date: "2026-07-16",
          description: "页面简短描述"
        }
      ]
    };
  },

  // Generate batch integration config from filenames
  generateBatchConfig(filenames, category = "未分类") {
    const pages = filenames.map((name, index) => ({
      id: this.generateId(name),
      title: name.replace(/\.html?$/i, '').replace(/_/g, ' '),
      file: `pages/${name}`,
      category: category,
      version: this.extractVersion(name),
      date: new Date().toISOString().split('T')[0],
      description: `自动生成的页面配置 - ${name}`
    }));

    return {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      pages
    };
  }
};

window.PageManager = PageManager;
