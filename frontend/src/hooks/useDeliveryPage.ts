import { useEffect, useState } from "react";
import type { DeliveryPage } from "../types/cms";
import {
  fetchDeliveryPage,
  getGuaranteedDeliveryPage,
} from "../lib/deliveryApi";

type State =
  | { status: "loading"; page: null }
  | { status: "ready"; page: DeliveryPage };

export function useDeliveryPage(
  tenantId: string,
  slug: string,
  locale: string
): State {
  const [state, setState] = useState<State>({
    status: "loading",
    page: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", page: null });

    fetchDeliveryPage(tenantId, slug, locale)
      .then((page) => {
        if (!cancelled) {
          setState({ status: "ready", page });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            status: "ready",
            page: getGuaranteedDeliveryPage(tenantId, slug, locale),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tenantId, slug, locale]);

  return state;
}
