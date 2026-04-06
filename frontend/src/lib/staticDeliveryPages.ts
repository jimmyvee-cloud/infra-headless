import type { DeliveryBlock, DeliveryPage } from "../types/cms";
import automationBlocks from "@dynamodb-generated/automation-blocks.json";
import deploymentBlocks from "@dynamodb-generated/deployment-blocks.json";

/** Bundled copy of infra seed blocks — used when GET /delivery/pages/… returns 404 (e.g. item not in Dynamo yet). */
export function getStaticDeliveryPage(
  tenantId: string,
  slug: string
): DeliveryPage | null {
  if (tenantId !== "infra_guys_website_main") return null;
  const s = slug.replace(/^\/+/, "");

  if (s === "services/automation.html") {
    return {
      tenant_id: tenantId,
      slug: "services/automation.html",
      template: "automation_services_marketing",
      status: "published",
      published_at: "2026-04-06T12:03:00.000Z",
      blocks: automationBlocks as DeliveryBlock[],
    };
  }

  if (s === "services/deployment.html") {
    return {
      tenant_id: tenantId,
      slug: "services/deployment.html",
      template: "deployment_services_marketing",
      status: "published",
      published_at: "2026-04-06T12:02:00.000Z",
      blocks: deploymentBlocks as DeliveryBlock[],
    };
  }

  return null;
}
