import { describe, it, expect } from "vitest";
import { comics, getComic, allTags } from "../content-loader";

describe("comics", () => {
  it("loads all comics from content", () => {
    expect(comics.length).toBeGreaterThan(0);
  });

  it("each comic has required fields", () => {
    for (const comic of comics) {
      expect(comic.slug).toBeTruthy();
      expect(comic.title).toBeTruthy();
      expect(comic.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(comic.pages.length).toBeGreaterThan(0);
      expect(comic.coverImage).toBe(comic.pages[0]);
      expect(comic.tags.length).toBeGreaterThan(0);
    }
  });

  it("pages are resolved URLs", () => {
    for (const comic of comics) {
      for (const page of comic.pages) {
        expect(page).toMatch(/^\/comics\/[\w-]+\/pages\//);
      }
    }
  });

  it("is sorted by date descending", () => {
    for (let i = 1; i < comics.length; i++) {
      expect(comics[i - 1].date >= comics[i].date).toBe(true);
    }
  });
});

describe("getComic", () => {
  it("returns comic by slug", () => {
    const first = comics[0];
    expect(getComic(first.slug)).toEqual(first);
  });

  it("returns undefined for unknown slug", () => {
    expect(getComic("nonexistent-slug")).toBeUndefined();
  });
});

describe("allTags", () => {
  it("has no duplicates", () => {
    const unique = new Set(allTags);
    expect(allTags.length).toBe(unique.size);
  });

  it("is sorted alphabetically", () => {
    const sorted = [...allTags].sort();
    expect(allTags).toEqual(sorted);
  });
});
