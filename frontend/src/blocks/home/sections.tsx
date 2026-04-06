import { useMemo, useState } from "react";
import type { HomeMessageKey } from "../../content/home-translations";
import { useHomeLocale } from "../../i18n/homeLocale";
import type { BlockProps } from "../../types/cms";
import type { PortfolioProject } from "../../data/portfolioProjects";
import type { InfraHomePillarConfig } from "../../types/infraHomePillar";

type NavProps = Record<string, never>;

export function InfraHomeNav({ id }: BlockProps<NavProps>) {
  const { locale, setLocale, t } = useHomeLocale();
  return (
    <nav className="navbar navbar-dark navbar-infra sticky-top" data-block-id={id}>
      <div className="container">
        <a className="navbar-brand" href="/">
          <img
            src="/dev-services-assets/infraguys-logo-full.png"
            alt="The InfraGuys"
            style={{ width: 150 }}
          />
        </a>
        <div className="d-flex align-items-center gap-3">
          <a
            href="/"
            className="d-none d-md-inline"
            style={{
              color: "var(--aws-muted)",
              fontSize: ".88rem",
              textDecoration: "none",
            }}
          >
            {t("nav_home")}
          </a>
          <a
            href="#portfolio"
            style={{
              color: "var(--aws-muted)",
              fontSize: ".88rem",
              textDecoration: "none",
            }}
          >
            {t("nav_work")}
          </a>
          <a
            href="#services-overview"
            style={{
              color: "var(--aws-muted)",
              fontSize: ".88rem",
              textDecoration: "none",
            }}
          >
            {t("nav_services")}
          </a>
          <div className="lang-switcher ms-2">
            <button
              type="button"
              className={`lang-btn${locale === "en" ? " active" : ""}`}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-btn${locale === "th" ? " active" : ""}`}
              onClick={() => setLocale("th")}
            >
              TH
            </button>
            <button
              type="button"
              className={`lang-btn${locale === "ar" ? " active" : ""}`}
              onClick={() => setLocale("ar")}
            >
              AR
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

type HeroProps = { image_src: string; image_alt: string };

export function InfraHomeHero({ id, props }: BlockProps<HeroProps>) {
  const { t } = useHomeLocale();
  return (
    <section className="hero" data-block-id={id}>
      <div className="grid-decoration" />
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="hero-eyebrow">{t("hero_eyebrow")}</div>
            <h1 dangerouslySetInnerHTML={{ __html: t("hero_h1") }} />
            <p className="lead mt-4">{t("hero_lead")}</p>
            <div className="d-flex flex-wrap gap-3 mt-5">
              <a href="#contact" className="btn-aws">
                {t("hero_cta_primary")}
              </a>
              <a href="#services-overview" className="btn-outline-aws">
                {t("hero_cta_secondary")}
              </a>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
            <div className="hero-image-wrap w-100">
              <img
                src={props.image_src}
                alt={props.image_alt}
                className="img-fluid w-100"
                style={{
                  maxHeight: "min(52vh, 420px)",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ServicesOverviewProps = { pillars: InfraHomePillarConfig[] };

/** Ensures pillar headings link even when delivery JSON predates titleHref. */
const PILLAR_TITLE_DEFAULT_HREF: Partial<
  Record<InfraHomePillarConfig["titleKey"], string>
> = {
  build_section_title: "/services/dev-services.html",
  deploy_section_title: "/services/deployment.html",
  auto_section_title: "/services/automation.html",
};

export function InfraHomeServicesOverview({
  id,
  props,
}: BlockProps<ServicesOverviewProps>) {
  const { t } = useHomeLocale();
  return (
    <section
      className="section-pad bg-alt"
      id="services-overview"
      data-block-id={id}
    >
      <div className="container">
        <div className="text-center mb-4 pb-4 border-bottom border-secondary border-opacity-25">
          <div className="section-label">{t("services_overview_label")}</div>
          <h2 className="section-title">{t("services_overview_title")}</h2>
          <p
            className="services-overview-intro mb-0"
            style={{
              color: "var(--aws-muted)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
            }}
            dangerouslySetInnerHTML={{ __html: t("services_overview_lead") }}
          />
        </div>

        {props.pillars.map((pillar) => {
          const titleHref =
            pillar.titleHref ?? PILLAR_TITLE_DEFAULT_HREF[pillar.titleKey];
          return (
          <div
            key={pillar.titleKey}
            className="overview-pillar-block overview-pillar-head"
          >
            <h3 className="section-title">
              {titleHref ? (
                <a
                  href={titleHref}
                  className="text-reset"
                  style={{
                    textDecoration: "none",
                    borderBottom: "2px solid var(--aws-accent, #ff9900)",
                    paddingBottom: "0.12em",
                  }}
                >
                  {t(pillar.titleKey)}
                </a>
              ) : (
                t(pillar.titleKey)
              )}
            </h3>
            <p className="lead-muted">{t(pillar.leadKey)}</p>
            <div className="row g-3">
              {pillar.itemKeys.map((key) => {
                const itemLink = pillar.itemLinks?.[key];
                return (
                  <div key={key} className="col-md-6 col-lg-4">
                    <div className="overview-item">
                      <i
                        className="bi bi-check2-circle overview-item-icon"
                        aria-hidden
                      />
                      <p className="overview-item-text mb-0">{t(key)}</p>
                      {itemLink ? (
                        <a
                          href={itemLink.href}
                          className="d-inline-block mt-2"
                          style={{
                            color: "var(--aws-accent, #ff9900)",
                            fontSize: ".875rem",
                            fontWeight: 500,
                            textDecoration: "none",
                          }}
                        >
                          {t(itemLink.labelKey)}
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}

type SpotlightCard = {
  titleKey: HomeMessageKey;
  bodyKey: HomeMessageKey;
};

type SpotlightProps = { cards: SpotlightCard[] };

export function InfraHomeSpotlight({ id, props }: BlockProps<SpotlightProps>) {
  const { t } = useHomeLocale();
  return (
    <section className="section-pad" data-block-id={id}>
      <div className="container">
        <div className="section-label">{t("diff_label")}</div>
        <h2 className="section-title">{t("diff_title")}</h2>
        <div className="section-divider" />
        <div className="row g-4 mt-1">
          {props.cards.map((c) => (
            <div key={c.titleKey} className="col-md-4">
              <div className="why-card h-100">
                <h4>{t(c.titleKey)}</h4>
                <p className="mb-0">{t(c.bodyKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type PortfolioProps = { projects: PortfolioProject[] };

const FILTERS: {
  id: "all" | PortfolioProject["category"];
  labelKey: HomeMessageKey;
}[] = [
  { id: "all", labelKey: "filter_all" },
  { id: "aws", labelKey: "filter_aws" },
  { id: "pwa", labelKey: "filter_pwa" },
  { id: "web", labelKey: "filter_web" },
  { id: "db", labelKey: "filter_db" },
];

export function InfraHomePortfolio({ id, props }: BlockProps<PortfolioProps>) {
  const { t, tPortfolio } = useHomeLocale();
  const [filter, setFilter] = useState<"all" | PortfolioProject["category"]>(
    "all"
  );

  const visible = useMemo(() => {
    if (filter === "all") return props.projects;
    return props.projects.filter((p) => p.category === filter);
  }, [filter, props.projects]);

  return (
    <section className="section-pad bg-alt" id="portfolio" data-block-id={id}>
      <div className="container">
        <div className="text-center mb-2">
          <div className="section-label">{t("portfolio_label")}</div>
          <h2 className="section-title">{t("portfolio_title")}</h2>
          <p
            className="mx-auto mb-4"
            style={{
              color: "var(--aws-muted)",
              fontSize: ".95rem",
              maxWidth: 520,
            }}
          >
            {t("portfolio_lead")}
          </p>
          <div className="section-divider mx-auto" />
        </div>

        <div className="portfolio-filter">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-btn${filter === f.id ? " active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {visible.map((p) => (
            <article
              key={p.id}
              className="portfolio-card"
              data-category={p.category}
            >
              <div className="portfolio-thumb">
                {p.href ? (
                  <a
                    href={p.href}
                    {...(p.hrefTargetBlank
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <img src={p.image} alt={p.imageAlt} className="img-fluid" />
                  </a>
                ) : (
                  <img src={p.image} alt={p.imageAlt} className="img-fluid" />
                )}
                <span className="portfolio-badge">{p.badge}</span>
                <span
                  className={`portfolio-status ${
                    p.status === "live" ? "status-live" : "status-wip"
                  }`}
                >
                  {p.status === "live" ? "Live" : "In Progress"}
                </span>
              </div>
              <div className="portfolio-body">
                <h4>{tPortfolio(p.titleKey)}</h4>
                <p
                  dangerouslySetInnerHTML={{
                    __html: tPortfolio(p.descKey),
                  }}
                />
                <div className="portfolio-stack">
                  {p.stack.map((tag) => (
                    <span key={tag} className="stack-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type CtaProps = { mailto: string; secondary_url: string };

export function InfraHomeCta({ id, props }: BlockProps<CtaProps>) {
  const { t } = useHomeLocale();
  return (
    <section className="section-pad-sm" id="contact" data-block-id={id}>
      <div className="container">
        <div className="cta-banner">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="section-label">{t("cta_label")}</div>
              <h2>{t("cta_title")}</h2>
              <p
                className="mt-3 mb-0"
                style={{ color: "var(--aws-muted)", fontSize: ".95rem" }}
              >
                {t("cta_body")}
              </p>
            </div>
            <div className="col-lg-4 text-lg-end d-flex flex-wrap gap-3 justify-content-lg-end">
              <a href={`mailto:${props.mailto}`} className="btn-aws">
                {t("cta_btn_email")}
              </a>
              <a href={props.secondary_url} className="btn-outline-aws">
                {t("cta_btn_site")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FooterProps = { mailto: string };

export function InfraHomeFooter({ id, props }: BlockProps<FooterProps>) {
  const { t } = useHomeLocale();
  return (
    <footer className="footer" data-block-id={id}>
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <span
              style={{
                fontFamily: "'Rajdhani',sans-serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--aws-orange)",
              }}
            >
              The Infra
              <span style={{ color: "var(--aws-text)" }}>Guys</span>
            </span>
            <br />
            <span>{t("footer_tagline")}</span>
          </div>
          <div className="d-flex flex-wrap gap-4">
            <a href="/">{t("footer_home")}</a>
            <a href="#services-overview">{t("footer_services")}</a>
            <a href="/services/dev-services.html">{t("footer_dev")}</a>
            <a href="/services/deployment.html">{t("footer_deploy")}</a>
            <a href="/services/automation.html">{t("footer_auto")}</a>
            <a href={`mailto:${props.mailto}`}>{props.mailto}</a>
          </div>
        </div>
        <hr style={{ borderColor: "var(--aws-border)", margin: "20px 0" }} />
        <p className="mb-0 text-center" style={{ fontSize: ".8rem" }}>
          {t("footer_copy")}
        </p>
      </div>
    </footer>
  );
}
