# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:4321)
npm run build        # Build for production
npm run preview      # Preview production build

# Type checking
npx tsc --noEmit
```

## Architecture

This is an Astro site with server-side rendering (Netlify adapter) that implements a protected content system.

### Tech Stack
- **Frontend**: Astro 5, Tailwind CSS 4, TypeScript
- **CMS**: Sanity (headless CMS for blog posts)
- **Auth/DB**: Supabase (magic link auth, user profiles, access permissions)
- **Email**: Resend API
- **Hosting**: Netlify

### Core Directories

- `src/lib/` - Supabase client utilities and email functions
- `src/pages/api/` - API routes for auth, admin, and content access
- `src/components/` - Reusable Astro components including `ProtectedContent.astro`
- `supabase/setup.sql` - Database schema with RLS policies

### Authentication Flow
1. Users sign in via magic link (`/auth/signin` → `/api/auth/signin`)
2. Email verification redirects to `/auth/confirm` which exchanges the code
3. Session is stored in Supabase auth cookies

### Protected Content System
- Posts in Sanity can have `accessLevel: "protected"`
- Protected posts show teaser content until access is granted
- Access controlled via `article_access` table (per-article) or `profiles.has_full_access` (global)
- Users can request access; admins approve via `/admin` dashboard

### Key Patterns
- All dynamic pages use `export const prerender = false;`
- API routes return JSON; auth errors redirect with 302
- Admin operations use `createSupabaseAdminClient()` (bypasses RLS)
- User operations use `createSupabaseServerClient()` (respects RLS)
- Admin status determined by `ADMIN_EMAILS` env var

## Environment Variables

Required in `.env` (see `.env.example`):
- `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` - Supabase client config
- `SUPABASE_SERVICE_ROLE_KEY` - Admin operations (bypasses RLS)
- `SANITY_API_TOKEN` - Authenticated Sanity API access
- `ADMIN_EMAILS` - Comma-separated list of admin email addresses
- `RESEND_API_KEY`, `FROM_EMAIL` - Email notifications
