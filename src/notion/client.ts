/**
 * Notion API client wrapper
 * Provides a typed interface to the Notion API
 */

import { Client } from '@notionhq/client';
import { config } from '../config/index.js';

// Initialize Notion client
export const notionClient = new Client({
  auth: config.notionApiKey,
});

// Export API methods for easier access
export const notionAPI = {
  pages: notionClient.pages,
  databases: notionClient.databases,
  blocks: notionClient.blocks,
  users: notionClient.users,
  search: notionClient.search,
  comments: notionClient.comments,
};

export default notionClient;
