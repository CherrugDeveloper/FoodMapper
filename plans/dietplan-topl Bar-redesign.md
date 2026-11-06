# DietPlan Top Bar Redesign Plan

## Requirements

### Mobile/Tablet Layout (semi-screen reduced)
- Meal count selector ("Pasti/giorno") should be **affiancata** (adjacent) to "Vai al calcolatore" and "Vai al diario" buttons on laptop screens when reduced

### Meal Count Selector
- Scientific guidance warnings should be **popups** (not permanent display)
- Color coding and symbols should be **visible in the dropdown select list**

## Implementation Steps

### 1. Create a custom meal count selector with popup
- Create a new component or modify the select dropdown
- Add visual indicators (colors/symbols) to each option in the dropdown
- Implement a popup/modal that shows guidance when meal count is selected

### 2. Responsive layout adjustment
- Use Tailwind responsive classes
- On medium screens and below, stack: Calculator button, Diary button, Meal count selector
- Use `sm:` breakpoints to control layout changes

### 3. Create custom select with visual indicators
- Options should show:
  - ⚠️ for 1-2 meals (amber warning)
  - 💡 for 3 meals (info)
  - ✓ for 4-5 meals (green check - optimal)
  - ℹ️ for 6-7 meals (info)

### 4. Implement popup for scientific guidance
- When meal count selection changes, show a popup with detailed guidance
- Popup should be dismissible

## Technical Details

### Current Structure (lines 81-112)
```
<div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
  Calculator button
  Diary button  
  Meal count select (with hidden warning messages below)
</div>
```

### New Structure
```
<div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
  Calculator button
  Diary button
  Meal count selector with visual indicators in dropdown
  {Warning popup shown conditionally}
</div>
```

### Visual Design for Select Options
- 1 meal: ⚠️ 1 - Non raccomandato
- 2 meals: ⚠️ 2 - Frequenza limitata
- 3 meals: 💡 3 - Standard tradizionale
- 4 meals: ✓ 4 - Ottimale
- 5 meals: ✓ 5 - Ottimale
- 6 meals: ℹ️ 6 - Frequenza elevata
- 7 meals: ℹ️ 7 - Frequenza elevata

## Files to Modify
- `src/components/DietPlan.tsx` - Main component
- Possibly create a new `src/components/MealCountSelector.tsx` component