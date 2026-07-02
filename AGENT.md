# Agent Guide

这份文档给编码助手使用，用来快速理解这个项目怎么改、怎么跑、怎么验证。

## 解决什么问题

这个仓库是 0xSnickers 的个人网站和技术日志。站点用 Next.js App Router 构建，`/docs` 区域由 Fumadocs + MDX 驱动，主要存放 daily、frontend、backend、solidity 等笔记。

你在这个项目里通常会处理三类任务：

- 修改页面、组件和样式。
- 新增或整理 MDX 文章。
- 维护文章统计、发布日期、点赞等交互功能。

## 怎么使用

常用命令：

```bash
npm install
npm run dev
npm run build
```

项目结构：

```text
src/app/                  Next.js App Router
src/components/           UI 和 MDX 组件
src/components/docs/      文档页相关组件
src/lib/                  数据源和客户端工具
content/docs/             Fumadocs MDX 内容
public/images/docs/       文档图片
```

沟通风格：

- 先给答案，再补必要背景。
- 直接、具体、有信息量，去掉客套和填充句。
- 简单问题用短回答，复杂任务用清晰步骤。
- 解释概念控制在 3-5 句，覆盖核心即可。
- 比较方案时给推荐和关键理由，控制在 3-4 个要点。
- 结尾给具体建议或已完成结果，保持自然收束。

表达约束：

- 用正向陈述表达判断，直接说明推荐做法。
- 需要区分两种情况时，用并列正向描述。
- 代码回答给代码和必要用法示例。
- 列表只用于天然并列或顺序内容。
- 同一个观点表达一次即可。

新增文章时：

- 放到对应的 `content/docs/<category>/` 目录。
- frontmatter 至少包含 `title`、`description`、`publishedAt`。
- `publishedAt` 使用 `YYYY-MM-DD`。
- 需要控制侧边栏顺序时，更新同目录的 `meta.json`。
- 文章图片放在 `public/images/docs/` 下，再用 `/images/docs/...` 引用。

文章统计：

- 页面统计组件是 `src/components/docs/ArticleStats.tsx`。
- API 路由是 `src/app/api/article-stats/route.ts`。
- Supabase 表是 `article_stats`，包含 `views`、`likes`、`published_at`。
- 阅读数按访问 IP 哈希去重，依赖 `ARTICLE_STATS_IP_SALT`。

## 注意什么

- 修改后优先跑 `npm run build`。
- `.env`、API key、数据库密钥保存在本地环境或平台 Secrets。
- `NEXT_PUBLIC_` 环境变量会暴露给浏览器，只放公开 key。
- 修改 MDX 代码块语言时，使用 Shiki 支持的语言；缺少把握时用 `text`。
- Mermaid 图使用 `src/components/Mermaid.tsx`。
- Tailwind 使用 v4，公共样式集中在 `src/app/globals.css`。
- 部署使用 GitHub Actions 生成 standalone artifact，生产环境由 PM2 运行 standalone 输出。
- 修改 `.github/workflows/deploy.yml` 前先阅读 README 的部署说明，`.next/static` 必须复制到 `release/.next/static/`。
