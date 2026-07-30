# SEO / AEO / GEO Audit — adhd.aimerge.live

**Audited:** 2026-07-30 · **Branch:** `seo/aeo-geo-optimization` · **Stack:** Next.js 16.2.9 (App Router, Turbopack, Tailwind v4)
**Evidence:** Screaming Frog crawl exports (28 URLs / 6 HTML pages) + full source review + baseline `next build`.

Severity: **P0** = actively harming rankings or risking a penalty · **P1** = measurable loss · **P2** = upside left on the table.

---

## 0. Baseline

| Metric | Value |
|---|---|
| HTML pages crawled | 6 (all `200`, all `Indexable`) |
| Total URLs crawled | 28 |
| Broken links (4xx/5xx) | **0** |
| Redirect chains | **0** |
| Duplicate content / near-duplicates | **0** |
| Canonical coverage | 6/6 self-referencing ✅ |
| Homepage HTML weight | 170 KB (text ratio 8.9%) |
| Homepage TTFB (crawl) | 0.061 s ✅ |
| Build output | 13/13 routes prerendered static ✅ |

The foundation is genuinely good: clean canonicals, no broken links, static prerendering, self-hosted fonts, cookie-consent gating. The problems are concentrated in **HTTP headers, structured-data scoping, image weight, and content extractability**.

---

## 1. Crawlability & Indexability — mostly healthy

| # | Finding | Sev |
|---|---|---|
| 1.1 | `/admin` is statically prerendered and has **no `noindex`**. `robots.txt` `Disallow` stops crawling but *not* indexing — a disallowed URL discovered via an external link can still surface as a URL-only SERP result. | **P1** |
| 1.2 | `robots.txt` has no AI-crawler directives. For GEO, explicitly naming `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, etc. declares intent and avoids default-deny behaviour at some crawlers. | **P1** |
| 1.3 | `public/llms.txt` exists but is referenced nowhere — not in `robots.txt`, not in the sitemap, not in `<link>`. Discovery depends entirely on a crawler guessing the convention. | **P1** |
| 1.4 | Sitemap omits `/` variants and has no `images` — fine at this size, but `lastModified` on the homepage is `new Date()` at build time, which marks it fresh on every deploy even for a CSS-only change. | P2 |

## 2. HTTP Security Headers — **complete failure**

`next.config.ts` has **no `headers()` function at all.** Screaming Frog flags:

| Header | Missing on | Sev |
|---|---|---|
| `X-Content-Type-Options: nosniff` | **28/28 URLs (100%)** | **P0** |
| `X-Frame-Options` / `frame-ancestors` | **28/28 URLs (100%)** | **P0** |
| `Referrer-Policy` | **28/28 URLs (100%)** | **P0** |
| `Content-Security-Policy` | 19/28 URLs (67.9%) | **P0** |
| `Strict-Transport-Security` | all | P1 |
| `Permissions-Policy` | all | P2 |

Not a direct ranking factor, but it is a **trust/quality signal**, it is the single largest cluster of issues in the crawl, and clickjacking + MIME-sniffing are real vulnerabilities on a site that collects names, emails and personal ADHD narratives.

## 3. Structured Data — **P0 scoping defect**

`<StructuredData />` is mounted in **`app/layout.tsx`**, so the *entire* entity graph is emitted on *every* page:

- **`FAQPage` renders on `/privacy`, `/terms`, `/accessibility`, `/medical-disclaimer`, `/ai-data-disclosure`** — pages that contain none of those questions. Google's structured-data policy requires markup to represent content **visible on that page**; mismatched `FAQPage` is an explicit spam violation and a manual-action risk.
- **`VideoObject` renders on all 6 pages** — the video exists only on the homepage.
- `ScholarlyArticle` likewise, and it lacks `headline`, `url`, and a top-level `datePublished`.

Also missing entirely:

| Missing type | Why it matters | Sev |
|---|---|---|
| `WebPage` per URL | No page-level entity; nothing ties each URL to the Organization | **P1** |
| `BreadcrumbList` | No breadcrumb rich result; weakens hierarchy signals | **P1** |
| `Service` / `Offer` | The free score — the actual product — is described nowhere in schema | **P1** |
| `HowTo`-style step list | The "How it works" 4-step block is invisible to parsers | P2 |
| `DefinedTerm` | "ADHD Belief Score" / "Pattern-to-Belief Map" are coined terms with no machine-readable definition — this is the core GEO gap | **P1** |
| `speakable` | No voice-assistant surface | P2 |
| `VideoObject.uploadDate` | Hardcoded `TODO(launch)` placeholder | P1 |

## 4. Metadata

| # | Finding | Data | Sev |
|---|---|---|---|
| 4.1 | Homepage meta description **truncated** | 181 chars / **1137 px** vs ~155 char / 985 px limits | **P1** |
| 4.2 | Homepage `<h1>` over guidance | **106 chars** | P2 |
| 4.3 | Titles below 30 chars | accessibility 24, privacy 25, terms 27, medical-disclaimer 29 | P2 |
| 4.4 | Descriptions below 70 chars | terms 54, privacy 58 | P2 |
| 4.5 | **Sub-pages have no `openGraph` / `twitter` blocks** — all 5 inherit the homepage card, so sharing `/privacy` renders "Free ADHD Belief Score" + the VSL poster, and `og:url` stays `/` on every page | 5 pages | **P1** |
| 4.6 | No `apple-icon`, no explicit `icons` metadata | — | P2 |
| 4.7 | No `authors` / `creator` / `publisher` / `category` — weak E-E-A-T attribution in metadata | — | P2 |

## 5. Images — **P0 weight**

Source files are wildly oversized relative to render size:

| File | Dimensions | **Disk** | Rendered at | Sev |
|---|---|---|---|---|
| `take/question.png` | 1888×906 | **1.42 MB** | 896 px | **P0** |
| `logos/un.png` | 3840×3269 | **1.09 MB** | **112 px** | **P0** |
| `take/reportsummary.png` | 1792×815 | **954 KB** | 672 px | **P0** |
| `manuj/closeup.jpg` | 1400×1867 | **963 KB** | 430 px | **P0** |
| `logos/pearson.png` | 1420×1556 | 124 KB | 112 px | P1 |
| `logos/ibm.png` | 2500×1000 | 80 KB | 112 px | P1 |

Plus **~4.5 MB of shipped-but-unreferenced images**: `take/audience.png` (1.04 MB), `take/beat.png` (1.33 MB), `take/reportpdf.png` (733 KB), `take/audiofile.png`, all of `public/images/*`, and 4 unused `public/manuj/*` photos.

Config gaps:

- No `images.formats` → **WebP only, no AVIF** (~20% smaller).
- No `images.qualities` → locked to the Next 16 default `[75]`.
- No `minimumCacheTTL`.
- Trust logos use `fill`, which is why the crawl reports "Images: Missing Size Attributes" on 5 images.
- **`priority` on the header logo is deprecated in Next 16** (replaced by `preload`) — currently preloading a 16 px-tall logo instead of the LCP element.
- Alt text over 100 chars on the 2 screenshots.

## 6. Accessibility

Strong baseline — skip link, `:focus-visible`, `prefers-reduced-motion`, pinch-zoom left enabled, `lang="en"`, alt text on every image, ARIA labels on the video controls. Remaining:

| # | Finding | Sev |
|---|---|---|
| 6.1 | **`MobileStickyCta` is `aria-hidden` while hidden but its link stays keyboard-focusable** (`pointer-events-none` blocks the mouse only). Focusing an `aria-hidden` interactive control is a WCAG 2.2 **4.1.2 Name, Role, Value** failure. | **P1** |
| 6.2 | Alt text over 100 chars on 2 images (WCAG-adjacent best practice) | P2 |
| 6.3 | `<html>` missing `dir="ltr"` | P2 |
| 6.4 | Video has no `<track kind="captions">` — captions are burned into the picture, so they can't be resized, restyled, or read by a screen reader (already self-declared on `/accessibility`) | P1 *(asset-blocked)* |

## 7. Performance / Core Web Vitals

| # | Finding | Sev |
|---|---|---|
| 7.1 | Image payload above — the dominant LCP/bandwidth cost | **P0** |
| 7.2 | No `experimental.inlineCss`. With Tailwind's atomic CSS this removes a render-blocking round-trip and directly improves FCP/LCP for first-time visitors | P1 |
| 7.3 | `/public` assets (video, logos, posters) get no long-lived `Cache-Control` — only `/_next/static` is immutable-cached | P1 |
| 7.4 | VSL poster is the likely LCP element and is neither preloaded nor served through the image optimizer | P1 |
| 7.5 | 12 testimonial `<video>` elements on the homepage — correctly `preload="none"` with poster frames ✅ | — |
| 7.6 | Fonts self-hosted via `next/font` with `display: swap` ✅ | — |

## 8. Content, AEO & GEO — **the largest untapped opportunity**

The homepage is a 2,478-word narrative sales page. It converts, but it is **structurally hostile to extraction** by AI answer engines:

| # | Finding | Sev |
|---|---|---|
| 8.1 | **No definitional block.** "ADHD Belief Score" and "Pattern-to-Belief Map" are coined terms and the page never states a clean, quotable 40–80 word definition. AI engines cite definitions; they cannot cite a narrative arc. | **P0 (GEO)** |
| 8.2 | **No comparison table.** Block 11 ("not another productivity system") argues differentiation in prose. A table comparing the score against planners / medication / coaching / therapy is exactly the artifact LLMs quote. | **P1 (GEO)** |
| 8.3 | FAQ answers are conversationally split across multiple `<p>` tags — first-paragraph answers are often < 20 words, below the 40–80 word extraction sweet spot. | P1 |
| 8.4 | `/terms` is **191 words** — flagged "Low Content Pages". Missing IP, refunds, governing law, and definitions sections a real ToS needs. | **P1** |
| 8.5 | Readability: `/medical-disclaimer` Flesch **46.6 ("Hard")**, `/accessibility` 50.4, `/ai-data-disclosure` 59.9 — long sentences and stacked clauses on the pages that most need to be understood. | P1 |
| 8.6 | **Internal linking is footer-only.** All 6 pages have exactly 6 unique outlinks (the footer nav). The homepage FAQ discusses diagnosis limits, AI handling, and privacy but links to none of `/medical-disclaimer`, `/ai-data-disclosure`, `/privacy` in body copy. Zero contextual anchor text. | **P1** |
| 8.7 | No `Article`/`Blog` surface, no glossary, no topic cluster — 6 pages covering 1 topic. | P2 |
| 8.8 | **Keyword strategy mismatch:** `keyword-map.md` / `keyword-shortlist.csv` target *"adhd and entrepreneurs" / "adhd coach for entrepreneurs"* (a coaching-for-founders positioning). The live site targets the *free ADHD Belief Score*. Neither the titles, H1s, nor body copy pursue the mapped keywords. These are two different businesses. | **P1 (strategy)** |

---

## 9. Priority order for remediation

1. **P0** Security headers (`next.config.ts`) — 100% of URLs affected.
2. **P0** Scope JSON-LD per page; remove `FAQPage`/`VideoObject` from non-home pages.
3. **P0** Image compression + AVIF + drop unreferenced assets.
4. **P0** Add extractable definition + comparison table (GEO).
5. **P1** Per-page OG/Twitter/canonical metadata; fix truncated description.
6. **P1** `noindex` on `/admin`; AI-crawler rules; expose `llms.txt`.
7. **P1** Fix the `aria-hidden` focusable CTA.
8. **P1** Add `WebPage` / `BreadcrumbList` / `Service` / `DefinedTerm` schema.
9. **P1** Expand `/terms`; improve readability; add contextual internal links.
10. **P2** `inlineCss`, cache headers, icons, alt-text trims, H1 length.

---

## 10. Explicitly out of scope (and why)

- **New marketing/blog pages.** A dedicated `/adhd-belief-score` page would cannibalise the homepage, which already targets that exact term as its primary keyword. Topic-cluster expansion is a content-strategy decision with a keyword-positioning conflict (§8.8) that needs a human call — recommended, not executed. See §8 of the final report.
- **Re-recording the VSL with a `.vtt` caption track** — asset-blocked.
- **Claims copy** (`TODO(launch)` markers around the score, dimensions, benchmark, and research wording) — these are factual/legal assertions on a health-adjacent product. Left untouched.
