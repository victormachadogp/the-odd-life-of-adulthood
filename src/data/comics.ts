import catCoffee from "@/assets/comic-cat-coffee.jpg";
import astronaut from "@/assets/comic-astronaut.jpg";
import dragonBakes from "@/assets/comic-dragon-bakes.jpg";
import friendsMusic from "@/assets/comic-friends-music.jpg";

export interface Comic {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  tags: string[];
  readingTime: string;
}

export const comics: Comic[] = [
  {
    slug: "an-honest-break-coffee",
    title: "An Honest Break for Coffee",
    date: "Apr 22, 2026",
    excerpt: "A sleepy cat discovers the bittersweet truth about caffeine.",
    image: catCoffee,
    tags: ["slice-of-life", "cats", "mornings"],
    readingTime: "2 min",
  },
  {
    slug: "a-flower-on-the-moon",
    title: "A Flower on the Moon",
    date: "Apr 18, 2026",
    excerpt: "An astronaut plants something small in a very big place.",
    image: astronaut,
    tags: ["sci-fi", "soft", "wholesome"],
    readingTime: "3 min",
  },
  {
    slug: "dragon-bakes-cookies",
    title: "Dragon Bakes Cookies",
    date: "Apr 11, 2026",
    excerpt: "Turns out fire breath has a learning curve.",
    image: dragonBakes,
    tags: ["fantasy", "comedy", "cooking"],
    readingTime: "2 min",
  },
  {
    slug: "shared-earbuds-at-sunset",
    title: "Shared Earbuds at Sunset",
    date: "Apr 4, 2026",
    excerpt: "Two friends, one song, the whole evening.",
    image: friendsMusic,
    tags: ["slice-of-life", "friendship"],
    readingTime: "2 min",
  },
];

export const allTags = Array.from(new Set(comics.flatMap((c) => c.tags))).sort();

export function getComic(slug: string) {
  return comics.find((c) => c.slug === slug);
}