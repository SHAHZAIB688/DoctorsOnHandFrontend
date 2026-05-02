/**
 * Socket.io connects to the API origin without the /api suffix.
 */
export function getSocketBaseUrl() {
  const api =
    import.meta.env.VITE_API_URL ||
    `${typeof window !== "undefined" ? window.location.protocol : "http:"}//${typeof window !== "undefined" ? window.location.hostname : "localhost"}:5000/api`;

  const trimmed = api.replace(/\/$/, "");
  if (trimmed.endsWith("/api")) {
    const base = trimmed.slice(0, -4);
    return base || (typeof window !== "undefined" ? window.location.origin : "http://localhost:5000");
  }
  try {
    const u = new URL(trimmed);
    return `${u.protocol}//${u.host}`;
  } catch {
    return typeof window !== "undefined" ? window.location.origin : "http://localhost:5000";
  }
}
