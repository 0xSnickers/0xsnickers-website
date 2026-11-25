import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/github/notes.ts', import.meta.url), 'utf8')
  .replace("from 'yaml'", `from '${import.meta.resolve('yaml')}'`);
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { documentFolders, listDocumentFolders } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
);

const directory = (name) => ({ type: 'tree', path: `content/docs/${name}` });

function mockRepository(t, { main, draft, truncated = false }) {
  const previous = process.env.PROJECT_GITHUB_TOKEN;
  process.env.PROJECT_GITHUB_TOKEN = 'test-only-token';
  t.after(() => {
    if (previous === undefined) delete process.env.PROJECT_GITHUB_TOKEN;
    else process.env.PROJECT_GITHUB_TOKEN = previous;
  });
  const requested = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(options.cache, 'no-store');
    requested.push(new URL(url).pathname);
    if (url.endsWith('/git/ref/heads/notes-draft')) {
      return draft ? Response.json({ object: { sha: 'draft-commit' } }) : new Response(null, { status: 404 });
    }
    if (url.endsWith('/git/trees/main?recursive=1')) return Response.json({ tree: main, truncated });
    if (url.endsWith('/git/trees/draft-commit?recursive=1')) return Response.json({ tree: draft });
    throw new Error(`Unexpected GitHub request: ${url}`);
  });
  return requested;
}

test('includes nested category directories and excludes files and unrelated folders', () => {
  assert.deepEqual(documentFolders([
    directory('backend/db'), directory('backend'), directory('backend/db'),
    { type: 'tree', path: 'content/docs' },
    { type: 'tree', path: 'public/images/docs' },
    { type: 'blob', path: 'content/docs/backend/db/meta.json' },
  ]), ['backend', 'backend/db']);
});

test('a stale draft cannot hide main-only categories; draft-only empty categories are included', async (t) => {
  const requested = mockRepository(t, {
    main: [directory('backend'), directory('backend/db')],
    draft: [directory('backend'), directory('backend/future-category'),
      { type: 'blob', path: 'content/docs/backend/future-category/meta.json' }],
  });
  assert.deepEqual(await listDocumentFolders(), ['backend', 'backend/db', 'backend/future-category']);
  assert.equal(requested.length, 3, 'category lookup must not download every article');
});

test('lists categories from main when no draft branch exists', async (t) => {
  const requested = mockRepository(t, { main: [directory('backend/db')] });
  assert.deepEqual(await listDocumentFolders(), ['backend/db']);
  assert.equal(requested.length, 2);
});

test('rejects incomplete trees instead of silently showing a partial category list', async (t) => {
  mockRepository(t, { main: [directory('backend')], truncated: true });
  await assert.rejects(listDocumentFolders(), /仓库文件太多/);
});
