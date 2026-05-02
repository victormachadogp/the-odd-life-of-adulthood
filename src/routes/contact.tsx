import { createFileRoute } from '@tanstack/react-router';
import { Mail, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: 'Contact — Inkwell' },
      {
        name: 'description',
        content: 'Say hi, send a commission inquiry, or subscribe to the Inkwell newsletter.',
      },
      { property: 'og:title', content: 'Contact — Inkwell' },
      { property: 'og:description', content: 'Say hi or subscribe to the Inkwell newsletter.' },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
        // Contact / Form
      </p>
      <h1 className="mt-2 text-5xl font-extrabold uppercase leading-[0.9] tracking-tighter md:text-7xl">
        Say hello<span className="text-primary">.</span>
      </h1>
      <p className="mt-4 max-w-xl text-sm uppercase tracking-wider text-muted-foreground">
        Commissions, kind words, suspicious offers — the inbox welcomes them all.
      </p>

      <div className="mt-10 grid gap-0 sm:grid-cols-3 brutal-border">
        <a
          href="mailto:hi@inkwell.studio"
          className="flex items-center gap-3 border-b-[3px] border-foreground bg-card p-4 transition-smooth hover:bg-primary hover:text-primary-foreground sm:border-b-0 sm:border-r-[3px]"
        >
          <Mail className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">hi@inkwell.studio</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 border-b-[3px] border-foreground bg-card p-4 transition-smooth hover:bg-primary hover:text-primary-foreground sm:border-b-0 sm:border-r-[3px]"
        >
          <Instagram className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">@inkwell.strips</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 bg-card p-4 transition-smooth hover:bg-primary hover:text-primary-foreground"
        >
          <Twitter className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">@inkwellstrips</span>
        </a>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="mt-10 brutal-border bg-card"
      >
        <p className="brutal-border-b bg-foreground px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-background">
          // Form.send
        </p>
        <div className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest">
                Name
              </span>
              <input
                required
                className="h-11 w-full brutal-border bg-background px-3 text-sm outline-none focus:bg-secondary"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest">
                Email
              </span>
              <input
                required
                type="email"
                className="h-11 w-full brutal-border bg-background px-3 text-sm outline-none focus:bg-secondary"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest">
              Message
            </span>
            <textarea
              required
              rows={5}
              className="w-full resize-none brutal-border bg-background p-3 text-sm outline-none focus:bg-secondary"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center brutal-border bg-primary px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-primary-foreground transition-smooth hover:-translate-y-0.5 sm:w-auto"
          >
            ▌ Transmit message
          </button>
          {sent && (
            <p className="brutal-border bg-foreground px-3 py-2 text-xs font-bold uppercase tracking-widest text-primary">
              ✓ Received. Reply incoming.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
