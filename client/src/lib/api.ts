// src/lib/api.ts
export type TokenGetter = () => string | null;

let getAccessToken: TokenGetter = () => null;
export const __setAccessTokenGetter = (fn: TokenGetter) => {
  getAccessToken = fn;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";
console.log("process.env.NEXT_PUBLIC_API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
console.log("process.env.NEXT_PUBLIC_API_BASE:", process.env.NEXT_PUBLIC_API_BASE);
console.log("API_BASE:", API_BASE); // Debug log
if (!process.env.NEXT_PUBLIC_API_BASE_URL && !process.env.NEXT_PUBLIC_API_BASE) {
  // Optional: warn early in dev if env is missing  // eslint-disable-next-line no-console
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set, using default: http://localhost:3000");
}

/**
 * Smart fetch:
 * - attaches Bearer token (from AuthContext)
 * - sends cookies (for refresh)
 * - on 401, calls /api/auth/refresh, then retries once
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  async function doFetch(retry = false): Promise<T> {
    // Build headers fresh each attempt so we pick up a newly refreshed token.
    const headers = new Headers(init.headers || {});
    headers.set("Content-Type", "application/json");
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const fullUrl = `${API_BASE}${path}`;
    console.log("Making request to:", fullUrl);
    const res = await fetch(fullUrl, {
      ...init,
      headers,
      credentials: "include", // include refresh cookie
    });

    if (res.status === 401 && !retry) {
      // Try refresh once
      const r = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (r.ok) {
        // If your backend returns the new access token in JSON (dev),
        // broadcast it so AuthContext can update.
        const data = await r.json().catch(() => ({} as unknown));
        if (data?.token && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("token:refreshed", { detail: data.token })
          );
        }
        // Retry original request once, with a fresh Authorization header.
        return doFetch(true);
      }

      // If refresh failed, surface 401 cleanly
      const txt = await res.text().catch(() => "");
      throw new Error(txt || "Unauthorized");
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || `HTTP ${res.status}`);
    }

    // Successful JSON response
    return (await res.json()) as T;
  }

  return doFetch(false);
}
