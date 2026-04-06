import type { DeliveryBlock, DeliveryPage } from "../types/cms";
import { portfolioProjects } from "./portfolioProjects";

function blocksForDevServicesPage(): DeliveryBlock[] {
  return [
    { id: "blk_nav", type: "dev_services_nav", order: 0, props: {} },
    {
      id: "blk_hero",
      type: "dev_services_hero",
      order: 1,
      props: {
        image_src: "/dev-services-assets/services.png",
        image_alt: "The InfraGuys",
      },
    },
    {
      id: "blk_offerings",
      type: "dev_services_offerings",
      order: 2,
      props: {
        cards: [
          {
            icon: "bi-cloud-fill",
            tags: ["Lambda / ECS", "Terraform / CDK", "API Gateway", "CI/CD"],
            titleKey: "svc1_title",
            descKey: "svc1_desc",
          },
          {
            icon: "bi-phone-fill",
            tags: ["React Native", "PWA", "iOS / Android", "Expo"],
            titleKey: "svc2_title",
            descKey: "svc2_desc",
          },
          {
            icon: "bi-code-slash",
            tags: ["React / Next.js", "Node / Python", "REST / GraphQL", "SaaS"],
            titleKey: "svc3_title",
            descKey: "svc3_desc",
          },
          {
            icon: "bi-database-fill",
            tags: [
              "PostgreSQL / Aurora",
              "Custom CRM",
              "ERP Integration",
              "Admin Panels",
            ],
            titleKey: "svc4_title",
            descKey: "svc4_desc",
          },
        ],
      },
    },
    {
      id: "blk_why",
      type: "dev_services_why",
      order: 3,
      props: {
        cards: [
          { icon: "bi-shield-check-fill", titleKey: "why1_title", bodyKey: "why1_body" },
          { icon: "bi-box-seam-fill", titleKey: "why2_title", bodyKey: "why2_body" },
          { icon: "bi-diagram-3-fill", titleKey: "why3_title", bodyKey: "why3_body" },
          {
            icon: "bi-calendar2-check-fill",
            titleKey: "why4_title",
            bodyKey: "why4_body",
          },
        ],
      },
    },
    {
      id: "blk_process",
      type: "dev_services_process",
      order: 4,
      props: {
        steps: [
          { num: "01", titleKey: "step1_title", bodyKey: "step1_body" },
          { num: "02", titleKey: "step2_title", bodyKey: "step2_body" },
          { num: "03", titleKey: "step3_title", bodyKey: "step3_body" },
          { num: "04", titleKey: "step4_title", bodyKey: "step4_body" },
        ],
      },
    },
    {
      id: "blk_portfolio",
      type: "dev_services_portfolio",
      order: 5,
      props: { projects: portfolioProjects },
    },
    {
      id: "blk_cta",
      type: "dev_services_cta",
      order: 6,
      props: {
        mailto: "hello@infra-guys.com",
        home_url: "https://infra-guys.com",
      },
    },
    {
      id: "blk_footer",
      type: "dev_services_footer",
      order: 7,
      props: { mailto: "hello@infra-guys.com" },
    },
  ];
}

const PAGE: DeliveryPage = {
  tenant_id: "infra_guys_website_main",
  slug: "services/dev-services.html",
  template: "dev_services_marketing",
  status: "published",
  published_at: "2026-04-06T00:00:00.000Z",
  blocks: blocksForDevServicesPage(),
};

/**
 * Simulates GET /delivery/pages/:slug?tenant=&locale=
 * — block structure from EN; visible strings resolved per locale in components (full locale tables here, not field-level overlay).
 */
export function getDeliveryPage(
  tenantId: string,
  slug: string,
  _locale: string
): DeliveryPage {
  if (
    tenantId === "infra_guys_website_main" &&
    (slug === "services/dev-services.html" || slug === "/services/dev-services.html")
  ) {
    return PAGE;
  }
  throw new Error(`Unknown page: ${tenantId} / ${slug}`);
}
