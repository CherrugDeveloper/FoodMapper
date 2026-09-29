---
name: hook-first-guard-verification
description: Applies the Hook-First Guard pattern for React Hooks and uses Gate-First Verification (ESLint --max-warnings=0 then tsc --noEmit) to prevent rule-of-hooks and type/nullability regressions.
---

# When to use
- When implementing or refactoring React components using `useState`, `useEffect`, `useCallback`, `useMemo`, etc.
- When ESLint reports `react-hooks/rules-of-hooks` ("React Hook ... is called conditionally") or `react-hooks/*` failures.
- When TypeScript reports `possibly null/undefined` issues and you need a safe guard strategy.
- When CI-style checks require **no warnings**.

# When NOT to use
- When you only need to add UI markup (no hook logic changes) and there are no lint/type failures.
- When you are changing ESLint rules globally as the primary fix (treat that as last resort).

# Inputs required from the user
1. The failing output (at least):
   - ESLint rule(s) / messages
   - TypeScript error(s) (if any)
2. The target file(s) where the hooks/types need adjustment.

# Workflow
1. Run **Gate-First Verification** in the repo:
   1) Execute `npx eslint . --max-warnings=0`.
   2) Execute `npx tsc -p tsconfig.json --noEmit`.
2. If ESLint complains about `react-hooks/rules-of-hooks`:
   1) Apply the **Hook-First Guard** invariant:
      - Ensure every `use*` hook is called unconditionally and in the exact same order on every render.
      - If you need to handle `null/undefined`, do it **after hooks** (in returned UI branches) or **inside callback bodies**.
   2) Preferred fix pattern:
      - Move/keep all `useCallback`/`useMemo` declarations before any `return ...` that might skip them.
      - In each callback, early-return when data is missing, e.g. `if (!recipe) return;`.
3. If TypeScript reports `possibly null/undefined`:
   1) Prefer safe runtime guards that preserve the Hook call order (e.g., early-return inside callbacks).
   2) Use UI-level guards only *after* all hooks are declared.
4. Re-verify:
   1) Re-run `npx eslint . --max-warnings=0`.
   2) Re-run `npx tsc -p tsconfig.json --noEmit`.

# Examples
- `react-hooks/rules-of-hooks` fix: keep `useCallback` declarations above `if (!data) return null;`, and do `if (!data) return;` inside the callback.
- `possibly null` fix: guard inside callback bodies rather than around the hook call.

# Troubleshooting / edge cases
- If the hook order still fails, identify whether a guard changed control-flow such that some hook declarations are skipped. Ensure *all* hook declarations are at the same lexical level within the component body.
- Avoid “fixing” hook errors by disabling `react-hooks/*` rules unless you are explicitly managing/accepting technical debt; the recommended outcome is correctness via Hook-First Guard.
