# Google Play Release Checklist

## Build

1. Confirm quality checks pass:

   ```sh
   npm run check
   ```

2. Build the signed Android App Bundle for Google Play:

   ```sh
   npm run build:android
   ```

3. Submit the latest Android build to an internal track:

   ```sh
   npm run submit:android:internal
   ```

4. If your Play Console account requires closed testing, submit the latest Android build to the closed testing track:

   ```sh
   npm run submit:android:closed
   ```

5. After Play Console checks and required testing are complete, submit to production:

   ```sh
   npm run submit:android:production
   ```

## Play Console Setup

- Create the app in Google Play Console with package name `com.mariialobareva.reactnative2048`.
- Choose the Games category, puzzle/board subcategory, and free/paid status before uploading.
- Complete app content forms: Data Safety, Ads, Content Rating, Target Audience, and Government Apps.
- This app stores the best score locally on the device and does not collect personal data.
- Add listing assets: app icon, feature graphic, phone screenshots, short description, and full description.
- New personal developer accounts created after November 13, 2023 must usually run a closed test before production access. Plan for at least 12 opted-in testers for 14 continuous days.
- Do not commit Google service account JSON files. Upload the service account key to EAS credentials or provide it securely in CI.

## Release Notes

Initial release:

```text
Play 2048 with keyboard, swipe, or desktop controls. Continue beyond 2048 and chase higher tiles.
```
