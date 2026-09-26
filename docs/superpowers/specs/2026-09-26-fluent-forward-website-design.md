# Fluent Forward website: design spec

- **Date:** 2026-09-26
- **Owner:** Kyle
- **Status:** approved in chat. This written spec is waiting for Kyle's review.
- **Source of truth for visuals:** Figma design system file `5OFFQnU7QouSuIwG5yWiwH`, Website page.

## 1. Goal
A live website for Kyle's English teaching business, Fluent Forward (@learnenglishwithkyle), with two jobs:
1. **Scheduling:** students book a free 15-minute intro call.
2. **Portfolio:** the site shows who Kyle is and why to learn with him.

Success means a visitor on a phone can go from the homepage to a booked intro call in under two minutes, and Kyle can change prices and contact details himself without code.

## 2. Stack and hosting

| Area | Decision |
|---|---|
| Framework | **Astro** static site. Plain CSS using the design-system tokens, plus a small amount of vanilla JS for the booking steps. |
| Repository | https://github.com/theflash113-cell/FluentForward (branch `main`) |
| Hosting | **Netlify**, connected to GitHub, on a free `*.netlify.app` address at launch. A custom domain comes later. Build command: `npm run build`. Publish directory: `dist`. |
| Forms | **Netlify Forms** (free tier: 100 submissions/month). Notification emails go to kyledglutz@gmail.com. Spam protection is a honeypot field, with no captcha. |
| Analytics | **Cloudflare Web Analytics**: cookieless, so no consent banner is needed. The token lives in `settings.yaml`. When the token is empty, no analytics script is loaded. |
| Video | Embedded from youtube-nocookie.com, and loads only after the visitor clicks. |

## 3. Editable content: `src/content/settings.yaml`
Every value Kyle is likely to change lives in this one file, and every entry has a comment explaining it in plain English. Every page reads from it; nothing is hard-coded.

- **Prices:**
  - Currency: USD
  - Single lesson: 13 (50 min)
  - 5-lesson pack: 60, valid 3 months
  - 10-lesson pack: 110, valid 6 months
  - Pack refunds: none
- **Contact:**
  - WhatsApp: `15165800740`, displayed as +1 (516) 580-0740
  - Email: kyledglutz@gmail.com
  - Instagram: learnenglishwithkyle
  - YouTube intro: `QG3bJ-1hy8Q`
  - Preply profile URL
- **Google Calendar booking link:** empty at launch. While empty, step 4 falls back to WhatsApp.
- **Cloudflare analytics token:** empty until Kyle adds it.
- **Services:** 8 in total, each with a name, a one-line description and an icon.
  - The six booking focuses: Business English, Travel English, English Literature, Beginner English, Accent Reduction, Pronunciation Coaching.
  - Two more on the homepage: Conversation and Exam prep. These can also be chosen as booking focuses.
- **Reviews:** a list. The first entry is Anmoldeep (Preply, 5★, 2026-08-18), with the quote exactly as Kyle gave it except "kyle" is capitalized to "Kyle".
- **Cancellation notice:** 12 hours.
- **Level test link:** https://preply.com/en/language-tests/english

**Blog posts** are Markdown files in `src/content/blog/`. **Free resources** are Markdown entries in `src/content/resources/`, with the PDFs in `public/resources/`. When either collection is empty, its page shows "Coming soon" with an email sign-up. Adding one file makes that page show a list instead.

## 4. Pages

| Route | Content |
|---|---|
| `/` | Hero, intro video, services (8), how it works (3 steps), "lessons built around your interests", about teaser, group classes teaser, review(s) + "More reviews on Preply", pricing (3 cards), start-booking box (steps 1–2, which carries the selections on to `/book`), final call to action |
| `/about` | Kyle's story: New York native, USF Finance, 2+ years on Preply, daily classes in Istanbul, TEFL Level 3. Headshot, teaching approach, call to action. |
| `/pricing` | Pricing cards, what's included, FAQ (payment after the intro call, 12h rescheduling, pack validity), then the booking section (anchor `#book`). `/book` redirects here. |
| `/booking-confirmed` | Thank-you page: what happens next, how to reschedule, WhatsApp link |
| `/group-classes` | Istanbul group classes: Kyle's class photos (Kyle confirmed he has students' permission), details say "contact for details", "Join on WhatsApp" button with a prefilled message |
| `/blog`, `/blog/[slug]` | "Coming soon" + sign-up at launch; post template ready |
| `/resources` | "Coming soon" + sign-up at launch; resource card template ready |
| `/contact` | WhatsApp, email, Instagram DM, response-time note |
| `/policies` | Cancellation (12h), late arrival (15 min), payment after the intro call, pack validity and no refunds, a plain-language privacy notice (flagged for Kyle to review; not legal advice). Terms: to be added later. |
| `/404` | "This page took a wrong turn" page |

**On every page:**
- Nav: About · Pricing · Group classes · Blog · Contact, plus a "Book a free intro call" button, and a menu for mobile.
- Footer: all links, contact details, and cancellation/privacy links.
- A floating WhatsApp button.
- A share image (1200×630) and a favicon.
- A unique `<title>` and meta description on each page.
- A sitemap and robots.txt.

## 5. Booking flow
1. **Focus:** choose one of 8 cards with icons (radio group).
2. **Level:** choose one of six tiles, A1 to C2, each with a bar meter (radio group). Includes the link "Not sure? Take Preply's free English level test" (opens in a new tab).
3. **Situation:** a text area with a 200-character limit and a live counter, plus name (required), email (required) and time zone (detected automatically, can be edited).
4. **Submit** posts to the Netlify form `booking`, which emails Kyle.
   - With JS, the answers are sent in the background and the page then shows step 4, "Pick a time".
     - The Google Calendar booking page is embedded as an iframe, with an "open in a new tab" link as backup.
     - If no booking link is configured, a "Message me on WhatsApp to pick a time" button appears instead, prefilled with the student's focus and level.
   - Without JS, the form submits normally and the student lands on `/booking-confirmed`.

The home start-booking box passes the focus and level to the booking page through the URL: `/pricing?focus=business&level=B1#book`.

**Validation:**
- Checks happen in the browser as well as through the form's required fields.
- Error messages are clear and appear inline.
- If a submission fails, the student sees a message with a WhatsApp fallback.

The email sign-up (`newsletter` form) collects only an email address and posts to Netlify Forms.

## 6. Visual system
- **Tokens from Figma:**
  - Colors: electric blue #2F4BFF, orange #FF6B2C, navy #0F1433.
  - Semantic names: bg/*, text/*, border/* become CSS custom properties `--ff-*`.
  - Spacing and radius scales carry over too.
- **Type:** Poppins ExtraBold/Bold for headings, Inter for body text, self-hosted (woff2) for speed and privacy.
- **Look:** rounded corners and the forward-chevron motif.
- **Breakpoints:** up to 640 px is mobile, 641–1024 px is tablet, above 1024 px is desktop. The content column is at most 1200 px wide.
- **Scope:** light mode only at launch.
- **Images:** exported from Figma, optimized with Astro's image tools (WebP/AVIF, responsive sizes), and every image has alt text.

## 7. Quality bar and checks
- Lighthouse scores of 90 or higher on mobile for Performance, Accessibility, Best Practices and SEO.
- WCAG AA contrast. Everything works with a keyboard, with visible focus states. The radio groups work with screen readers.
- Before handover:
  - Screenshots at 390, 768 and 1440 px.
  - Link check across every page.
  - Booking form tests: required fields, the 200-character limit, the handoff from home to the booking page, and the fallback when no booking link is set.
  - A price-change test: edit `settings.yaml`, rebuild, and check the new price appears everywhere.

## 8. Launch steps (Kyle)
1. In Netlify, choose **Add new site**, then **Import from GitHub**, and pick `FluentForward`. The build settings are picked up from `netlify.toml`.
2. Rename the site under Site configuration > Change site name, for example `fluentforward`.
3. Under Forms, enable form detection, then add email notifications to kyledglutz@gmail.com for `booking` and `newsletter`.
4. In Cloudflare, go to Web Analytics, choose **Add a site**, and enter the netlify.app address. Under **Manage site**, copy the token and paste it into `settings.yaml`.

## 9. Out of scope for launch, with a hook for each
| Item | How it will be added |
|---|---|
| Custom domain | Netlify domain settings |
| Google Calendar booking link | One line in settings |
| Full Terms | A new section on the Policies page |
| Dark mode | Not planned yet |
| Blog posts and resource PDFs | Added as files |
| On-site payments | Payment is after the intro call |
| Turkish version | Not planned |
