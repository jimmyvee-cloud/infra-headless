import type { HomeMessageKey } from "../content/home-translations";

export type InfraHomePillarItemLink = {
  href: string;
  labelKey: HomeMessageKey;
};

export type InfraHomePillarConfig = {
  titleKey: HomeMessageKey;
  leadKey: HomeMessageKey;
  itemKeys: HomeMessageKey[];
  /** When set, the pillar heading links here (e.g. deep-dive service page). */
  titleHref?: string;
  /** Optional CTA under a bullet (e.g. deep-dive service page). */
  itemLinks?: Partial<Record<HomeMessageKey, InfraHomePillarItemLink>>;
};
