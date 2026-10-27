import { Shield, Route, Layers } from 'lucide-react';
import { Container } from '@/lib/ui/Container';
import { Card, CardContent } from '@/lib/ui/Card';
import { SwapCard } from '@/components/SwapCard';

const FEATURES = [
  { icon: Shield, title: 'Non-custodial', desc: 'You hold your keys. Every trade is signed client-side in your own wallet.' },
  { icon: Route, title: 'Best-priced routing', desc: 'Quotes aggregated across DEX liquidity via the 0x Protocol.' },
  { icon: Layers, title: 'Two chains, one app', desc: 'Swap natively on Ethereum and Base without switching tools.' },
];

export function SwapPage() {
  return (
    <Container className="py-8 md:py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-display text-foreground">Swap tokens at the best price</h1>
        <p className="mt-3 text-body text-muted-foreground">
          Driftswap routes every trade through the deepest liquidity on Ethereum and Base, so you always get a competitive rate — signed securely from your own wallet.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <SwapCard />
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <CardContent className="space-y-2 pt-6">
              <f.icon size={20} className="text-primary" />
              <div className="text-small font-semibold text-foreground">{f.title}</div>
              <div className="text-small text-muted-foreground">{f.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
