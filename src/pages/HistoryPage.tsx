import { Container } from '@/lib/ui/Container';
import { HistoryPanel } from '@/components/HistoryPanel';

export function HistoryPage() {
  return (
    <Container className="py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">History</h1>
        <p className="mt-1 text-body text-muted-foreground">Unified swaps and transfers across Ethereum and Base.</p>
      </div>
      <HistoryPanel />
    </Container>
  );
}
