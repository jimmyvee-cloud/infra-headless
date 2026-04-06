import type { DeliveryBlock, DeliveryPage } from "../types/cms";
import type { InfraHomePillarConfig } from "../types/infraHomePillar";
import { portfolioProjects } from "./portfolioProjects";

const HOME_PILLARS: InfraHomePillarConfig[] = [
  {
    titleKey: "build_section_title",
    leadKey: "build_section_lead",
    titleHref: "/services/dev-services.html",
    itemKeys: [
      "build_i1",
      "build_i2",
      "build_i3",
      "build_i4",
      "build_i5",
      "build_i6",
      "build_i7",
    ],
  },
  {
    titleKey: "deploy_section_title",
    leadKey: "deploy_section_lead",
    titleHref: "/services/deployment.html",
    itemKeys: ["deploy_i1", "deploy_i2", "deploy_i3"],
  },
  {
    titleKey: "auto_section_title",
    leadKey: "auto_section_lead",
    titleHref: "/services/automation.html",
    itemKeys: ["auto_i1", "auto_i2", "auto_i3", "auto_i4"],
  },
];

function blocksForHomePage(): DeliveryBlock[] {
  return [
    { id: "home_nav", type: "infra_home_nav", order: 0, props: {} },
    {
      id: "home_hero",
      type: "infra_home_hero",
      order: 1,
      props: {
        image_src: "/dev-services-assets/infra-guys-hero.png",
        image_alt: "Infra Guys — cloud infrastructure and automation",
      },
    },
    {
      id: "home_services_overview",
      type: "infra_home_services_overview",
      order: 2,
      props: { pillars: HOME_PILLARS },
    },
    {
      id: "home_spotlight",
      type: "infra_home_spotlight",
      order: 3,
      props: {
        cards: [
          { titleKey: "diff_1_title", bodyKey: "diff_1_body" },
          { titleKey: "diff_2_title", bodyKey: "diff_2_body" },
          { titleKey: "diff_3_title", bodyKey: "diff_3_body" },
        ],
      },
    },
    {
      id: "home_portfolio",
      type: "infra_home_portfolio",
      order: 4,
      props: { projects: portfolioProjects },
    },
    {
      id: "home_cta",
      type: "infra_home_cta",
      order: 5,
      props: {
        mailto: "hello@infra-guys.com",
        secondary_url: "https://infra-guys.com",
      },
    },
    {
      id: "home_footer",
      type: "infra_home_footer",
      order: 6,
      props: { mailto: "hello@infra-guys.com" },
    },
  ];
}

const HOME_PAGE: DeliveryPage = {
  tenant_id: "infra_guys_website_main",
  slug: "index",
  template: "infra_home_marketing",
  status: "published",
  published_at: "2026-04-06T00:00:00.000Z",
  blocks: blocksForHomePage(),
};

export function getHomePage(
  tenantId: string,
  _locale: string
): DeliveryPage {
  if (tenantId === "infra_guys_website_main") {
    return HOME_PAGE;
  }
  throw new Error(`Unknown home for tenant: ${tenantId}`);
}
