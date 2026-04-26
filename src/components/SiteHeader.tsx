import { Link } from "@tanstack/react-router";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/" as const, label: "Home" },
  { to: "/comics" as const, label: "Comics" },
  { to: "/about" as const, label: "About" },
  { to: "/contact" as const, label: "Contact" },
];

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 brutal-border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="group flex items-center gap-3" aria-label="Inkwell home">
          <span className="flex h-10 w-10 items-center justify-center brutal-border bg-primary text-primary-foreground transition-smooth group-hover:-translate-y-0.5">
            <span className="text-lg font-extrabold">IW</span>
          </span>
          <span className="text-lg font-extrabold uppercase tracking-tight">
            Inkwell<span className="text-primary">.</span>
          </span>
          <span className="hidden border-l border-foreground/30 pl-3 text-[10px] font-bold uppercase text-muted-foreground md:inline">
            Issue №042 / 2026
          </span>
        </Link>

        <nav className="hidden items-center md:flex">
          {navItems.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground transition-smooth hover:bg-foreground hover:text-background",
                i !== 0 && "border-l-[3px] border-foreground",
              )}
              activeProps={{ className: "bg-foreground text-background" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center brutal-border bg-background text-foreground transition-smooth hover:bg-foreground hover:text-background"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center brutal-border bg-background md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden brutal-border-t md:hidden",
          open ? "max-h-72" : "max-h-0",
        )}
        style={{ transition: "max-height 200ms ease" }}
      >
        <nav className="flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              className="border-b border-foreground/30 px-4 py-3 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background"
              activeProps={{ className: "bg-foreground text-background" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}