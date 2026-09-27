# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: diary.spec.ts >> Diary Entry Persistence >> should display symptoms section
- Location: tests\e2e\diary.spec.ts:33:3

# Error details

```
Test timeout of 45000ms exceeded while running "beforeEach" hook.
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - banner [ref=e5]:
    - generic [ref=e6]: FoodMapper
    - generic [ref=e16]:
      - button "Notifiche" [ref=e18] [cursor=pointer]
      - generic [ref=e23]: "🌐 Language:"
      - combobox "Language selector" [ref=e24] [cursor=pointer]:
        - option "Italiano" [selected]
        - option "English"
        - option "Español"
        - option "Français"
        - option "Deutsch"
  - navigation [ref=e25]:
    - generic [ref=e26]:
      - button "Calcolo" [ref=e27] [cursor=pointer]:
        - generic [aria-hidden] [ref=e28]: ⚙️
        - text: Calcolo
      - button "Diario" [active] [ref=e29] [cursor=pointer]:
        - generic [aria-hidden] [ref=e30]: 📔
        - text: Diario
      - button "Dieta" [ref=e31] [cursor=pointer]:
        - generic [aria-hidden] [ref=e32]: 🍽️
        - text: Dieta
      - button "Ricette" [ref=e33] [cursor=pointer]:
        - generic [aria-hidden] [ref=e34]: 📖
        - text: Ricette
      - button "Spesa" [ref=e35] [cursor=pointer]:
        - generic [aria-hidden] [ref=e36]: 🛒
        - text: Spesa
      - button "Allenamento" [ref=e37] [cursor=pointer]:
        - generic [aria-hidden] [ref=e38]: 💪
        - text: Allenamento
      - button "Alimenti" [ref=e39] [cursor=pointer]:
        - generic [aria-hidden] [ref=e40]: 🔍
        - text: Alimenti
      - button "Enciclopedia" [ref=e41] [cursor=pointer]:
        - generic [aria-hidden] [ref=e42]: 📚
        - text: Enciclopedia
      - button "Changelog" [ref=e43] [cursor=pointer]:
        - generic [aria-hidden] [ref=e44]: 📋
        - text: Changelog
      - button "Sviluppatore" [ref=e45] [cursor=pointer]:
        - generic [aria-hidden] [ref=e46]: 👨‍💻
        - text: Sviluppatore
  - main [ref=e47]:
    - generic [ref=e48]:
      - heading "📔 Diario quotidiano" [level=2] [ref=e49]
      - generic [ref=e50]:
        - button "‹" [ref=e51] [cursor=pointer]
        - generic [ref=e52]: domenica 27 settembre 2026
        - button "›" [disabled] [ref=e54]
      - generic [ref=e55]:
        - heading "⚡ Riepilogo Rapido" [level=3] [ref=e57]
        - generic [ref=e58]:
          - generic [ref=e60]:
            - generic [ref=e61]: Calorie
            - strong [ref=e63]: "0"
          - generic [ref=e65]:
            - generic [ref=e66]: Acqua
            - strong [ref=e68]: "0"
          - generic [ref=e70]:
            - generic [ref=e71]: Sintomi
            - strong [ref=e72]: "0"
          - generic [ref=e74]:
            - generic [ref=e75]: Transito
            - generic [ref=e76]: —
      - generic [ref=e77]:
        - generic [ref=e78]:
          - generic [ref=e79]:
            - heading "🍽️ Pasti" [level=3] [ref=e80]
            - button "Reset Giornata" [ref=e81] [cursor=pointer]
          - generic [ref=e82]:
            - button "Mostra Tutti" [ref=e83] [cursor=pointer]
            - button "Colazione" [ref=e84] [cursor=pointer]
            - button "Pranzo" [ref=e85] [cursor=pointer]
            - button "Spuntino" [ref=e86] [cursor=pointer]
            - button "Cena" [ref=e87] [cursor=pointer]
          - generic [ref=e88]:
            - generic [ref=e89]:
              - generic [ref=e90]:
                - generic [ref=e91]: Colazione
                - button "Reset" [ref=e92] [cursor=pointer]
              - textbox "Cosa hai mangiato?" [ref=e93]
              - combobox [ref=e95]:
                - option "+ Aggiungi alimento" [selected]
                - option "Pane di Frumento / Pasta comune"
                - option "Riso Bianco e Integrale"
                - option "Avena in fiocchi"
                - option "Quinoa"
                - option "Mais / Polenta"
                - option "Grano Saraceno"
                - option "Pane e Pasta Gluten-Free certificati"
                - option "Tagliatelle di Shirataki (konjac)"
                - option "Farro perlato"
                - option "Aglio e Cipolla"
                - option "Zucchine"
                - option "Carote"
                - option "Carciofi e Scalogno"
                - option "Spinaci freschi"
                - option "Finocchio"
                - option "Peperoni"
                - option "Pomodori"
                - option "Cavolfiore"
                - option "Patate"
                - option "Zucca (butternut)"
                - option "Melanzane"
                - option "Broccoli (cimette)"
                - option "Asparagi"
                - option "Cetrioli"
                - option "Rucola"
                - option "Barbabietola rossa cotta"
                - option "Mele e Pere"
                - option "Fragole e Mirtilli"
                - option "Anguria"
                - option "Arance e Mandarini"
                - option "Kiwi"
                - option "Banana (soda, non matura)"
                - option "Melone cantalupo"
                - option "Ananas"
                - option "Ciliegie"
                - option "Papaia"
                - option "Lamponi"
                - option "Prugne secche (senza nocciolo)"
                - option "Uva (porzione controllata)"
                - option "Latte vaccino e Formaggi freschi"
                - option "Parmigiano Reggiano / Grana Padano"
                - option "Uova e Carne fresca"
                - option "Legumi (Fagioli, Lenticchie comuni)"
                - option "Petto di Pollo / Tacchino"
                - option "Pesce azzurro (Sarde, Sgombro)"
                - option "Tofu sodo"
                - option "Yogurt greco senza lattosio"
                - option "Mozzarella di bufala"
                - option "Tempeh"
                - option "Manzo magro"
                - option "Olio EVO"
                - option "Mandorle (max ~10)"
                - option "Semi di Chia"
                - option "Semi di Zucca"
                - option "Cioccolato fondente ≥70%"
                - option "Miele"
                - option "Sciroppo d'Acero"
                - option "Zenzero fresco"
                - option "Aceto di mele"
                - option "Curcuma in polvere"
                - option "Senape (al naturale)"
                - option "Caffè espresso"
                - option "Tè verde (infuso)"
                - option "Tisana camomilla (infuso)"
                - option "Acqua minerale"
                - option "Latte di avena senza zuccheri aggiunti"
                - option "Burro chiarificato (Ghee)"
                - option "Noci (mix, max ~30g)"
            - generic [ref=e96]:
              - generic [ref=e97]:
                - generic [ref=e98]: Pranzo
                - button "Reset" [ref=e99] [cursor=pointer]
              - textbox "Cosa hai mangiato?" [ref=e100]
              - combobox [ref=e102]:
                - option "+ Aggiungi alimento" [selected]
                - option "Pane di Frumento / Pasta comune"
                - option "Riso Bianco e Integrale"
                - option "Avena in fiocchi"
                - option "Quinoa"
                - option "Mais / Polenta"
                - option "Grano Saraceno"
                - option "Pane e Pasta Gluten-Free certificati"
                - option "Tagliatelle di Shirataki (konjac)"
                - option "Farro perlato"
                - option "Aglio e Cipolla"
                - option "Zucchine"
                - option "Carote"
                - option "Carciofi e Scalogno"
                - option "Spinaci freschi"
                - option "Finocchio"
                - option "Peperoni"
                - option "Pomodori"
                - option "Cavolfiore"
                - option "Patate"
                - option "Zucca (butternut)"
                - option "Melanzane"
                - option "Broccoli (cimette)"
                - option "Asparagi"
                - option "Cetrioli"
                - option "Rucola"
                - option "Barbabietola rossa cotta"
                - option "Mele e Pere"
                - option "Fragole e Mirtilli"
                - option "Anguria"
                - option "Arance e Mandarini"
                - option "Kiwi"
                - option "Banana (soda, non matura)"
                - option "Melone cantalupo"
                - option "Ananas"
                - option "Ciliegie"
                - option "Papaia"
                - option "Lamponi"
                - option "Prugne secche (senza nocciolo)"
                - option "Uva (porzione controllata)"
                - option "Latte vaccino e Formaggi freschi"
                - option "Parmigiano Reggiano / Grana Padano"
                - option "Uova e Carne fresca"
                - option "Legumi (Fagioli, Lenticchie comuni)"
                - option "Petto di Pollo / Tacchino"
                - option "Pesce azzurro (Sarde, Sgombro)"
                - option "Tofu sodo"
                - option "Yogurt greco senza lattosio"
                - option "Mozzarella di bufala"
                - option "Tempeh"
                - option "Manzo magro"
                - option "Olio EVO"
                - option "Mandorle (max ~10)"
                - option "Semi di Chia"
                - option "Semi di Zucca"
                - option "Cioccolato fondente ≥70%"
                - option "Miele"
                - option "Sciroppo d'Acero"
                - option "Zenzero fresco"
                - option "Aceto di mele"
                - option "Curcuma in polvere"
                - option "Senape (al naturale)"
                - option "Caffè espresso"
                - option "Tè verde (infuso)"
                - option "Tisana camomilla (infuso)"
                - option "Acqua minerale"
                - option "Latte di avena senza zuccheri aggiunti"
                - option "Burro chiarificato (Ghee)"
                - option "Noci (mix, max ~30g)"
            - generic [ref=e103]:
              - generic [ref=e104]:
                - generic [ref=e105]: Spuntino
                - button "Reset" [ref=e106] [cursor=pointer]
              - textbox "Cosa hai mangiato?" [ref=e107]
              - combobox [ref=e109]:
                - option "+ Aggiungi alimento" [selected]
                - option "Pane di Frumento / Pasta comune"
                - option "Riso Bianco e Integrale"
                - option "Avena in fiocchi"
                - option "Quinoa"
                - option "Mais / Polenta"
                - option "Grano Saraceno"
                - option "Pane e Pasta Gluten-Free certificati"
                - option "Tagliatelle di Shirataki (konjac)"
                - option "Farro perlato"
                - option "Aglio e Cipolla"
                - option "Zucchine"
                - option "Carote"
                - option "Carciofi e Scalogno"
                - option "Spinaci freschi"
                - option "Finocchio"
                - option "Peperoni"
                - option "Pomodori"
                - option "Cavolfiore"
                - option "Patate"
                - option "Zucca (butternut)"
                - option "Melanzane"
                - option "Broccoli (cimette)"
                - option "Asparagi"
                - option "Cetrioli"
                - option "Rucola"
                - option "Barbabietola rossa cotta"
                - option "Mele e Pere"
                - option "Fragole e Mirtilli"
                - option "Anguria"
                - option "Arance e Mandarini"
                - option "Kiwi"
                - option "Banana (soda, non matura)"
                - option "Melone cantalupo"
                - option "Ananas"
                - option "Ciliegie"
                - option "Papaia"
                - option "Lamponi"
                - option "Prugne secche (senza nocciolo)"
                - option "Uva (porzione controllata)"
                - option "Latte vaccino e Formaggi freschi"
                - option "Parmigiano Reggiano / Grana Padano"
                - option "Uova e Carne fresca"
                - option "Legumi (Fagioli, Lenticchie comuni)"
                - option "Petto di Pollo / Tacchino"
                - option "Pesce azzurro (Sarde, Sgombro)"
                - option "Tofu sodo"
                - option "Yogurt greco senza lattosio"
                - option "Mozzarella di bufala"
                - option "Tempeh"
                - option "Manzo magro"
                - option "Olio EVO"
                - option "Mandorle (max ~10)"
                - option "Semi di Chia"
                - option "Semi di Zucca"
                - option "Cioccolato fondente ≥70%"
                - option "Miele"
                - option "Sciroppo d'Acero"
                - option "Zenzero fresco"
                - option "Aceto di mele"
                - option "Curcuma in polvere"
                - option "Senape (al naturale)"
                - option "Caffè espresso"
                - option "Tè verde (infuso)"
                - option "Tisana camomilla (infuso)"
                - option "Acqua minerale"
                - option "Latte di avena senza zuccheri aggiunti"
                - option "Burro chiarificato (Ghee)"
                - option "Noci (mix, max ~30g)"
            - generic [ref=e110]:
              - generic [ref=e111]:
                - generic [ref=e112]: Cena
                - button "Reset" [ref=e113] [cursor=pointer]
              - textbox "Cosa hai mangiato?" [ref=e114]
              - combobox [ref=e116]:
                - option "+ Aggiungi alimento" [selected]
                - option "Pane di Frumento / Pasta comune"
                - option "Riso Bianco e Integrale"
                - option "Avena in fiocchi"
                - option "Quinoa"
                - option "Mais / Polenta"
                - option "Grano Saraceno"
                - option "Pane e Pasta Gluten-Free certificati"
                - option "Tagliatelle di Shirataki (konjac)"
                - option "Farro perlato"
                - option "Aglio e Cipolla"
                - option "Zucchine"
                - option "Carote"
                - option "Carciofi e Scalogno"
                - option "Spinaci freschi"
                - option "Finocchio"
                - option "Peperoni"
                - option "Pomodori"
                - option "Cavolfiore"
                - option "Patate"
                - option "Zucca (butternut)"
                - option "Melanzane"
                - option "Broccoli (cimette)"
                - option "Asparagi"
                - option "Cetrioli"
                - option "Rucola"
                - option "Barbabietola rossa cotta"
                - option "Mele e Pere"
                - option "Fragole e Mirtilli"
                - option "Anguria"
                - option "Arance e Mandarini"
                - option "Kiwi"
                - option "Banana (soda, non matura)"
                - option "Melone cantalupo"
                - option "Ananas"
                - option "Ciliegie"
                - option "Papaia"
                - option "Lamponi"
                - option "Prugne secche (senza nocciolo)"
                - option "Uva (porzione controllata)"
                - option "Latte vaccino e Formaggi freschi"
                - option "Parmigiano Reggiano / Grana Padano"
                - option "Uova e Carne fresca"
                - option "Legumi (Fagioli, Lenticchie comuni)"
                - option "Petto di Pollo / Tacchino"
                - option "Pesce azzurro (Sarde, Sgombro)"
                - option "Tofu sodo"
                - option "Yogurt greco senza lattosio"
                - option "Mozzarella di bufala"
                - option "Tempeh"
                - option "Manzo magro"
                - option "Olio EVO"
                - option "Mandorle (max ~10)"
                - option "Semi di Chia"
                - option "Semi di Zucca"
                - option "Cioccolato fondente ≥70%"
                - option "Miele"
                - option "Sciroppo d'Acero"
                - option "Zenzero fresco"
                - option "Aceto di mele"
                - option "Curcuma in polvere"
                - option "Senape (al naturale)"
                - option "Caffè espresso"
                - option "Tè verde (infuso)"
                - option "Tisana camomilla (infuso)"
                - option "Acqua minerale"
                - option "Latte di avena senza zuccheri aggiunti"
                - option "Burro chiarificato (Ghee)"
                - option "Noci (mix, max ~30g)"
        - generic [ref=e117]:
          - generic [ref=e118]:
            - button "🩺 Sintomi" [ref=e119] [cursor=pointer]
            - button "🚽 Transito intestinale" [ref=e120] [cursor=pointer]
            - button "💧 Acqua" [ref=e121] [cursor=pointer]
          - generic [ref=e123]:
            - generic [ref=e124]:
              - generic [ref=e125]:
                - button "−" [ref=e126] [cursor=pointer]
                - strong [ref=e127]: "0"
                - button "+" [ref=e128] [cursor=pointer]
              - generic [ref=e129]: 0 bicchieri (~250 ml l'uno)
            - button "🔕 Attiva promemoria" [ref=e130] [cursor=pointer]
        - generic [ref=e131]:
          - heading "📝 Note" [level=3] [ref=e132]
          - textbox "Contesto, stress, sonno, farmaci..." [ref=e133]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Diary Entry Persistence', () => {
> 4  |   test.beforeEach(async ({ page }) => {
     |        ^ Test timeout of 45000ms exceeded while running "beforeEach" hook.
  5  |     await page.goto('/');
  6  |     await page.getByLabel('Language selector').selectOption('it');
  7  |     await page.click('button:has-text("Ho letto, compreso e accetto")');
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