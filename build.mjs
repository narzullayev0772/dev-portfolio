// Static site generator: entries/*.md (with frontmatter) -> dist/
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, copyFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { marked } from 'marked';

const ROOT = new URL('.', import.meta.url).pathname;
const OUT = join(ROOT, 'dist');
const config = JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8'));

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Minimal frontmatter: `key: value` lines; tags as "a, b" or "[a, b]".
function parseEntry(file) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${basename(file)}: missing frontmatter (--- title/date/tags/summary ---)`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  if (!meta.title || !meta.date) throw new Error(`${basename(file)}: title and date are required`);
  const tags = (meta.tags || '').replace(/^\[|\]$/g, '').split(',').map((t) => t.trim()).filter(Boolean);
  return {
    slug: basename(file, '.md'),
    title: meta.title,
    date: meta.date,
    summary: meta.summary || '',
    tags,
    draft: meta.draft === 'true',
    html: marked.parse(m[2]),
  };
}

const formatDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const tagList = (tags) => tags.map((t) => `<span class="tag" data-tag="${esc(t)}">${esc(t)}</span>`).join('');

const page = ({ title, body, depth = 0, description = config.bio }) => {
  const up = '../'.repeat(depth);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="stylesheet" href="${up}style.css">
</head>
<body>
<main class="wrap">
${body}
</main>
<footer class="wrap foot">© ${new Date().getFullYear()} ${esc(config.name)}</footer>
</body>
</html>`;
};

const entries = readdirSync(join(ROOT, 'entries'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => parseEntry(join(ROOT, 'entries', f)))
  .filter((e) => !e.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
copyFileSync(join(ROOT, 'src/style.css'), join(OUT, 'style.css'));

// Entry pages
for (const e of entries) {
  const dir = join(OUT, 'entries', e.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page({
    title: `${e.title} — ${config.name}`,
    description: e.summary,
    depth: 2,
    body: `<a class="back" href="../../">← All notes</a>
<article class="entry">
  <header>
    <time datetime="${esc(e.date)}">${formatDate(e.date)}</time>
    <h1>${esc(e.title)}</h1>
    <div class="tags">${tagList(e.tags)}</div>
  </header>
  ${e.html}
</article>`,
  }));
}

// Index
const allTags = [...new Set(entries.flatMap((e) => e.tags))].sort();
const links = Object.entries(config.links || {})
  .map(([label, href]) => `<a href="${esc(href)}" rel="me">${esc(label)}</a>`).join('');

const list = entries.length
  ? entries.map((e) => `<li class="card" data-tags="${esc(e.tags.join(','))}">
  <a href="entries/${esc(e.slug)}/">
    <time datetime="${esc(e.date)}">${formatDate(e.date)}</time>
    <h2>${esc(e.title)}</h2>
    ${e.summary ? `<p>${esc(e.summary)}</p>` : ''}
  </a>
  <div class="tags">${tagList(e.tags)}</div>
</li>`).join('\n')
  : '<li class="empty">First case study coming soon.</li>';

writeFileSync(join(OUT, 'index.html'), page({
  title: `${config.name} — ${config.role}`,
  body: `<header class="hero">
  <h1>${esc(config.name)}</h1>
  <p class="role">${esc(config.role)}</p>
  <p class="bio">${esc(config.bio)}</p>
  <nav class="links">${links}</nav>
</header>
<section>
  <div class="section-head">
    <h2>Engineering notes</h2>
    <span class="count">${entries.length}</span>
  </div>
  ${allTags.length ? `<div class="filter"><button class="tag active" data-filter="">all</button>${allTags.map((t) => `<button class="tag" data-filter="${esc(t)}">${esc(t)}</button>`).join('')}</div>` : ''}
  <ul class="cards">${list}</ul>
</section>
<script>
document.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach((x) => x.classList.toggle('active', x === b));
  const t = b.dataset.filter;
  document.querySelectorAll('.card').forEach((c) => {
    c.hidden = t && !c.dataset.tags.split(',').includes(t);
  });
}));
</script>`,
}));

console.log(`Built ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} -> dist/`);
