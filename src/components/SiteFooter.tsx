import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="brutal-border-t bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-3xl font-extrabold uppercase tracking-tight">
              Inkwell<span className="text-primary">.</span>
            </p>
            <p className="mt-2 max-w-sm text-xs uppercase tracking-wider text-background/70">
              An independent webcomic catalogue. Printed pixels, weekly.
            </p>
          </div>
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">// Index</p>
            <nav className="flex flex-col gap-2 text-xs uppercase tracking-wider">
              <Link to="/" className="hover:text-primary">→ Home</Link>
              <Link to="/comics" className="hover:text-primary">→ Archive</Link>
              <Link to="/about" className="hover:text-primary">→ About</Link>
              <Link to="/contact" className="hover:text-primary">→ Contact</Link>
            </nav>
          </div>
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">// Meta</p>
            <p className="text-xs uppercase tracking-wider text-background/70">ISSN 2026—0042</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-background/70">Lisbon · Print &amp; Web</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-background/30 pt-4 text-[10px] uppercase tracking-widest text-background/60 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Inkwell — All strips reserved.</p>
          <p>v.1.0 / built with red ink</p>
        </div>
      </div>
    </footer>
  );
}