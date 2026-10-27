import { useMemo } from 'react';
import { Wallet2, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/lib/ui/Card';
import { Button } from '@/lib/ui/Button';
import { Badge } from '@/lib/ui/Badge';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { TokenIcon } from '@/components/TokenIcon';
import { useAppData } from '@/lib/data';
import { useWallet, CHAINS, shortenAddress, type ChainId } from '@/lib/wallet-context';
import { TOKENS_BY_CHAIN, USD_PRICES, type Token } from '@/lib/tokens';

interface Balance {
  token: Token;
  amount: number;
}

interface ChainPortfolio {
  chainId: ChainId;
  balances: Balance[];
}

function mockPortfolio(chainId: ChainId): Balance[] {
  const tokens = TOKENS_BY_CHAIN[chainId];
  const amounts: Record<string, number> = {
    ETH: 1.842,
    USDC: 2540.11,
    USDT: 310.0,
    WBTC: 0.042,
    DAI: 128.4,
    UNI: 64.2,
    cbETH: 0.5,
    AERO: 1890.0,
  };
  return tokens.map((t) => ({ token: t, amount: amounts[t.symbol] ?? 0 }));
}

function ChainCard({ chainId }: { chainId: ChainId }) {
  const { address } = useWallet();
  const { data, isLoading, error, refetch } = useAppData<Balance[]>({
    key: ['portfolio-balances', chainId, address],
    mock: mockPortfolio(chainId),
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  const total = useMemo(
    () => (data ?? []).reduce((sum, b) => sum + b.amount * (USD_PRICES[b.token.symbol] ?? 0), 0),
    [data]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{CHAINS[chainId].name}</CardTitle>
          <CardDescription>Native + ERC-20 balances</CardDescription>
        </div>
        <span className="text-h3 tabular-nums text-foreground">
          ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="py-10"><CenteredSpinner label={`Loading ${CHAINS[chainId].name} balances`} /></div>
        ) : error ? (
          <div className="px-6 pb-6">
            <Alert variant="destructive">
              <AlertTitle>Couldn't load balances</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-2">
                <span>{(error as Error).message}</span>
                <Button size="sm" variant="outline" onClick={() => refetch()}><RefreshCw size={14} />Retry</Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="px-6 pb-6">
            <EmptyState icon={<Wallet2 size={20} />} title="No tokens found" description="This wallet has no balances on this chain yet." />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((b) => {
              const usd = b.amount * (USD_PRICES[b.token.symbol] ?? 0);
              return (
                <li key={b.token.address} className="flex items-center gap-3 px-6 py-3">
                  <TokenIcon token={b.token} size={32} />
                  <div className="flex-1">
                    <div className="text-small font-medium text-foreground">{b.token.symbol}</div>
                    <div className="text-micro text-muted-foreground">{b.token.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-small tabular-nums text-foreground">{b.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                    <div className="text-micro tabular-nums text-muted-foreground">${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function PortfolioPanel() {
  const { address, connect } = useWallet();

  if (!address) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={<Wallet2 size={20} />}
            title="Connect your wallet"
            description="Connect a wallet to see your live balances across Ethereum and Base."
            action={<Button onClick={() => connect('MetaMask')}>Connect Wallet</Button>}
          />
        </CardContent>
      </Card>
    );
  }

  const ethBalances = mockPortfolio(1);
  const baseBalances = mockPortfolio(8453);
  const netWorth =
    ethBalances.reduce((s, b) => s + b.amount * (USD_PRICES[b.token.symbol] ?? 0), 0) +
    baseBalances.reduce((s, b) => s + b.amount * (USD_PRICES[b.token.symbol] ?? 0), 0);

  return (
    <div className="space-y-6">
      <Card className="bg-surface-elevated">
        <CardContent className="flex flex-col gap-1 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-small text-muted-foreground">Total net worth</div>
            <div className="text-display tabular-nums text-foreground">
              ${netWorth.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
          <Badge variant="outline" className="w-fit font-mono">{shortenAddress(address)}</Badge>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChainCard chainId={1} />
        <ChainCard chainId={8453} />
      </div>
    </div>
  );
}
