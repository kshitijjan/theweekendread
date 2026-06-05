# 📚 The Weekend Read
> **A dead-simple, distraction-free link-saver that cures digital hoarding and restores the joy of reading.**

[![Built with Astro](https://img.shields.io/badge/built%20with-Astro%20v6-f75e23?style=flat-cap&logo=astro)](https://astro.build)
[![Styled with Tailwind](https://img.shields.io/badge/styled%20with-Tailwind%20v4-38bdf8?style=flat-cap&logo=tailwind-css)](https://tailwindcss.com)
[![Database MongoDB](https://img.shields.io/badge/database-MongoDB-47a248?style=flat-cap&logo=mongodb)](https://mongodb.com)
[![Auth Clerk](https://img.shields.io/badge/auth-Clerk-6c47ff?style=flat-cap&logo=clerk)](https://clerk.com)
[![Love Open Source](https://img.shields.io/badge/made%20with-❤️%20%26%20intent-ff69b4?style=flat-cap)]()

---

## 🍃 The Philosophy: Less Hoarding, More Reading

In our hyper-connected world, we are constantly bombarded with fascinating essays, deep-dives, and tutorials. With built-in tools like browser reading lists, saving a link takes a split second. 

**But saving is not reading.** Without constraints, our reading lists turn into digital graveyards, generating choice paralysis and cognitive guilt. Every time we open our list, we are overwhelmed by dozens of options, and we end up closing the tab.

**The Weekend Read** is designed around a single, wholesome constraint:
```
  [ Encounter Link ] ────► [ Drop in Queue ] ────► [ Hidden During Week (No noise) ]
                                                                  │
                                                        (Automated Friday CRON)
                                                                  ▼
                                                     [ Curated Digest of 3 Links ]
                                                                  │
                                                        (Read & Appreciate)
                                                                  ▼
                                                         [ Permanent Archive ]
```

Every Friday, our engine selects **exactly three randomly chosen links** from your collection and emails them in a clean, beautifully formatted newsletter. The rest of your queue stays out of sight, letting you appreciate the stories you saved, one weekend at a time. ☕✨

---

## ✨ Features

- 🎯 **Monolithic Minimalism:** A gorgeous, Vercel-inspired dark/light interface built for focus.
- 🔒 **Zero-Hoard Queue:** Unread links are kept out of sight during the week to eliminate decision fatigue.
- 📬 **Mindful Digests:** Receive exactly 3 random reads in your inbox every Friday via [Resend](https://resend.com).
- 🗃️ **Permanent Archive:** Emailed links are stored in your archive, ready for you to revisit anytime.
- ⚡ **Ultra-Responsive:** Optimized from the ground up for mobile, tablets, and 4K displays. No clunky hamburger menus; just sleek animated layouts and a dynamic viewport.

---

## 🛠️ Tech Stack

- **Framework:** [Astro (SSR mode)](https://astro.build)
- **UI/Styling:** [Tailwind CSS v4](https://tailwindcss.com) & Vanilla CSS variables
- **Database:** [MongoDB](https://www.mongodb.com/) via Mongoose
- **Authentication:** [Clerk for Astro](https://clerk.com/)
- **Email Dispatch:** [Resend](https://resend.com)
- **Icons:** `@lucide/astro`

---

## 🚀 Getting Started

### 1. Install Dependencies

Clone this repository and install the project dependencies:
```bash
npm install
```

### 2. Configure Environment Variables

Copy the environment template file:
```bash
cp .env.example .env
```

Open `.env` and fill in your secure integration keys:
- `MONGODB_URI`: Connection string (e.g., `mongodb://127.0.0.1:27017/theweekendread`).
- `PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: Retrieve these from your Clerk dashboard.
- `RESEND_API_KEY`: Retrieve this from your Resend dashboard.
- `SENDER_EMAIL`: Address from which digests are sent (e.g., `The Weekend Read <onboarding@resend.dev>`).
- `CRON_SECRET`: A secure random password of your choice to protect the automated digest route.

### 3. Run MongoDB Locally

Ensure your local MongoDB instance is active:
```bash
mongod --dbpath=/path/to/data/db
```

### 4. Run the Dev Server

Launch the Astro development server:
```bash
npm run dev
```
Open `http://localhost:4321` in your browser. 🚀

---

## 📬 Triggering the Weekly Digest (CRON)

The core logic that selects and emails the three random links is exposed at the following secure route:
`GET /api/send-digest?secret=YOUR_CRON_SECRET`

### Testing Locally
You can test dispatching an email to your queue using `curl`:
```bash
curl -X GET "http://localhost:4321/api/send-digest?secret=YOUR_CRON_SECRET"
```
Or by passing it in the authorization headers:
```bash
curl -X GET "http://localhost:4321/api/send-digest" \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Production Setup
For production deployments, schedule a recurring cron task (e.g., using GitHub Actions, Vercel Crons, or Zeabur) to hit the endpoint every Friday morning with the `Authorization` header containing your `CRON_SECRET`.

---

## 📂 Project Structure

- 🎨 [`src/styles/global.css`](file:///Users/kshitijjain/theweekendread/src/styles/global.css): Core styles, design tokens, and transitions in Tailwind v4.
- 📐 [`src/layouts/Layout.astro`](file:///Users/kshitijjain/theweekendread/src/layouts/Layout.astro): Main layout wrapper equipped with Clerk auth, responsive navigation, and animated hamburger drawer.
- 🗄️ [`src/lib/db.ts`](file:///Users/kshitijjain/theweekendread/src/lib/db.ts): MongoDB database connection manager.
- 🧬 [`src/lib/models/`](file:///Users/kshitijjain/theweekendread/src/lib/models): Mongoose schemas for link storage (`Link.ts`) and user cache (`User.ts`).
- 🛡️ [`src/middleware.ts`](file:///Users/kshitijjain/theweekendread/src/middleware.ts): Clerk middleware router managing protected/public routes.
- 🏠 [`src/pages/index.astro`](file:///Users/kshitijjain/theweekendread/src/pages/index.astro): Marketing landing page with fluid Vanta.js fog effects.
- 📊 [`src/pages/dashboard.astro`](file:///Users/kshitijjain/theweekendread/src/pages/dashboard.astro): The user workspace dashboard to manage saved queues.
- ⚙️ [`src/pages/api/send-digest.ts`](file:///Users/kshitijjain/theweekendread/src/pages/api/send-digest.ts): CURATE + EMAIL cron task executor.

---

## 🌱 Wholesome Reminders for the Reader

> [!TIP]
> **A Mindful Reading Ritual:**
> Pour yourself a warm cup of coffee, tea, or cocoa. Set your phone to *Do Not Disturb*. Take a deep breath and sink slowly into the words. Reading is not a race to accumulate information; it is a quiet dialogue between minds. Let yourself enjoy the journey! ☕️🍂
