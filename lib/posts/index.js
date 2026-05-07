// ─────────────────────────────────────────────────────────────────────────────
// lib/posts/index.js
//
// HOW TO ADD A NEW POST:
// 1. Copy _TEMPLATE.js → create new file in lib/posts/your-slug.js
// 2. Add one import line below
// 3. Add the imported variable to allPosts array
// Done — everything else updates automatically
// ─────────────────────────────────────────────────────────────────────────────

import { post as post1 } from "./chennai-to-pondicherry";
import { post as post2 } from "./car-rental-chennai-weekends";
import { post as post3 } from "./chennai-to-coimbatore-self-drive-guide";

import { post as post4 } from "./best-places-chennai-coimbatore-summer-monsoon";
import { post as post5 } from "./cheapest-self-drive-car-rental-chennai-bangalore-weekends";
import { post as post6 } from "./ooty-self-drive-guide-bangalore-chennai-2026";
// (uncomment above lines one by one as you write each post)
// ─────────────────────────────────────────────────────────────────────────────

export const allPosts = [
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
];

export function getPostBySlug(slug) {
  return allPosts.find((p) => p.slug === slug) || null;
}

export function getAllSlugs() {
  return allPosts.map((p) => p.slug);
}

export function getRecentPosts(count = 3) {
  return [...allPosts]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, count);
}
