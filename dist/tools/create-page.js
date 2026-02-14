/**
 * Create Page Tool
 * Creates a new Notion page with rich content
 */
import { notionAPI } from '../notion/client.js';
/**
 * Converts simple content format to Notion blocks
 */
function contentToBlocks(content) {
    return content.map((item) => {
        switch (item.type) {
            case 'heading_1':
                return {
                    object: 'block',
                    type: 'heading_1',
                    heading_1: {
                        rich_text: [{ type: 'text', text: { content: item.content } }],
                    },
                };
            case 'heading_2':
                return {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                        rich_text: [{ type: 'text', text: { content: item.content } }],
                    },
                };
            case 'heading_3':
                return {
                    object: 'block',
                    type: 'heading_3',
                    heading_3: {
                        rich_text: [{ type: 'text', text: { content: item.content } }],
                    },
                };
            case 'bulleted_list_item':
                return {
                    object: 'block',
                    type: 'bulleted_list_item',
                    bulleted_list_item: {
                        rich_text: [{ type: 'text', text: { content: item.content } }],
                    },
                };
            case 'code':
                return {
                    object: 'block',
                    type: 'code',
                    code: {
                        rich_text: [{ type: 'text', text: { content: item.content } }],
                        language: item.metadata?.language || 'plain text',
                    },
                };
            case 'embed':
                return {
                    object: 'block',
                    type: 'embed',
                    embed: {
                        url: item.content,
                    },
                };
            case 'paragraph':
            default:
                return {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [{ type: 'text', text: { content: item.content } }],
                    },
                };
        }
    });
}
/**
 * Creates a new Notion page
 */
export async function createPage(params) {
    try {
        // Determine parent type
        const parent = params.parentId.includes('-')
            ? { page_id: params.parentId }
            : { database_id: params.parentId };
        // Create the page
        const page = await notionAPI.pages.create({
            parent,
            properties: params.properties || {
                title: {
                    title: [
                        {
                            text: {
                                content: params.title,
                            },
                        },
                    ],
                },
            },
        });
        // Add content if provided
        if (params.content && params.content.length > 0) {
            const blocks = contentToBlocks(params.content);
            await notionAPI.blocks.children.append({
                block_id: page.id,
                children: blocks,
            });
        }
        // Build response
        const response = {
            pageId: page.id,
            url: page.url,
            title: params.title,
            createdTime: 'created_time' in page ? page.created_time : new Date().toISOString(),
            lastEditedTime: 'last_edited_time' in page ? page.last_edited_time : new Date().toISOString(),
        };
        return {
            success: true,
            data: response,
        };
    }
    catch (error) {
        return {
            success: false,
            error: {
                code: error.code || 'UNKNOWN_ERROR',
                message: error.message || 'Failed to create page',
                details: error,
            },
        };
    }
}
/**
 * MCP Tool definition for create_page
 */
export const createPageToolDefinition = {
    name: 'create_page',
    description: 'Creates a new page in Notion with rich content support. Can create pages in databases or as child pages.',
    inputSchema: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                description: 'The title of the page',
            },
            parentId: {
                type: 'string',
                description: 'The parent database ID or page ID (32-character string)',
            },
            content: {
                type: 'array',
                description: 'Array of content blocks to add to the page',
                items: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            enum: ['paragraph', 'heading_1', 'heading_2', 'heading_3', 'bulleted_list_item', 'code', 'embed'],
                            description: 'The type of content block',
                        },
                        content: {
                            type: 'string',
                            description: 'The content text or URL (for embeds)',
                        },
                        metadata: {
                            type: 'object',
                            description: 'Optional metadata (e.g., language for code blocks)',
                        },
                    },
                    required: ['type', 'content'],
                },
            },
            properties: {
                type: 'object',
                description: 'Additional Notion properties (for database pages)',
            },
        },
        required: ['title', 'parentId'],
    },
};
//# sourceMappingURL=create-page.js.map