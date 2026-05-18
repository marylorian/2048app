# React Native 2048

A compact Expo React Native implementation of 2048 for iOS, Android, and web.

## Features

- Swipe, keyboard, and desktop arrow-button controls.
- Animated tile movement and merge feedback.
- Win modal at 2048 with options to continue or restart.
- Continued play beyond 2048 toward 4096 and higher tiles.
- Game-over overlay with restart.
- Best score persistence with device storage on mobile and localStorage on web.
- Responsive control behavior that hides arrow buttons on phones and tablets.

## Stack

- Expo SDK 55
- React 19
- React Native 0.83
- TypeScript
- Jest and React Native Testing Library
- Cypress with axe accessibility checks
- Storybook with accessibility addon
- EAS Build and Submit

## Run Locally

```sh
npm install
npm run start
```

Then open the app in Expo Go, an iOS Simulator, an Android Emulator, or the web target.

Useful targets:

```sh
npm run android
npm run ios
npm run web
```

## Quality Checks

Run the full local gate:

```sh
npm run check
```

Individual checks:

```sh
npm run format:check
npm run expo:check
npm run lint
npm run typecheck
npm run test
npm run e2e
npm run build:storybook
```

CI runs formatting, Expo dependency validation, linting, typechecking, unit tests, web export, Storybook build, and a separate Cypress e2e/a11y stage.

## Storybook

```sh
npm run storybook
```

Build static Storybook:

```sh
npm run build:storybook
```

## Web Build

```sh
npm run build:web
```

The exported web app is written to `dist`.

## Native Builds

Native builds use EAS. Log in before building:

```sh
npx eas-cli login
```

Internal builds:

```sh
npm run build:internal
npm run build:android:internal
npm run build:ios:internal
npm run build:native:internal
```

Production builds:

```sh
npm run build:android
npm run build:ios
npm run build:native
```

Other native variants:

```sh
npm run build:android:apk
npm run build:ios:simulator
```

## Store Submission

Google Play:

```sh
npm run submit:android:internal
npm run submit:android:closed
npm run submit:android:production
```

See `docs/google-play.md` for the release checklist.

Apple App Store:

```sh
npm run credentials:ios
npm run submit:ios
```

Run `npm run credentials:ios` once from an interactive terminal before non-interactive iOS EAS builds, so EAS can create or reuse the Apple distribution certificate and provisioning profile.

See `docs/apple-store.md` for the release checklist.

## EAS Notes

- EAS project ID is configured in `app.json`.
- EAS uses remote app versioning via `cli.appVersionSource`.
- Android production builds output an App Bundle for Google Play.
- `EAS_BUILD_NO_EXPO_GO_WARNING=true` is set in EAS build profiles to suppress the Expo Go production warning.
