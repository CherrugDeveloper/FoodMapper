---
name: testing-foodmapper
description: How to set up and E2E-test the FoodMapper Vite+React+Tailwind v4 app (server, disclaimer gate, dark-mode emulation).
---

# Testing FoodMapper (Vite + React 19 + Tailwind CSS v4)

## App location & serving
- Repo: `/home/ubuntu/repos/foodmapper`; Node at `/home/ubuntu/node22/bin` (prepend to PATH).
- Install: `npm ci` (blueprint already does `npm install`).
- Serve: `npm run preview` → http://localhost:4173/FoodMapper/ (serves `dist/` — run `npm run build` after code changes or the preview shows a stale build). Or `npm run dev` (vite dev server).
- Base path is `/FoodMapper/` — bare `/` 404s.
- Quick freshness check for a preview build: `grep -o '@layer base' dist/assets/index-*.css` or grep for feature-specific tokens.

## Disclaimer gate
- `localStorage.ibs_disclaimer_accepted === 'true'` unlocks the app (checked by `MedicalDisclaimer`).
- To see the modal: `localStorage.clear()` + reload. Modal has its own language select (it renders before the Header).
- i18next caches language in `localStorage.i18nextLng`; `i18next-browser-languagedetector` falls back to `navigator` language — on an en-US browser the "default" is English, not Italian.

## Verifying CSS-cascade/utility bugs rigorously
- Tailwind v4 + this app's 18px root font → rem utilities scale: mb-6=27px, mb-4=18px, mb-2=9px, pb-3=13.5px, text-xl=22.5px, text-2xl=27px. Compare against base-layer values (h2 = 500 weight, 24px, 0 0 8px margin; p = margin 0) to prove utilities apply.
- `space-y-*` in Tailwind v4 uses `margin-block-end` on `:not(:last-child)` (NOT margin-top on siblings — check `marginBlockEnd`).
- `browser_console` returns `undefined` for bare expressions; use `console.log(...)` and read "Logs from your script".

## Dark-mode & viewport emulation (no system setting on this box)
`gsettings color-scheme` schema does not exist. Use CDP on the running Devin Chrome (remote-debugging-port 29229): connect a WebSocket (Node 22 has global `WebSocket`) to the page target's `webSocketDebuggerUrl` from `http://localhost:29229/json`, send `Emulation.setEmulatedMedia {features:[{name:'prefers-color-scheme',value:'dark'}]}`, and **keep the socket open while screenshotting** — closing the CDP session resets emulation. Scripts in `/home/ubuntu/foodmapper-e2e/`:
- `dark-emulate.mjs` — `node dark-emulate.mjs dark <holdSeconds>`
- `viewport-emulate.mjs` — `node viewport-emulate.mjs <w> <h> <holdSeconds>` sends `Emulation.setDeviceMetricsOverride` (e.g. 390x844 mobile) and auto-clears on exit; `--clear` flag clears manually.
- `console-watch.mjs` — attaches `Runtime.consoleAPICalled`/`Runtime.exceptionThrown`/`Log.entryAdded`, reloads the page, and dumps every console event (catches errors `browser_console` can't retrieve retroactively).

## Structure (tab-based app since PR #2)
`<nav>` has 6 buttons (⚙️Calcolo 📔Diario 🍽️Dieta 💪Allenamento 🔍Alimenti 📚Enciclopedia); switching unmounts the other sections (scrollY resets to 0). On narrow viewports the nav wraps in a horizontally scrollable div.
- Calculator results + userData live in App state only — reload clears them: Dieta/Allenamento revert to CTA, diary water progress bar loses its target (glass count persists).
- Diary persists to `localStorage.foodmapper_diary_v1` (JSON keyed by ISO date: `{meals:{breakfast,lunch,snack,dinner}, symptoms[], symptomSeverity, transitScore, bowelMovements, waterGlasses, notes}`). Auto-saves on every change, skipping fully-empty days.
- Water reminder calls `Notification.requestPermission()` — a real Chrome prompt appears; granted → `🔔 Promemoria attivo` + 75-min interval (session-scoped).
- Default calc inputs (70kg/175cm/30y/F/sedentary): kcal 1779, proteins 112g, fats 63g, carbs 191g, fiber 25g→30g w/ diabete, water 2.45L (=10 glasses). Meal kcal badges: Colazione 25%/Pranzo 35%/Spuntino 10%/Cena 30%.
- Season data lives on foods ids 4,5,7,8,9,10: Estate→4 cards, Inverno→2, unseasoned cards show "📅 Tutto l'anno". Search matches `t(foods.{id}.name)` OR raw `food.name` (raw names are Italian — so an Italian term still matches in EN mode).
- Useful anchors: phase buttons `Fase N:`/`Phase N:`, `← Torna all'indice`, `Torna a oggi` (diary date nav), markdown article "Decodificare l'Acronimo FODMAP".
- Watch for layout shifts: clicking a diary transit score reveals a label line and pushes the counters down ~26px — re-screenshot before clicking steppers.

## Devin Secrets Needed
None — the app is fully local, no credentials.
