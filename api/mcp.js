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
      description: "Active MCP server for Base Casin Orchestrator Agent",
      capabilities: ["casino-game-management", "betting-automation", "reward-optimization"],
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
            serverInfo: { name: "Base Casin MCP", version: "1.0.0" }
          }
        });
      }

      if (method === "tools/list") {
        return res.status(200).json({
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
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: `Successfully executed ${params?.name} with parameters: ${JSON.stringify(params?.arguments || {})}` }]
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
        message: "MCP command received",
        agent: "Base Casin Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
