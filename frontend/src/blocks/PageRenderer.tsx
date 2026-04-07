import registry from "./registry";
import type { DeliveryBlock, PageMeta } from "../types/cms";

interface BlockRow extends DeliveryBlock {
  type: string;
}

export function PageRenderer({
  blocks,
  locale,
  page,
}: {
  blocks: DeliveryBlock[];
  locale: string;
  page: PageMeta;
}) {
  const safeBlocks = Array.isArray(blocks) ? blocks : [];
  const sorted = [...safeBlocks].sort((a, b) => a.order - b.order);

  return (
    <>
      {sorted.map((block) => {
        const Component = registry[block.type];
        if (!Component) {
          console.warn(`Unknown block type: ${block.type}`);
          return null;
        }
        const row = block as BlockRow;
        return (
          <Component
            key={row.id}
            id={row.id}
            type={row.type}
            order={row.order}
            props={row.props as never}
            locale={locale}
            page={page}
          />
        );
      })}
    </>
  );
}
