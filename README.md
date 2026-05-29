# 0xSnickers Website

Personal website and logbook for 0xSnickers.

![GitHub stars](https://img.shields.io/github/stars/0xSnickers/0xsnickers-website?style=social)
![GitHub forks](https://img.shields.io/github/forks/0xSnickers/0xsnickers-website?style=social)
![GitHub license](https://img.shields.io/github/license/0xSnickers/0xsnickers-website)

## Overview

This repository contains the 0xSnickers personal website, project showcase, and MDX-powered logbook.

The public site is built with Next.js App Router. The `/docs` area is powered by Fumadocs and is used as a daily/technical logbook with categories such as daily notes, frontend, backend, and Solidity.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Fumadocs MDX
- Framer Motion
- Lucide React

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build the production app:

```bash
npm run build
```

The production build uses Next.js standalone output.

## Logbook Content

Fumadocs content lives in:

```text
content/docs/
```

Current top-level logbook categories:

```text
content/docs/daily/
content/docs/frontend/
content/docs/backend/
content/docs/solidity/
```

Add a new MDX page under the relevant category and update that category's `meta.json` to control sidebar ordering.

Example:

```text
content/docs/daily/5-29.mdx
content/docs/daily/meta.json
```

## Deployment

Deployment is handled by GitHub Actions.

The server is intentionally kept as a lightweight runtime host. It does not run `npm ci`, `next build`, or `docker build`.

Deployment flow:

```mermaid
sequenceDiagram
  actor Dev as Developer
  participant GH as GitHub
  participant CI as GitHub Actions
  participant Server as Server
  participant App as Node.js Runtime
  participant Proxy as Nginx / Hosting Panel

  Dev->>GH: Push to main
  GH->>CI: Trigger deploy workflow
  CI->>CI: Checkout repository
  CI->>CI: Setup Node.js 20
  CI->>CI: Run npm ci
  CI->>CI: Run npm run build
  CI->>CI: Generate .next/standalone
  CI->>CI: Pack release.tar.gz
  CI->>Server: Upload release.tar.gz by SCP
  CI->>Server: Connect by SSH
  Server->>Server: Extract release.tar.gz to next-release
  Server->>Server: Stop previous node process if app.pid exists
  Server->>Server: Stop legacy Docker Compose service if present
  Server->>Server: Move current release to previous
  Server->>Server: Move next-release to current
  Server->>App: Start node server.js on port 3000
  App-->>Server: Write app.pid and app.log
  Proxy->>App: Proxy public traffic to 127.0.0.1:3000
```

```text
GitHub Actions
  npm ci
  npm run build
  package .next/standalone, .next/static, and public
  upload release.tar.gz to the server

Server
  extract release.tar.gz
  switch the current release directory
  run node server.js
```

Required GitHub repository secrets:

```text
SERVER_HOST
SERVER_USER
SSH_PRIVATE_KEY
SERVER_PORT
PROJECT_PATH
```

The server must have Node.js 20 available to the SSH deployment user:

```bash
node -v
```

The app runs on:

```text
0.0.0.0:3000
```

Nginx or the hosting panel should proxy the public domain to:

```text
127.0.0.1:3000
```

After deployment, the server project directory contains:

```text
release.tar.gz
current/
previous/
app.pid
app.log
```

Useful server commands:

```bash
tail -100 app.log
cat app.pid
kill "$(cat app.pid)"
```

## Notes

Docker-based deployment files have been removed to avoid confusion. Production deployment uses standalone build artifacts instead of Docker images. This avoids running heavy Next.js and Fumadocs builds on low-resource servers.

## License

MIT
