"use client";

const TOKEN_KEY = "kintoun_admin_token";

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch { /* ignore */ }
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch { /* ignore */ }
}

let patched = false;

/** Pastikan semua fetch ke API admin membawa token + cookie (berfungsi di iframe preview). */
export function patchAdminFetch() {
  if (patched || typeof window === "undefined") return;
  patched = true;
  const orig = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
    const isAdminApi = /\/api\/(admin|auth\/me|auth\/logout)/.test(url);
    if (!isAdminApi) return orig(input, init);
    const headers = new Headers(init?.headers);
    const token = getAdminToken();
    if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
    return orig(input, { ...init, credentials: "include", headers });
  };
}
