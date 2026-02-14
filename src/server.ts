/**
 * MCP Server Implementation
 * Implements the Model Context Protocol for Notion agent
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools, toolDefinitions } from './tools/index.js';
import { config } from './config/index.js';

/**
 * Create and configure the MCP server
 */
export function createMCPServer() {
  const server = new Server(
    {
      name: 'notion-agent-mcp',
      version: '0.1.0-mvp',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  /**
   * Handler for listing available tools
   */
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: toolDefinitions.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  /**
   * Handler for executing tools
   */
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // Find and execute the requested tool
    const toolFunction = tools[name as keyof typeof tools];
    
    if (!toolFunction) {
      throw new Error(`Unknown tool: ${name}`);
    }

    try {
      const result = await toolFunction(args as any);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,

              error: {
                code: 'TOOL_EXECUTION_ERROR',
                message: error.message,
                details: error,
              },
            }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

/**
 * Start the MCP server
 */
export async function startServer() {
  const server = createMCPServer();
  const transport = new StdioServerTransport();
  
  await server.connect(transport);

  console.error('Notion MCP Server running on stdio');
  console.error(`Environment: ${config.nodeEnv}`);
  console.error(`Tools available: ${toolDefinitions.length}`);
}
