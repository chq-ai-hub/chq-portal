# CHQ Portal Framework

> **Richard Chen (ChenHongQiang) Research & Development Knowledge Base · CHQ Company**
>
> 一个面向 GitHub Pages 部署的、支持登录认证与翻页浏览的 HTML Portal 框架。
> An HTML Portal framework with authentication and pagination, designed for GitHub Pages deployment.

---

## 📋 目录

- [工程结构](#-工程结构)
- [快速开始](#-快速开始)
- [页面集成指南（3步走）](#-页面集成指南3步走)
- [批量集成提示词模板](#-批量集成提示词模板)
- [版本管理规范](#-版本管理规范)
- [快捷键](#-快捷键)
- [更新日志](#-更新日志)

---

## 🏗 工程结构

```
chq-portal-v1.0.0/
├── index.html                 # 登录入口页（默认账号: admin / 密码: password）
├── main.html                  # 主浏览框架页（需登录后访问）
├── 404.html                   # 404 错误页
├── VERSION                    # 当前版本号（v1.0.0）
├── CHANGELOG.md               # 版本变更日志
├── README.md                  # 本文件（集成手顺与使用说明）
│
├── assets/
│   ├── css/
│   │   ├── style.css          # 全局样式（CSS Variables / 动画 / 工具类）
│   │   ├── login.css          # 登录页专用样式
│   │   └── portal.css         # 主浏览页专用样式
│   ├── js/
│   │   ├── auth.js            # 登录认证模块（SHA-256 + Token）
│   │   ├── router.js          # 路由与翻页逻辑
│   │   ├── pages.js           # 页面配置管理工具
│   │   └── effects.js         # 动态视觉效果（粒子背景 / 极光 / 主题）
│   └── images/                # 图片资源目录
│
├── pages/                     # ⭐ 您的 HTML 文件存放处
│   ├── pages.json             # 页面注册配置文件（核心）
│   ├── _welcome.html          # 系统默认欢迎页
│   └── README.md              # 页面存放说明
│
├── docs/
│   └── INTEGRATION_GUIDE.md   # 详细集成技术文档
│
├── versions/                  # 历史版本备份目录
│   └── README.md
│
└── .github/
    └── workflows/
        └── deploy.yml         # GitHub Actions 自动部署配置
```

---

## 🚀 快速开始

### 1. 本地预览

直接在浏览器中打开 `index.html` 即可预览。

```bash
# 或使用 Python 简易服务器
python3 -m http.server 8000
# 访问 http://localhost:8000
```

### 2. 部署到 GitHub Pages

1. 在 GitHub 创建新仓库（如 `chq-portal`）
2. 将本工程 push 到仓库
3. 进入 **Settings → Pages → Source**，选择 **GitHub Actions**
4. 或选择 **Deploy from a branch → main / (root)**
5. 访问 `https://yourname.github.io/chq-portal/`

---

## ⭐ 页面集成指南（3步走）

### 第 1 步：放入 HTML 文件

将您的 HTML 文件复制到 `pages/` 目录下。

**推荐命名格式**：
```
{名称}_v{版本号}.html
```

**示例**：
```
pages/
├── LLM-对比平台_v1.0.0.html
├── LLM-对比平台_v2.0.0.html
├── DeepSeek-API说明_v1.0.0.html
└── ...
```

### 第 2 步：注册页面

编辑 `pages/pages.json` 文件，在 `pages` 数组中添加您的页面信息。

**单页面注册示例**：
```json
{
  "id": "llm-compare-v1",
  "title": "LLM 对比平台 v1.0",
  "file": "pages/LLM-对比平台_v1.0.0.html",
  "category": "LLM工具",
  "version": "1.0.0",
  "date": "2026-07-16",
  "description": "大语言模型多维度对比分析平台"
}
```

**字段说明**：

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | ✅ | 唯一标识，仅含字母/数字/下划线/横线 |
| `title` | ✅ | 页面标题（显示在导航栏） |
| `file` | ✅ | HTML 文件路径，相对于工程根目录 |
| `category` | ❌ | 分类名称，用于导航分组 |
| `version` | ❌ | 版本号，如 `1.0.0` |
| `date` | ❌ | 更新日期，如 `2026-07-16` |
| `description` | ❌ | 页面描述，hover 时显示 |

### 第 3 步：提交并部署

```bash
git add .
git commit -m "feat: 集成 LLM 对比平台 v1.0.0"
git push origin main
```

GitHub Pages 会自动更新（约 1-2 分钟）。

---

## 🤖 批量集成提示词模板

### 模板 A：单个页面集成

当您给我单个 HTML 文件时，请复制以下提示词：

```text
请帮我把这个 HTML 文件集成到 CHQ Portal 工程中：

文件内容：[粘贴 HTML 内容]

文件名：LLM-对比平台_v1.0.0.html
分类：LLM工具
版本：1.0.0
日期：2026-07-16
描述：大语言模型对比分析平台

请执行：
1. 将文件保存到 pages/ 目录
2. 更新 pages/pages.json 注册该页面
3. 更新 CHANGELOG.md 记录变更
4. 递增 VERSION 中的修订版本号（如 v1.0.0 → v1.0.1）
5. 打包工程为 zip
```

### 模板 B：批量页面集成

当您给我多个 HTML 文件时，请复制以下提示词：

```text
请帮我批量集成以下 HTML 文件到 CHQ Portal 工程中：

文件列表：
1. LLM-Key-Tester_v1.0.html（分类：测试工具，版本：1.0.0）
2. LLM-Key-Tester_v2.0.html（分类：测试工具，版本：2.0.0）
3. LLM-对比平台_v4.0.html（分类：LLM工具，版本：4.0.0）
4. DeepSeek-API-说明_v1.0.html（分类：API文档，版本：1.0.0）
[继续添加...]

请执行：
1. 将所有文件保存到 pages/ 目录
2. 更新 pages/pages.json 批量注册所有页面
3. 更新 CHANGELOG.md 记录本次批量集成
4. 递增 VERSION 中的次版本号（如 v1.0.0 → v1.1.0）
5. 打包工程为 zip
```

### 模板 C：更新现有页面

当您需要更新已集成的页面时：

```text
请帮我更新 CHQ Portal 中的页面：

页面 ID：llm-compare-v1
更新内容：[描述变更内容]
新文件内容：[粘贴新 HTML 内容]

请执行：
1. 覆盖 pages/ 目录下的原文件（或保留旧版本备份）
2. 更新 pages/pages.json 中的 version 和 date 字段
3. 更新 CHANGELOG.md 记录变更
4. 递增 VERSION 中的修订版本号
5. 打包工程为 zip
```

---

## 🏷 版本管理规范

### 语义化版本号

格式：`v主版本.次版本.修订号`

| 级别 | 触发条件 | 示例 |
|------|----------|------|
| **主版本** | 重大架构变更、不兼容更新 | v1.0.0 → v2.0.0 |
| **次版本** | 新增功能、新增页面集成 | v1.0.0 → v1.1.0 |
| **修订号** | Bug 修复、样式微调、页面更新 | v1.0.0 → v1.0.1 |

### 每次更新必须执行的操作

1. ✅ 修改 `VERSION` 文件中的版本号
2. ✅ 在 `CHANGELOG.md` 顶部添加新版本记录
3. ✅ 更新 `pages/pages.json` 中的 `lastUpdated` 字段
4. ✅ 如需保留旧版本，备份到 `versions/` 目录

### 备份命名格式

```
versions/chq-portal-v{旧版本号}-{日期}.zip
```

**示例**：`versions/chq-portal-v1.0.0-20260715.zip`

---

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `←` / `→` | 上一页 / 下一页 |
| `PageUp` / `PageDown` | 上一页 / 下一页 |
| `Shift` + 滚轮 | 翻页浏览 |
| `Home` / `End` | 跳到第一页 / 最后一页 |
| `T` | 切换深色/浅色主题 |
| `Esc` | 退出登录 |

---

## 📄 更新日志

详见 [CHANGELOG.md](./CHANGELOG.md)

---

## 📜 版权声明 / Legal Notice

**Copyright © 2026 CHQ Company. All rights reserved.**

This work is the exclusive intellectual property of CHQ Company.  
Unauthorized reproduction, distribution, or commercial exploitation in any form is strictly prohibited without prior written consent.

**Author & Principal Architect**  
Richard Chen (ChenHongQiang)

---

**著作权声明**

本作品为 CHQ Company 的知识产权，受相关法律保护。  
未经 CHQ Company 事先书面许可，任何单位或个人不得以任何形式复制、转载、修改或用于商业用途。

**作者暨首席架构师**  
Richard Chen（陈鸿强）

---

> 💡 **提示**：本工程所有文件均为静态资源，可直接部署到任何静态托管服务（GitHub Pages、Vercel、Netlify、Cloudflare Pages 等）。
> 
> **Tip**: All files in this project are static assets and can be deployed to any static hosting service.
