import { Outlet, Link, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';

import appCss from '../styles.css?url';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ThemeProvider } from '@/components/ThemeProvider';

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div
        className="max-w-md text-center brutal-border bg-card p-10"
        style={{ boxShadow: '10px 10px 0 0 var(--primary)' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">// Error</p>
        <h1 className="mt-2 text-7xl font-extrabold uppercase tracking-tighter text-foreground">
          404
        </h1>
        <h2 className="mt-2 text-xl font-extrabold uppercase tracking-tight text-foreground">
          Page not found
        </h2>
        <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
          This file does not exist in the catalogue.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center brutal-border bg-foreground px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-background transition-smooth hover:bg-primary hover:text-primary-foreground"
          >
            ← Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Inkwell — Webcomics for the curious' },
      {
        name: 'description',
        content:
          'A modern webcomic blog. Fresh strips every week — playful, weird, and a little wonderful.',
      },
      { name: 'author', content: 'Inkwell' },
      { property: 'og:title', content: 'Inkwell — Webcomics for the curious' },
      { property: 'og:description', content: 'A modern webcomic blog. Fresh strips every week.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@Inkwell' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Space+Mono:wght@400;700&display=swap',
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </ThemeProvider>
  );
}
