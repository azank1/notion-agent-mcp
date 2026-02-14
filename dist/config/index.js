/**
 * Application configuration
 * Loads environment variables and provides typed config
 */
import { config as loadEnv } from 'dotenv';
import { z } from 'zod';
// Load environment variables
loadEnv();
// Configuration schema
const configSchema = z.object({
    // Notion API
    notionApiKey: z.string().min(1, 'NOTION_API_KEY is required'),
    // Server
    port: z.coerce.number().default(3003),
    nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
    logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    // Optional APIs
    tavilyApiKey: z.string().optional(),
    openRouterApiKey: z.string().optional(),
    tradingViewApiKey: z.string().optional(),
    // Optional OAuth
    googleOAuthClientId: z.string().optional(),
    googleOAuthClientSecret: z.string().optional(),
});
// Parse and validate configuration
export const config = configSchema.parse({
    notionApiKey: process.env.NOTION_API_KEY,
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    logLevel: process.env.LOG_LEVEL,
    tavilyApiKey: process.env.TAVILY_API_KEY,
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    tradingViewApiKey: process.env.TRADINGVIEW_API_KEY,
    googleOAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleOAuthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
});
//# sourceMappingURL=index.js.map