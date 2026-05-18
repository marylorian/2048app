# Apple App Store Release Checklist

## Build

1. Confirm quality checks pass:

   ```sh
   npm run check
   ```

2. Set up iOS credentials once from an interactive terminal:

   ```sh
   npm run credentials:ios
   ```

   Let EAS create or reuse the Apple distribution certificate and provisioning profile. Non-interactive EAS builds cannot create missing Apple credentials for you.

3. Build the signed iOS app for App Store Connect:

   ```sh
   npm run build:ios
   ```

4. Submit the latest iOS build to App Store Connect and TestFlight:

   ```sh
   npm run submit:ios
   ```

5. After TestFlight validation and App Store Connect metadata are complete, submit the build for App Review in App Store Connect.

## App Store Connect Setup

- Enroll in the Apple Developer Program and create the app in App Store Connect.
- Use bundle identifier `com.mariialobareva.reactnative2048`.
- Set the app category to Games and choose the puzzle/board subcategory that best fits.
- Add app information: name, subtitle, description, keywords, support URL, marketing URL if available, copyright, age rating, and pricing.
- Add product page assets: app icon, iPhone screenshots, iPad screenshots if distributing on iPad, and optional preview videos.
- Complete privacy details. This app stores the best score locally on the device and does not collect personal data.
- Complete accessibility support details in App Store Connect.
- Configure App Store Connect API credentials with EAS for CI or use the interactive Apple sign-in flow locally.
- EAS versioning uses the remote version source, so iOS build numbers are incremented by EAS and should not be duplicated in `app.json`.

## Release Notes

Initial release:

```text
Play 2048 with keyboard, swipe, or desktop controls. Continue beyond 2048 and chase higher tiles.
```
