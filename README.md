# Notion Agent MCP Server

Model Context Protocol (MCP) server for Notion workspace integration.

## Overview

Standalone MCP server that enables AI assistants (Claude Desktop, VAPI, etc.) to interact with Notion workspaces through structured tool calls.

**Status**: MVP Development  
**Version**: 0.1.0-mvp  
**Integration**: Isolated (not yet integrated with MetaOrcha platform)

## Features

### Implemented Tools

- **create_page** - Create Notion pages with rich formatted content

### Planned Tools

- **update_page** - Update existing page content and properties
- **query_database** - Query Notion databases with filters and sorting
- **search** - Search across workspace for pages and databases
- **add_chart** - Embed TradingView charts in pages

## Installation

```bash
# Clone repository
git clone https://github.com/azank1/notion-agent-mcp.git
cd notion-agent-mcp

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your NOTION_API_KEY

# Build project
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file:

```env
# Required
NOTION_API_KEY=secret_your_notion_integration_key

# Optional
PORT=3003
NODE_ENV=development
LOG_LEVEL=info
```

### Getting a Notion API Key

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Name it "MCP Agent" and select your workspace
4. Copy the "Internal Integration Token"
5. Share your database/page with the integration

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Integration tests (requires real Notion workspace)
npm run test:integration
```

## Using with Claude Desktop

1. Build the project:
   ```bash
   npm run build
   ```

2. Edit Claude Desktop config:
   
   **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
   **Linux**: `~/.config/Claude/claude_desktop_config.json`  
   **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

3. Add the MCP server:
   ```json
   {
     "mcpServers": {
       "notion-research": {
         "command": "node",
         "args": ["/path/to/notion-agent-mcp/dist/index.js"],
         "env": {
           "NOTION_API_KEY": "secret_your_notion_api_key"
         }
       }
     }
   }
   ```

4. Restart Claude Desktop

5. Test it:
   ```
   "Create a research note about Bitcoin in my Notion workspace"
   ```

## API Documentation

### create_page

Creates a new Notion page with rich content.

**Parameters**:
- `title` (string, required): Page title
- `parentId` (string, required): Parent database or page ID
- `content` (array, optional): Content blocks
- `properties` (object, optional): Additional Notion properties

**Example**:
```typescript
{
  "title": "Research Note: Bitcoin",
  "parentId": "your-database-id-here",
  "content": [
    {
      "type": "heading_1",
      "content": "Overview"
    },
    {
      "type": "paragraph",
      "content": "Bitcoin is a decentralized cryptocurrency..."
    },
    {
      "type": "bulleted_list_item",
      "content": "Launched in 2009"
    }
  ]
}
```

## Development

### Project Structure

```
notion-agent-mcp/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # MCP server implementation
│   ├── config/               # Configuration
│   ├── types/                # TypeScript types
│   ├── notion/               # Notion API client
│   └── tools/                # MCP tools
│       ├── create-page.ts
│       └── index.ts
├── tests/                    # Test files (planned)
├── package.json
├── tsconfig.json
└── README.md
```

### Branch Strategy

Single-branch development on `main` for MVP phase. Feature branches will be created as needed, aligned with metaorcha-control and metaorcha-emerge repository workflows.

### Adding a New Tool

1. Create tool file in `src/tools/your-tool.ts`
2. Implement the tool function
3. Export tool definition (MCP schema)
4. Add to `src/tools/index.ts`
5. Add tests in `tests/unit/tools/`

## Testing

### Unit Tests

Test individual tools without hitting Notion API:

```bash
npm test -- create-page.test.ts
```

### Integration Tests

Test with real Notion workspace:

```bash
# Set up test database
export TEST_NOTION_DATABASE_ID=your-test-db-id

# Run integration tests
npm run test:integration
```

## Deployment

### Railway (Recommended for MVP)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and init
railway login
railway init

# Set environment variables in Railway dashboard
# Deploy
railway up
```

## MVP Status

- [x] Project setup and TypeScript configuration
- [x] MCP protocol implementation
- [x] Notion API client
- [x] create_page tool
- [ ] update_page tool
- [ ] query_database tool
- [ ] search tool
- [ ] add_chart tool
- [ ] Unit tests (80% coverage)
- [ ] Integration tests
- [ ] Claude Desktop testing
- [ ] Railway deployment
- [ ] Performance benchmarks

## Integration with MetaOrcha

**Status**: Blocked until MVP complete

This agent is being developed in isolation. Integration with MetaOrcha orchestration platform will happen after MVP validation and spec approval.

See [METAORCHA_INTEGRATION.md](METAORCHA_INTEGRATION.md) for details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT

## Issues

Report issues at: https://github.com/azank1/notion-agent-mcp/issues