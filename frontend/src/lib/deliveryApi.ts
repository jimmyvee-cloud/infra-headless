import type { DeliveryPage } from "../types/cms";
import { getHomePage } from "../data/homePageDelivery";
import { getDeliveryPage as getBundledDevServicesPage } from "../data/servicesDevServicesDelivery";
import { apiOrigin } from "./apiOrigin";
import { getStaticDeliveryPage } from "./staticDeliveryPages";

const FETCH_TIMEOUT_MS = 12_000;

function getBundledDeliveryPage(
  tenantId: string,
  slug: string,
  locale: string
): DeliveryPage | null {
  if (tenantId !== "infra_guys_website_main") return null;
  const s = slug.replace(/^\/+/, "");
  if (s === "" || s === "index") return getHomePage(tenantId, locale);
  if (s === "services/dev-services.html") {
    return getBundledDevServicesPage(tenantId, slug, locale);
  }
  return getStaticDeliveryPage(tenantId, slug);
}

/** Always returns a renderable page — bundled slug, else company home (never throws). */
export function getGuaranteedDeliveryPage(
  tenantId: string,
  slug: string,
  locale: string
): DeliveryPage {
  try {
    return (
      getBundledDeliveryPage(tenantId, slug, locale) ??
      getHomePage("infra_guys_website_main", locale)
    );
  } catch {
    return getHomePage("infra_guys_website_main", locale);
  }
}

function deliveryPagePath(slug: string): string {
  const trimmed = slug.replace(/^\/+/, "");
  const segments = trimmed === "" ? ["index"] : trimmed.split("/");
  return segments.map(encodeURIComponent).join("/");
}

/**
 * Prefer live API/Dynamo; on any failure, same bundled content as local dev.
 * Never rejects — callers always get HTML blocks to render.
 */
export async function fetchDeliveryPage(
  tenantId: string,
  slug: string,
  locale: string
): Promise<DeliveryPage> {
  const guaranteed = () => getGuaranteedDeliveryPage(tenantId, slug, locale);

  if (import.meta.env.VITE_STATIC_DELIVERY === "true") {
    return guaranteed();
  }

  try {
    const path = deliveryPagePath(slug);
    const url = new URL(`${apiOrigin}/delivery/pages/${path}`);
    url.searchParams.set("tenant_id", tenantId);
    url.searchParams.set("locale", locale);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url.toString(), { signal: ctrl.signal });
    clearTimeout(timer);

    if (res.ok) {
      try {
        const page = (await res.json()) as DeliveryPage;
        if (Array.isArray(page.blocks)) {
          return page;
        }
      } catch {
        /* non-JSON or parse error */
      }
    }
  } catch {
    /* network, CORS, timeout, etc. */
  }

  return guaranteed();
}
