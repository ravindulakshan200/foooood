# Sorriso Food

A premium Next.js 14 restaurant and online ordering app for **Sorriso**, Battaramulla.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Supabase (PostgreSQL + Storage)
- **Payments**: PayHere Sri Lanka
- **Languages**: English & Sinhala (සිංහල)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase URL, anon key, and PayHere credentials.

### 3. Database migrations

In the Supabase SQL Editor, run these files **in order**:

1. `supabase/migrations/20240101_init_schema.sql`
2. `supabase/migrations/20240102_add_sizes_and_new_items.sql`
3. `supabase/migrations/20240103_remove_demo_items.sql`
4. `supabase/migrations/20240603_enhancements.sql` — newsletter, order tracking, image storage

### 4. Admin user

Create an admin account in Supabase → Authentication → Users, then sign in at `/admin/login`.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### Customer-facing
- Cinematic landing page with animations
- Menu with category filter, search, and size options
- Cart & PayHere checkout
- **Order tracking** at `/track` (by phone number)
- Contact form & reservations
- **English / Sinhala** language toggle
- Google Maps (Battaramulla location)
- WhatsApp ordering link

### Admin panel (`/admin`)
- Dashboard with stats
- Orders — payment status, **fulfillment status**, WhatsApp notify
- Bookings — confirm / cancel
- Menu — add items, toggle availability, **upload images**
- **Contact messages** — read & mark as read

### Integrations
- Supabase for menu, orders, bookings, contact, newsletter
- PayHere sandbox/production payments
- Supabase Storage bucket `menu-images` for dish photos

## Deploy (Vercel)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com/)
3. Add all `.env.local` variables to Vercel Environment Variables
4. Deploy

Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://sorrisofood.lk`).

## Platform links

Override delivery platform URLs in `.env.local`:

- `NEXT_PUBLIC_FACEBOOK_URL`
- `NEXT_PUBLIC_PICKME_URL`
- `NEXT_PUBLIC_UBER_EATS_URL`
