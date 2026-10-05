# Build Integrity Process

This document outlines a repeatable process for maintaining build integrity in the **FoodMapper** project. Follow these steps to ensure a clean and reliable build before pushing changes.

---

## Table of Contents
1. [Resolve ESLint Errors](#resolve-eslint-errors)
2. [Resolve npm Audit Vulnerabilities](#resolve-npm-audit-vulnerabilities)
3. [Approve Pending Install Scripts](#approve-pending-install-scripts)
4. [Ensure CI Pipeline Enforces Checks](#ensure-ci-pipeline-enforces-checks)
5. [Test Locally Before Pushing](#test-locally-before-pushing)

---

## Resolve ESLint Errors

ESLint ensures code quality and consistency. Follow these steps to resolve errors:

1. **Run ESLint**:
   ```bash
   npm run lint
   ```
   
2. **Fix Errors**:
   - Address all reported errors in the terminal output.
   - Use the `--fix` flag for auto-fixable issues:
     ```bash
     npx eslint . --fix
     ```
   
3. **Verify**:
   - Re-run `npm run lint` to ensure all errors are resolved.

---

## Resolve npm Audit Vulnerabilities

npm audit identifies vulnerabilities in project dependencies. Follow these steps to resolve them:

1. **Run Audit**:
   ```bash
   npm audit
   ```
   
2. **Fix Vulnerabilities**:
   - Update vulnerable packages:
     ```bash
     npm update <package-name>
     ```
   - If updates are unavailable, consider using `--force` (not recommended) or manually patching:
     ```bash
     npm audit fix --force
     ```
   
3. **Verify**:
   - Re-run `npm audit` to confirm all vulnerabilities are resolved.

---

## Approve Pending Install Scripts

If there are pending changes to `package.json` or `package-lock.json`, ensure they are approved:

1. **Check for Changes**:
   - Review `package.json` and `package-lock.json` for pending updates.

2. **Update Dependencies**:
   - If new dependencies are added, ensure they are justified and documented.
   - Run:
     ```bash
     npm install
     ```
   
3. **Commit Changes**:
   - Commit the updated `package-lock.json` to ensure consistency across environments.

---

## Ensure CI Pipeline Enforces Checks

The CI pipeline enforces build integrity checks. Verify it is configured correctly:

1. **Check CI Configuration**:
   - Ensure the CI pipeline includes the following checks:
     - ESLint (`npm run lint`)
     - TypeScript compilation (`tsc`)
     - npm audit (`npm audit`)
     - Unit tests (`npm run test:ci`)

2. **Verify CI Pipeline**:
   - Push a small change (e.g., a comment update) to trigger the CI pipeline.
   - Monitor the CI logs for failures and address them.

---

## Test Locally Before Pushing

Test your changes locally to ensure they don't break the build:

1. **Build the Project**:
   ```bash
   npm run build
   ```
   
2. **Run Tests**:
   ```bash
   npm run test
   npm run test:e2e
   ```
   
3. **Preview the Build**:
   ```bash
   npm run preview
   ```
   
4. **Verify Functionality**:
   - Manually test critical features to ensure they work as expected.

---

## Final Checklist Before Pushing

Before pushing your changes, ensure:
- [ ] All ESLint errors are resolved.
- [ ] All npm audit vulnerabilities are addressed.
- [ ] `package-lock.json` is up-to-date and committed.
- [ ] Local tests pass (`npm run test` and `npm run test:e2e`).
- [ ] The build succeeds (`npm run build`).
- [ ] CI pipeline passes for the latest commit.

---

By following this process, you help maintain the integrity and reliability of the **FoodMapper** project.