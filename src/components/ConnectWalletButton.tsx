import { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, LogOut, Check } from 'lucide-react';
import { Button } from '@/lib/ui/Button';
import { useWallet, shortenAddress, type WalletProviderName } from '@/lib/wallet-context';

const PROVIDERS: WalletProviderName[] = ['MetaMask', 'Coinbase Wallet', 'WalletConnect'];

export function ConnectWalletButton() {
  const { address, providerName, connecting, connect, disconnect } = useWallet();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (address) {
    return (
      <div className="relative" ref={ref}>
        <Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)}>
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="font-mono">{shortenAddress(address)}</span>
          <ChevronDown size={14} />
        </Button>
        {open && (
          <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-lg border border-border bg-surface-elevated p-2 shadow-elev-3 animate-in">
            <div className="px-2 py-1.5 text-micro text-muted-foreground">Connected via {providerName}</div>
            <button
              type="button"
              onClick={() => { disconnect(); setOpen(false); }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-small text-foreground transition-colors duration-150 hover:bg-muted"
            >
              <LogOut size={14} /> Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <Button size="sm" onClick={() => setOpen((o) => !o)} disabled={connecting}>
        <Wallet size={16} />
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-lg border border-border bg-surface-elevated p-2 shadow-elev-3 animate-in">
          <div className="px-2 py-1.5 text-micro text-muted-foreground">Choose a wallet</div>
          {PROVIDERS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { connect(p); setOpen(false); }}
              className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-small text-foreground transition-colors duration-150 hover:bg-muted"
            >
              {p}
              <Check size={14} className="text-muted-foreground opacity-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
