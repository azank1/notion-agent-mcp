# Notion Agent MCP

**Model Context Protocol (MCP) server for Notion integration**

A standalone TypeScript-based MCP server that enables AI assistants to interact with Notion workspaces. Built for seamless integration with Claude Desktop, MetaOrcha platform, and other MCP-compatible clients.

---

## Overview

This server implements the Model Context Protocol to provide AI assistants with structured access to Notion's API. It enables creating pages, querying databases, searching content, and embedding rich media within Notion workspaces.

**Development Status**: MVP in progress (1/5 tools complete)

**Repository**: [azank1/notion-agent-mcp](https://github.com/azank1/notion-agent-mcp)

**Branch Strategy**: `main` → `develop` → `mvp/core` (active development)

---

## Features

### Implemented Tools

- **create_page**: Create Notion pages with rich content (headings, paragraphs, lists, code blocks, embeds)

### Planned Tools

- **update_page**: Modify existing page content and properties
- **query_database**: Query Notion databases with filters and sorting
- **search**: Search across workspace for pages and databases
- **add_chart**: Embed TradingView charts in pages

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Notion API key ([create integration](https://www.notion.so/my-integrations))

### Installation

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

# Run server
npm start
```

---

## Configuration

### Environment Variables

Create a `.env` file with the following:

```bash
# Required
NOTION_API_KEY=secret_xxx  # Your Notion integration token

# Optional
PORT=3000                   # Server port (default: 3000)
LOG_LEVEL=info             # Logging level: debug, info, warn, error
```

### Notion Workspace Setup

1. Create a [Notion integration](https://www.notion.so/my-integrations)
2. Grant integration access to target pages/databases
3. Copy the integration token to `NOTION_API_KEY`

---

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "notion-agent": {
      "command": "node",
      "args": ["/path/to/notion-agent-mcp/dist/index.js"],
      "env": {
        "NOTION_API_KEY": "secret_xxx"
      }
    }
  }
}
```

Restart Claude Desktop and use conversational commands:

```
"Create a research page about Bitcoin in my Notion workspace"
"Search for pages related to AI in Notion"
"Add a BTC/USD chart to my trading notes page"
```

### With MetaOrcha Platform

Integration with MetaOrcha Gateway is planned but not yet implemented. See [METAORCHA_INTEGRATION.md](METAORCHA_INTEGRATION.md) for details.

### Standalone Testing

```bash
# Start server
npm start

# Server runs on stdio by default
# Send MCP protocol messages via stdin
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | npm start
```

---

## API Documentation

### create_page

Creates a new Notion page with rich content support.

**Parameters**:
- `title` (string, required): Page title
- `parentId` (string, required): Parent database or page ID
- `content` (array, optional): Array of content blocks
- `properties` (object, optional): Notion properties for database pages

**Content Block Types**:
- `paragraph`: Regular text
- `heading_1`, `heading_2`, `heading_3`: Headings
- `bulleted_list_item`: Bullet points
- `code`: Code blocks (with optional language metadata)
- `embed`: Embedded content (URLs)

**Example**:

```typescript
{
  "title": "Research Notes: Bitcoin",
  "parentId": "database_id_here",
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
      "type": "code",
      "content": "const btcPrice = await fetchPrice('BTC');",
      "metadata": { "language": "javascript" }
    }
  ]
}
```

**Response**:

```typescript
{
  "success": true,
  "data": {
    "pageId": "page_id_here",
    "url": "https://notion.so/...",
    "title": "Research Notes: Bitcoin",
    "createdTime": "2026-02-14T08:00:00.000Z",
    "lastEditedTime": "2026-02-14T08:00:00.000Z"
  }
}
```

---

## Development

### Project Structure

```
notion-agent-mcp/
├── src/
│   ├── config/          # Environment configuration
│   ├── notion/          # Notion API client wrapper
│   ├── tools/           # MCP tool implementations
│   ├── types/           # TypeScript type definitions
│   ├── server.ts        # MCP protocol server
│   └── index.ts         # Entry point
├── tests/               # Test files (to be implemented)
├── dist/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

### Development Workflow

```bash
# Install dependencies
npm install

# Run in development mode (auto-reload)
npm run dev

# Build project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Adding a New Tool

1. Create tool file in `src/tools/your-tool.ts`
2. Implement tool function with proper error handling
3. Export MCP tool definition with JSON schema
4. Add to `src/tools/index.ts` exports
5. Write unit tests in `tests/tools/your-tool.test.ts`
6. Update documentation

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
# Requires real Notion workspace
NOTION_API_KEY=secret_xxx npm run test:integration
```

### Testing with Claude Desktop

1. Build and configure Claude Desktop (see Usage section)
2. Start Claude Desktop
3. Use conversational commands to test tools
4. Check logs for errors

**Current Test Coverage**: 0% (tests not yet implemented)

**Target Coverage**: 80%

---

## Deployment

### Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# Set environment variables
railway variables set NOTION_API_KEY=secret_xxx
```

### Docker

```bash
# Build image
docker build -t notion-agent-mcp .

# Run container
docker run -e NOTION_API_KEY=secret_xxx notion-agent-mcp
```

### Environment Setup

Production deployments should use:
- `LOG_LEVEL=info`
- Secure secret management (Railway secrets, AWS Secrets Manager, etc.)
- Health check endpoint (planned)
- Monitoring and alerting

---

## Architecture

### MCP Protocol Flow

```
Client (Claude/MetaOrcha)
    ↓ (MCP requests via stdio/HTTP)
MCP Server (this project)
    ↓ (HTTP/REST)
Notion API
```

### Tool Execution

1. Client sends `tools/call` request with tool name and parameters
2. Server validates parameters against JSON schema
3. Server executes tool logic (Notion API calls)
4. Server returns structured response (success/error)

### Error Handling

All tools return standardized responses:

```typescript
// Success
{ success: true, data: {...} }

// Error
{ 
  success: false, 
  error: { 
    code: "INVALID_API_KEY", 
    message: "Notion API key is invalid" 
  } 
}
```

---

## Troubleshooting

### "Notion API key is invalid"

- Verify `NOTION_API_KEY` in `.env` file
- Check integration has access to target pages
- Ensure API key starts with `secret_`

### "Parent database/page not found"

- Verify parent ID is correct (32-character string)
- Ensure integration has access to parent resource
- Check if parent is a database (use database_id) or page (use page_id)

### Claude Desktop not showing tools

- Restart Claude Desktop after config changes
- Check config file path is correct
- Verify `dist/index.js` exists (run `npm run build`)
- Check Claude Desktop logs for errors

### Build errors

```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

---

## Roadmap

### MVP Phase (Current)

- [x] MCP protocol server implementation
- [x] create_page tool
- [ ] update_page tool
- [ ] query_database tool
- [ ] search tool
- [ ] add_chart tool
- [ ] Unit tests (80% coverage)
- [ ] Integration tests
- [ ] Claude Desktop testing

### Integration Phase

- [ ] Deploy to Railway
- [ ] MetaOrcha Gateway integration
- [ ] Performance optimization
- [ ] Monitoring and logging

### Future Enhancements

- [ ] Additional Notion tools (comments, databases)
- [ ] Caching layer
- [ ] Rate limiting
- [ ] Webhooks support
- [ ] Multi-workspace support

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Checklist

1. Fork repository and create feature branch
2. Follow existing code style (TypeScript strict mode)
3. Add tests for new features
4. Update documentation
5. Submit pull request to `develop` branch

---

## License

MIT License - See LICENSE file for details

---

## Support

- **Issues**: [GitHub Issues](https://github.com/azank1/notion-agent-mcp/issues)
- **Documentation**: See docs in this repository
- **Community**: Discussions tab on GitHub

---

## Acknowledgments

- Built with [Model Context Protocol SDK](https://github.com/modelcontextprotocol)
- Powered by [Notion API](https://developers.notion.com)
- Designed for [Claude Desktop](https://claude.ai/desktop)

---

**Last Updated**: February 14, 2026  
**Version**: 0.1.0-mvp  
**Status**: Active Development