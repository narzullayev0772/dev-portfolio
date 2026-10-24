# Alisher Narzullayev — portfolio

Mobile & Fullstack Engineer. Live: https://peaceful-gingersnap-b58c00.netlify.app

Based on the open-source [dillionverma/portfolio](https://github.com/dillionverma/portfolio) template (Next.js, shadcn/ui, Magic UI) — MIT, see [LICENSE](./LICENSE).

## Editing
- Profile, work, projects and their **features → technologies**: [`src/data/resume.tsx`](./src/data/resume.tsx)
- App icons and store screenshots: `public/apps/<slug>.png`, `public/apps/<slug>/{1,2,3}.jpg`
- Engineering notes (blog): `content/<slug>.mdx` with `title`, `publishedAt`, `summary` frontmatter

## Run
```bash
pnpm install
pnpm dev
```

Deployed on Netlify (`netlify.toml`); every push to `main` redeploys.
