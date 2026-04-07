import { PageRenderer } from "../blocks/PageRenderer";
import { useDeliveryPage } from "../hooks/useDeliveryPage";
import { useHomeLocale } from "../i18n/homeLocale";
import "../styles/dev-services.css";

const TENANT = "infra_guys_website_main";
const HOME_SLUG = "index";

/** Tenant root — same visual system as dev-services marketing template. */
export function HomePage() {
  const { locale } = useHomeLocale();
  const { status, page } = useDeliveryPage(TENANT, HOME_SLUG, locale);

  if (status === "loading" || !page) {
    return (
      <div style={{ fontFamily: "system-ui", padding: "2rem" }}>Loading…</div>
    );
  }

  const meta = {
    slug: page.slug,
    template: page.template,
    status: page.status,
    published_at: page.published_at,
    tenant_id: page.tenant_id,
  };

  return <PageRenderer blocks={page.blocks} locale={locale} page={meta} />;
}
