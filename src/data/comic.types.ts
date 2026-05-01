export interface Comic {
  slug: string;
  title: string;
  type: "comic" | "art";
  date: string;          // ISO 8601 (YYYY-MM-DD)
  excerpt: string;
  pages: string[];       // resolved URLs: /comics/<slug>/pages/01.jpg
  coverImage: string;    // pages[0]
  tags: string[];
  readingTime: string;
}