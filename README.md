# The Weekend Read — Minimalist Link-Saver MVP

**The Weekend Read** is a dead-simple link-saver designed to prevent digital hoarding. Users drop links into a distraction-free dashboard throughout the week. Every Friday, a secure CRON task triggers an automated digest containing **exactly three** randomly selected links from their queue, delivered straight to their inbox. All unread links are hidden throughout the week to encourage digital minimalism.

Built with a sleek, monochromatic **Vercel-inspired** aesthetic utilizing modern CSS-first Tailwind CSS v4 styling.

---

## 🚀 Tech Stack

- **Framework**: [Astro (SSR mode)](https://astro.build) running on Node.js
- **UI/Styling**: [Tailwind CSS v4](https://tailwindcss.com) (configured with custom Vercel-style colors, fonts, and shadows)
- **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose (with connection pooling)
- **Authentication**: [Clerk for Astro](https://clerk.com/)
- **Email Delivery**: [Resend](https://resend.com)
- **Icons**: `@lucide/astro`

---

## 🛠️ Getting Started

### 1. Install Dependencies

Clone the repository and install the packages:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of the project (you can copy `.env.example`):

```bash
cp .env.example .env
```

Fill in the required keys:
*   `MONGODB_URI`: Your MongoDB database connection string (e.g., `mongodb://127.0.0.1:27017/theweekendread`).
*   `PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: Get these from your Clerk Dashboard after creating an Astro application.
*   `RESEND_API_KEY`: Get this from your Resend Dashboard.
*   `SENDER_EMAIL`: The email address you want to send newsletters from (e.g. `The Weekend Read <onboarding@resend.dev>`).
*   `CRON_SECRET`: A secure random secret of your choice to protect the weekly digest endpoint.

### 3. Run MongoDB Locally

Make sure MongoDB is running on your machine:

```bash
mongod --dbpath=/path/to/data/db
```

### 4. Run the Dev Server

Launch the development server:

```bash
npm run dev
```

Visit the application at `http://localhost:4321`.

---

## 📬 Triggering the Weekly Digest (CRON)

The core logic thatcurates and emails exactly three links per user is exposed at the API endpoint:
`GET /api/send-digest?secret=YOUR_CRON_SECRET`

### Triggering Locally

You can test the email delivery endpoint using curl:

```bash
curl -X GET "http://localhost:4321/api/send-digest?secret=YOUR_CRON_SECRET"
```

Or by sending an `Authorization` header:

```bash
curl -X GET "http://localhost:4321/api/send-digest" \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Setting up Production Crons

When deploying, set up a recurring cron task (e.g. using GitHub Actions, Vercel Crons, Zeabur, or EasyCron) to run every Friday and request the endpoint with the `Authorization` header or query parameter containing your production `CRON_SECRET`.

---

## 📂 Project Structure

-   [`src/layouts/Layout.astro`](file:///Users/kshitijjain/theweekendread/src/layouts/Layout.astro): Main wrapper layout with Clerk authentication controls, header, and footer.
-   [`src/styles/global.css`](file:///Users/kshitijjain/theweekendread/src/styles/global.css): Global CSS containing the Vercel design system tokens and component classes in Tailwind v4.
-   [`src/lib/db.ts`](file:///Users/kshitijjain/theweekendread/src/lib/db.ts): MongoDB/Mongoose connection manager.
-   [`src/lib/models/`](file:///Users/kshitijjain/theweekendread/src/lib/models): Mongoose schemas (`Link.ts`, `User.ts`).
-   [`src/middleware.ts`](file:///Users/kshitijjain/theweekendread/src/middleware.ts): Clerk middleware for guarding private dashboard routes.
-   [`src/pages/index.astro`](file:///Users/kshitijjain/theweekendread/src/pages/index.astro): Marketing landing page with hero backdrop mesh glow.
-   [`src/pages/dashboard.astro`](file:///Users/kshitijjain/theweekendread/src/pages/dashboard.astro): The main user dashboard for saving and archiving links.
-   [`src/pages/api/send-digest.ts`](file:///Users/kshitijjain/theweekendread/src/pages/api/send-digest.ts): API endpoint for weekly digest curation and Resend email dispatch.
