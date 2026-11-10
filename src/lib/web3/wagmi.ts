import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { mock } from 'wagmi/connectors'

/**
 * Base Denim Upgrade Specifications
 * Denim activated on Base Mainnet on November 5, 2026 at 18:00 UTC.
 * Replaced Flashblocks with native canonical blocks every 200ms.
 */
export const BASE_DENIM_CONFIG = {
  chain: base,
  network: 'Base Mainnet',
  chainId: 8453,
  eip155: 'eip155:8453',
  upgrade: 'Denim',
  activationDate: '2026-11-05T18:00:00Z',
  blockTimeMs: 200,
  architecture: '200ms Native Canonical Blocks',
  flashblocksRetired: true,
  rpcUrl: 'https://mainnet.base.org',
  wsUrl: 'wss://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
  consensus: 'Canonical 200ms Preconfirmation-Free Blocks',
} as const;

export const config = createConfig({
  chains: [base],
  connectors: [
    mock({
      accounts: [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      ],
    }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
      retryCount: 3,
      retryDelay: 200,
    }),
  },
})

