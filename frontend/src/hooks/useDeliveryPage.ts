import { useEffect, useState } from "react";
import type { DeliveryPage } from "../types/cms";
import { fetchDeliveryPage } from "../lib/deliveryApi";

type State =
  | { status: "loading"; page: null; error: null }
  | { status: "ok"; page: DeliveryPage; error: null }
  | { status: "error"; page: null; error: string };

export function useDeliveryPage(
  tenantId: string,
  slug: string,
  locale: string
): State {
  const [state, setState] = useState<State>({
    status: "loading",
    page: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", page: null, error: null });

    fetchDeliveryPage(tenantId, slug, locale)
      .then((page) => {
        if (!cancelled) {
          setState({ status: "ok", page, error: null });
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e);
          setState({ status: "error", page: null, error: msg });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tenantId, slug, locale]);

  return state;
}
