/**
 * Create Page Tool
 * Creates a new Notion page with rich content
 */
import type { CreatePageParams, PageResponse, ToolResponse } from '../types/index.js';
/**
 * Creates a new Notion page
 */
export declare function createPage(params: CreatePageParams): Promise<ToolResponse<PageResponse>>;
/**
 * MCP Tool definition for create_page
 */
export declare const createPageToolDefinition: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            title: {
                type: string;
                description: string;
            };
            parentId: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                            enum: string[];
                            description: string;
                        };
                        content: {
                            type: string;
                            description: string;
                        };
                        metadata: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
            properties: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=create-page.d.ts.map