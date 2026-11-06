# Plan: DietPlan Meal Count Selector & Popup Redesign

## Objectives
1. **Responsive Layout**: Ensure the meal count selector (`Pasti/giorno`) is adjacent to the "Vai al calcolatore" and "Vai al diario" buttons across semi-screen reduced laptop/portable views (`sm:` / `md:` breakpoints).
2. **Popup Warnings**: Remove permanent warning banners for meal counts and replace them with popup/toast notifications or a contextual popup triggered upon selection change.
3. **Dropdown Visuals**: Include color symbols (`⚠️`, `💡`, `✓`, `ℹ️`) directly within the dropdown options (`<option>`) of the meal count selector so users see the guidance before selecting.

## Step-by-Step Implementation Steps

### Step 1: Update `src/components/DietPlan.tsx`
- Refactor the top action bar container (`flex flex-wrap items-center gap-2`) to keep the Calculator button, Diary button, and Meal Count selector grouped adjacently across tablet and laptop viewports (`sm:` / `md:` breakpoints).
- Remove the permanent inline warning banner (`mb-6 px-3 py-2 rounded-lg bg-(--code-bg)...`).
- Add popup/toast triggering when `mealCount` preference changes or when the user clicks an info button next to the selector.
- Update `<option>` elements in the `<select>` dropdown to include descriptive labels with symbols:
  - `1`: "⚠️ 1 pasto/giorno (Sconsigliato)"
  - `2`: "⚠️ 2 pasti/giorno (Limitato)"
  - `3`: "💡 3 pasti/giorno (Standard)"
  - `4`: "✓ 4 pasti/giorno (Ottimale)"
  - `5`: "✓ 5 pasti/giorno (Ottimale)"
  - `6`: "ℹ️ 6 pasti/giorno (Elevato)"
  - `7`: "ℹ️ 7 pasti/giorno (Elevato)"

### Step 2: Add Notification / Popup Logic
- Integrate with `useToast` or a dedicated modal/popup state to show the scientific guidance as a popup when the meal count is modified.

### Step 3: Verify and Test
- Run `npm run lint` and `npm test` to verify correctness.
