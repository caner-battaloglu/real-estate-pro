// src/lib/api.ts
type ApiResult<T> = { data: T | null; error: string | null };

// Prefer NEXT_PUBLIC_ (works in both Server/Client components). Fallback to server-only if you ever add it.
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? "";

function buildUrl(path: string) {
  if (!BASE) throw new Error("API base URL missing. Set NEXT_PUBLIC_API_BASE_URL in .env.local");
  // Allow callers to pass "/properties?x=1" or "properties?x=1"
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return new URL(normalized, BASE.endsWith("/") ? BASE : BASE + "/").toString();
}

export async function get<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const url = buildUrl(path);
    const res = await fetch(url, { ...init, cache: "no-store" });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { data: null, error: text || `HTTP ${res.status}` };
    }
    const json = (await res.json()) as T;
    return { data: json, error: null };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Network error";
    return { data: null, error: message };
  }
}
