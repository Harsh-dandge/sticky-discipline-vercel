# 🧷 Sticky Discipline

Build discipline one sticky note at a time.

## What is it?

A daily task manager with a **"Sticky Discipline"** rule set:

- 🌅 **Planning mode** (before noon) — add, edit, and delete tasks for the day.
- 🌇 **Execution mode** (after noon) — the day's plan is locked; only completing tasks is allowed.
- 📌 Tasks are pre-planned (3 pts), same-day (2 pts), or carried (1 pt).
- 🔄 Unfinished tasks can be carried forward to tomorrow.
- 📊 Dashboard & Reports show completion rate, task distribution, and points.

## Tech stack

- **Next.js 14** (App Router) + React + TypeScript
- **Firebase** — Authentication (email/password, Google) + Firestore
- **Zustand** state management
- **Tailwind CSS** + Recharts
- **PWA** offline support via service worker

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Firebase config
npm run dev
```

Open http://localhost:3000.

## Environment variables

See `.env.example` for the full list of `NEXT_PUBLIC_FIREBASE_*` keys. Never commit `.env.local`.

## Data model

- `users/{uid}` — user profile
- `dailyNotes/{userId}_{date}` — one document per user per day, containing a `tasks` array