import type { Token } from '@/lib/tokens';

export function TokenIcon({ token, size = 28 }: { token: Token; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-background"
      style={{ width: size, height: size, backgroundColor: token.logoColor, fontSize: size * 0.4 }}
    >
      {token.symbol.slice(0, 1)}
    </div>
  );
}
