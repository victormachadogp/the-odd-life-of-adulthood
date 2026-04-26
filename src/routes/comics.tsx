import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ComicCard } from "@/components/ComicCard";
import { Sidebar } from "@/components/Sidebar";
import { comics } from "@/data/comics";

export const Route = createFileRoute("/comics")({
  head: () => ({
    meta: [
      { title: "All Comics — Inkwell" },
      { name: "description", content: "Browse the full archive of Inkwell webcomics." },
      { property: "og:title", content: "All Comics — Inkwell" },
      { property: "og:description", content: "Browse the full archive of Inkwell webcomics." },
    ],
  }),
  component: ComicsPage,
});

function ComicsPage() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return comics.filter((c) => {
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.excerpt.toLowerCase().includes(query.toLowerCase());
      const matchesTag = !tag || c.tags.includes(tag);
      return matchesQuery && matchesTag;
    });
  }, [query, tag]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="brutal-border-b mb-10 pb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">// Catalogue / Index</p>
        <h1 className="mt-2 text-5xl font-extrabold uppercase tracking-tighter md:text-7xl">
          The Archive<span className="text-primary">.</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm uppercase tracking-wider text-muted-foreground">
          Every strip filed, numbered, and stamped. Browse by tag or query.
        </p>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          {filtered.length === 0 ? (
            <div className="brutal-border bg-card p-10 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              ⚠ No entries match this filter.
            </div>
          ) : (
            filtered.map((c, i) => <ComicCard key={c.slug} comic={c} index={i} />)
          )}
        </div>
        <Sidebar query={query} onSearch={setQuery} selectedTag={tag} onTagChange={setTag} />
      </div>
    </div>
  );
}