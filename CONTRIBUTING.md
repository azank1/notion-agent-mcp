# Contributing to Notion Agent MCP

Thank you for your interest in contributing to the Notion Agent MCP server. This document provides guidelines and context for developers getting started with the codebase.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Architecture Overview](#architecture-overview)
4. [Code Organization](#code-organization)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Git Workflow](#git-workflow)
8. [Pull Request Process](#pull-request-process)
9. [Tool Implementation Guide](#tool-implementation-guide)
10. [Common Patterns](#common-patterns)

---

## Getting Started

### For New Developers

Before starting development, please:

1. Read this entire document
2. Review [README.md](README.md) for project overview
3. Check [MVP_COMPONENTS.md](MVP_COMPONENTS.md) for current status
4. Review [METAORCHA_INTEGRATION.md](METAORCHA_INTEGRATION.md) for integration context
5. Provide this CONTRIBUTING.md to Copilot/Claude as context

### Quick Setup

```bash
# Clone repository
git clone https://github.com/azank1/notion-agent-mcp.git
cd notion-agent-mcp

# Checkout develop branch
git checkout develop

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your NOTION_API_KEY to .env

# Build and verify
npm run build
npm test
```

---

## Development Environment

### Required Tools

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **TypeScript**: 5.x (installed via npm)
- **Git**: 2.x or higher
- **Code Editor**: VS Code recommended

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Git Graph
- Thunder Client (for API testing)

### Environment Variables

Create `.env` file with:

```bash
# Required for development
NOTION_API_KEY=secret_xxx

# Optional
PORT=3000
LOG_LEVEL=debug
```

**Security Note**: Never commit `.env` file or expose API keys in code.

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────┐
│  MCP Client (Claude Desktop, etc.)      │
└───────────────┬─────────────────────────┘
                │ MCP Protocol (stdio)
                ▼
┌─────────────────────────────────────────┐
│  MCP Server (src/server.ts)             │
│  - ListTools handler                     │
│  - CallTool handler                      │
│  - Error handling                        │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Tool Registry (src/tools/index.ts)     │
│  - create_page                           │
│  - update_page (planned)                 │
│  - query_database (planned)              │
│  - search (planned)                      │
│  - add_chart (planned)                   │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Notion Client (src/notion/client.ts)   │
└───────────────┬─────────────────────────┘
                │ HTTP/REST
                ▼
┌─────────────────────────────────────────┐
│  Notion API                              │
└─────────────────────────────────────────┘
```

### Key Design Principles

1. **MCP Protocol Compliance**: All tools follow MCP 1.0 specification
2. **Type Safety**: Strict TypeScript mode, comprehensive types
3. **Error Handling**: Structured error responses with codes and messages
4. **Modularity**: Each tool is self-contained in its own file
5. **Testability**: Tools designed for easy unit and integration testing

---

## Code Organization

### Directory Structure

```
src/
├── config/
│   └── index.ts           # Environment configuration with Zod validation
├── notion/
│   └── client.ts          # Notion API client wrapper
├── tools/
│   ├── create-page.ts     # create_page tool implementation
│   ├── update-page.ts     # (to be implemented)
│   ├── query-database.ts  # (to be implemented)
│   ├── search.ts          # (to be implemented)
│   ├── add-chart.ts       # (to be implemented)
│   └── index.ts           # Tool registry and exports
├── types/
│   └── index.ts           # Shared TypeScript types
├── server.ts              # MCP protocol server
└── index.ts               # Entry point

tests/
├── tools/
│   └── create-page.test.ts  # (to be implemented)
└── integration/
    └── notion-api.test.ts   # (to be implemented)
```

### File Naming Conventions

- **TypeScript files**: `kebab-case.ts` (e.g., `create-page.ts`)
- **Test files**: `*.test.ts` (e.g., `create-page.test.ts`)
- **Type definition files**: `index.ts` in types directory
- **Configuration files**: `index.ts` in config directory

---

## Coding Standards

### TypeScript Guidelines

**Use Strict Mode**:
```typescript
// tsconfig.json already enforces strict mode
// All code must compile with no errors
```

**Explicit Types**:
```typescript
// Good
export async function createPage(params: CreatePageParams): Promise<ToolResponse<PageResponse>> {
  // ...
}

// Avoid
export async function createPage(params: any): Promise<any> {
  // ...
}
```

**Error Handling**:
```typescript
// Good - structured error response
try {
  const result = await notionAPI.pages.create(params);
  return { success: true, data: result };
} catch (error: any) {
  return {
    success: false,
    error: {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
    },
  };
}

// Avoid - throwing errors
async function badExample() {
  throw new Error('This breaks MCP protocol');
}
```

**Null Safety**:
```typescript
// Good - check for optional properties
const createdTime = 'created_time' in page ? page.created_time : new Date().toISOString();

// Avoid - direct access to potentially undefined properties
const createdTime = page.created_time; // May be undefined
```

### Code Style

**Formatting**: Prettier is configured, run `npm run format` before committing.

**Imports**:
```typescript
// Order: external, then internal
import { Client } from '@notionhq/client';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

import { config } from './config/index.js';
import { notionAPI } from './notion/client.js';
```

**Comments**:
```typescript
/**
 * Creates a new page in Notion with rich content support.
 * 
 * @param params - Page creation parameters
 * @returns Success response with page data or error response
 */
export async function createPage(params: CreatePageParams): Promise<ToolResponse<PageResponse>> {
  // Implementation
}
```

**Variable Naming**:
- `camelCase` for variables and functions
- `PascalCase` for types and interfaces
- `UPPER_SNAKE_CASE` for constants
- Descriptive names (avoid single letters except in loops)

---

## Testing Guidelines

### Test Structure

```typescript
import { createPage } from '../src/tools/create-page';

describe('createPage', () => {
  describe('parameter validation', () => {
    it('should require title parameter', async () => {
      const result = await createPage({ parentId: 'xxx' } as any);
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('successful creation', () => {
    it('should create page with title and content', async () => {
      const result = await createPage({
        title: 'Test Page',
        parentId: 'database_id',
        content: [{ type: 'paragraph', content: 'Test content' }],
      });
      expect(result.success).toBe(true);
      expect(result.data?.title).toBe('Test Page');
    });
  });

  describe('error handling', () => {
    it('should handle invalid API key', async () => {
      // Test with invalid key
    });
  });
});
```

### Test Requirements

- **Unit tests**: Test each tool in isolation
- **Integration tests**: Test with real Notion API (requires test workspace)
- **Coverage target**: 80% minimum
- **All tests must pass**: Before submitting PR

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests (requires Notion workspace)
npm run test:integration

# Run specific test file
npm test -- create-page.test.ts
```

---

## Git Workflow

### Branch Strategy

```
main                    # Production releases only
  ↑
develop                 # Integration branch
  ↑
mvp/core               # Active MVP development
  ↑
feature/tool-name      # Individual features
```

### Branch Naming

- `feature/tool-name` - New tool implementations
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates
- `test/test-description` - Test additions

### Commit Messages

Follow conventional commits format:

```bash
# Format
<type>(<scope>): <description>

[optional body]

[optional footer]

# Examples
feat(tools): implement update_page tool

- Add parameter validation
- Implement content update logic
- Add error handling
- Update tool registry

Closes #123

fix(server): handle undefined tool parameters

Previously, undefined parameters caused crashes.
Now returns validation error response.

docs(readme): update installation instructions

test(tools): add unit tests for create_page
```

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `perf`

---

## Pull Request Process

### Before Submitting PR

1. **Branch from develop**: `git checkout -b feature/your-feature`
2. **Write tests**: Ensure 80% coverage
3. **Run all checks**:
   ```bash
   npm run build   # Must succeed
   npm test        # All tests pass
   npm run lint    # No lint errors
   ```
4. **Update documentation**: README.md, MVP_COMPONENTS.md if needed
5. **Commit changes**: Follow commit message format

### PR Checklist

- [ ] Code compiles with no TypeScript errors
- [ ] All tests pass
- [ ] Test coverage meets 80% minimum
- [ ] Documentation updated
- [ ] No console.log or debug code left
- [ ] Environment variables documented
- [ ] Error handling implemented
- [ ] Code follows style guidelines

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Test addition

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Tested with Claude Desktop
- [ ] All tests passing

## Checklist
- [ ] Code compiles
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Follows coding standards

## Related Issues
Closes #123
```

### Review Process

1. Submit PR to `develop` branch
2. Automated checks run (build, tests, lint)
3. Code review by maintainer
4. Address feedback
5. Approval and merge

---

## Tool Implementation Guide

### Step-by-Step Process

#### 1. Create Tool File

Create `src/tools/your-tool.ts`:

```typescript
import { notionAPI } from '../notion/client.js';
import { ToolResponse, YourToolParams, YourToolResponse } from '../types/index.js';

/**
 * Description of what this tool does
 * 
 * @param params - Tool parameters
 * @returns Tool response
 */
export async function yourTool(params: YourToolParams): Promise<ToolResponse<YourToolResponse>> {
  try {
    // 1. Validate parameters (if needed beyond schema)
    
    // 2. Make Notion API calls
    const result = await notionAPI.someMethod(params);
    
    // 3. Format response
    const response: YourToolResponse = {
      // Format data
    };
    
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    // 4. Handle errors
    return {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An error occurred',
      },
    };
  }
}

/**
 * MCP Tool definition
 */
export const yourToolDefinition = {
  name: 'your_tool',
  description: 'Clear description of what the tool does',
  inputSchema: {
    type: 'object' as const,
    properties: {
      paramName: {
        type: 'string',
        description: 'Parameter description',
      },
    },
    required: ['paramName'],
  },
};
```

#### 2. Add Types

In `src/types/index.ts`:

```typescript
export interface YourToolParams {
  paramName: string;
  optionalParam?: string;
}

export interface YourToolResponse {
  resultField: string;
  // Other fields
}
```

#### 3. Register Tool

In `src/tools/index.ts`:

```typescript
import { yourTool, yourToolDefinition } from './your-tool.js';

export const tools = {
  create_page: createPage,
  your_tool: yourTool,  // Add here
};

export const toolDefinitions = [
  createPageToolDefinition,
  yourToolDefinition,  // Add here
];
```

#### 4. Write Tests

Create `tests/tools/your-tool.test.ts`:

```typescript
import { yourTool } from '../../src/tools/your-tool';

describe('yourTool', () => {
  it('should execute successfully', async () => {
    const result = await yourTool({ paramName: 'value' });
    expect(result.success).toBe(true);
  });
  
  it('should handle errors', async () => {
    // Test error cases
  });
});
```

#### 5. Update Documentation

Update:
- `README.md` - Add tool to features list
- `MVP_COMPONENTS.md` - Update tool status
- Add usage examples

### Tool Implementation Checklist

- [ ] Tool function implemented with error handling
- [ ] MCP tool definition with JSON schema
- [ ] TypeScript types added
- [ ] Registered in tool registry
- [ ] Unit tests written (80% coverage)
- [ ] Integration tests written
- [ ] Documentation updated
- [ ] Tested with Claude Desktop
- [ ] Error cases handled

---

## Common Patterns

### Pattern 1: Converting Content to Notion Blocks

```typescript
function contentToNotionBlocks(content: ContentBlock[]): any[] {
  return content.map(block => {
    switch (block.type) {
      case 'paragraph':
        return {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: block.content } }],
          },
        };
      // Handle other types
      default:
        throw new Error(`Unknown block type: ${block.type}`);
    }
  });
}
```

### Pattern 2: Error Response Formatting

```typescript
catch (error: any) {
  // Map Notion API errors to our error codes
  const errorCode = error.code === 'unauthorized' 
    ? 'INVALID_API_KEY' 
    : error.code === 'object_not_found'
    ? 'RESOURCE_NOT_FOUND'
    : 'UNKNOWN_ERROR';
    
  return {
    success: false,
    error: {
      code: errorCode,
      message: error.message || 'An error occurred',
    },
  };
}
```

### Pattern 3: Parameter Validation

```typescript
// Schema validation via MCP
// Additional validation in function if needed
export async function yourTool(params: YourToolParams): Promise<ToolResponse> {
  // Validate complex constraints
  if (params.startDate > params.endDate) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'startDate must be before endDate',
      },
    };
  }
  
  // Continue with implementation
}
```

### Pattern 4: Async/Await Best Practices

```typescript
// Good - sequential when order matters
const page = await notionAPI.pages.create(pageParams);
const blocks = await notionAPI.blocks.children.append({
  block_id: page.id,
  children: contentBlocks,
});

// Good - parallel when independent
const [page, database] = await Promise.all([
  notionAPI.pages.retrieve({ page_id: pageId }),
  notionAPI.databases.query({ database_id: dbId }),
]);
```

---

## Development Tips

### Debugging

**Enable Debug Logging**:
```bash
LOG_LEVEL=debug npm start
```

**Test Individual Tool**:
```typescript
// Create test script: scripts/test-tool.ts
import { createPage } from '../src/tools/create-page';

async function test() {
  const result = await createPage({
    title: 'Test Page',
    parentId: 'your_database_id',
    content: [{ type: 'paragraph', content: 'Test' }],
  });
  console.log(JSON.stringify(result, null, 2));
}

test();
```

**Check MCP Protocol**:
```bash
# Send test request to server
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | npm start
```

### Common Issues

**Issue**: TypeScript compilation errors
**Solution**: Run `npm run build` and fix type errors before committing

**Issue**: Tests failing
**Solution**: Ensure `.env` has valid `NOTION_API_KEY`, check Notion workspace access

**Issue**: Claude Desktop not showing tools
**Solution**: Rebuild project (`npm run build`), restart Claude Desktop, check config path

---

## Resources

### Documentation

- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [Notion API Documentation](https://developers.notion.com/reference)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Project Files

- [README.md](README.md) - Project overview
- [MVP_COMPONENTS.md](MVP_COMPONENTS.md) - Development progress tracking
- [METAORCHA_INTEGRATION.md](METAORCHA_INTEGRATION.md) - Integration planning

### Community

- GitHub Issues - Bug reports and feature requests
- GitHub Discussions - Questions and community support

---

## Code of Conduct

### Expectations

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing private information

---

## Questions?

If you have questions or need clarification:

1. Check existing documentation (README, CONTRIBUTING, MVP_COMPONENTS)
2. Search GitHub Issues for similar questions
3. Open a new GitHub Issue with "Question" label
4. Provide this CONTRIBUTING.md to Copilot/Claude for context

---

**Last Updated**: February 14, 2026  
**Maintainer**: azank1  
**Status**: Active Development

Thank you for contributing to Notion Agent MCP!
