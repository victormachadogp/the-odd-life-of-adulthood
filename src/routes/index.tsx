import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown } from "lucide-react";
import { ComicCard } from "@/components/ComicCard";
import { Sidebar } from "@/components/Sidebar";
import { comics } from "@/data/comics";

const artBackground = "/media/art-background.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inkwell — Webcomics for the curious" },
      { name: "description", content: "A weekly feed of fresh, hand-drawn webcomics. Cats, dragons, and quiet moments." },
      { property: "og:title", content: "Inkwell — Webcomics for the curious" },
      { property: "og:description", content: "A weekly feed of fresh, hand-drawn webcomics." },
    ],
  }),
  component: Index,
});

function Index() {
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
    <div>
      {/* Marquee strip */}
      <div className="brutal-border-b overflow-hidden bg-foreground py-2 text-background">
        <div className="flex gap-8 whitespace-nowrap text-[11px] font-bold uppercase tracking-widest">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              ★ New strip every Friday
              <span className="text-primary">/</span>
              Issue №042
              <span className="text-primary">/</span>
              Black ink only
              <span className="text-primary">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero — newspaper masthead */}
      <section className="brutal-border-b relative overflow-hidden bg-foreground">
        <img
          src={artBackground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          {/* meta line */}
          <div className="flex items-center justify-between border-b border-background/20 py-3 text-[10px] font-bold uppercase tracking-widest text-background/50">
            <span>Vol. I — №042</span>
            <span className="hidden md:inline">A weekly catalogue of strips</span>
            <span>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}</span>
          </div>

          {/* publication name */}
          <div className="border-b border-background/20 py-4 text-center">
            <p className="text-2xl font-extrabold uppercase tracking-[0.15em] text-background md:text-4xl">
              A Estranha Vida Adulta
            </p>
          </div>

          {/* hero grid */}
          <div className="grid items-end md:grid-cols-[1fr_320px]">
            {/* left: text + CTAs */}
            <div className="py-12 md:py-16 md:pr-10">
              <p className="mb-4 inline-block bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                ▌ Featured this issue
              </p>
              <h1 className="text-5xl font-extrabold uppercase leading-[1.15] tracking-tighter text-background md:text-7xl lg:text-8xl">
                Tiny
                <br />
                stories,
                <br />
                <span className="bg-primary px-2 text-primary-foreground">drawn loud.</span>
              </h1>
              <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:gap-3">
                <a
                  href="#feed"
                  className="inline-flex items-center justify-between brutal-border bg-primary px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-primary-foreground transition-smooth hover:-translate-y-0.5"
                  style={{ borderColor: "var(--primary-foreground)" }}
                >
                  Browse archive
                  <ArrowDown className="ml-4 h-4 w-4" />
                </a>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-between brutal-border bg-background px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-foreground transition-smooth hover:-translate-y-0.5"
                >
                  Meet the author →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feed + Sidebar */}
      <section id="feed" className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <div className="brutal-border-b flex items-end justify-between pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">// Section 01</p>
                <h2 className="text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                  Latest strips
                </h2>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                [{String(filtered.length).padStart(2, "0")}] {filtered.length === 1 ? "entry" : "entries"}
                {tag ? ` · #${tag}` : ""}
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="brutal-border bg-card p-10 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                ⚠ No results. Reset filters.
              </div>
            ) : (
              <div className="space-y-10">
                {filtered.map((c, i) => (
                  <ComicCard key={c.slug} comic={c} index={i} />
                ))}
              </div>
            )}
          </div>
          <Sidebar
            query={query}
            onSearch={setQuery}
            selectedTag={tag}
            onTagChange={setTag}
          />
        </div>
      </section>
    </div>
  );
}
