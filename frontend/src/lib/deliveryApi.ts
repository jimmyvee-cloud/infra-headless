import type { DeliveryPage } from "../types/cms";
import { apiOrigin } from "./apiOrigin";

/** Build path-safe URL: `/delivery/pages/a/b` with encoded segments. */
function deliveryPagePath(slug: string): string {
  const trimmed = slug.replace(/^\/+/, "");
  const segments = trimmed === "" ? ["index"] : trimmed.split("/");
  return segments.map(encodeURIComponent).join("/");
}

export async function fetchDeliveryPage(
  tenantId: string,
  slug: string,
  locale: string
): Promise<DeliveryPage> {
  const path = deliveryPagePath(slug);
  const url = new URL(`${apiOrigin}/delivery/pages/${path}`);
  url.searchParams.set("tenant_id", tenantId);
  url.searchParams.set("locale", locale);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(
      `Delivery ${res.status}: ${detail || res.statusText}`
    );
  }
  return res.json() as Promise<DeliveryPage>;
}
