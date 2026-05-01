import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Comic } from "@/data/comic.types";

interface Props {
  comic: Comic;
  index?: number;
}

export function ComicCard({ comic, index = 0 }: Props) {
  return (
    <article
      className="group animate-fade-up brutal-border bg-card transition-smooth hover:-translate-x-1 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 60}ms`,
        boxShadow: "8px 8px 0 0 var(--ink)",
      }}
    >
      <Link to="/comics/$slug" params={{ slug: comic.slug }} className="block">
        {/* catalog header strip */}
        <div className="flex items-center justify-between brutal-border-b bg-background px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
          <span className="text-primary">FILE №{String(index + 1).padStart(3, "0")}</span>
          <span className="text-foreground">
            {format(parseISO(comic.date), "MMM d, yyyy")} · <Clock className="inline h-3 w-3" /> {comic.readingTime}
          </span>
        </div>

        {/* image panel */}
        <div className="brutal-border-b bg-background p-3 md:p-4">
          <div className="brutal-border overflow-hidden bg-secondary">
            <img
              src={comic.coverImage}
              alt={comic.title}
              loading="lazy"
              width={768}
              height={1536}
              className="mx-auto block max-h-[560px] w-auto object-contain transition-smooth"
            />
          </div>
        </div>

        {/* meta block */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto]">
          <div className="space-y-3 p-5 md:border-r-[3px] md:border-foreground">
            <h2 className="text-2xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-3xl">
              {comic.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{comic.excerpt}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {comic.tags.map((t) => (
                <span
                  key={t}
                  className="brutal-border bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center bg-primary px-6 py-4 text-primary-foreground brutal-border-t md:brutal-border-t-0 md:px-8 md:py-0">
            <span className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest">
              Read
              <ArrowRight className="h-5 w-5 transition-smooth group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}