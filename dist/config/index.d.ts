/**
 * Application configuration
 * Loads environment variables and provides typed config
 */
import { z } from 'zod';
declare const configSchema: z.ZodObject<{
    notionApiKey: z.ZodString;
    port: z.ZodDefault<z.ZodNumber>;
    nodeEnv: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    logLevel: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug"]>>;
    tavilyApiKey: z.ZodOptional<z.ZodString>;
    openRouterApiKey: z.ZodOptional<z.ZodString>;
    tradingViewApiKey: z.ZodOptional<z.ZodString>;
    googleOAuthClientId: z.ZodOptional<z.ZodString>;
    googleOAuthClientSecret: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notionApiKey: string;
    port: number;
    nodeEnv: "development" | "production" | "test";
    logLevel: "error" | "warn" | "info" | "debug";
    tavilyApiKey?: string | undefined;
    openRouterApiKey?: string | undefined;
    tradingViewApiKey?: string | undefined;
    googleOAuthClientId?: string | undefined;
    googleOAuthClientSecret?: string | undefined;
}, {
    notionApiKey: string;
    port?: number | undefined;
    nodeEnv?: "development" | "production" | "test" | undefined;
    logLevel?: "error" | "warn" | "info" | "debug" | undefined;
    tavilyApiKey?: string | undefined;
    openRouterApiKey?: string | undefined;
    tradingViewApiKey?: string | undefined;
    googleOAuthClientId?: string | undefined;
    googleOAuthClientSecret?: string | undefined;
}>;
export declare const config: {
    notionApiKey: string;
    port: number;
    nodeEnv: "development" | "production" | "test";
    logLevel: "error" | "warn" | "info" | "debug";
    tavilyApiKey?: string | undefined;
    openRouterApiKey?: string | undefined;
    tradingViewApiKey?: string | undefined;
    googleOAuthClientId?: string | undefined;
    googleOAuthClientSecret?: string | undefined;
};
export type Config = z.infer<typeof configSchema>;
export {};
//# sourceMappingURL=index.d.ts.map