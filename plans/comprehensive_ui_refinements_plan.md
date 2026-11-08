# Comprehensive UI Refinements and DayNavigator Fixes Plan

## Objectives
1. **NutritionalCalculator & MedicationSelector Refinements**:
   - Define and localize `diet_meal_count_1_label` and `diet_meal_count_2_label` across all translation files.
   - Update `diet_meal_count_6_label` and `diet_meal_count_7_label` to explicitly indicate they are discouraged (`sconsigliati`).
   - Standardize `diet_meal_count_4_label` styling with background and border consistency.
   - Align health condition selection styling and color contrast with allergen selection (`amber-600` styling).
   - Fix InfoPopup key prefix duplication (e.g. `fodmap_Fruttosio`).
   - Relocate the pharmacological therapy `InfoPopup` from below the text field to right beside its label in [`src/components/MedicationSelector.tsx`](src/components/MedicationSelector.tsx:177).

2. **DayNavigator Calendar & Critical Bug Fixes**:
   - **Critical Priority**: Resolve UI freezing / button unresponsiveness caused by event handling, pointer events, or propagation in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
   - **Calendar Navigation**: Fix month generation and traversal logic to correctly transition between sequential months without arbitrary jumping.
   - **Grayed-out Logic**: Restrict grayed-out styling strictly to days outside the current active calendar month.
   - **Date Selection & Clamping**: Ensure flexible selection logic without premature or incorrect past clamping.
   - **Diet Start Date Badge & Drag-and-Drop**: Display a visual diet start date badge on the respective calendar cell and support drag-and-drop re-assignment of the start date to another calendar day.

## Mermaid Architecture Diagram
```mermaid
graph TD
    A[NutritionalCalculator] --> B[Meal Count Selector]
    A --> C[Health Conditions (Amber Contrast)]
    A --> D[MedicationSelector]
    D --> E[InfoPopup next to label]
    
    F[DayNavigator] --> G[Calendar Grid & Month Navigation]
    F --> H[DayCell with Start Date Badge & Drag-and-Drop]
    F --> I[Event Propagation & Pointer Interactivity Fix]
    
    J[Localization Files] --> K[Meal Count Labels & Warnings]
    J --> L[Info Popup Cleanups]
```
