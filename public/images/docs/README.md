# Article Images

Put images used by docs/articles in this directory.

Recommended structure:

```text
public/images/docs/
  daily/
    article-slug/
      cover.png
      step-1.png
  frontend/
    nextjs/
      data-cache/
        diagram.png
```

Use them in MDX with absolute public paths:

```mdx
![Image alt](/images/docs/daily/article-slug/cover.png)
```

Keep `public/images/` for global site assets, and use this folder for article-specific images.
