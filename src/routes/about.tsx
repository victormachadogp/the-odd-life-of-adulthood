import { createFileRoute, Link } from '@tanstack/react-router';
const authorAvatar = '/media/author-avatar.jpg';

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About — Inkwell' },
      {
        name: 'description',
        content: 'Meet Mira, the cartoonist behind Inkwell, and the story of the strip.',
      },
      { property: 'og:title', content: 'About — Inkwell' },
      { property: 'og:description', content: 'Meet Mira, the cartoonist behind Inkwell.' },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">// About / Bio</p>
      <h1 className="mt-2 text-5xl font-extrabold uppercase leading-[0.9] tracking-tighter md:text-7xl">
        A small studio
        <br />
        for small
        <br />
        <span className="bg-primary px-2 text-primary-foreground">stories.</span>
      </h1>

      <div className="mt-10 brutal-border bg-card p-5">
        <div className="flex items-center gap-4">
          <img
            src={authorAvatar}
            alt="Mira Okafor"
            width={80}
            height={80}
            className="h-20 w-20 brutal-border object-cover"
          />
          <div>
            <p className="text-xl font-extrabold uppercase">Mira Okafor</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Cartoonist · Lisbon · 2022→
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground">
        <p>
          Inkwell started as a sketchbook habit in 2022 — a single panel a day, drawn on the metro,
          scanned at home, and posted before I changed my mind. It grew into a quiet catalogue of
          comics about feelings, animals, and the small absurdities of being a person.
        </p>
        <p>
          I draw with a 0.3mm pen, a flat brush, and a single red marker that's almost out of ink.
          Most strips take a few hours. The good ones take a few weeks of staring at the wall.
        </p>
        <p>New strips go up every Friday. Sometimes Tuesday, when the wall stares back.</p>
      </div>

      <div
        className="mt-12 brutal-border bg-foreground p-8 text-background"
        style={{ boxShadow: '8px 8px 0 0 var(--primary)' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          // Newsletter.sub
        </p>
        <p className="mt-3 text-3xl font-extrabold uppercase leading-tight">
          Want a strip
          <br />
          in your inbox?
        </p>
        <p className="mt-4 text-xs uppercase tracking-wider text-background/70">
          Once a week. No ads. No tracking. Just comics.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center gap-2 brutal-border bg-primary px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-primary-foreground transition-smooth hover:-translate-y-0.5"
          style={{ borderColor: 'var(--background)' }}
        >
          ▌ Subscribe →
        </Link>
      </div>
    </div>
  );
}
