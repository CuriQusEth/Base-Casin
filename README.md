# Base Casino

Welcome to **Base Casino**, a flashy, mobile-first, web3-enabled crypto casino simulator deployed on the Base Mainnet!

## 🌟 Overview

Base Casino is an immersive casino experience built for the Base ecosystem. It features a complete suite of standard casino games alongside modern autonomous capabilities through an embedded Model Context Protocol (MCP) compatible AI Agent.

## ✨ Features

- **Lucky Spin (Slots):** High-volatility slot machine with Base-themed symbols and win streaks.
- **Rocket Crash:** Classic crash game where players ride the multiplier to the moon and try to cash out before the inevitable crash.
- **ERC-8004 Active AI Agent:** Comes fully equipped with the **Base Casin Orchestrator**, an autonomous AI agent capable of multi-game orchestration, betting management, risk management, and risk automation via the Model Context Protocol (MCP).
- **Web3 Integration:** Fully integrated with Base Mainnet (EIP-155:8453).
- **Vault & Rewards:** Seamlessly bridge in-game chips to theoretical on-chain tokens.

## 🤖 MCP AI Agent Connection

The Base Casin Orchestrator operates as a standardized Model Context Protocol (MCP) server. You can interact with it via its App Router API endpoints.

**Orchestrator Capabilities:**
- `casino-game-management`
- `betting-automation`
- `reward-optimization`
- `multi-game-orchestration`
- `risk-management`
- `mcp-command-execution`

**Agent Services:**
- `A2A Endpoint`: `https://base-casin.vercel.app/.well-known/agent-card.json`
- `MCP Endpoint`: `https://base-casin.vercel.app/api/mcp`
- `General API`: `https://base-casin.vercel.app/api/agent`

To test the MCP agent locally or invoke tools (`get_race_status`, `start_race`, `get_leaderboard`, `optimize_speed`, `get_track_info`), hit the `/api/mcp` POST endpoint using standard JSON-RPC 2.0 formatting.

## 🛠 Tech Stack

- Next.js / React (Vite)
- Tailwind CSS & Framer Motion
- Wagmi + Viem
- Express.js / Node.js
- Model Context Protocol (MCP)

## 🚀 Getting Started Locally

1. Clone or download the repository.
2. Run `npm install` to install all necessary dependencies.
3. Replace the `[PLACEHOLDER]` configuration values with your environment keys where required.
4. Run `npm run dev` to launch the application locally.
5. The application will be available on `http://localhost:3000`.

*Disclaimer: This is a simulated environment intended for fun/demo purposes.*