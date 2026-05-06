import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { mock } from 'wagmi/connectors'

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
    [base.id]: http(),
  },
})
