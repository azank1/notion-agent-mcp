# Notion Agent MCP Server

An MCP (Model Context Protocol) server that enables LLMs to interact with Notion workspaces.

## 🎯 Overview

This is a standalone MCP server that exposes Notion operations as tools that can be called by AI assistants like Claude Desktop, VAPI, or any MCP-compatible client.

**Status**: MVP Development (Branch: `mvp/core`)  
**Version**: 0.1.0-mvp  
**Integration**: Isolated (not yet integrated with MetaOrcha)

## 🚀 Features

### MVP Tools (v0.1.0)

- ✅ **create_page** - Create rich Notion pages with formatted content
- 🔄 **update_page** - Update existing pages (coming soon)
- 🔄 **query_database** - Query Notion databases (coming soon)
- 🔄 **search** - Search across workspace (coming soon)
- 🔄 **add_chart** - Embed TradingView charts (coming soon)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/azank1/notion-agent-mcp.git
cd notion-agent-mcp

# Checkout MVP branch
git checkout mvp/core

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your NOTION_API_KEY
```

## 🔧 Configuration

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

## 🎮 Usage

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

## 🤖 Using with Claude Desktop

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

## 📚 API Documentation

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

## 🏗️ Development

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
├── tests/                    # Test files
├── package.json
├── tsconfig.json
└── README.md
```

### Branch Strategy

- `main` - Production releases only
- `develop` - Integration branch
- `mvp/core` - MVP development (active)
- `feature/*` - Feature branches

### Adding a New Tool

1. Create tool file in `src/tools/your-tool.ts`
2. Implement the tool function
3. Export tool definition (MCP schema)
4. Add to `src/tools/index.ts`
5. Add tests in `tests/unit/tools/`

## 🧪 Testing

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

## 🚀 Deployment

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

## 📋 MVP Completion Checklist

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

## 🔗 Integration with MetaOrcha

**Status**: 🔒 Blocked until MVP complete

This agent is being developed in isolation. Integration with the MetaOrcha orchestration platform will happen after:

1. ✅ All MVP tools implemented
2. ✅ Tests passing
3. ✅ Deployed to Railway
4. ✅ Tested with Claude Desktop
5. ✅ Spec approval

See `INTEGRATION_PLAN.md` for details.

## 📄 License

MIT

## 👤 Author

azank1

## 🐛 Issues

Report issues at: https://github.com/azank1/notion-agent-mcp/issues