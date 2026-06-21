/**
 * Tiny API client. All calls are same-origin relative URLs; Vite proxies /api
 * to the backend in dev, and in production the frontend is served behind the
 * same host. No API host is ever hardcoded.
 */

async function request(path, options) {
  const res = await fetch(path, options);
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { error: "BAD_RESPONSE", message: text };
  }
  if (!res.ok) {
    const message = body?.message || body?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.code = body?.error;
    throw err;
  }
  return body;
}

export function getHealth() {
  return request("/api/health");
}

export function getScenarios() {
  return request("/api/scenarios");
}

export function postTriage(payload) {
  return request("/api/triage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
