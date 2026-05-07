// ═══════════════════════════════════════════════════════════════════════════════
// HOW TO WRITE A NEW BLOG POST
//
// 1. Copy this file → rename to your-post-slug.js (lowercase, hyphens only)
// 2. Fill every field below — no coding knowledge needed
// 3. In lib/posts/index.js, add:
//      import { post as postN } from "./your-post-slug";
//    and add postN to the allPosts array
// 4. Deploy — post is live with full SEO and schema automatically
// ═══════════════════════════════════════════════════════════════════════════════

export const post = {

  // Must match filename exactly (without .js)
  slug: "your-post-slug",

  // Shown in Google search results — keep under 60 characters
  title: "Your Post Title Here | MM Miles",

  metaTitle: "Your Post Title Here | MM Miles",

  // Shown under title in Google — keep under 160 characters
  metaDescription: "Write your meta description here. Include your main keyword. Keep under 160 characters.",

  mainKeyword: "your main keyword here",

  // Use: "destination-guide" "car-guide" "how-to" "city-guide"
  tags: ["destination-guide", "chennai"],

  publishedAt: "2026-04-01",
  updatedAt: "2026-04-01",

  // Shown on blog listing page — 1-2 sentences
  excerpt: "Write a compelling 1-2 sentence summary for the blog listing page.",

  // Image in /public/blog/ folder — 1200x630px recommended
  coverImage: "/blog/your-image.jpg",
  coverImageAlt: "Describe the image including your keyword",

  // Estimate: 200 words = 1 minute
  readTime: "8 min read",

  author: "MM Miles Team",

  relatedCity: { name: "Chennai", slug: "chennai" },

  // These become clickable car cards inside your post
  relatedCars: [
    { name: "Toyota Fortuner", slug: "toyota-fortuner" },
    { name: "Hyundai Creta", slug: "hyundai-creta" },
  ],

  // These become FAQ rich snippets in Google — write 4-6
  faqs: [
    {
      question: "Write your first FAQ question?",
      answer: "Write the answer. 2-3 sentences. Be specific.",
    },
    {
      question: "Write your second FAQ question?",
      answer: "Write the answer.",
    },
    {
      question: "Write your third FAQ question?",
      answer: "Write the answer.",
    },
    {
      question: "Write your fourth FAQ question?",
      answer: "Write the answer.",
    },
  ],

  // ── CONTENT BLOCKS ──────────────────────────────────────────────────────────
  // Types: intro, h2, h3, paragraph, list, table, tip, warning, cars, cta
  content: [

    // INTRO — include your keyword in first sentence
    {
      type: "intro",
      text: "Write your opening paragraph here. Include keyword in first sentence. Answer the main question immediately. 100-150 words.",
    },

    // KEY FACTS TABLE
    {
      type: "h2",
      text: "Key Facts",
    },
    {
      type: "table",
      headers: ["Detail", "Information"],
      rows: [
        ["Distance", "XXX km"],
        ["Drive Time", "X hours"],
        ["Best Route", "Write route"],
        ["Best Time", "Write months"],
        ["Recommended Car", "SUV / Sedan"],
      ],
    },

    // MAIN SECTIONS
    {
      type: "h2",
      text: "Your First Main Section Heading",
    },
    {
      type: "paragraph",
      text: "Write 150-200 words here. Be specific. Include real names, distances, prices.",
    },

    // TIP BOX
    {
      type: "tip",
      text: "Write a genuinely useful tip here that travellers would appreciate.",
    },

    // RECOMMENDED CARS — links to your /rent/ pages automatically
    {
      type: "h2",
      text: "Best Cars for This Trip",
    },
    {
      type: "cars",
      items: [
        {
          name: "Toyota Fortuner",
          slug: "toyota-fortuner",
          city: "chennai",
          reason: "Write one sentence why this car is great for this trip.",
        },
        {
          name: "Hyundai Creta",
          slug: "hyundai-creta",
          city: "chennai",
          reason: "Write one sentence why this car suits this trip.",
        },
      ],
    },

    // PLACES SECTION
    {
      type: "h2",
      text: "Places to Stop",
    },
    {
      type: "h3",
      text: "1. First Place Name",
    },
    {
      type: "paragraph",
      text: "Write 80-100 words describing this place. Distance from start, opening hours, entry fees, what to do.",
    },
    {
      type: "h3",
      text: "2. Second Place Name",
    },
    {
      type: "paragraph",
      text: "Write 80-100 words.",
    },

    // TIPS LIST
    {
      type: "h2",
      text: "Tips Before You Go",
    },
    {
      type: "list",
      items: [
        "Specific tip 1",
        "Specific tip 2",
        "Specific tip 3",
        "Specific tip 4",
        "Specific tip 5",
      ],
    },

    // ALWAYS END WITH CTA
    {
      type: "cta",
      text: "Ready for your road trip? Book your self drive car rental with zero deposit and unlimited km.",
      buttonText: "Book Self Drive Car →",
      buttonLink: "/cities/chennai",
    },

  ],
};
