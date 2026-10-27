import { Container } from '@/lib/ui/Container';
import { PortfolioPanel } from '@/components/PortfolioPanel';

export function PortfolioPage() {
  return (
    <Container className="py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Portfolio</h1>
        <p className="mt-1 text-body text-muted-foreground">Live balances across Ethereum and Base, valued in USD.</p>
      </div>
      <PortfolioPanel />
    </Container>
  );
}
