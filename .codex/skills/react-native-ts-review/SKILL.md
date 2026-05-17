---
name: react-native-ts-review
description: Review React Native and TypeScript apps for correctness, mobile UX, accessibility, performance, Expo dependency compatibility, storage/security, tests, Storybook coverage, CI, and maintainability. Use when asked to review, audit, harden, or improve a React Native, Expo, React Native Web, or TypeScript mobile app/codebase.
---

# React Native TypeScript Review

Use this skill to perform a senior-engineer code review of a React Native + TypeScript app. Prioritize bugs, build risks, platform regressions, accessibility problems, stale-hook issues, storage/security mistakes, and missing tests. Do not make broad refactors unless they directly reduce risk.

## Review Workflow

1. Inspect the project shape: `package.json`, lockfile, Expo/RN/React/RN Web versions, build scripts, CI, lint/test config, and platform-specific files.
2. Inspect app code: `src/components`, `src/utils`, `src/constants`, `src/types`, navigation/state/storage/animation/gesture code, and web/native branches.
3. Inspect quality surfaces: unit tests, Storybook stories, a11y addon setup, Jest mocks, ESLint, Prettier, TypeScript config, and pre-commit/CI checks.
4. Run relevant checks when possible: format, lint, typecheck, unit tests, app build, Storybook build, and Expo dependency validation.
5. Report findings first, ordered by severity, with concrete fixes.

## Checklist

### TypeScript

- Ensure props, state, utility return values, and domain models are explicit where inference is not enough.
- Prefer discriminated unions for UI, request, and game states.
- Flag `any`, unsafe casts, non-null assertions, overly broad types, and circular type imports.
- Keep shared types in stable locations and avoid component-local types leaking across boundaries.

### React Hooks

- Verify hook dependency arrays reflect actual reactive dependencies.
- Do not expand hook deps only to satisfy ESLint.
- If deps are unstable, recommend refactoring with smaller effects, reducers, refs, event handlers, or derived render-time values.
- Flag stale closures, async effects without cleanup, and state updates after unmount.

### React Native And Expo

- Check iOS, Android, and web behavior separately.
- Confirm Expo SDK, React Native, React, and React Native Web versions are compatible.
- Prefer `npx expo install --check` in CI for Expo apps.
- Flag reliance on private Expo/RN internals unless isolated to local test mocks.
- Check native build scripts, EAS config, web export, and Storybook build coverage when present.

### Accessibility

- Interactive elements must expose a clear role or `accessibilityRole` and an accessible name.
- Icon-only buttons need accessible labels.
- Modal dialogs need clear title/content/actions and predictable dismiss/continue behavior.
- Dynamic score/status updates should use accessibility state or live regions when useful.
- Do not hide essential controls from assistive technology.

### Performance

- Look for unnecessary re-renders during gestures, animations, or high-frequency updates.
- Prefer native-driver-compatible animations where appropriate.
- Keep expensive calculations out of render unless cheap or memoized for a real reason.
- For lists, require stable keys, correct `extraData`, and `getItemLayout` where applicable.

### Storage And Security

- AsyncStorage/localStorage may store non-sensitive preferences, settings, and scores.
- Flag tokens, secrets, credentials, API keys, or private user data in AsyncStorage/localStorage.
- Ensure storage helpers handle invalid data, missing APIs, platform differences, and async errors gracefully.

### Tests

- Prefer React Native Testing Library user-facing queries: role, label, placeholder, display value, and visible text.
- Use `testID` only when user-facing queries are not practical.
- Avoid implementation-only assertions except for pure utility functions.
- Cover core state transitions, platform branches, storage behavior, animation/gesture outcomes, and edge cases.
- Ensure tests do not depend on private Expo/RN internals without local mocks.

### Storybook

- Every reusable component should have stories for key states.
- Include `@storybook/addon-a11y` where Storybook is used.
- Use realistic props and stateful examples without coupling stories to app-global side effects unless intentional.
- Keep generated Storybook output ignored by lint/format/git.

## Output Format

Lead with findings only, ordered by severity:

- `[P0]` broken build, data loss, app cannot run
- `[P1]` likely runtime bug or serious UX/accessibility issue
- `[P2]` maintainability, test gap, platform risk
- `[P3]` polish or minor improvement

For each finding, include:

- file path and line
- what is wrong
- why it matters
- concrete fix

After findings, include:

- `Open questions`
- `Verification recommended`
- `Summary`

If no issues are found, say so clearly and list residual risks or checks that were not run.
