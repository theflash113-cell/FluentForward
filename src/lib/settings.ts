import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

type Service = { id: string; type: string; name: string; short: string; description: string; icon: string; booking?: boolean };
type Review = { name: string; source: string; stars?: number; date?: string; quote: string; photo?: string };

const raw = parse(fs.readFileSync(path.resolve('src/content/settings.yaml'), 'utf8'));

const p = raw.prices;
const money = (n: number) => `${p.currency_symbol}${Number.isInteger(n) ? n : n.toFixed(2)}`;

type LessonTypeRaw = {
  id: string; name: string; description: string; single: number; pack_5: number; pack_10: number;
  features: { single: string[]; pack_5: string[]; pack_10: string[] };
};

export const services: Service[] = raw.services;

const lessonType = (t: LessonTypeRaw) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  single: t.single,
  singleLabel: money(t.single),
  features: t.features,
  services: services.filter((s) => s.type === t.id),
  packs: [
    { count: 5, price: t.pack_5, months: p.pack_5_valid_months },
    { count: 10, price: t.pack_10, months: p.pack_10_valid_months },
  ].map((pk) => ({
    ...pk,
    label: money(pk.price),
    perLesson: money(Math.round((pk.price / pk.count) * 100) / 100),
    saves: money(t.single * pk.count - pk.price),
  })),
});

const types = (p.lesson_types as LessonTypeRaw[]).map(lessonType);
const cheapest = types.reduce((a, b) => (b.single < a.single ? b : a));

export const prices = {
  ...p,
  money,
  types,
  // The lowest single-lesson price, for "from $X" labels.
  fromLabel: cheapest.singleLabel,
  // Pack lengths and validity are the same for every lesson type.
  packs: cheapest.packs,
  typeOf: (id: string) => types.find((t) => t.id === id),
};

const c = raw.contact;
export const contact = {
  ...c,
  whatsappUrl: (text?: string) =>
    `https://wa.me/${c.whatsapp_number}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  emailUrl: `mailto:${c.email}`,
  instagramUrl: `https://www.instagram.com/${c.instagram_handle}/`,
  instagramDmUrl: `https://ig.me/m/${c.instagram_handle}`,
  youtubeUrl: `https://www.youtube.com/watch?v=${c.youtube_intro_video_id}`,
};

export const booking = raw.booking as {
  google_calendar_link: string;
  level_test_link: string;
  cancellation_notice_hours: number;
  late_arrival_minutes: number;
  teacher_timezone: string;
};

export const analyticsToken: string = raw.analytics?.cloudflare_token || '';
export const highlights = raw.highlights as { preply_rating: string; years_teaching: string };
export const bookingServices = services.filter((s) => s.booking !== false);
export const reviews: Review[] = raw.reviews || [];

export const levels = [
  { id: 'A1', name: 'Beginner' },
  { id: 'A2', name: 'Elementary' },
  { id: 'B1', name: 'Intermediate' },
  { id: 'B2', name: 'Upper-intermediate' },
  { id: 'C1', name: 'Advanced' },
  { id: 'C2', name: 'Proficient' },
];
