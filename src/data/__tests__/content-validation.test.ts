import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import Ajv from "ajv";

const contentDir = resolve(__dirname, "../../../content/comics");
const schema = JSON.parse(
  readFileSync(resolve(__dirname, "../../../content/comic.schema.json"), "utf-8")
);

const ajv = new Ajv();
const validate = ajv.compile(schema);

const comicDirs = readdirSync(contentDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

describe("content validation", () => {
  it.each(comicDirs)("%s/comic.json is valid against schema", (slug) => {
    const filePath = join(contentDir, slug, "comic.json");
    const content = JSON.parse(readFileSync(filePath, "utf-8"));

    // Remove $schema field before validation (not in the schema itself)
    const { $schema: _, ...data } = content;

    const valid = validate(data);
    if (!valid) {
      expect.fail(
        `${slug}/comic.json: ${validate.errors?.map((e) => `${e.instancePath} ${e.message}`).join(", ")}`
      );
    }
  });

  it.each(comicDirs)("%s/comic.json has valid ISO date", (slug) => {
    const filePath = join(contentDir, slug, "comic.json");
    const content = JSON.parse(readFileSync(filePath, "utf-8"));
    const date = new Date(content.date);
    expect(date.toString()).not.toBe("Invalid Date");
  });

  it.each(comicDirs)("%s has page files referenced in comic.json", (slug) => {
    const filePath = join(contentDir, slug, "comic.json");
    const content = JSON.parse(readFileSync(filePath, "utf-8"));
    const comicDir = join(contentDir, slug);

    for (const page of content.pages) {
      const pagePath = join(comicDir, page);
      expect(
        () => readFileSync(pagePath),
        `Missing file: ${page}`
      ).not.toThrow();
    }
  });
});