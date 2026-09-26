# Fluent Forward website

This is Kyle's English teaching website. It's built with [Astro](https://astro.build) and hosted on Netlify. Every change saved on GitHub goes live automatically in about a minute.

## Editing the site (no coding needed)

| What you want to do | File to edit |
|---|---|
| Change prices, pack validity or the intro call length | `src/content/settings.yaml` → `prices` |
| Change your WhatsApp number, email, Instagram, YouTube video or Preply link | `src/content/settings.yaml` → `contact` |
| Add your Google Calendar booking link | `src/content/settings.yaml` → `booking: google_calendar_link` |
| Turn on visitor stats (Cloudflare) | `src/content/settings.yaml` → `analytics: cloudflare_token` |
| Edit services or booking choices | `src/content/settings.yaml` → `services` |
| Add a real review | `src/content/settings.yaml` → `reviews` |
| Write a blog post | Copy `src/content/blog/_TEMPLATE.md` |
| Add a free resource (PDF) | Upload the PDF to `public/resources/`, then copy `src/content/resources/_TEMPLATE.md` |

### How to edit a file on GitHub

1. Open the file on github.com.
2. Click the ✏️ pencil icon (**Edit this file**).
3. Change only the text after the colon ( `:` ). Keep the spaces at the start of each line exactly as they are.
4. Click **Commit changes…**, then **Commit changes** again.
5. Wait about a minute and refresh your website.

If something goes wrong, Netlify keeps the last working version online. To see what failed, go to Netlify → your site → **Deploys**, and click the failed one. The most common cause is a missing space or quote in `settings.yaml`.

## Where form answers go

Booking answers and email sign-ups are collected by **Netlify Forms**. To get them by email, go to Netlify → your site → **Forms** → **Form notifications** → **Add notification** → **Email notification**, and set it up for both the `booking` and `newsletter` forms.

## One-time Netlify setup

1. In Netlify, choose **Add new project** (called **Add new site** in some accounts) → **Import an existing project** → **GitHub** → `FluentForward`.
   The build settings are read from `netlify.toml` automatically.
2. Go to **Project configuration** (or **Site configuration**) → **Change name** and pick a name, for example `fluentforward`.
3. Under **Forms**, make sure form detection is on. It's usually on by default. Then add the email notifications described above.

## For developers

```bash
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # production build in dist/
```

- Design tokens come from the Fluent Forward Figma design system and are defined in `src/styles/global.css`.
- Components mirror the Figma components: Button, Tag, Card/Service, Card/Pricing, Card/Review, Video Embed, WhatsApp Button, Focus Option and Level Tile.
- The design spec is in `docs/superpowers/specs/`.
