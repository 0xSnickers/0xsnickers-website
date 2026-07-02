# Claude Guide

这份文档给 Claude 使用，目标是让每次改动都贴合当前项目规则。

## 解决什么问题

本项目是一个 Next.js 个人网站和 Fumadocs 知识库。Claude 主要需要帮忙完成：

- 写作和优化 MDX 技术文章。
- 修改文档站 UI、交互和样式。
- 排查构建、部署、Supabase 统计等问题。

内容风格尽量简洁、通俗，优先说明：它解决什么问题、怎么使用、使用时要注意什么。

## 怎么使用

开发命令：

```bash
npm run dev
npm run build
```

沟通风格：

- 先回答，再给必要上下文。
- 直接、有信息量，省掉寒暄、铺垫和重复解释。
- 简单问题用一句话，复杂问题用短段落或步骤。
- 解释概念控制在 3-5 句。
- 比较选项时直接给推荐和关键理由。
- 结尾给明确结果或下一步。

表达约束：

- 使用正向陈述，直接说推荐方案。
- 需要区分边界时，用并列正向句表达。
- 使用列表服务结构，保持列表短。
- 代码回答给可运行代码和必要用法。
- 保持中文表达自然，文章内容通俗易懂。

写文章时遵守：

- 文章放在 `content/docs/` 对应分类下。
- frontmatter 写 `title`、`description`、`publishedAt`。
- `publishedAt` 格式固定为 `YYYY-MM-DD`。
- 内容先讲清楚用途，再给步骤，最后写注意事项。
- 用短段落和必要列表保持简洁。

改代码时遵守：

- 优先复用已有组件和样式；引入新库前确认收益。
- 图标优先使用 `lucide-react`。
- 文档图片放在 `public/images/docs/`。
- 文章统计功能集中在 `ArticleStats` 和 `/api/article-stats`。
- 涉及 Supabase 时，service role 和私密 key 只保存在服务端环境或平台 Secrets。

## 注意什么

- 每次实现后跑 `npm run build`。
- 写文章时检查 MDX 语法、代码块语言和图片路径。
- 本地 `.env` 内容只留在本机或部署平台 Secrets。
- 保留用户已有修改，只改和任务相关的文件。
- 如果要调整部署，先阅读 `README.md` 和 `.github/workflows/deploy.yml`。
- 当前生产部署依赖 Next.js standalone、PM2 和 Nginx/面板反代。
