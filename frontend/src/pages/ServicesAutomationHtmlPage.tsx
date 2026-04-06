import { PageRenderer } from "../blocks/PageRenderer";
import { useDeliveryPage } from "../hooks/useDeliveryPage";
import { useDevServicesLocale } from "../i18n/devServicesLocale";
import "../styles/dev-services.css";

const TENANT = "infra_guys_website_main";
const SLUG = "services/automation.html";

/** Automation & AI on AWS — reuses dev-services marketing blocks. */
export function ServicesAutomationHtmlPage() {
  const { locale } = useDevServicesLocale();
  const { status, page, error } = useDeliveryPage(TENANT, SLUG, locale);

  if (status === "loading") {
    return (
      <div style={{ fontFamily: "system-ui", padding: "2rem" }}>Loading…</div>
    );
  }
  if (status === "error" || !page) {
    return (
      <div style={{ fontFamily: "system-ui", padding: "2rem", color: "#b91c1c" }}>
        <strong>Could not load page</strong>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>{error}</pre>
      </div>
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
