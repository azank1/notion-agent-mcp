/**
 * Tools index
 * Exports all MCP tools and their definitions
 */
import { createPage, createPageToolDefinition } from './create-page.js';
// Export all tool functions
export const tools = {
    create_page: createPage,
    // Additional tools will be added here:
    // update_page,
    // query_database,
    // search,
    // add_chart,
};
// Export all tool definitions
export const toolDefinitions = [
    createPageToolDefinition,
    // Additional tool definitions will be added here
];
// Export individual tools
export { createPage };
//# sourceMappingURL=index.js.map