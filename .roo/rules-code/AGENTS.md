# IBS Nutrition App - Coding-Specific Rules

## Non-obvious implementation constraints
- Storage: use `src/utils/storage.ts` helpers; most keys are prefixed with `foodmapper_` but the disclaimer key is `ibs_disclaimer_accepted` (no prefix).
- Food filtering: keep bilingual matching in `FoodFilter` (translated `foods.{id}.name` AND raw `food.name`), case-insensitive.
- Seasonal logic: only foods with IDs 4, 5, 7, 8, 9, 10 use `food.months`; if `months` is missing, the food is year-round.
- MedicalDisclaimer: language selector must remain inside the disclaimer modal and must work before the main Header renders.
- Tailwind v4 spacing: `space-y-*` is implemented via logical properties (`margin-block-*`), so do not “fix” spacing with margin-top/bottom.
- Water reminder permissions: handle `Notification.requestPermission()` states properly (`'granted'/'denied'` plus `'unsupported'`/feature detection) and ensure cleanup for timers.
