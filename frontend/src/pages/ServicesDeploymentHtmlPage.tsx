import { PageRenderer } from "../blocks/PageRenderer";
import { useDeliveryPage } from "../hooks/useDeliveryPage";
import { useDevServicesLocale } from "../i18n/devServicesLocale";
import "../styles/dev-services.css";

const TENANT = "infra_guys_website_main";
const SLUG = "services/deployment.html";

/** Deployment & delivery — reuses dev-services marketing blocks; copy from deployment-translations. */
export function ServicesDeploymentHtmlPage() {
  const { locale } = useDevServicesLocale();
  const { status, page } = useDeliveryPage(TENANT, SLUG, locale);

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

  return (
    <PageRenderer blocks={page.blocks} locale={locale} page={meta} />
  );
}
