import type { ChainId } from '@/lib/wallet-context';

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoColor: string;
}

export const TOKENS_BY_CHAIN: Record<ChainId, Token[]> = {
  1: [
    { symbol: 'ETH', name: 'Ethereum', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18, logoColor: '#627EEA' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, logoColor: '#2775CA' },
    { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, logoColor: '#26A17B' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, logoColor: '#F7931A' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, logoColor: '#F5AC37' },
    { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, logoColor: '#FF007A' },
  ],
  8453: [
    { symbol: 'ETH', name: 'Ethereum', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18, logoColor: '#627EEA' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, logoColor: '#2775CA' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18, logoColor: '#F5AC37' },
    { symbol: 'cbETH', name: 'Coinbase Wrapped ETH', address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', decimals: 18, logoColor: '#0052FF' },
    { symbol: 'AERO', name: 'Aerodrome', address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631', decimals: 18, logoColor: '#0052FF' },
  ],
};

export const USD_PRICES: Record<string, number> = {
  ETH: 3412.57,
  USDC: 1.0,
  USDT: 1.0,
  WBTC: 96210.33,
  DAI: 1.0,
  UNI: 11.84,
  cbETH: 3589.12,
  AERO: 1.12,
};
