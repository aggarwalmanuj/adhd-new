# Mobile-First Shipping Checklist

**~80 to 90% of our traffic is mobile, and it is paid.** An unoptimised mobile
view is wasted ad spend. Every new page or component is built and reviewed on
mobile FIRST (360px), then scaled up. Do not ship desktop-only work.

Run through this list before merging any page or component. Target viewports:
**360px, 390px, 430px** (small Android to iPhone Pro Max), then tablet, then
desktop.

## How to test

1. Chrome/Brave DevTools > device toolbar (Ctrl+Shift+M). Check iPhone SE (375),
   iPhone 14 Pro Max (430), and a 360px Android.
2. Set DevTools width to exactly **360px** and scroll the whole page: there must
   be **zero horizontal scroll**.
3. Run Lighthouse (mobile preset) on the built app (`npm run build && npm start`,
   then Lighthouse in an incognito window). **Performance, Accessibility, Best
   Practices, SEO must each be > 90.**
4. Sanity-check on at least one real phone before a paid campaign points at it.

## Layout & viewport

- [ ] No horizontal scroll at 360px. (Common causes: a flex/grid child without
      `min-w-0`; fixed widths; unbroken long words; full-bleed images; negative
      margins. We keep `overflow-x: clip` on `html` as a net, but fix the source.)
- [ ] `viewport` is `width=device-width, initial-scale=1`. Never set
      `maximum-scale` or `user-scalable=no` (a11y failure; pinch-zoom must work).
- [ ] Content respects safe areas / notches (no critical UI in the top-left/right
      corners under the status bar).
- [ ] Sections use responsive padding (e.g. `px-5 sm:px-8`, `py-20 sm:py-32`),
      not fixed desktop values.
- [ ] Grids/columns collapse to a single column on mobile.

## Typography (audience skews older, err larger)

- [ ] Body copy is at least **17px** (`body` base is `1.0625rem`; long-form uses
      `.text-body-lg`). Nothing important below 16px.
- [ ] Display/headlines use `clamp()` and never overflow their container; add
      `overflow-wrap: break-word` on large headings.
- [ ] Line length stays readable on mobile (`max-w-2xl`/`max-w-xl` for prose).
- [ ] Sufficient contrast (WCAG AA: 4.5:1 body, 3:1 large text). Marine tokens
      are tuned for this; re-check any custom color.

## Tap targets & interaction

- [ ] Every button/link is at least **44x44px** effective tap size (our `.btn`
      pill clears this; give small text links vertical padding).
- [ ] Adjacent tap targets have enough spacing that fingers don't mis-hit.
- [ ] Primary CTA is thumb-reachable and, on mobile, full-width or near it.
- [ ] `:focus-visible` is present and visible (teal ring) for keyboard users.
- [ ] Hover-only affordances have a non-hover equivalent (no info hidden behind
      hover on touch).

## Forms (note: this funnel collects data on aimerge.live, not here)

- [ ] Inputs render at **>= 16px** font (prevents iOS focus-zoom; enforced
      globally for `input/textarea/select`).
- [ ] Correct `type`/`inputmode`/`autocomplete` (email, tel, etc.) so mobile
      keyboards and autofill work.
- [ ] Labels are real `<label>`s; errors are announced (`aria-live`).
- [ ] Tap targets in the form (radios/checkboxes/submit) meet 44px.

## Media & performance

- [ ] Images use `next/image` with correct `width`/`height` (no layout shift);
      hero image has `priority`, below-fold images lazy-load.
- [ ] No oversized images shipped to phones; art-direct heights per breakpoint
      (e.g. `h-64 sm:h-80 lg:h-136`).
- [ ] Fonts use `next/font` with `display: swap`; no render-blocking web fonts.
- [ ] Animations run on `transform`/`opacity` only and honour
      `prefers-reduced-motion` (our globals disable ken-burns / reveals / pulse).
- [ ] Lighthouse mobile: LCP < 2.5s, CLS < 0.1, no long main-thread blocks.

## Content & CTA (funnel policy)

- [ ] Page **leads with the free CTA**; primary action is obvious above the fold.
- [ ] **No pricing tiers / dollar amounts on the landing page.** Pricing lives
      deeper in the funnel, after the free Belief Score experience.
- [ ] "No credit card required" appears directly beneath the primary CTA, and the
      Belief Score is clearly described as free.
- [ ] Outbound scorecard CTAs forward attribution (`ScorecardCta` handles this).

## Definition of done

- [ ] Renders cleanly with no horizontal scroll from 360px to 430px.
- [ ] Lighthouse mobile scores all > 90.
- [ ] Verified in DevTools mobile emulation AND on one real device before a paid
      campaign is pointed at the page.
