# Task Tracker Android

This folder contains an Android Studio project that wraps the planner web app in a native Android shell using `WebView`.

## Open in Android Studio

1. Open Android Studio.
2. Choose `Open`.
3. Select the `android-app` folder.
4. Let Gradle sync.
5. Run the `app` configuration on an emulator or Android device.

## Where the app content lives

- Native Android entry point: `app/src/main/java/com/example/tasktracker/MainActivity.kt`
- Embedded planner files: `app/src/main/assets/index.html`, `style.css`, `app.js`

## Notes

- Task data is stored with browser `localStorage` inside the Android `WebView`.
- If you update the root web app files, copy the same changes into `app/src/main/assets/` so the Android app stays in sync.
