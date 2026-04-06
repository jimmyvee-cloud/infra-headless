import type { ComponentType } from "react";
import {
  DevServicesCta,
  DevServicesFooter,
  DevServicesHero,
  DevServicesNav,
  DevServicesOfferings,
  DevServicesPortfolio,
  DevServicesProcess,
  DevServicesWhy,
} from "./dev-services/sections";
import {
  InfraHomeCta,
  InfraHomeFooter,
  InfraHomeHero,
  InfraHomeNav,
  InfraHomePortfolio,
  InfraHomeServicesOverview,
  InfraHomeSpotlight,
} from "./home/sections";
import type { BlockProps } from "../types/cms";

/* eslint-disable @typescript-eslint/no-explicit-any */
const registry: Record<string, ComponentType<BlockProps<any>>> = {
  dev_services_nav: DevServicesNav,
  dev_services_hero: DevServicesHero,
  dev_services_offerings: DevServicesOfferings,
  dev_services_why: DevServicesWhy,
  dev_services_process: DevServicesProcess,
  dev_services_portfolio: DevServicesPortfolio,
  dev_services_cta: DevServicesCta,
  dev_services_footer: DevServicesFooter,

  infra_home_nav: InfraHomeNav,
  infra_home_hero: InfraHomeHero,
  infra_home_services_overview: InfraHomeServicesOverview,
  infra_home_spotlight: InfraHomeSpotlight,
  infra_home_portfolio: InfraHomePortfolio,
  infra_home_cta: InfraHomeCta,
  infra_home_footer: InfraHomeFooter,
};

export default registry;
