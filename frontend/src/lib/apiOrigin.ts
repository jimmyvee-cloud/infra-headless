/** Public API base (FastAPI /delivery, /health). */
export const apiOrigin =
  (import.meta.env.VITE_API_ORIGIN as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8800";
