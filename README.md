# NRC International Team Website

React + Vite + React Router single-page app, deployed to GitHub Pages at https://www.nrc-team.com.

## Stack

- Vite + React 19 + TypeScript
- React Router v6
- Tailwind CSS + Material Tailwind
- Supabase (auth, database, storage via Edge Functions)
- Firebase (legacy file storage)
- Formik + Yup, react-hot-toast, react-markdown

## Local development

```sh
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # writes ./dist + ./dist/404.html (SPA fallback)
pnpm preview      # serves the production build locally
pnpm typecheck    # tsc --noEmit
```

Create a `.env` with the `VITE_*` variables (see CI workflow for the full list).

## Deployment

`main` branch pushes trigger `.github/workflows/pages.yml`:

1. `pnpm install --frozen-lockfile`
2. `pnpm build` (Vite build + copy `index.html` → `404.html` for SPA fallback)
3. Upload `./dist` as the GitHub Pages artifact
4. Deploy

The custom domain `www.nrc-team.com` is enforced via `public/CNAME`.

### Required GitHub repo secrets

- `VITE_BASE_URL`
- `VITE_MEASUREMENT_ID`
- `VITE_PUBLIC_KEY`
- `VITE_SERVICE_ID`
- `VITE_SITE_URL`
- `VITE_SUPABASE_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_TEMPLATE_ID`

## Supabase Edge Function

The gallery scrapes Google Photos shared albums via an Edge Function (browser CORS would otherwise block direct fetches).

```sh
supabase functions deploy google-photos-album --no-verify-jwt
```

Source: `supabase/functions/google-photos-album/index.ts`.

## Routing

All routes are defined in `src/App.tsx`. Page components live under `src/app/`; the directory structure is historical and no longer drives routing — routes are declared explicitly. The `/dashboard/*` subtree uses a layout route with `<Outlet />` (`src/app/dashboard/layout.tsx`).
