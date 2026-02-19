# Daily Reset (Next.js)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment variables to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run dev server:

```bash
npm run dev
```

## Routes

- `/` landing page
- `/reset` 3-minute guided reset
- `/leaderboard` Supabase leaderboard
