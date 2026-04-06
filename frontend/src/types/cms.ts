import type { ComponentType } from "react";

export interface PageMeta {
  slug: string;
  template: string;
  status: string;
  published_at: string;
  tenant_id: string;
}

/** Delivery block after locale merge — translatable strings resolved in components via i18n. */
export interface DeliveryBlock<T = Record<string, unknown>> {
  id: string;
  type: string;
  order: number;
  props: T;
}

export interface DeliveryPage {
  tenant_id: string;
  slug: string;
  template: string;
  status: string;
  published_at: string;
  blocks: DeliveryBlock[];
}

export interface BlockProps<T extends Record<string, unknown>> {
  id: string;
  type: string;
  order: number;
  props: T;
  locale: string;
  page: PageMeta;
}

export type BlockComponent<T extends Record<string, unknown>> = ComponentType<
  BlockProps<T>
>;
