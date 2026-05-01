import type { Comic } from "./comic.types";

interface ComicJson {
  title: string;
  type?: "comic" | "art";
  date: string;
  excerpt: string;
  pages: string[];
  tags: string[];
  readingTime?: string;
}

const modules = import.meta.glob<ComicJson>("../../content/comics/*/comic.json", {
  eager: true,
  import: "default",
});

function slugFromPath(path: string): string {
  return path.split("/").at(-2)!;
}

export const comics: Comic[] = Object.entries(modules)
  .map(([path, data]) => {
    const slug = slugFromPath(path);
    const pages = data.pages.map((p) => `/comics/${slug}/${p}`);
    return {
      slug,
      title: data.title,
      type: data.type ?? "comic",
      date: data.date,
      excerpt: data.excerpt,
      pages,
      coverImage: pages[0],
      tags: data.tags,
      readingTime: data.readingTime ?? "",
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export const allTags = Array.from(new Set(comics.flatMap((c) => c.tags))).sort();

export function getComic(slug: string): Comic | undefined {
  return comics.find((c) => c.slug === slug);
}