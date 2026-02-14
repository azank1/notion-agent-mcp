#!/usr/bin/env node
/**
 * Notion MCP Server - Main Entry Point
 *
 * This is an MCP (Model Context Protocol) server that allows LLMs to interact with Notion.
 * It exposes tools for creating, updating, querying, and searching Notion pages and databases.
 *
 * Usage:
 *   - Standalone: node dist/index.js
 *   - With Claude Desktop: Configure in claude_desktop_config.json
 *   - With other MCP clients: Use stdio transport
 */
import { startServer } from './server.js';
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Start the server
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map