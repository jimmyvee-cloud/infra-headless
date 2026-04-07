import type { DeliveryPage } from "../types/cms";
import { getHomePage } from "../data/homePageDelivery";
import { getDeliveryPage as getBundledDevServicesPage } from "../data/servicesDevServicesDelivery";
import { apiOrigin } from "./apiOrigin";
import { getStaticDeliveryPage } from "./staticDeliveryPages";

const FETCH_TIMEOUT_MS = 12_000;

/** Bundled marketing pages — used when API is down, wrong, or unreachable so the site still renders. */
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
  const bundled = (): DeliveryPage | null =>
    getBundledDeliveryPage(tenantId, slug, locale);

  if (import.meta.env.VITE_STATIC_DELIVERY === "true") {
    const page = bundled();
    if (page) return page;
    throw new Error(
      `Offline mode (VITE_STATIC_DELIVERY): no bundled page for slug "${slug}"`
    );
  }

  const path = deliveryPagePath(slug);
  const url = new URL(`${apiOrigin}/delivery/pages/${path}`);
  url.searchParams.set("tenant_id", tenantId);
  url.searchParams.set("locale", locale);

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url.toString(), { signal: ctrl.signal });
    clearTimeout(timer);

    if (res.ok) {
      const page = (await res.json()) as DeliveryPage;
      if (!Array.isArray(page.blocks)) {
        const fb = bundled();
        if (fb) return fb;
      }
      return page;
    }

    const fallback = bundled();
    if (fallback) return fallback;

    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`Delivery ${res.status}: ${detail || res.statusText}`);
  } catch (e) {
    const fallback = bundled();
    if (fallback) return fallback;

    if (e instanceof Error) throw e;
    throw new Error(String(e));
  }
}
