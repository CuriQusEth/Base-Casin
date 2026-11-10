import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === CORS Middleware for API routes ===
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // === API ROUTES ===

  // .well-known/agent-card.json
  app.get("/.well-known/agent-card.json", (req, res) => {
    res.json({
      name: "Base Casin Orchestrator",
      description: "Base Casin platformunda çalışan ERC-8004 uyumlu AI Agent. Base Denim Mainnet (200ms native bloklar) üzerinde casino game management, betting automation, reward optimization ve multi-game orchestration yapan akıllı agent.",
      version: "1.0.0",
      type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
      image: "https://base-casin.vercel.app/logo.png",
      wallets: {
        base: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B"
      },
      services: [
        {
          name: "A2A",
          endpoint: "https://base-casin.vercel.app/.well-known/agent-card.json",
          version: "1.0.0",
          description: "Agent-to-Agent communication on Base Denim Mainnet"
        },
        {
          name: "MCP",
          endpoint: "https://base-casin.vercel.app/api/mcp",
          version: "1.0.0",
          description: "Model Context Protocol - Active command execution (Denim 200ms blocks)"
        },
        {
          name: "API",
          endpoint: "https://base-casin.vercel.app/api/agent",
          version: "1.0.0",
          description: "Main agent control API"
        }
      ],
      capabilities: [
        "base-denim-mainnet-compatible",
        "200ms-canonical-blocks",
        "flashblocks-migrated",
        "casino-game-management",
        "betting-automation",
        "reward-optimization",
        "multi-game-orchestration",
        "risk-management",
        "mcp-command-execution"
      ],
      supportedChains: ["eip155:8453"],
      network: {
        name: "Base Mainnet",
        chainId: 8453,
        upgrade: "Denim",
        blockTimeMs: 200,
        flashblocksRetired: true,
        rpc: "https://mainnet.base.org"
      },
      skills: [
        {
          name: "casino-management",
          description: "Orchestrates casino operations and player management"
        },
        {
          name: "betting-automation",
          description: "Automates betting strategies and execution"
        },
        {
          name: "reward-optimization",
          description: "Calculates and optimizes user rewards"
        },
        {
          name: "denim-network-orchestration",
          description: "Orchestrates game state and settlement across Base Denim 200ms canonical blocks"
        }
      ],
      active: true,
      status: "online"
    });
  });

  // MCP GET
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Base Casin MCP Endpoint",
      status: "active",
      network: "Base Mainnet",
      upgrade: "Denim",
      blockTimeMs: 200,
      flashblocksStatus: "retired",
      description: "Active MCP server for Base Casin Orchestrator Agent on Base Denim Mainnet (200ms canonical blocks)",
      capabilities: [
        "base-denim-mainnet-compatible",
        "200ms-canonical-blocks",
        "casino-game-management",
        "betting-automation",
        "reward-optimization"
      ],
      timestamp: new Date().toISOString()
    });
  });

  // MCP POST
  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const { method, params, id } = body || {};

      // MCP JSON-RPC
      if (method === "initialize") {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "Base Casin MCP (Denim Mainnet)", version: "1.0.0" }
          }
        });
      }

      if (method === "tools/list") {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              { name: "get_denim_network_info", description: "Get the Base Denim Mainnet status (200ms native canonical blocks, Flashblocks migration status)", inputSchema: { type: "object", properties: {} } },
              { name: "get_block_status", description: "Get current canonical block status and 200ms confirmation parameters", inputSchema: { type: "object", properties: {} } },
              { name: "get_race_status", description: "Get the current status of the casino races", inputSchema: { type: "object", properties: {} } },
              { name: "start_race", description: "Start a new casino race", inputSchema: { type: "object", properties: {} } },
              { name: "get_leaderboard", description: "Get the current leaderboard", inputSchema: { type: "object", properties: {} } },
              { name: "optimize_speed", description: "Optimize the speed for the racing agent", inputSchema: { type: "object", properties: {} } },
              { name: "get_track_info", description: "Get information about the current race track", inputSchema: { type: "object", properties: {} } }
            ]
          }
        });
      }

      if (method === "tools/call") {
        let executionText = `Successfully executed ${params?.name} with parameters: ${JSON.stringify(params?.arguments || {})}`;
        
        if (params?.name === "get_denim_network_info") {
          executionText = JSON.stringify({
            network: "Base Mainnet",
            chainId: 8453,
            eip155: "eip155:8453",
            upgrade: "Denim",
            activationDate: "2026-11-05T18:00:00Z",
            blockTimeMs: 200,
            architecture: "200ms Native Canonical Blocks",
            flashblocksStatus: "retired",
            pendingTagBehavior: "Resolves directly to latest canonical block",
            rpc: "https://mainnet.base.org",
            ws: "wss://mainnet.base.org"
          }, null, 2);
        } else if (params?.name === "get_block_status") {
          executionText = JSON.stringify({
            network: "Base Mainnet (Denim)",
            blockInterval: "200ms",
            canonical: true,
            preconfirmationsRetired: true,
            status: "producing_canonical_blocks_200ms",
            timestamp: new Date().toISOString()
          }, null, 2);
        }

        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: executionText }]
          }
        });
      }

      if (method === "prompts/list") {
        return res.json({ jsonrpc: "2.0", id, result: { prompts: [] } });
      }

      if (method === "resources/list") {
        return res.json({ jsonrpc: "2.0", id, result: { resources: [] } });
      }

      // Default
      res.json({
        status: "success",
        message: "MCP command received (Base Denim Mainnet)",
        agent: "Base Casin Orchestrator",
        network: "Base Mainnet (Denim 200ms)",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  // Agent API GET
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Base Casin Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Base Casin",
      network: "Base Mainnet",
      chainId: 8453,
      upgrade: "Denim",
      blockTime: "200ms",
      flashblocks: "retired",
      version: "1.0.0"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
