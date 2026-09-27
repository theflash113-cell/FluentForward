// Private lesson booking for current students (/students).
//
// No accounts: Kyle gives each student a personal code. Set these in
// Netlify > Site configuration > Environment variables:
//   STUDENT_CODES          the codes, separated by commas, e.g. EMRE-7K2P, ANMOL-4F9X
//                          (letters, numbers and dashes; `npm run student-code Emre` makes one)
//   STUDENT_CALENDAR_LINK  the Google Calendar booking page link for lessons
// After changing either one, redeploy (Deploys > Trigger deploy) so it takes
// effect. A valid code is remembered on the student's device; delete a code
// from STUDENT_CODES to remove that student's access.

const COOKIE = 'ff_student';
// Browsers cap cookies at 400 days, so the cookie is renewed on every visit
// and a student who keeps coming back stays signed in indefinitely.
const MAX_AGE = 400 * 24 * 60 * 60;
const PLACEHOLDER = '__STUDENT_CALENDAR_URL__';

const env = (name) => globalThis.Netlify?.env.get(name) ?? '';
const normalise = (code) => String(code || '').trim().toUpperCase();
const validCodes = () => new Set(env('STUDENT_CODES').split(/[\s,;]+/).map(normalise).filter(Boolean));

const calendarLink = () => {
  const link = env('STUDENT_CALENDAR_LINK').trim();
  if (!link.startsWith('https://')) return '';
  return link.includes('gv=true') ? link : `${link}${link.includes('?') ? '&' : '?'}gv=true`;
};

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const cookie = (value, maxAge) =>
  `${COOKIE}=${value}; Path=/students; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;

const redirect = (to, setCookie) => {
  const headers = new Headers({ Location: to, 'Cache-Control': 'no-store' });
  if (setCookie) headers.append('Set-Cookie', setCookie);
  return new Response(null, { status: 303, headers });
};

export default async (request, context) => {
  const url = new URL(request.url);

  if (request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const code = normalise(form?.get('code'));
    if (code && validCodes().has(code)) return redirect('/students/', cookie(code, MAX_AGE));
    return redirect('/students/?error');
  }

  if (url.searchParams.has('signout')) return redirect('/students/', cookie('', 0));

  const saved = normalise(context.cookies.get(COOKIE));
  const allowed = saved !== '' && validCodes().has(saved);

  const response = await context.next();
  if (!(response.headers.get('content-type') || '').includes('text/html')) return response;

  const link = allowed ? calendarLink() : '';
  let html = await response.text();
  html = html.replace(PLACEHOLDER, link ? escapeAttr(link) : 'about:blank');
  if (allowed && link) html = html.replace('data-access="locked"', 'data-access="open"');
  if (url.searchParams.has('error')) html = html.replace('data-code-error="0"', 'data-code-error="1"');

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('etag');
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Robots-Tag', 'noindex');
  // A removed code: forget it so the student sees the code box again.
  if (saved && !allowed) headers.append('Set-Cookie', cookie('', 0));
  // Renew the cookie so access never runs out while the code is valid.
  if (allowed) headers.append('Set-Cookie', cookie(saved, MAX_AGE));
  return new Response(html, { status: response.status, headers });
};

export const config = { path: ['/students', '/students/*'] };
