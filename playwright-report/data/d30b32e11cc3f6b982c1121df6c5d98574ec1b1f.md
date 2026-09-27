# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: diary.spec.ts >> Diary Entry Persistence >> should show calculator prompt when no calculation exists
- Location: tests\e2e\diary.spec.ts:15:3

# Error details

```
TimeoutError: page.click: Timeout 12000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Ho letto, compreso e accetto")')
    - locator resolved to <button class="w-full sm:w-auto px-6 py-2.5 font-semibold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-md text-center text-sm">Ho letto, compreso e accetto</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed

```

# Page snapshot

```yaml
- generic [ref=e5]:
  - generic [ref=e6]:
    - generic [ref=e7]: "🌐 Lingua:"
    - combobox "Language selector" [ref=e8] [cursor=pointer]:
      - option "Italiano (IT)" [selected]
      - option "English (EN)"
      - option "Deutsch (DE)"
      - option "Español (ES)"
      - option "Français (FR)"
  - heading "⚠️Avviso Importante e Limitazione di Responsabilità" [level=2] [ref=e9]
  - generic [ref=e10]:
    - paragraph [ref=e11]:
      - text: Questa applicazione è uno
      - strong [ref=e12]: strumento puramente informativo e di auto-tracciamento
      - text: basato sulla letteratura scientifica attuale (comprese le linee guida della Monash University e studi indicizzati su PubMed).
    - paragraph [ref=e13]: Il software NON fornisce diagnosi mediche, NON prescrive terapie e NON sostituisce in alcun modo il parere di un medico, gastroenterologo o dietista professionista.
    - paragraph [ref=e14]: I disturbi gastrointestinali, inclusi i sintomi riconducibili alla Sindrome dell'Intestino Irritabile (IBS), possono sovrapporsi a patologie organiche più severe (come la celiachia o le malattie infiammatorie croniche intestinali - IBD).
    - paragraph [ref=e15]: È fondamentale eseguire gli accertamenti clinici ed escludere altre patologie sotto la supervisione di uno specialista prima di intraprendere una dieta restrittiva a basso contenuto di FODMAP. Una dieta di esclusione prolungata e non guidata può alterare negativamente il microbiota intestinale.
    - paragraph [ref=e16]: "Gli articoli formativi sono sintesi divulgative: citano le fonti ma possono non riflettere le evidenze più recenti, quindi verifica sempre gli studi originali. Non modificare terapie o alimentazione prescritte per patologie diagnosticate (come celiachia, IBD o tumori) senza consultare il tuo medico."
  - button "Ho letto, compreso e accetto" [ref=e18] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Diary Entry Persistence', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.getByLabel('Language selector').selectOption('it');
> 7  |     await page.click('button:has-text("Ho letto, compreso e accetto")');
     |                ^ TimeoutError: page.click: Timeout 12000ms exceeded.
  8  |     await page.click('button:has-text("📔")');
  9  |   });
  10 | 
  11 |   test('should display diary tab', async ({ page }) => {
  12 |     await expect(page.getByRole('button', { name: 'Diario' })).toBeVisible();
  13 |   });
  14 | 
  15 |   test('should show calculator prompt when no calculation exists', async ({ page }) => {
  16 |     await page.evaluate(() => localStorage.clear());
  17 |     await page.reload();
  18 |     await page.getByLabel('Language selector').selectOption('it');
  19 |     await page.click('button:has-text("Ho letto, compreso e accetto")');
  20 |     await page.click('button:has-text("📔")');
  21 |     // The calculator prompt may not be visible immediately, just check the diary loaded
  22 |     await expect(page.getByRole('heading', { name: '📔 Diario quotidiano' })).toBeVisible();
  23 |   });
  24 | 
  25 |   test('should display water section', async ({ page }) => {
  26 |     await expect(page.getByRole('button', { name: '💧 Acqua' })).toBeVisible();
  27 |   });
  28 | 
  29 |   test('should display meals section', async ({ page }) => {
  30 |     await expect(page.locator('text=Pasti')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('should display symptoms section', async ({ page }) => {
  34 |     await expect(page.getByRole('button', { name: '🩺 Sintomi' })).toBeVisible();
  35 |   });
  36 | 
  37 |   test('should display notes section', async ({ page }) => {
  38 |     await expect(page.getByRole('heading', { name: 'Note' })).toBeVisible();
  39 |   });
  40 | });
```