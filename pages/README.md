# pages/ 目录说明

此目录用于存放您的 HTML 页面文件。

## 文件命名规范

```
{名称}_v{版本号}.html
```

**示例**：
- `LLM-对比平台_v1.0.0.html`
- `DeepSeek-API说明_v1.0.0.html`
- `Key测试工具_v2.1.0.html`

## 重要提醒

⚠️ **仅将 HTML 文件放入此目录还不够！**

您还必须编辑同目录下的 **`pages.json`** 文件来注册页面，否则页面不会显示在导航栏中。

## pages.json 结构

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-07-16",
  "pages": [
    {
      "id": "unique-id",
      "title": "页面标题",
      "file": "pages/文件名.html",
      "category": "分类名称",
      "version": "1.0.0",
      "date": "2026-07-16",
      "description": "页面描述"
    }
  ]
}
```

## 快速检查清单

- [ ] HTML 文件已放入 `pages/` 目录
- [ ] `pages.json` 中已添加页面注册信息
- [ ] `file` 路径正确（相对于工程根目录）
- [ ] `id` 唯一且只含字母/数字/下划线/横线
- [ ] `category` 已填写（用于导航分组）

---

CHQ Portal Framework · © 2026 CHQ Company
