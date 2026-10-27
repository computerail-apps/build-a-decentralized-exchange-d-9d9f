import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/lib/ui/Input';
import { TokenIcon } from '@/components/TokenIcon';
import type { Token } from '@/lib/tokens';

interface Props {
  tokens: Token[];
  value: Token;
  onChange: (t: Token) => void;
}

export function TokenSelect({ tokens, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const filtered = tokens.filter(
    (t) => t.symbol.toLowerCase().includes(query.toLowerCase()) || t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface-elevated py-1.5 pl-1.5 pr-3 transition-colors duration-150 hover:border-primary/50"
      >
        <TokenIcon token={value} size={24} />
        <span className="text-body font-semibold text-foreground">{value.symbol}</span>
        <ChevronDown size={16} className="text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-72 rounded-lg border border-border bg-surface-elevated p-2 shadow-elev-3 animate-in">
          <div className="relative mb-2">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search token"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((t) => (
              <button
                key={t.address}
                type="button"
                onClick={() => { onChange(t); setOpen(false); setQuery(''); }}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-muted"
              >
                <TokenIcon token={t} size={28} />
                <div>
                  <div className="text-small font-semibold text-foreground">{t.symbol}</div>
                  <div className="text-micro text-muted-foreground">{t.name}</div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-2 py-6 text-center text-small text-muted-foreground">No tokens found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
