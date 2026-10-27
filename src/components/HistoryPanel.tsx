import { useState } from 'react';
import { History as HistoryIcon, ExternalLink, RefreshCw, ArrowRightLeft, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, CardContent } from '@/lib/ui/Card';
import { Button } from '@/lib/ui/Button';
import { Badge } from '@/lib/ui/Badge';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { useAppData } from '@/lib/data';
import { useWallet, CHAINS, type ChainId } from '@/lib/wallet-context';

type TxType = 'swap' | 'send' | 'receive';
type TxStatus = 'confirmed' | 'pending' | 'failed';

interface TxRecord {
  id: string;
  chainId: ChainId;
  type: TxType;
  status: TxStatus;
  hash: string;
  fromToken: string;
  toToken?: string;
  fromAmount: number;
  toAmount?: number;
  timestamp: string;
}

const MOCK_HISTORY: TxRecord[] = [
  { id: '1', chainId: 1, type: 'swap', status: 'confirmed', hash: '0x8f3a1c2b9e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c', fromToken: 'ETH', toToken: 'USDC', fromAmount: 0.5, toAmount: 1706.28, timestamp: '2024-06-12T14:32:00Z' },
  { id: '2', chainId: 8453, type: 'swap', status: 'confirmed', hash: '0x1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80', fromToken: 'USDC', toToken: 'AERO', fromAmount: 500, toAmount: 446.4, timestamp: '2024-06-11T09:15:00Z' },
  { id: '3', chainId: 1, type: 'send', status: 'confirmed', hash: '0x2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091', fromToken: 'USDT', fromAmount: 250, timestamp: '2024-06-10T18:47:00Z' },
  { id: '4', chainId: 1, type: 'receive', status: 'confirmed', hash: '0x3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809123', fromToken: 'ETH', fromAmount: 1.2, timestamp: '2024-06-09T07:02:00Z' },
  { id: '5', chainId: 8453, type: 'swap', status: 'pending', hash: '0x4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80912345', fromToken: 'ETH', toToken: 'USDC', fromAmount: 0.25, toAmount: 853.1, timestamp: '2024-06-13T11:05:00Z' },
  { id: '6', chainId: 1, type: 'swap', status: 'failed', hash: '0x5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091234567', fromToken: 'DAI', toToken: 'WBTC', fromAmount: 1200, toAmount: 0.0, timestamp: '2024-06-08T21:40:00Z' },
];

const statusBadge: Record<TxStatus, 'success' | 'warning' | 'destructive'> = {
  confirmed: 'success',
  pending: 'warning',
  failed: 'destructive',
};

const typeIcon: Record<TxType, typeof ArrowRightLeft> = {
  swap: ArrowRightLeft,
  send: ArrowUpRight,
  receive: ArrowDownLeft,
};

function relTime(iso: string): string {
  const s = Math.floor((Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return s + 's ago';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

type Filter = 'all' | ChainId;

export function HistoryPanel() {
  const { address, connect } = useWallet();
  const [filter, setFilter] = useState<Filter>('all');

  const { data, isLoading, error, refetch } = useAppData<TxRecord[]>({
    key: ['tx-history', address],
    mock: MOCK_HISTORY,
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  if (!address) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={<HistoryIcon size={20} />}
            title="Connect your wallet"
            description="Connect a wallet to see your unified transaction history across Ethereum and Base."
            action={<Button onClick={() => connect('MetaMask')}>Connect Wallet</Button>}
          />
        </CardContent>
      </Card>
    );
  }

  const filtered = (data ?? []).filter((tx) => filter === 'all' || tx.chainId === filter);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex gap-1 rounded-full bg-muted p-1 w-fit">
          {([['all', 'All chains'], [1, 'Ethereum'], [8453, 'Base']] as [Filter, string][]).map(([val, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => setFilter(val)}
              className={`rounded-full px-3 py-1 text-small font-medium transition-colors duration-150 ${
                filter === val ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-12"><CenteredSpinner label="Loading transaction history" /></div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load history</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-2">
              <span>{(error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}><RefreshCw size={14} />Retry</Button>
            </AlertDescription>
          </Alert>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<HistoryIcon size={20} />} title="No transactions yet" description="Your swaps and transfers will show up here once you make your first trade." />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((tx) => {
              const Icon = typeIcon[tx.type];
              return (
                <li key={tx.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-small font-medium text-foreground">
                      {tx.type === 'swap' ? `${tx.fromToken} → ${tx.toToken}` : tx.type === 'send' ? `Sent ${tx.fromToken}` : `Received ${tx.fromToken}`}
                      <Badge variant="outline" className="text-micro">{CHAINS[tx.chainId].name}</Badge>
                    </div>
                    <div className="text-micro text-muted-foreground">{relTime(tx.timestamp)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-small tabular-nums text-foreground">
                      {tx.fromAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {tx.fromToken}
                      {tx.toAmount !== undefined && tx.type === 'swap' ? ` → ${tx.toAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${tx.toToken}` : ''}
                    </div>
                  </div>
                  <Badge variant={statusBadge[tx.status]}>{tx.status}</Badge>
                  <a
                    href={`${CHAINS[tx.chainId].explorer}/tx/${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                    aria-label="View on explorer"
                  >
                    <ExternalLink size={14} />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
