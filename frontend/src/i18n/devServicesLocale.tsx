import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  devServicesMessages,
  type DevServicesLocale,
} from "../content/dev-services-translations";
import { deploymentMessages } from "../content/deployment-translations";

export type MessageKey = keyof (typeof devServicesMessages)["en"];

type Ctx = {
  locale: DevServicesLocale;
  setLocale: (l: DevServicesLocale) => void;
  t: (key: MessageKey) => string;
};

const ServiceMarketingLocaleContext = createContext<Ctx | null>(null);

const DEV_DOC_TITLE: Record<DevServicesLocale, string> = {
  en: "Development Services – The Infra Guys",
  th: "บริการพัฒนา – The Infra Guys",
  ar: "خدمات التطوير – The Infra Guys",
};

const DEPLOY_DOC_TITLE: Record<DevServicesLocale, string> = {
  en: "Deployment Services – The Infra Guys",
  th: "บริการ Deploy – The Infra Guys",
  ar: "خدمات النشر – The Infra Guys",
};

function ServiceMarketingLocaleProvider({
  children,
  messages,
  docTitles,
  initialLocale = "en",
}: {
  children: ReactNode;
  messages: typeof devServicesMessages;
  docTitles: Record<DevServicesLocale, string>;
  initialLocale?: DevServicesLocale;
}) {
  const [locale, setLocale] = useState<DevServicesLocale>(initialLocale);

  const table = useMemo(() => messages[locale], [locale, messages]);

  const t = useCallback(
    (key: MessageKey) => {
      const v = table[key];
      if (v !== undefined) return v;
      return messages.en[key] ?? String(key);
    },
    [table, messages]
  );

  useEffect(() => {
    document.documentElement.lang = locale === "ar" ? "ar" : locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = docTitles[locale];
  }, [locale, docTitles]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return (
    <ServiceMarketingLocaleContext.Provider value={value}>
      {children}
    </ServiceMarketingLocaleContext.Provider>
  );
}

export function DevServicesLocaleProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: DevServicesLocale;
}) {
  return (
    <ServiceMarketingLocaleProvider
      messages={devServicesMessages}
      docTitles={DEV_DOC_TITLE}
      initialLocale={initialLocale}
    >
      {children}
    </ServiceMarketingLocaleProvider>
  );
}

export function DeploymentLocaleProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: DevServicesLocale;
}) {
  return (
    <ServiceMarketingLocaleProvider
      messages={deploymentMessages}
      docTitles={DEPLOY_DOC_TITLE}
      initialLocale={initialLocale}
    >
      {children}
    </ServiceMarketingLocaleProvider>
  );
}

export function useDevServicesLocale(): Ctx {
  const c = useContext(ServiceMarketingLocaleContext);
  if (!c) {
    throw new Error(
      "useDevServicesLocale must be used within DevServicesLocaleProvider or DeploymentLocaleProvider"
    );
  }
  return c;
}
