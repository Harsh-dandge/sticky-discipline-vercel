# 🧷 Sticky Discipline

<div align="center">

  <img src="https://raw.githubusercontent.com/Harsh-dandge/sticky-discipline-vercel/main/public/icons/icon-192.png" alt="Sticky Discipline Logo" width="90" height="90" style="border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />

  ### *Build discipline, one sticky note at a time.*

  [![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-State%20Management-443e38?style=for-the-badge)](https://github.com/pmndrs/zustand)

  <br />

  [🚀 Live Demo](https://sticky-discipline-vercel.vercel.app) • [📖 Documentation](#-getting-started) • [✨ Key Features](#-core-features) • [🛡️ Security](#-security--firebase-rules) • [🛠️ Architecture](#-system-architecture)

</div>

---

## 💡 The Philosophy Behind Sticky Discipline

Traditional to-do apps fail because they let you add endless tasks throughout the day, creating an illusion of productivity while encouraging procrastination.

**Sticky Discipline introduces psychological friction to boost execution:**

```
       00:00 AM                        12:00 PM (Noon)                   11:59 PM
          │                                  │                               │
          ▼                                  ▼                               ▼
  ┌──────────────────────────────┐   ┌───────────────────────────────────────────┐
  │   🌅 PLANNING MODE           │   │   🌇 EXECUTION MODE                       │
  │   • Add & organize tasks     │   │   • Plan is LOCKED                        │
  │   • Full edit/delete access  │   │   • Add/delete disabled                   │
  │   • Pre-plan for max points  │   │   • Focus 100% on completing tasks        │
  └──────────────────────────────┘   └───────────────────────────────────────────┘
```

1. **Morning Commitment (Before Noon):** You define what success looks like for the day.
2. **Afternoon Execution (After Noon):** The board locks. No more adding new distractions or deleting hard tasks — only checking them off is allowed.
3. **Gamified Points System:** Rewards advance planning over last-minute scrambling.

---

## ✨ Core Features

<table>
  <tr>
    <td width="50%">
      <h3>🌅 Time-Locked Execution Engine</h3>
      <ul>
        <li><b>Planning Mode (Before 12 PM):</b> Full flexibility to add, edit, or remove daily tasks.</li>
        <li><b>Execution Mode (After 12 PM):</b> Locks the daily plan. Prevents afternoon task-dumping.</li>
        <li><b>Dynamic Mode Indicator:</b> Live status badges showing current mode and countdown.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🎯 Gamified Points Scoring</h3>
      <ul>
        <li><b>Pre-planned Tasks:</b> <code>3 points</code> (Created for future days)</li>
        <li><b>Same-day Tasks:</b> <code>2 points</code> (Created before noon)</li>
        <li><b>Carried-forward Tasks:</b> <code>1 point</code> (Unfinished from yesterday)</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔄 Automated Carry-Forward</h3>
      <ul>
        <li>Uncompleted tasks can be rolled over to tomorrow with 1 click or at midnight.</li>
        <li>Idempotency markers prevent accidental task duplication.</li>
        <li>Carried tasks reflect lower point values to encourage finishing on time.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📊 Visual Analytics & Reports</h3>
      <ul>
        <li><b>Live Progress Gauge:</b> Real-time daily completion percentage circle.</li>
        <li><b>Distribution Breakdown:</b> Pre-planned vs Same-day vs Carried tasks.</li>
        <li><b>Discipline Score Tracker:</b> Points earned over 7, 30, and 90-day intervals.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📅 Multi-Day & Recurring Scheduler</h3>
      <ul>
        <li>Plan ahead up to <b>3 months in advance</b>.</li>
        <li>Set up repeating recurring routines over custom date ranges.</li>
        <li>Historical view: Browse past days in read-only audit mode.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>⚡ PWA & Real-Time Sync</h3>
      <ul>
        <li><b>Instant multi-tab sync:</b> Firestore snapshot listeners update changes immediately.</li>
        <li><b>PWA Offline Support:</b> Installable on desktop & mobile with custom service workers.</li>
        <li><b>Responsive Design:</b> Handcrafted sticky-note aesthetic optimized for all screen sizes.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 📸 Application Preview

<div align="center">

| 📝 Daily Sticky Note Board | 📊 Analytics & Discipline Reports |
| :---: | :---: |
| <img src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80" alt="Sticky Note Workspace" width="450" /> | <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" alt="Analytics Dashboard" width="450" /> |
| *Time-locked daily sticky note interface* | *Interactive performance & score tracking* |

</div>

> 💡 *Tip: Replace sample preview images above with your own screenshots in `/public/screenshots/`!*

---

## 🛠️ System Architecture & Tech Stack

```
                                  ┌───────────────────────────┐
                                  │      Next.js 14 App       │
                                  │  (React 18 + TypeScript)  │
                                  └─────────────┬─────────────┘
                                                │
                     ┌──────────────────────────┼──────────────────────────┐
                     ▼                          ▼                          ▼
        ┌─────────────────────────┐ ┌────────────────────────┐ ┌─────────────────────────┐
        │      Zustand Store      │ │      Rules Engine      │ │   Service Worker (PWA)  │
        │    (Client State)       │ │  (Planning/Execution)  │ │     (Offline Cache)     │
        └────────────┬────────────┘ └────────────────────────┘ └─────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────────────────────────────────┐
        │                        Firebase Services                        │
        │   • Firebase Authentication (Email/Password + Google OAuth)     │
        │   • Cloud Firestore (Real-Time Subscriptions + Batch Commits)   │
        └─────────────────────────────────────────────────────────────────┘
```

### Technology Matrix

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) | Server & client rendering, routing, and dynamic API endpoints |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety and custom interfaces |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Sticky-note paper textures, custom typography & responsive grid |
| **State Management** | [Zustand 5](https://github.com/pmndrs/zustand) | Lightweight, predictable client-side state store |
| **Backend & Auth** | [Firebase 12](https://firebase.google.com/) | User authentication (Google/Email) & Firestore NoSQL database |
| **Testing** | [Vitest](https://vitest.dev/) | Unit & business rules verification test suite |

---

## 🚀 Getting Started

Follow these steps to run **Sticky Discipline** locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.17.0` or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- A free [Firebase account](https://console.firebase.google.com/)

### 1. Clone the repository
```bash
git clone https://github.com/Harsh-dandge/sticky-discipline-vercel.git
cd sticky-discipline-vercel
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start building discipline!

---

## 🧪 Running Tests

The project includes an automated test suite verifying core business rules, point calculations, and time-restricted execution:

```bash
# Run all unit and rules tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Highlights
- ✅ **Planning mode** permissions (before 12 PM)
- ✅ **Execution mode** lock enforcement (after 12 PM)
- ✅ **Points engine** accuracy (3 pts / 2 pts / 1 pt)
- ✅ **Carry-forward** idempotency and task cloning
- ✅ **Date range & recurring** validation

---

## 🛡️ Security & Firebase Rules

To safeguard user data, configure your **Firestore Security Rules** in the [Firebase Console](https://console.firebase.google.com/):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profile: only the owner can read/write
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Daily notes: format userId_YYYY-MM-DD
    match /dailyNotes/{noteId} {
      allow read, write: if request.auth != null && noteId.matches('^' + request.auth.uid + '_.*');
    }
  }
}
```

---

## 📁 Project Structure

```
sticky-discipline/
├── 📂 app/                  # Next.js 14 App Router pages & API routes
│   ├── 📂 api/              # Backend endpoints (/api/auth, /api/tasks)
│   ├── 📂 auth/             # Authentication page (Login/Register/Google)
│   ├── 📂 dashboard/        # Analytics & summary view
│   ├── 📂 note/             # Core interactive sticky note board
│   ├── 📂 reports/          # Discipline reports & completion metrics
│   ├── layout.tsx           # Global root layout & font definitions
│   └── page.tsx             # Landing / welcome redirect
├── 📂 components/           # Reusable UI components
│   ├── AuthProvider.tsx     # Firebase Auth context wrapper
│   ├── Header.tsx           # Navigation bar with user profile & badges
│   ├── StickyNote.tsx       # Handcrafted sticky note board component
│   ├── TaskItem.tsx         # Memoized individual task item
│   └── RecurringTaskForm.tsx# Modal for scheduling recurring tasks
├── 📂 firebase/             # Firebase SDK configuration & initialization
├── 📂 hooks/                # Custom React hooks (useTaskOperations, etc.)
├── 📂 lib/                  # Pure utility & rules engine (rulesEngine.ts)
├── 📂 public/               # Static assets, icons, manifest & PWA service worker
├── 📂 services/             # Firestore & Auth service abstractions
├── 📂 store/                # Zustand global state (useTaskStore.ts)
├── 📂 types/                # TypeScript interfaces (task.ts)
├── 📂 __tests__/            # Vitest unit test suites
├── .env.example             # Template environment variables
├── DEPLOY.md                # Vercel deployment walkthrough
└── README.md                # Project documentation
```

---

## 🌐 Deploying to Vercel

Deploy your own instance of Sticky Discipline with [Vercel](https://vercel.com):

1. Push your code to GitHub.
2. Import the repository into your **Vercel Dashboard**.
3. In **Project Settings → Environment Variables**, add all keys from your `.env.local` (`NEXT_PUBLIC_FIREBASE_*`).
4. Click **Deploy**.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Harsh-dandge">Harsh Dandge</a></sub>
</div>
