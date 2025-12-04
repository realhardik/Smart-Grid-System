# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Development

**Web:**
```bash
npm run dev
```

**Electron:**
```bash
npm run electron:dev
```

**Android:**
```bash
# First time only
npm run capacitor:init
npm run capacitor:add:android

# Then for development
npm run android:dev
```

## Building for Production

### Electron (Desktop)

**Option 1: Using Next.js Server (Recommended for full features)**
```bash
npm run build
npm run electron:build
```

**Option 2: Using Static Export (Smaller size, limited features)**
```bash
npm run electron:build:static
```

### Android

1. Build static export and sync:
```bash
npm run capacitor:sync
```

2. Open in Android Studio:
```bash
npm run capacitor:open:android
```

3. In Android Studio:
   - Build > Build Bundle(s) / APK(s) > Build APK(s)
   - Or use Gradle: `cd android && ./gradlew assembleRelease`

## Important Notes

### Static Export Limitations

When using static export (`build:static`), the following Next.js features won't work:
- API Routes (`/api/*`)
- Server Components with dynamic data fetching
- `getServerSideProps`
- `getStaticProps` with revalidation
- Middleware

For Android builds, static export is required. For Electron, you can choose between:
- **Server build**: Full Next.js features, but larger app size
- **Static export**: Smaller size, but limited to client-side features

### Platform-Specific Builds

**Electron:**
- macOS: Requires macOS to build
- Windows: Can build on any platform with Wine (for cross-compilation)
- Linux: Can build on any platform

**Android:**
- Requires Android Studio
- Requires Java JDK 11+
- Requires Android SDK

## Troubleshooting

### Electron Issues

**App won't start:**
- Check that port 3000 is not in use
- Verify Next.js build completed successfully
- Check console for errors

**Build fails:**
- Ensure all dependencies are installed
- Check that `out` or `.next` directory exists after build
- Verify electron-builder configuration

### Android Issues

**Capacitor sync fails:**
- Ensure `out` directory exists (run `npm run build:static` first)
- Check `capacitor.config.ts` has correct `webDir` path
- Verify Android platform is added: `npx cap ls`

**Android Studio won't open:**
- Install Android Studio
- Ensure Android SDK is installed
- Check that `android` directory exists after `capacitor:add:android`

**Build errors in Android Studio:**
- Sync Gradle files: File > Sync Project with Gradle Files
- Clean build: Build > Clean Project
- Invalidate caches: File > Invalidate Caches / Restart

## Environment Variables

Create a `.env.local` file for environment-specific variables:
```
NEXT_PUBLIC_API_URL=your_api_url
```

These will be available in both Electron and Android builds.

