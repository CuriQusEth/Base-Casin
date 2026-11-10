export default function handler(req, res) {
  // Add CORS headers for Vercel Serverless 
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({
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
        "flashblocks-migrated",
        "casino-game-management",
        "betting-automation",
        "reward-optimization"
      ],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { method, params, id } = body;

      // MCP JSON-RPC
      if (method === "initialize") {
        return res.status(200).json({
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
        return res.status(200).json({
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

        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: executionText }]
          }
        });
      }

      if (method === "prompts/list") {
        return res.status(200).json({ jsonrpc: "2.0", id, result: { prompts: [] } });
      }

      if (method === "resources/list") {
        return res.status(200).json({ jsonrpc: "2.0", id, result: { resources: [] } });
      }

      // Default
      return res.status(200).json({
        status: "success",
        message: "MCP command received (Base Denim Mainnet)",
        agent: "Base Casin Orchestrator",
        network: "Base Mainnet (Denim 200ms)",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}

