/** Public API base (FastAPI `/delivery`, `/health`). */
function resolveApiOrigin(): string {
  const fromEnv = (import.meta.env.VITE_API_ORIGIN as string | undefined)?.replace(
    /\/$/,
    ""
  );
  if (fromEnv) return fromEnv;

  if (import.meta.env.DEV) {
    return "http://localhost:8800";
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "https://www.infra-guys.com";
}

export const apiOrigin = resolveApiOrigin();
