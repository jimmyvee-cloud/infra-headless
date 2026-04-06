<!--
  Supplement: templating / block authoring patterns (expanded examples).
  Canonical spec: headless-cms-architecture.html (#template-engine, #frontend-structure, #admin-panel).
  Pure-block rule: delivery blocks do not fetch CMS/server-owned data; load globals in the route/layout — see HTML callout "Pure delivery vs local UI".
-->

This note expands the **registry + PageRenderer** model into Blade-like patterns in React: loops, conditionals, nested blocks, and layout composition. For authoritative rules (pure blocks, schema merge, repeater / block_list, LayoutProps + nav), read those HTML sections first.

The registry maps `block.type` → Component. That component receives the block’s `props` (and, from the delivery payload, `locale` and `page` metadata). Inside the component you use normal React — map collections, branch on props, compose subcomponents. **Do not** use blocks to load CMS or server-owned data; fetch nav, settings, and other globals in the route or layout and pass them into `Layout`.

Blade @foreach     →  .map() in JSX
Blade @if          →  conditional rendering in JSX
Blade @extends     →  layoutRegistry[page.template]
Blade @section     →  children prop passed through layout
Blade @include     →  import and use a sub-component
Blade @component   →  any React component in your blocks/ folder
Blade @props       →  destructured from block.props

Aim for templates that are easy to author: a clear picture of what data is in scope, graceful empty states, and small composable pieces.

Layer 1: The block contract

Every block component must conform to one interface. This is the foundational rule everything else builds on:
typescript

// types/blocks.ts — the single source of truth for block authoring

export interface BlockProps<T extends Record<string, unknown> = Record<string, unknown>> {
  id:       string          // stable block ID from DynamoDB
  type:     string          // "hero", "card_grid" etc
  order:    number          // sort position on page
  props:    T               // the content — typed per block
  locale:   string          // active locale, e.g. "en", "th"
  page:     PageMeta        // parent page metadata
}

export interface PageMeta {
  slug:         string
  template:     string
  status:       string
  published_at: string
  tenant_id:    string
}

The generic T on props is key — each block defines its own typed props interface so you get full TypeScript autocomplete when authoring templates:
typescript

// blocks/HeroBlock.tsx

interface HeroProps {
  heading:    string
  subheading: string | null
  cta_label:  string
  cta_url:    string
  image_key:  string | null
  overlay:    boolean
}

export default function HeroBlock({ props, locale }: BlockProps<HeroProps>) {
  const { heading, subheading, cta_label, cta_url, image_key, overlay } = props

  return (
    <section className="hero">
      {image_key && (
        <div className={`hero__bg ${overlay ? 'hero__bg--overlay' : ''}`}>
          <img src={mediaUrl(image_key)} alt="" />
        </div>
      )}
      <div className="hero__content">
        <h1>{heading}</h1>
        {subheading && <p className="hero__sub">{subheading}</p>}
        <a href={cta_url} className="btn">{cta_label}</a>
      </div>
    </section>
  )
}

That {subheading && <p>} is your @if. That {image_key && <div>} is another. Completely natural.

Layer 2: Collection blocks — looping

This is where it gets interesting. A block's props can contain arrays. A card_grid block might have a cards array; a team block might have a members array; a faq block might have items. You loop through them exactly as you'd expect:
typescript

// blocks/CardGridBlock.tsx

interface Card {
  title:     string
  body:      string
  image_key: string | null
  link_url:  string | null
  link_label: string | null
}

interface CardGridProps {
  heading:  string | null
  columns:  2 | 3 | 4         // non-translatable — layout decision
  cards:    Card[]             // array of card objects
}

export default function CardGridBlock({ props }: BlockProps<CardGridProps>) {
  const { heading, columns, cards } = props

  return (
    <section className="card-grid">
      {heading && <h2 className="card-grid__heading">{heading}</h2>}
      <div className={`card-grid__grid card-grid__grid--cols-${columns}`}>
        {cards.map((card, i) => (
          <div key={i} className="card">
            {card.image_key && (
              <img src={mediaUrl(card.image_key)} alt={card.title} />
            )}
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            {card.link_url && (
              <a href={card.link_url}>{card.link_label ?? 'Learn more'}</a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

In the admin, the cards field renders as a repeater — a list of sub-forms that the editor can add to, remove from, and reorder. The schema definition for this:
typescript

{
  type: "card_grid",
  label: "Card grid",
  fields: [
    { name: "heading", type: "text",     translatable: true,  required: false },
    { name: "columns", type: "select",   translatable: false, required: true,
      options: [2, 3, 4] },
    {
      name: "cards",
      type: "repeater",     // ← tells BlockForm to render a repeater UI
      translatable: true,
      required: true,
      min: 1,
      max: 12,
      fields: [             // ← nested field definitions
        { name: "title",      type: "text",     translatable: true  },
        { name: "body",       type: "textarea", translatable: true  },
        { name: "image_key",  type: "media",    translatable: false },
        { name: "link_url",   type: "url",      translatable: false },
        { name: "link_label", type: "text",     translatable: true  },
      ]
    }
  ]
}

The repeater type is the key addition to the schema system. The admin BlockForm renders an "Add card" button and a drag-reorderable list of sub-forms. The output is just a plain JSON array stored on the props object in DynamoDB — no special handling needed in PageRenderer.

Layer 3: Conditional rendering — beyond simple null checks

You'll want more expressive conditionals than just checking if a value exists. A block might have a variant prop that changes its entire layout, or a show_on prop that controls visibility by device or locale. Handle these as explicit prop values:
typescript

// blocks/BannerBlock.tsx

interface BannerProps {
  variant:  'info' | 'warning' | 'success' | 'promo'
  message:  string
  cta_url:  string | null
  cta_label: string | null
  dismissible: boolean
}

export default function BannerBlock({ props, locale }: BlockProps<BannerProps>) {
  const { variant, message, cta_url, cta_label, dismissible } = props
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className={`banner banner--${variant}`} role="alert">
      <span>{message}</span>
      {cta_url && cta_label && (
        <a href={cta_url} className="banner__cta">{cta_label}</a>
      )}
      {dismissible && (
        <button onClick={() => setDismissed(true)} aria-label="Dismiss">×</button>
      )}
    </div>
  )
}

For locale-conditional content — showing a block only in certain locales — you have two options. The cleaner one is to handle it in the delivery API (don't return the block if it has a locale restriction that doesn't match). The simpler v1 approach is a locales prop on the block:
typescript

// Inside PageRenderer — filter before rendering
const visibleBlocks = sorted.filter(block => {
  if (!block.props.locales || block.props.locales.length === 0) return true
  return block.props.locales.includes(locale)
})

Layer 4: Nested blocks — blocks within blocks

This is the most powerful capability and the one that makes the system feel truly unlimited. A two_column block might contain two independent block arrays — one for the left column, one for the right. You achieve this by making PageRenderer a reusable component that can render any blocks[] array, not just the top-level one:
typescript

// PageRenderer is recursive

export function BlockRenderer({ blocks, locale, page }: {
  blocks: Block[]
  locale: string
  page:   PageMeta
}) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order)
  return (
    <>
      {sorted.map(block => {
        const Component = registry[block.type]
        if (!Component) return null
        return <Component key={block.id} {...block} locale={locale} page={page} />
      })}
    </>
  )
}

Now a layout block like two_column can embed its own BlockRenderer calls:
typescript

// blocks/TwoColumnBlock.tsx

interface TwoColumnProps {
  left_blocks:  Block[]   // nested block arrays
  right_blocks: Block[]
  ratio:        '50-50' | '33-67' | '67-33'
}

export default function TwoColumnBlock({ props, locale, page }: BlockProps<TwoColumnProps>) {
  return (
    <div className={`two-col two-col--${props.ratio}`}>
      <div className="two-col__left">
        <BlockRenderer blocks={props.left_blocks} locale={locale} page={page} />
      </div>
      <div className="two-col__right">
        <BlockRenderer blocks={props.right_blocks} locale={locale} page={page} />
      </div>
    </div>
  )
}

In the admin, left_blocks and right_blocks render as embedded mini-canvases inside the parent block's form — each with their own block picker and drag-reorder. This is how you build truly complex page layouts without adding any new infrastructure — you're just nesting the same system inside itself.

The schema field type for this is "block_list":
typescript

{
  name: "left_blocks",
  type: "block_list",          // renders embedded BlockCanvas in admin
  translatable: true,
  allowed_types: ["rich_text", "image", "cta"],  // restrict what can go inside
}

Layer 5: Layout templates — the @extends equivalent

The template field on the page drives which layout shell wraps everything. This is your Blade @extends. The layout receives the rendered blocks as children and can add navbars, footers, sidebars, and other chrome around them:
typescript

// layouts/registry.ts

import DefaultLayout  from './DefaultLayout'
import LandingLayout  from './LandingLayout'
import ArticleLayout  from './ArticleLayout'
import MinimalLayout  from './MinimalLayout'

const layoutRegistry: Record<string, ComponentType<LayoutProps>> = {
  default:  DefaultLayout,
  landing:  LandingLayout,
  article:  ArticleLayout,
  minimal:  MinimalLayout,
}

export default layoutRegistry

typescript

// layouts/LandingLayout.tsx — full-bleed, no sidebar, custom nav

export interface LayoutProps {
  page:     PageMeta
  children: ReactNode
  locale:   string
  nav:      NavItem[]    // fetched alongside the page
}

export default function LandingLayout({ page, children, locale, nav }: LayoutProps) {
  return (
    <div className="layout layout--landing">
      <header className="site-header site-header--transparent">
        <Nav items={nav} locale={locale} />
      </header>
      <main id="main-content">
        {children}        {/* ← this is where PageRenderer output goes */}
      </main>
      <Footer locale={locale} />
    </div>
  )
}

typescript

// pages/[slug].tsx — puts it all together

export default function SlugPage() {
  const { slug } = useParams()
  const { locale } = useLocale()
  const { data: page } = usePage(slug, locale)
  const { data: nav }  = useNav(locale)

  if (!page) return <NotFound />

  const Layout = layoutRegistry[page.template] ?? DefaultLayout

  return (
    <Layout page={page} locale={locale} nav={nav}>
      <BlockRenderer blocks={page.blocks} locale={locale} page={page} />
    </Layout>
  )
}

Layer 6: Shared components — the @include equivalent

Any piece of UI you want to reuse across blocks is just a regular React component imported wherever needed. You maintain a components/ folder alongside blocks/ for these:

components/
  MediaImage.tsx        // resolves image_key → S3 URL, handles fallbacks
  RichText.tsx          // renders HTML string safely (sanitized)
  LocaleLink.tsx        // href prefixed with locale if needed
  SocialShare.tsx       // reusable share buttons
  AnimateIn.tsx         // intersection-observer animation wrapper

typescript

// components/RichText.tsx — the critical one

import DOMPurify from 'dompurify'

interface RichTextProps {
  html:      string
  className?: string
}

export default function RichText({ html, className }: RichTextProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p','h2','h3','h4','ul','ol','li','strong','em','a','blockquote','code','pre'],
    ALLOWED_ATTR: ['href','target','rel','class'],
  })
  return (
    <div
      className={`rich-text ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}

Any block that needs rich text output just imports RichText. The RichTextBlock itself is just:
typescript

export default function RichTextBlock({ props }: BlockProps<{ body: string }>) {
  return <RichText html={props.body} className="content-block" />
}

Layer 7: Global data — things available in every template

Some data doesn't live in blocks — navigation menus, site settings, footer content. In Blade these come from view composers or shared data. In this system you fetch them alongside the page in usePage and pass them through the layout:
typescript

// hooks/usePage.ts — fetches page + global data in parallel

export function usePage(slug: string, locale: string) {
  return useQuery(['page', slug, locale], async () => {
    const [page, nav, settings] = await Promise.all([
      api.delivery.getPage(slug, locale),
      api.delivery.getNav(locale),
      api.delivery.getSettings(),
    ])
    return { page, nav, settings }
  })
}

settings comes from a special _settings page in the CMS — a page that never renders publicly but holds global config like site name, social links, default OG image, cookie banner text, and so on. Editors manage it through the same block-based admin interface.

What this gives you end to end

When you sit down to build a new template for a client, the workflow is:

    Define the block schema (field names, types, translatable flags) in blocks/schema/
    Write the React component in blocks/ — it's just JSX with access to typed props
    Register it in blocks/registry.ts — one line
    Register the schema in the FastAPI block schema endpoint — one dict entry
    It appears immediately in the admin block picker, with the correct form fields, translation locking, and media picker integration

You never touch the admin UI code, the delivery API, the DynamoDB schema, or the PageRenderer. The only files you create are the schema definition and the component. If you want a new layout shell, add one file to layouts/ and one line to layouts/registry.ts.

The system can do anything HTML can do because there is no intermediate template language — your block component is the template. Loops, conditionals, state, animations, third-party embeds, canvas elements, SVG, Web Components — all of it works because it's React all the way down.
