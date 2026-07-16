# CHQ Portal 详细集成技术文档

> 本文档面向需要深度定制或批量集成的用户。

---

## 1. 页面配置系统详解

### 1.1 pages.json 完整字段规范

```json
{
  "version": "配置格式版本",
  "lastUpdated": "最后更新日期",
  "pages": [
    {
      "id": "页面唯一标识（必填，URL-safe）",
      "title": "页面标题（必填，显示用）",
      "file": "文件路径（必填，相对根目录）",
      "category": "分类（可选，默认"未分类"）",
      "version": "页面版本（可选）",
      "date": "日期（可选）",
      "description": "描述（可选，tooltip用）"
    }
  ]
}
```

### 1.2 分类管理策略

建议按以下方式组织分类：

| 分类 | 用途 |
|------|------|
| `系统` | 框架自带页面 |
| `LLM工具` | 大语言模型相关工具 |
| `API文档` | API 说明与规格文档 |
| `测试工具` | 各类测试与验证工具 |
| `数据分析` | 数据可视化与分析 |
| `个人项目` | 其他个人研发项目 |

### 1.3 ID 生成规则

ID 必须满足：
- 唯一性：在整个 `pages` 数组中不重复
- URL-safe：仅包含 `a-z`, `A-Z`, `0-9`, `_`, `-`
- 语义化：如 `llm-compare-v1`, `deepseek-api-doc`

---

## 2. 批量集成自动化

### 2.1 使用 PageManager 生成配置

在浏览器控制台中执行：

```javascript
// 假设您有一组文件名
const files = [
  'LLM-Key-Tester_v1.0.html',
  'LLM-对比平台_v4.0.html',
  'DeepSeek-API-说明_v1.0.html'
];

// 自动生成配置
const config = PageManager.generateBatchConfig(files, '待分类');
console.log(JSON.stringify(config, null, 2));
```

### 2.2 配置验证

```javascript
// 验证单个页面配置
const errors = PageManager.validatePage({
  id: 'test-page',
  title: '测试',
  file: 'pages/test.html'
});
console.log(errors); // 空数组表示验证通过
```

---

## 3. 样式定制

### 3.1 CSS Variables 覆盖

在 `assets/css/style.css` 的 `:root` 中修改以下变量：

```css
:root {
  --gold-primary: #c9a227;    /* 主强调色 */
  --gold-light: #e8d5a3;      /* 亮强调色 */
  --gold-dark: #8a6d1f;       /* 暗强调色 */
  --rose-gold: #b76e79;       /* 玫瑰金 */
  
  --bg-primary: #0a0a0f;      /* 主背景 */
  --bg-secondary: #12121a;    /* 次背景 */
  --bg-tertiary: #1a1a24;     /* 第三背景 */
}
```

### 3.2 主题切换原理

通过 `data-theme` 属性切换：
- `<html data-theme="dark">` 深色模式
- `<html data-theme="light">` 浅色模式

---

## 4. 认证系统

### 4.1 修改默认密码

编辑 `assets/js/auth.js`：

```javascript
const AUTH_CONFIG = {
  username: 'admin',
  passwordHash: '您的SHA256哈希值', // 使用 SHA256("您的密码")
  // ...
};
```

**生成 SHA256**：
```javascript
// 在浏览器控制台执行
async function getHash(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
getHash('您的新密码').then(console.log);
```

### 4.2 Token 持久化

登录状态存储在 `localStorage`：
- `chq_portal_auth_token`：认证 Token 及过期时间
- `chq_portal_theme`：主题偏好

---

## 5. GitHub Actions 自动部署

### 5.1 配置文件

`.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 5.2 启用步骤

1. 将工程 push 到 GitHub 仓库
2. 进入 **Settings → Pages**
3. Source 选择 **GitHub Actions**
4. 等待首次部署完成

---

## 6. 常见问题

### Q: 页面加载显示 404？
A: 检查 `pages.json` 中的 `file` 路径是否正确，文件名大小写是否匹配。

### Q: 新页面不显示在导航栏？
A: 必须同时满足：1) HTML 文件在 `pages/` 目录；2) `pages.json` 中已注册。

### Q: 如何删除页面？
A: 1) 删除 `pages/` 下的 HTML 文件；2) 从 `pages.json` 中移除对应条目。

### Q: 登录后白屏？
A: 检查浏览器控制台报错，通常是 `pages.json` 格式错误或文件路径问题。

---

CHQ Portal Framework
Copyright © 2026 CHQ Company. All rights reserved.
Author & Principal Architect: Richard Chen (ChenHongQiang)
