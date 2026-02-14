/**
 * Shared TypeScript types for the Notion MCP server
 */

// MCP Tool Parameter Types
export interface CreatePageParams {
  title: string;
  parentId: string;  // Database ID or Page ID
  content?: PageContent[];
  properties?: Record<string, any>;
}

export interface UpdatePageParams {
  pageId: string;
  properties?: Record<string, any>;
  content?: PageContent[];
}

export interface QueryDatabaseParams {
  databaseId: string;
  filter?: any;
  sorts?: any[];
  limit?: number;
}

export interface SearchParams {
  query: string;
  filter?: {
    property?: string;
    value?: 'page' | 'database';
  };
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'last_edited_time' | 'created_time';
  };
}

export interface AddChartParams {
  pageId: string;
  symbol: string;
  interval?: string;
  chartType?: 'candlestick' | 'line' | 'area';
}

// Page Content Types
export interface PageContent {
  type: 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3' | 'bulleted_list_item' | 'code' | 'embed';
  content: string;
  metadata?: Record<string, any>;
}

// Tool Response Types
export interface ToolResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PageResponse {
  pageId: string;
  url: string;
  title: string;
  createdTime: string;
  lastEditedTime: string;
}

export interface DatabaseQueryResponse {
  results: any[];
  hasMore: boolean;
  nextCursor?: string;
}

// MCP Server Types
export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPResourceDefinition {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

// Logging Types
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface Logger {
  error: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  info: (message: string, meta?: any) => void;
  debug: (message: string, meta?: any) => void;
}
