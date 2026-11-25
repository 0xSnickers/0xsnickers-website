import { createClient } from '@supabase/supabase-js';
import { mkdtemp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseEnv } from 'node:util';
import { z } from 'zod';

const envPath = resolve('.env.local');
const lockPath = `${envPath}.notes-setup.lock`;
const requestTimeoutMs = 20_000;

function log(message) {
  console.log(message);
}

function fetchWithTimeout(input, init = {}) {
  const timeout = AbortSignal.timeout(requestTimeoutMs);
  const signal = init.signal && typeof AbortSignal.any === 'function'
    ? AbortSignal.any([init.signal, timeout])
    : timeout;
  return fetch(input, { ...init, signal });
}

function askLine(label, hidden = false) {
  log(label);
  const stdin = process.stdin;

  return new Promise((resolve, reject) => {
    let value = '';
    const wasRaw = stdin.isRaw;
    stdin.setEncoding('utf8');
    stdin.resume();
    stdin.setRawMode(true);

    const cleanup = () => {
      stdin.off('data', onData);
      if (stdin.isTTY) stdin.setRawMode(Boolean(wasRaw));
      stdin.pause();
    };

    const onData = (chunk) => {
      for (const char of String(chunk)) {
        if (char === '\u0003') {
          cleanup();
          const error = new Error('已取消初始化。');
          error.name = 'AbortError';
          reject(error);
          return;
        }
        if (char === '\r' || char === '\n') {
          cleanup();
          process.stdout.write('\n');
          resolve(value);
          return;
        }
        if (char === '\u007f' || char === '\b') {
          if (!hidden && value.length > 0) process.stdout.write('\b \b');
          value = value.slice(0, -1);
          continue;
        }
        if (char < ' ' && char !== '\t') continue;
        value += char;
        if (!hidden) process.stdout.write(char);
      }
    };

    stdin.on('data', onData);
  });
}

async function findAuthor(admin) {
  let author;
  const pageSize = 100;
  for (let page = 1; ; page += 1) {
    let result;
    try {
      result = await admin.listUsers({ page, perPage: pageSize });
    } catch (error) {
      throw new Error(error?.name === 'TimeoutError'
        ? '连接 Supabase 超时。请检查网络和项目 URL。'
        : '无法连接 Supabase。请检查网络、项目 URL 和服务端密钥。');
    }
    const { data, error } = result;
    if (error) throw new Error('无法读取 Supabase 用户。请检查项目 URL 和服务端密钥。');
    for (const user of data.users) {
      if (user.app_metadata?.notes_author !== true) continue;
      if (author) throw new Error('这个 Supabase 项目已有多个笔记管理员，请先在 Supabase 中确认要保留的账号。');
      author = user;
    }
    if (data.users.length < pageSize || (data.total > 0 && page * pageSize >= data.total)) return author;
  }
}

async function askCredentials() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('请在交互式终端运行 npm run notes:setup。');
  }

  log('还没有笔记管理员。请输入新账号，密码不会显示。');
  const email = (await askLine('笔记管理员邮箱：')).trim().toLowerCase();
  if (!z.email().safeParse(email).success) throw new Error('请输入有效的邮箱地址。');

  const password = await askLine('密码（输入时不显示）：', true);
  if (!password) throw new Error('请输入密码。');
  const confirmation = await askLine('确认密码：', true);
  if (password !== confirmation) throw new Error('两次输入的密码不一致，未创建账号。');
  return { email, password };
}

async function saveAuthorId(userId) {
  const contents = await readFile(envPath, 'utf8');
  const assignment = `NOTES_AUTHOR_ID=${userId}`;
  const definition = /^[ \t]*(?:export[ \t]+)?NOTES_AUTHOR_ID[ \t]*=[^\r\n]*/gm;
  const updated = definition.test(contents)
    ? contents.replace(definition, assignment)
    : `${contents}${contents.endsWith('\n') ? '' : '\n'}${assignment}\n`;

  const tempDir = await mkdtemp(resolve('.env.local.notes-setup-'));
  try {
    const tempFile = join(tempDir, '.env.local');
    await writeFile(tempFile, updated, { mode: 0o600 });
    await rename(tempFile, envPath);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function missingEnv(url, publishableKey, secret) {
  const missing = [];
  if (!url || url.startsWith('your ')) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!publishableKey || publishableKey.startsWith('your ')) missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  if (!secret || secret.startsWith('your ')) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  return missing;
}

async function setup() {
  log('开始配置笔记管理员…');

  let contents;
  try {
    contents = await readFile(envPath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    throw new Error('请先创建 .env.local，填写 Supabase 项目 URL、Publishable Key 和服务端密钥。');
  }

  const env = parseEnv(contents);
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const missing = missingEnv(url, publishableKey, secret);
  if (missing.length > 0) {
    throw new Error(`请先在 .env.local 填写：${missing.join('、')}。`);
  }

  try {
    await mkdir(lockPath);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    throw new Error('已有初始化命令在运行。若上一次意外中断，可在确认后删除空目录 .env.local.notes-setup.lock。');
  }

  try {
    log('正在连接 Supabase，检查是否已有笔记管理员…');
    const { auth } = createClient(url, secret, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { fetch: fetchWithTimeout },
    });
    let author = await findAuthor(auth.admin);
    const configuredId = parseEnv(await readFile(envPath, 'utf8')).NOTES_AUTHOR_ID?.trim();
    if (configuredId && configuredId !== author?.id) {
      throw new Error('NOTES_AUTHOR_ID 与当前项目的笔记管理员不一致，请检查连接的 Supabase 项目和原账号。');
    }

    if (author) {
      log(`已有笔记管理员${author.email ? `：${author.email}` : ''}。不会修改密码。`);
    } else {
      const credentials = await askCredentials();
      log('正在创建笔记管理员…');
      const { data, error } = await auth.admin.createUser({
        ...credentials,
        email_confirm: true,
        app_metadata: { notes_author: true },
      });
      if (error?.code === 'email_exists' || error?.code === 'user_already_exists') {
        throw new Error('这个邮箱已存在，请使用另一个邮箱初始化。现有账号未更改。');
      }
      if (error || !data.user) {
        throw new Error(`创建账号失败${error?.code ? `（${error.code}）` : ''}，请检查邮箱和 Supabase 密码要求。`);
      }
      author = data.user;
      log(`账号已创建：${author.email}`);
    }

    log('正在写入 NOTES_AUTHOR_ID…');
    await saveAuthorId(author.id);
    log('笔记管理员已配置。请重启开发服务器，然后访问 /admin/login。');
  } finally {
    await rm(lockPath, { recursive: true, force: true });
  }
}

try {
  await setup();
} catch (error) {
  console.error(error.name === 'AbortError' ? '已取消初始化。' : error.message);
  process.exitCode = 1;
}
