/// <reference types="vite/client" />

declare const __ANNA_TOOL_IDS__: Record<string, string> | undefined;

declare module "/static/anna-apps/_sdk/latest/index.js" {
  export const AnnaAppRuntime: {
    connect: () => Promise<{
      entryPayload?: { brand?: string; phase?: string };
      tools: {
        invoke: (args: { tool_id: string; method: string; args: Record<string, unknown> }) => Promise<{ result?: unknown; ok?: boolean }>;
      };
      storage: {
        get: (args: { key: string }) => Promise<{ value?: unknown }>;
        set: (args: { key: string; value: unknown }) => Promise<void>;
      };
      window: {
        set_title: (args: { title: string }) => Promise<void>;
      };
    }>;
  };
}
