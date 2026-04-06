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
import {
  homeMessages,
  type HomeLocale,
  type HomeMessageKey,
} from "../content/home-translations";

type Ctx = {
  locale: HomeLocale;
  setLocale: (l: HomeLocale) => void;
  t: (key: HomeMessageKey) => string;
  /** Portfolio blurbs shared with dev-services delivery keys (same locale tables). */
  tPortfolio: (key: keyof (typeof devServicesMessages)["en"]) => string;
};

const HomeLocaleContext = createContext<Ctx | null>(null);

const DOC_TITLE: Record<HomeLocale, string> = {
  en: "The Infra Guys — Cloud build, deploy & automation",
  th: "The Infra Guys — คลาวด์ สร้าง ส่งมอบ และอัตโนมัติ",
  ar: "The Infra Guys — بناء سحابي ونشر وأتمتة",
};

export function HomeLocaleProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: HomeLocale;
}) {
  const [locale, setLocale] = useState<HomeLocale>(initialLocale);

  const table = useMemo(() => homeMessages[locale], [locale]);
  const portfolioTable = useMemo(
    () => devServicesMessages[locale as DevServicesLocale],
    [locale]
  );

  const t = useCallback(
    (key: HomeMessageKey) => {
      const v = table[key];
      if (v !== undefined) return v;
      return homeMessages.en[key] ?? String(key);
    },
    [table]
  );

  const tPortfolio = useCallback(
    (key: keyof (typeof devServicesMessages)["en"]) => {
      const v = portfolioTable[key];
      if (v !== undefined) return v;
      return devServicesMessages.en[key] ?? String(key);
    },
    [portfolioTable]
  );

  useEffect(() => {
    document.documentElement.lang = locale === "ar" ? "ar" : locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = DOC_TITLE[locale];
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, tPortfolio }),
    [locale, t, tPortfolio]
  );

  return (
    <HomeLocaleContext.Provider value={value}>{children}</HomeLocaleContext.Provider>
  );
}

export function useHomeLocale(): Ctx {
  const c = useContext(HomeLocaleContext);
  if (!c) {
    throw new Error("useHomeLocale must be used within HomeLocaleProvider");
  }
  return c;
}
