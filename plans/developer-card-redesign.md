# DeveloperCard Redesign Plan

## Overview

Redesign the DeveloperCard component to add community engagement and fundraising buttons:
- GitHub discussions button (feature proposal)
- Project star button
- Share buttons (WhatsApp, Telegram, X, direct link)
- Refined donate UI with PayPal integration
- Removal of redundant GitHub button
- Overall UI refinement

**File:** `src/components/DeveloperCard.tsx`
**Route:** `/developer` (lazy-loaded in `src/App.tsx:140`)

---

## 1. Current Structure Analysis

### Layout hierarchy (lines 75-216)

```
<section className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
  └── div.card (bg-(--code-bg), border, rounded-2xl, p-4..p-8)
       ├── Developer Info (lines 79-110)
       │    ├── Avatar (lines 80-86)
       │    └── Name + bio + social links (lines 87-109)
       ├── Support the Project (lines 112-165)
       │    ├── PayPal (lines 122-131)
       │    ├── Ko-fi / Buy Me a Coffee (lines 132-164)
       └── Support Links (lines 167-188)
       ├── Contact Support (lines 190-205)
       └── Version footer (lines 207-211)
</section>
```

### Data structures

| Array | Lines | Purpose |
|-------|-------|---------|
| `socialLinks` | 45-47 | GitHub only |
| `donationLinks` | 49-67 | PayPal, Ko-fi, Buy Me a Coffee |
| `supportLinks` | 69-73 | Bug report, feature request, repo link |

### Existing GitHub button

- Line 46: `socialLinks` entry → `REPO_URL` (https://github.com/CherrugDeveloper/FoodMapper)
- Line 72: `supportLinks` entry `repo_link` → `REPO_URL`
- **Redundancy:** GitHub is reachable via two separate buttons

### Existing donations

- **PayPal:** Lines 28-43, 50-55, 122-131 — dynamically loads SDK with `client-id=PRODUCTION_CLIENT_ID` (placeholder!) and `hostedButtonId: 'SANC9MUHSXD9N'`
- **Ko-fi:** Line 57-60 → https://ko-fi.com/foodmapper
- **Buy Me a Coffee:** Lines 56-67, 132-149 — renders official BMC button image

### Existing feature request

- Line 71: `supportLinks` entry `feature_request` → `${REPO_URL}/discussions` (generic discussions page, **not** the ideas category)

### Component usage

- `src/App.tsx:25` — lazy import
- `src/App.tsx:140` — route `path="/developer"`

### i18n keys (public/locales/en/translation.json:549-564)

`developer.name`, `developer.bio`, `developer.support_title`, `developer.support_description`, `developer.support_links_title`, `developer.bug_report`, `developer.feature_request`, `developer.repo_link`, `developer.repo_label`, `developer.contact_title`, `developer.contact_description`, `developer.contact_email`, `developer.version`, `developer.built_with`

---

## 2. Existing Functionality Inventory

| Feature | Status | Location |
|---------|--------|----------|
| GitHub link | ✅ Exists (twice) | `socialLinks:46`, `supportLinks:72` |
| Star button | ❌ Missing | — |
| Share (WhatsApp/Telegram/X/direct) | ❌ Missing | — |
| Donate (PayPal SDK) | ✅ Exists | lines 28-43, 50-55 |
| Donate (Ko-fi / Ko-fi) | ✅ Exists | lines 57-67 |
| Discussions link | ✅ Exists | line 71 → `/discussions` (not ideas category) |
| Bug report | ✅ Exists | line 70 |
| Repo link | ✅ Exists | line 72 |
| Email support | ✅ Exists | lines 197-204 |

**Key findings:**
- No star button exists anywhere in the codebase
- No share buttons exist anywhere in the codebase
- The existing discussions link points to the generic discussions index — the GitHub Discussions **ideas category** is: `https://github.com/CherrugDeveloper/FoodMapper/discussions/categories/ideas`
- PayPal `client-id` is still the placeholder `PRODUCTION_CLIENT_ID` — this must be replaced with the production client ID before donations work

---

## 3. Required Changes

### A. Button inventory (final state)

```
Developer Card → Header row (new)
├── GitHub Discussions   → /discussions/categories/ideas   [NEW dedicated button]
├── Star                → https://github.com/CherrugDeveloper/FoodMapper
└── Share               → opens modal/popup with WhatsApp | Telegram | X | Direct link

Developer Card → Support the Project (refined)
├── Donate (PayPal)     → hosted button SANC9MUHSXD9N + fallback link
├── Ko-fi               → https://ko-fi.com/foodmapper
└── Buy Me a Coffee     → official button image

Developer Card → Support Links (refined)
├── Report a Bug        → /issues
├── Request a Feature   → /discussions (keep, may keep alongside ideas category)
└── GitHub Repository   → repo URL

Developer Card → Contact Support
└── Email               → foodmappersupport@gmail.com
```

### B. Redundancy cleanup

- **Remove** the GitHub entry from `socialLinks` (line 46) — the Repo link button in Support Links plus the new dedicated GitHub Discussions button cover GitHub navigation
- Alternatively keep one GitHub link if desired; but per instructions, remove the redundant button

### C. New share/share functionality

Implement a share modal or popover (triggered by Share button):

```ts
const SHARE_OPTIONS = [
  { platform: 'whatsapp', label: 'Share on WhatsApp', url: (text: string) => `https://wa.me/?text=${encodeURIComponent(text + ' ' + REPO_URL)}` },
  { platform: 'telegram', label: 'Share on Telegram', url: (text: string) => `https://t.me/share/url?url=${encodeURIComponent(REPO_URL)}&text=${encodeURIComponent(text)}` },
  { platform: 'x',        label: 'Share on X',        url: (text: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(REPO_URL)}&text=${encodeURIComponent(text)}` },
  { platform: 'direct',   label: 'Copy direct link',   action: () => navigator.clipboard.writeText(window.location.href) },
];
```

Share text: `"Check out FoodMapper, the open-source IBS/FODMAP-friendly nutrition app: ${REPO_URL}"`

Use a modal (like existing `PerformanceModal`) or a small popover anchored to the Share button.

### D. Star button

Simple external link button:
- URL: `https://github.com/CherrugDeveloper/FoodMapper/stargazers` or the repo root
- Icon: `⭐`
- Placed in the new header row alongside Discussions and Share

### E. PayPal refinements

1. Replace placeholder `client-id=PRODUCTION_CLIENT_ID` with the real production client ID
2. Add a fallback `<a>` link next to/in the PayPal container in case the hosted button script fails to load
3. Consider loading the SDK only when the donate section is visible (currently always on mount)
4. Keep `hostedButtonId: 'SANC9MUHSXD9N'`

### F. UI refinement suggestions

| Area | Current | Suggested |
|------|---------|-----------|
| Card spacing | `p-4 sm:p-6 md:p-8` | Consider `py-4 sm:py-6 md:py-8` vertical vs horizontal balance |
| Buttons | uniform `px-3 sm:px-4 py-2` | Size donate/paypal area more prominently; give Share/Discussions/Star a compact icon+text variant |
| Avatar | circular 80-128px | Could add rounded square or keep — no change needed |
| Sections | border-top divider at line 112 | Keep; maybe add spacing between donate buttons |
| Donate row | PayPal div + 2 links wrapped | Make PayPal span full width or a larger tile; Ko-fi/BMC side-by-side |
| Version footer | plain text | Keep, possibly align left |
| Transitions | consistent hover style | Reuse existing style for all new buttons |

**New header row design** (below avatar/bio, above the border-top):

```tsx
<div className="flex flex-wrap gap-2 sm:gap-3">
  <a href="/discussions/categories/ideas" ...>GitHub Discussions 💡</a>
  <a href={REPO_URL} ...>Star ⭐</a>
  <button onClick={openShare} ...>Share ↗</button>
</div>
```

**Share modal layout:** grid of 4 tiles (WhatsApp, Telegram, X, Direct link), each copying/sharing on click.

---

## 4. New Translations Required (i18n)

Add to `public/locales/*/translation.json` under `developer`:

```json
"developer": {
  ...existing keys...
  "share_title": "Share",
  "share_description": "Spread the word about FoodMapper to friends and the community",
  "share_whatsapp": "Share on WhatsApp",
  "share_telegram": "Share on Telegram",
  "share_x": "Share on X",
  "share_direct": "Copy link",
  "share_copied": "Link copied to clipboard",
  "star": "Star",
  "star_description": "Give us a star on GitHub to support the project",
  "discussions_title": "GitHub Discussions",
  "discussions_description": "Propose new features and give feedback on existing ideas"
}
```

Translation strings for other languages (de, es, fr, it) must be added to the matching locale files.

---

## 5. Implementation Steps

1. **Add new data arrays** (lines after line 43):
   - `shareOptions` (share data with text generation)
   - `communityButtons` (GitHub Discussions, Star, Share)
2. **Create share modal component** (inline in same file or `components/ShareModal.tsx` using `useTranslation` and `useToast`)
3. **Modify `socialLinks`** (line 45-47): remove GitHub entry
4. **Modify `supportLinks`** (line 69-73): keep as-is or add notes
5. **Update PayPal** (line 32): replace placeholder client-id; add fallback link
6. **Refactor JSX render**:
   - New header row with community buttons (after bio)
   - Refined donate section (PayPal tile + fallback)
   - Keep Support Links + Contact + Version sections
7. **Update translations** in all 5 locale files (en, de, es, fr, it)
8. **Run `check_translations.cjs` / translation audit** to confirm no missing keys

---

## 6. Notes & Caveats

- **PayPal client-id:** must be obtained from the PayPal developer dashboard and replaces `PRODUCTION_CLIENT_ID` on line 32. Do not commit the production client ID to a public repo if the project is public — consider a `.env` or a protected key file.
- **PayPal hosted button ID** `SANC9MUHSXD9N` already exists on the PayPal account and is linked to EUR currency.
- **Share modal** must handle `navigator.clipboard` being unavailable (mobile web) and `Notification`-style denied state for direct link copying.
- **Accessibility:** all new buttons need `aria-label` and proper `role`; the share modal should be keyboard-navigable and close on Escape/blur.
- **Tailwind v4 logical spacing** rules apply: `space-y-*` maps to `margin-block-*`.
- **GitHub Pages base:** `vite.config.ts` `base: './'` must be preserved (already correct).
- **TypeScript:** no new types required beyond what's present; reuse `SocialLink`/`DonationLink` interfaces or extend with a `CommunityButton` interface.

---

## 7. Risks

- PayPal hosted button may fail to render if the SDK script source is blocked (ad blockers); the fallback link mitigates this.
- Share URL encoding must handle spaces and special characters correctly (use `encodeURIComponent`).
- Adding a modal changes the DOM; ensure z-index stacking context works with existing components.
