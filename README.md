# Engineering notes

Case studies from real production work — what I built, why, and what I learned.

## Writing an entry
Add `entries/YYYY-MM-DD-slug.md`:

```markdown
---
title: Cut list rebuilds by 60% with selector-based BLoC
date: 2026-10-24
tags: flutter, bloc, performance
summary: One-line result shown on the index card.
---

## Context
...
```

`draft: true` in frontmatter hides an entry.

## Build
```bash
npm install
npm run build   # -> dist/
```

Deployed on Netlify (`netlify.toml`), every push to `main` redeploys.
