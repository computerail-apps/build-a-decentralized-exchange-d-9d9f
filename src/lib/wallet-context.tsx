import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type ChainId = 1 | 8453;

export interface ChainInfo {
  id: ChainId;
  name: string;
  shortName: string;
  explorer: string;
  nativeSymbol: string;
}

export const CHAINS: Record<ChainId, ChainInfo> = {
  1: { id: 1, name: 'Ethereum', shortName: 'ETH', explorer: 'https://etherscan.io', nativeSymbol: 'ETH' },
  8453: { id: 8453, name: 'Base', shortName: 'Base', explorer: 'https://basescan.org', nativeSymbol: 'ETH' },
};

export type WalletProviderName = 'MetaMask' | 'Coinbase Wallet' | 'WalletConnect';

interface WalletState {
  address: string | null;
  providerName: WalletProviderName | null;
  chainId: ChainId;
  connecting: boolean;
  connect: (provider: WalletProviderName) => void;
  disconnect: () => void;
  setChainId: (id: ChainId) => void;
}

const WalletContext = createContext<WalletState | null>(null);

// Deterministic, realistically-formatted address used only to represent the
// "connected" UI state until Phase 2 wires real wallet connectors (wagmi).
const DEMO_CONNECTED_ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d8976';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<WalletProviderName | null>(null);
  const [chainId, setChainId] = useState<ChainId>(1);
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback((provider: WalletProviderName) => {
    setConnecting(true);
    setProviderName(provider);
    // Real connector handshake (MetaMask/Coinbase/WalletConnect via wagmi) is wired in Phase 2.
    setAddress(DEMO_CONNECTED_ADDRESS);
    setConnecting(false);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProviderName(null);
  }, []);

  const value = useMemo<WalletState>(
    () => ({ address, providerName, chainId, connecting, connect, disconnect, setChainId }),
    [address, providerName, chainId, connecting, connect, disconnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
