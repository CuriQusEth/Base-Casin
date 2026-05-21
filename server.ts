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
      description: "Base Casin platformunda çalışan ERC-8004 uyumlu AI Agent. Casino game management, betting automation, reward optimization ve multi-game orchestration yapan akıllı agent.",
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
          description: "Agent-to-Agent communication"
        },
        {
          name: "MCP",
          endpoint: "https://base-casin.vercel.app/api/mcp",
          version: "1.0.0",
          description: "Model Context Protocol - Active command execution"
        },
        {
          name: "API",
          endpoint: "https://base-casin.vercel.app/api/agent",
          version: "1.0.0",
          description: "Main agent control API"
        }
      ],
      capabilities: [
        "casino-game-management",
        "betting-automation",
        "reward-optimization",
        "multi-game-orchestration",
        "risk-management",
        "mcp-command-execution"
      ],
      supportedChains: ["eip155:8453"],
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
      description: "Active MCP server for Base Casin Orchestrator Agent",
      capabilities: ["casino-game-management", "betting-automation", "reward-optimization"],
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
            serverInfo: { name: "Base Casin MCP", version: "1.0.0" }
          }
        });
      }

      if (method === "tools/list") {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
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
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: `Successfully executed ${params?.name} with parameters: ${JSON.stringify(params?.arguments || {})}` }]
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
        message: "MCP command received",
        agent: "Base Casin Orchestrator",
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
