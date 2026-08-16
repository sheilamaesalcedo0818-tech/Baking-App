# Baking App

Personal, single-user baking recipe manager with automatic ingredient scaling.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Supabase · deploy on Vercel.

## Features (v1)

- Three categories: pastries, bread, cake
- Recipes: name, base weight, ingredient list (name / quantity / unit)
- Scale by target weight or presets (½, 1×, 1½, 2×, 3×)
- Mobile-friendly UI

## Setup

### 1. Supabase

Create a project, then run [supabase/schema.sql](supabase/schema.sql) in the SQL editor.

### 2. Environment

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Install & run

```bash
npm install
npm run dev
```

### 4. Deploy on Vercel

- Push repo to GitHub
- Import in Vercel
- Add the two `NEXT_PUBLIC_SUPABASE_*` env vars
- Deploy

## Project layout

```
src/
  app/                Next.js routes (home, category, recipe detail, new/edit)
  components/         Client components (form, scaler, delete button)
  lib/
    supabase.ts       Supabase client
    types.ts          Shared types + constants
    scale.ts          Scaling logic (pure functions)
supabase/
  schema.sql          Table definitions
```

## Notes

RLS is enabled with permissive policies since this is a single-user tool using the anon key. If you make the deployment public, replace the policies with proper auth-gated ones.
