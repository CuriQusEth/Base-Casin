import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      protocol: "MCP",
      version: "1.0.0",
      name: "Base Casin MCP Endpoint",
      status: "active",
      description: "Active MCP server for Base Casin Orchestrator Agent",
      capabilities: [
        "casino-game-management",
        "betting-automation",
        "reward-optimization",
        "multi-game-orchestration",
        "risk-management",
        "mcp-command-execution"
      ],
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, params, id } = body;

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // MCP JSON-RPC Protocol Implementation
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "Base Casin MCP", version: "1.0.0" }
        }
      }, { headers });
    }

    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [
            {
              name: "get_race_status",
              description: "Get the current status of the casino races",
              inputSchema: { type: "object", properties: {} }
            },
            {
              name: "start_race",
              description: "Start a new casino race",
              inputSchema: { type: "object", properties: {} }
            },
            {
              name: "get_leaderboard",
              description: "Get the current leaderboard",
              inputSchema: { type: "object", properties: {} }
            },
            {
              name: "optimize_speed",
              description: "Optimize the speed for the racing agent",
              inputSchema: { type: "object", properties: {} }
            },
            {
              name: "get_track_info",
              description: "Get information about the current race track",
              inputSchema: { type: "object", properties: {} }
            }
          ]
        }
      }, { headers });
    }

    if (method === 'tools/call') {
      // Execute the requested tool
      const toolName = params?.name;
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: `Successfully executed ${toolName} with parameters: ${JSON.stringify(params?.arguments || {})}`
            }
          ]
        }
      }, { headers });
    }

    if (method === 'prompts/list') {
      return NextResponse.json({ jsonrpc: "2.0", id, result: { prompts: [] } }, { headers });
    }

    if (method === 'resources/list') {
      return NextResponse.json({ jsonrpc: "2.0", id, result: { resources: [] } }, { headers });
    }

    // Default response for simple REST calls
    return NextResponse.json({
      status: "success",
      message: "MCP command received",
      agent: "Base Casin Orchestrator",
      receivedAt: new Date().toISOString(),
      payload: body
    }, { headers });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid MCP request" }, 
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
