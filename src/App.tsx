import { useState } from 'react';
import { ArrowRightLeft, Wallet2, History as HistoryIcon } from 'lucide-react';
import { Nav, NavLink } from '@/lib/ui/Nav';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { WalletProvider } from '@/lib/wallet-context';
import { SwapPage } from '@/pages/SwapPage';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { HistoryPage } from '@/pages/HistoryPage';

type View = 'swap' | 'portfolio' | 'history';

function AppShell() {
  const [view, setView] = useState<View>('swap');
  return (
    <div className="min-h-screen">
      <Nav brand={<span>Driftswap</span>} actions={<ConnectWalletButton />}>
        <NavLink href="#" active={view === 'swap'} onClick={() => setView('swap')}>
          <ArrowRightLeft size={14} className="mr-2" />Swap
        </NavLink>
        <NavLink href="#" active={view === 'portfolio'} onClick={() => setView('portfolio')}>
          <Wallet2 size={14} className="mr-2" />Portfolio
        </NavLink>
        <NavLink href="#" active={view === 'history'} onClick={() => setView('history')}>
          <HistoryIcon size={14} className="mr-2" />History
        </NavLink>
      </Nav>
      <main className="pb-16">
        {view === 'swap' && <SwapPage />}
        {view === 'portfolio' && <PortfolioPage />}
        {view === 'history' && <HistoryPage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppShell />
    </WalletProvider>
  );
}
