import { runTool } from "./engine";

/** Bundled handle from app.json#bundled_executas. Publish maps this to a minted tool_id. */
export const EXECUTA_HANDLE = "cubiczan-chp";

/** Local/dev placeholder from executa.json. Never a minted platform id. */
export const DEV_FALLBACK_TOOL_ID = "tool-dev-servicesell-finbridge";

export const TOOL_ID =
  (typeof window !== "undefined" &&
    (window as unknown as { __ANNA_TOOL_IDS__?: Record<string, string> }).__ANNA_TOOL_IDS__?.[
      EXECUTA_HANDLE
    ]) ||
  DEV_FALLBACK_TOOL_ID;

export type HostKind = "anna" | "standalone";

export type Host = {
  kind: HostKind;
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
};

type AnnaRuntime = {
  entryPayload?: { brand?: string; phase?: string };
  tools: Host["tools"];
  storage: Host["storage"];
  window: Host["window"];
};

export async function connectHost(): Promise<Host> {
  try {
    const sdkHref = "/static/anna-apps/_sdk/latest/index.js";
    const mod = (await import(/* @vite-ignore */ sdkHref)) as {
      AnnaAppRuntime: { connect: () => Promise<AnnaRuntime> };
    };
    const anna = await mod.AnnaAppRuntime.connect();
    return {
      kind: "anna",
      entryPayload: anna.entryPayload,
      tools: anna.tools,
      storage: anna.storage,
      window: anna.window,
    };
  } catch {
    return createStandaloneHost();
  }
}

function createStandaloneHost(): Host {
  const memory = new Map<string, unknown>();
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem("ssfb:store");
      if (raw) {
        for (const [key, value] of Object.entries(JSON.parse(raw) as Record<string, unknown>)) {
          memory.set(key, value);
        }
      }
    } catch {
      /* ignore corrupt local store */
    }
  }
  const persist = () => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("ssfb:store", JSON.stringify(Object.fromEntries(memory)));
  };
  return {
    kind: "standalone",
    tools: {
      async invoke({ method, args }) {
        return { ok: true, result: { success: true, data: runTool(method, args) } };
      },
    },
    storage: {
      async get({ key }) {
        return { value: memory.get(key) };
      },
      async set({ key, value }) {
        memory.set(key, value);
        persist();
      },
    },
    window: {
      async set_title({ title }) {
        if (typeof document !== "undefined") document.title = title;
      },
    },
  };
}

export function unwrapTool(out: { result?: unknown }): unknown {
  const result = out.result as { data?: unknown; result?: unknown } | undefined;
  if (result && typeof result === "object" && "data" in result && result.data !== undefined) {
    return result.data;
  }
  return result ?? out;
}
