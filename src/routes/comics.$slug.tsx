import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { comics, getComic } from '@/data/content-loader';

const authorAvatar = '/media/author-avatar.jpg';

export const Route = createFileRoute('/comics/$slug')({
  loader: ({ params }) => {
    const comic = getComic(params.slug);
    if (!comic) throw notFound();
    return comic;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.title} — Inkwell` },
            { name: 'description', content: loaderData.excerpt },
            { property: 'og:title', content: `${loaderData.title} — Inkwell` },
            { property: 'og:description', content: loaderData.excerpt },
            { property: 'og:image', content: loaderData.coverImage },
            { name: 'twitter:image', content: loaderData.coverImage },
          ],
        }
      : { meta: [{ title: 'Comic — Inkwell' }] },
  component: ComicPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">// Error 404</p>
      <h1 className="mt-2 text-5xl font-extrabold uppercase tracking-tighter">File missing</h1>
      <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
        This entry has been redacted or never existed.
      </p>
      <Link
        to="/comics"
        className="mt-6 inline-flex items-center gap-2 brutal-border bg-foreground px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-background"
      >
        ← Back to archive
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-extrabold uppercase">System error</h1>
      <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
        {error.message}
      </p>
    </div>
  ),
});

function ComicPage() {
  const comic = Route.useLoaderData();
  const idx = comics.findIndex((c) => c.slug === comic.slug);
  const prev = comics[idx + 1];
  const next = comics[idx - 1];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
      <Link
        to="/comics"
        className="mb-8 inline-flex items-center gap-2 brutal-border bg-background px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-smooth hover:bg-foreground hover:text-background"
      >
        <ArrowLeft className="h-3 w-3" /> Back to archive
      </Link>

      {/* File header — catalog card */}
      <header className="brutal-border mb-8 bg-card">
        <div className="brutal-border-b flex items-center justify-between bg-foreground px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-background">
          <span className="text-primary">FILE №{String(idx + 1).padStart(3, '0')}</span>
          <span>
            {format(parseISO(comic.date), 'MMM d, yyyy')} / {comic.readingTime}
          </span>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-1.5">
            {comic.tags.map((t) => (
              <span
                key={t}
                className="brutal-border bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              >
                #{t}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tighter md:text-6xl">
            {comic.title}
          </h1>
          <div className="brutal-border-t flex items-center gap-3 pt-4 text-xs">
            <img
              src={authorAvatar}
              alt="Mira Okafor"
              width={32}
              height={32}
              className="h-8 w-8 brutal-border object-cover"
            />
            <span className="font-bold uppercase tracking-widest">Mira Okafor</span>
            <span className="ml-auto text-muted-foreground">By: M.O.</span>
          </div>
        </div>
      </header>

      {/* Comic image — vertical reading */}
      <div
        className="brutal-border bg-card"
        style={{ boxShadow: '10px 10px 0 0 var(--ink)' }}
      >
        <img
          src={comic.coverImage}
          alt={comic.title}
          width={768}
          height={1536}
          className="mx-auto block w-full object-contain"
        />
      </div>

      {/* Caption */}
      <div className="mt-10 border-l-[6px] border-primary bg-card p-5 brutal-border">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">// Caption</p>
        <p className="mt-2 text-lg leading-relaxed text-foreground">{comic.excerpt}</p>
      </div>

      {/* Actions */}
      <div className="mt-8 grid grid-cols-3 brutal-border">
        <button className="flex items-center justify-center gap-2 border-r-[3px] border-foreground bg-card py-3 text-xs font-extrabold uppercase tracking-widest transition-smooth hover:bg-primary hover:text-primary-foreground">
          <Heart className="h-4 w-4" /> 248
        </button>
        <button className="flex items-center justify-center gap-2 border-r-[3px] border-foreground bg-card py-3 text-xs font-extrabold uppercase tracking-widest transition-smooth hover:bg-primary hover:text-primary-foreground">
          <MessageCircle className="h-4 w-4" /> 12
        </button>
        <button className="flex items-center justify-center gap-2 bg-card py-3 text-xs font-extrabold uppercase tracking-widest transition-smooth hover:bg-primary hover:text-primary-foreground">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>

      {/* Comments */}
      <section className="mt-12">
        <div className="brutal-border-b mb-4 flex items-end justify-between pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              // Section.discuss
            </p>
            <h2 className="text-2xl font-extrabold uppercase tracking-tight">Comments</h2>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            [{String(sampleComments.length).padStart(2, '0')}]
          </p>
        </div>
        <form className="brutal-border bg-card p-4">
          <textarea
            placeholder="LEAVE A THOUGHT..."
            className="min-h-[96px] w-full resize-none brutal-border bg-background p-3 text-sm outline-none placeholder:text-xs placeholder:font-bold placeholder:uppercase placeholder:tracking-widest placeholder:text-muted-foreground focus:bg-secondary"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="brutal-border bg-primary px-5 py-2 text-xs font-extrabold uppercase tracking-widest text-primary-foreground transition-smooth hover:-translate-y-0.5"
            >
              ▌ Post
            </button>
          </div>
        </form>

        <ul className="mt-6 space-y-4">
          {sampleComments.map((c) => (
            <li
              key={c.author}
              className="brutal-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center brutal-border bg-foreground text-sm font-extrabold text-background">
                  {c.author[0]}
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest">{c.author}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {c.when}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground">{c.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Prev / Next */}
      <nav className="mt-16 grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            to="/comics/$slug"
            params={{ slug: prev.slug }}
            className="brutal-border bg-card p-5 transition-smooth hover:-translate-x-1 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest">← Prev file</p>
            <p className="mt-2 text-lg font-extrabold uppercase leading-tight">{prev.title}</p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/comics/$slug"
            params={{ slug: next.slug }}
            className="brutal-border bg-card p-5 text-right transition-smooth hover:-translate-x-1 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest">Next file →</p>
            <p className="mt-2 text-lg font-extrabold uppercase leading-tight">{next.title}</p>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

const sampleComments = [
  {
    author: 'Theo',
    when: '2 days ago',
    body: 'This made me smile on a Monday morning. Thank you.',
  },
  { author: 'Lin', when: '5 days ago', body: 'The third panel is a whole mood. Saving forever.' },
];
