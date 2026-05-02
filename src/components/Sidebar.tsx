import { useState } from 'react';
import { Search } from 'lucide-react';
import { allTags } from '@/data/content-loader';

const authorAvatar = '/media/author-avatar.jpg';

interface SidebarProps {
  onSearch?: (q: string) => void;
  query?: string;
  selectedTag?: string | null;
  onTagChange?: (tag: string | null) => void;
}

export function Sidebar({ onSearch, query = '', selectedTag = null, onTagChange }: SidebarProps) {
  const [internal, setInternal] = useState(query);

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      {/* Search */}
      <div className="brutal-border bg-card">
        <p className="brutal-border-b bg-foreground px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-background">
          // Search.idx
        </p>
        <div className="p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
            <input
              id="search"
              type="search"
              value={internal}
              onChange={(e) => {
                setInternal(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder="QUERY..."
              className="h-10 w-full brutal-border bg-background pl-9 pr-3 text-xs font-bold uppercase tracking-widest outline-none placeholder:text-muted-foreground focus:bg-primary focus:text-primary-foreground focus:placeholder:text-primary-foreground/70"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="brutal-border bg-card">
        <p className="brutal-border-b bg-foreground px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-background">
          // Categories.tag
        </p>
        <div className="flex flex-col">
          <button
            onClick={() => onTagChange?.(null)}
            className={
              'flex items-center justify-between border-b border-foreground/30 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-smooth ' +
              (selectedTag === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-card hover:bg-foreground hover:text-background')
            }
          >
            <span>★ All strips</span>
            <span className="opacity-60">[*]</span>
          </button>
          {allTags.map((tag, i) => (
            <button
              key={tag}
              onClick={() => onTagChange?.(tag === selectedTag ? null : tag)}
              className={
                'flex items-center justify-between px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-smooth ' +
                (i !== allTags.length - 1 ? 'border-b border-foreground/30 ' : '') +
                (selectedTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-foreground hover:text-background')
              }
            >
              <span>#{tag}</span>
              <span className="opacity-60">[{String(i + 1).padStart(2, '0')}]</span>
            </button>
          ))}
        </div>
      </div>

      {/* Author card */}
      <div className="brutal-border bg-foreground text-background">
        <p className="border-b border-background/30 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary">
          // Author.bio
        </p>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <img
              src={authorAvatar}
              alt="Mira, the artist behind Inkwell"
              width={56}
              height={56}
              className="h-14 w-14 brutal-border object-cover"
              style={{ borderColor: 'var(--background)' }}
            />
            <div>
              <p className="text-base font-extrabold uppercase leading-tight">Mira Okafor</p>
              <p className="text-[10px] uppercase tracking-widest text-background/70">
                Cartoonist · LX
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs uppercase tracking-wider text-background/80">
            Small, quiet stories. Cats, dragons, the occasional astronaut.
          </p>
        </div>
      </div>
    </aside>
  );
}
