import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, Settings2, Info, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/lib/ui/Card';
import { Button } from '@/lib/ui/Button';
import { Badge } from '@/lib/ui/Badge';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Spinner } from '@/lib/ui/Spinner';
import { TokenSelect } from '@/components/TokenSelect';
import { useAppData } from '@/lib/data';
import { useWallet, CHAINS, type ChainId } from '@/lib/wallet-context';
import { TOKENS_BY_CHAIN, USD_PRICES, type Token } from '@/lib/tokens';

interface QuoteResult {
  price: string;
  guaranteedPrice: string;
  toAmount: string;
  estimatedGas: string;
  sources: { name: string; proportion: string }[];
  minimumReceived: string;
  priceImpactPct: string;
}

function buildMockQuote(fromToken: Token, toToken: Token, fromAmount: number): QuoteResult {
  const fromUsd = USD_PRICES[fromToken.symbol] ?? 1;
  const toUsd = USD_PRICES[toToken.symbol] ?? 1;
  const rawTo = fromAmount > 0 ? (fromAmount * fromUsd) / toUsd : 0;
  const slippageAdjusted = rawTo * 0.995;
  return {
    price: (rawTo / (fromAmount || 1)).toFixed(6),
    guaranteedPrice: (slippageAdjusted / (fromAmount || 1)).toFixed(6),
    toAmount: rawTo.toFixed(6),
    estimatedGas: '182,400',
    sources: [
      { name: 'Uniswap_V3', proportion: '0.65' },
      { name: 'Curve', proportion: '0.20' },
      { name: 'Balancer_V2', proportion: '0.15' },
    ],
    minimumReceived: slippageAdjusted.toFixed(6),
    priceImpactPct: '0.08',
  };
}

export function SwapCard() {
  const { address, chainId, setChainId, connect } = useWallet();
  const tokens = TOKENS_BY_CHAIN[chainId];
  const [fromToken, setFromToken] = useState<Token>(tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[1]);
  const [amount, setAmount] = useState('1.0');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const next = TOKENS_BY_CHAIN[chainId];
    setFromToken(next[0]);
    setToToken(next[1]);
  }, [chainId]);

  const parsedAmount = parseFloat(amount) || 0;

  const { data: quote, isLoading, error, refetch, isFetching } = useAppData<QuoteResult>({
    key: ['0x-quote', chainId, fromToken.symbol, toToken.symbol, parsedAmount],
    mock: buildMockQuote(fromToken, toToken, parsedAmount),
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  const fromUsdValue = useMemo(() => (USD_PRICES[fromToken.symbol] ?? 0) * parsedAmount, [fromToken, parsedAmount]);
  const toUsdValue = useMemo(
    () => (quote ? (USD_PRICES[toToken.symbol] ?? 0) * parseFloat(quote.toAmount) : 0),
    [quote, toToken]
  );

  function flip() {
    setFromToken(toToken);
    setToToken(fromToken);
  }

  return (
    <Card className="w-full max-w-md border-border/60 bg-surface-elevated/80 shadow-elev-3 backdrop-blur">
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-full bg-muted p-1">
            {(Object.values(CHAINS)).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setChainId(c.id as ChainId)}
                className={`rounded-full px-3 py-1 text-small font-medium transition-colors duration-150 ${
                  chainId === c.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowSettings((s) => !s)}
            aria-label="Slippage settings"
            className="rounded-full p-2 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
          >
            <Settings2 size={16} />
          </button>
        </div>

        {showSettings && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 animate-in">
            <span className="text-small text-muted-foreground">Max slippage</span>
            <div className="flex gap-1">
              {[0.1, 0.5, 1.0].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlippage(s)}
                  className={`rounded-md px-2 py-1 text-small transition-colors duration-150 ${
                    slippage === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1 rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between text-micro text-muted-foreground">
            <span>You pay</span>
            <span>Balance: {(parsedAmount * 3.2).toFixed(4)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0.0"
              className="w-full bg-transparent text-h2 tabular-nums text-foreground outline-none placeholder:text-muted-foreground"
            />
            <TokenSelect tokens={tokens} value={fromToken} onChange={setFromToken} />
          </div>
          <div className="text-micro tabular-nums text-muted-foreground">${fromUsdValue.toFixed(2)}</div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={flip}
            aria-label="Flip tokens"
            className="-my-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-surface-elevated text-muted-foreground transition-transform duration-150 hover:rotate-180 hover:text-foreground"
          >
            <ArrowDown size={16} />
          </button>
        </div>

        <div className="space-y-1 rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between text-micro text-muted-foreground">
            <span>You receive</span>
            <span>Balance: {(parsedAmount * 1.1).toFixed(4)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            {isLoading || isFetching ? (
              <Spinner size={20} />
            ) : (
              <span className="w-full truncate text-h2 tabular-nums text-foreground">
                {quote ? parseFloat(quote.toAmount).toLocaleString(undefined, { maximumFractionDigits: 6 }) : '0.0'}
              </span>
            )}
            <TokenSelect tokens={tokens} value={toToken} onChange={setToToken} />
          </div>
          <div className="text-micro tabular-nums text-muted-foreground">${toUsdValue.toFixed(2)}</div>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't fetch quote</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-2">
              <span>{(error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                <RefreshCw size={14} />Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : quote ? (
          <div className="space-y-2 rounded-xl border border-border bg-surface p-4 text-small">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span className="tabular-nums text-foreground">
                1 {fromToken.symbol} = {quote.price} {toToken.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Price impact</span>
              <span className="tabular-nums text-success">{quote.priceImpactPct}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Minimum received</span>
              <span className="tabular-nums text-foreground">{quote.minimumReceived} {toToken.symbol}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Info size={12} /> Est. gas
              </span>
              <span className="tabular-nums text-foreground">{quote.estimatedGas}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quote.sources.map((s) => (
                <Badge key={s.name} variant="outline">{s.name.replace('_', ' ')} {Math.round(parseFloat(s.proportion) * 100)}%</Badge>
              ))}
            </div>
          </div>
        ) : null}

        {address ? (
          <Button className="w-full" size="lg" disabled={!quote || parsedAmount <= 0}>
            Review swap
          </Button>
        ) : (
          <Button className="w-full" size="lg" onClick={() => connect('MetaMask')}>
            Connect wallet to swap
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
