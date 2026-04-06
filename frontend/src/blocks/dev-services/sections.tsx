import { useMemo, useState } from "react";
import type { MessageKey } from "../../i18n/devServicesLocale";
import { useDevServicesLocale } from "../../i18n/devServicesLocale";
import type { BlockProps } from "../../types/cms";
import type { PortfolioProject } from "../../data/portfolioProjects";

type NavProps = Record<string, never>;

export function DevServicesNav({ id }: BlockProps<NavProps>) {
  const { locale, setLocale, t } = useDevServicesLocale();
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
            {t("nav_portfolio")}
          </a>
          <a
            href="#services"
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

export function DevServicesHero({ id, props }: BlockProps<HeroProps>) {
  const { t } = useDevServicesLocale();
  return (
    <section className="hero" data-block-id={id}>
      <div className="grid-decoration" />
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="hero-eyebrow">{t("hero_eyebrow")}</div>
            <h1
              dangerouslySetInnerHTML={{ __html: t("hero_h1") }}
            />
            <p className="lead mt-4">{t("hero_lead")}</p>
            <div className="d-flex flex-wrap gap-3 mt-5">
              <a href="#contact" className="btn-aws">
                {t("hero_cta_primary")}
              </a>
              <a href="#services" className="btn-outline-aws">
                {t("hero_cta_secondary")}
              </a>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-flex justify-content-center">
            <div className="hero-image-wrap w-100">
              <img
                src={props.image_src}
                alt={props.image_alt}
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type OfferingCard = {
  icon: string;
  tags: string[];
  titleKey: MessageKey;
  descKey: MessageKey;
};

type OfferingsProps = { cards: OfferingCard[] };

export function DevServicesOfferings({ id, props }: BlockProps<OfferingsProps>) {
  const { t } = useDevServicesLocale();
  return (
    <section className="section-pad bg-alt" id="services" data-block-id={id}>
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-label">{t("services_label")}</div>
          <h2 className="section-title">{t("services_title")}</h2>
          <div className="section-divider mx-auto" />
        </div>
        <div className="row g-4">
          {props.cards.map((c) => (
            <div key={c.titleKey} className="col-md-6 col-lg-3">
              <div className="service-card">
                <div className="card-icon">
                  <i className={`bi ${c.icon}`} />
                </div>
                <h3>{t(c.titleKey)}</h3>
                <p>{t(c.descKey)}</p>
                <div>
                  {c.tags.map((tag) => (
                    <span key={tag} className="service-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type WhyCard = {
  icon: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

type WhyProps = { cards: WhyCard[] };

export function DevServicesWhy({ id, props }: BlockProps<WhyProps>) {
  const { t } = useDevServicesLocale();
  return (
    <section className="section-pad" data-block-id={id}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-4">
            <div className="section-label">{t("why_label")}</div>
            <h2 className="section-title">{t("why_title")}</h2>
            <div className="section-divider" />
            <p
              style={{
                color: "var(--aws-muted)",
                fontSize: ".95rem",
                lineHeight: 1.75,
              }}
            >
              {t("why_body")}
            </p>
          </div>
          <div className="col-lg-8">
            <div className="row g-4">
              {props.cards.map((c) => (
                <div key={c.titleKey} className="col-sm-6">
                  <div className="why-card">
                    <div className="why-icon">
                      <i className={`bi ${c.icon}`} />
                    </div>
                    <h4>{t(c.titleKey)}</h4>
                    <p>{t(c.bodyKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ProcessStep = {
  num: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

type ProcessProps = { steps: ProcessStep[] };

export function DevServicesProcess({ id, props }: BlockProps<ProcessProps>) {
  const { t } = useDevServicesLocale();
  return (
    <section className="section-pad bg-alt" data-block-id={id}>
      <div className="container">
        <div className="row g-5 align-items-start">
          <div className="col-lg-5">
            <div className="section-label">{t("process_label")}</div>
            <h2 className="section-title">{t("process_title")}</h2>
            <div className="section-divider" />
            <p
              style={{
                color: "var(--aws-muted)",
                fontSize: ".92rem",
                lineHeight: 1.75,
              }}
            >
              {t("process_body")}
            </p>
          </div>
          <div className="col-lg-7">
            {props.steps.map((s) => (
              <div key={s.num} className="process-step">
                <div className="step-num">{s.num}</div>
                <div className="step-content">
                  <h5>{t(s.titleKey)}</h5>
                  <p>{t(s.bodyKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type PortfolioProps = { projects: PortfolioProject[] };

const FILTERS: { id: "all" | PortfolioProject["category"]; labelKey: MessageKey }[] =
  [
    { id: "all", labelKey: "filter_all" },
    { id: "aws", labelKey: "filter_aws" },
    { id: "pwa", labelKey: "filter_pwa" },
    { id: "web", labelKey: "filter_web" },
    { id: "db", labelKey: "filter_db" },
  ];

export function DevServicesPortfolio({
  id,
  props,
}: BlockProps<PortfolioProps>) {
  const { t } = useDevServicesLocale();
  const [filter, setFilter] = useState<
    "all" | PortfolioProject["category"]
  >("all");

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
                <h4>{t(p.titleKey)}</h4>
                <p
                  dangerouslySetInnerHTML={{ __html: t(p.descKey) }}
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

type CtaProps = { mailto: string; home_url: string };

export function DevServicesCta({ id, props }: BlockProps<CtaProps>) {
  const { t } = useDevServicesLocale();
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
              <a href={props.home_url} className="btn-outline-aws">
                {t("cta_btn_back")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FooterProps = { mailto: string };

export function DevServicesFooter({ id, props }: BlockProps<FooterProps>) {
  const { t } = useDevServicesLocale();
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
          <div className="d-flex gap-4">
            <a href="/">{t("footer_home")}</a>
            <a href="#services">{t("footer_services")}</a>
            <a href={`mailto:${props.mailto}`}>{props.mailto}</a>
          </div>
        </div>
        <hr
          style={{ borderColor: "var(--aws-border)", margin: "20px 0" }}
        />
        <p
          className="mb-0 text-center"
          style={{ fontSize: ".8rem" }}
        >
          {t("footer_copy")}
        </p>
      </div>
    </footer>
  );
}
