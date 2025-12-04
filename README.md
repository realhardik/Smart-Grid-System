# Smart Water Grid Dashboard

A cross-platform dashboard application built with Next.js, Electron, and Capacitor that works on Desktop (Windows, macOS, Linux) and Android.

## Features

- 🌐 **Web**: Next.js web application
- 🖥️ **Desktop**: Electron app for Windows, macOS, and Linux
- 📱 **Android**: Native Android app via Capacitor

## Prerequisites

- Node.js 18+ and npm/pnpm
- For Android: Android Studio and Java JDK
- For Electron builds: Platform-specific build tools

## Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

## Development

### Web Development
```bash
npm run dev
```
Runs the Next.js development server at `http://localhost:3000`

### Electron Development
```bash
npm run electron:dev
```
This will:
1. Start the Next.js dev server
2. Launch Electron when the server is ready

### Android Development

First, initialize Capacitor and add Android platform (one-time setup):
```bash
npm run capacitor:init
npm run capacitor:add:android
```

Then, for development:
```bash
npm run android:dev
```
This will:
1. Build a static export of your Next.js app
2. Sync with Capacitor
3. Open Android Studio

## Building for Production

### Build Web App
```bash
npm run build
```

### Build Electron App

**For current platform:**
```bash
npm run electron:build
```

**For specific platforms:**
```bash
npm run electron:build:mac    # macOS
npm run electron:build:win    # Windows
npm run electron:build:linux  # Linux
```

Built apps will be in the `dist-electron` directory.

### Build Android App

1. Build and sync:
```bash
npm run capacitor:sync
```

2. Open Android Studio:
```bash
npm run capacitor:open:android
```

3. In Android Studio:
   - Build > Generate Signed Bundle / APK
   - Or use the terminal:
   ```bash
   cd android && ./gradlew assembleRelease
   ```

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
├── electron/           # Electron main process files
│   ├── main.js        # Main Electron process
│   └── preload.js     # Preload script
├── public/            # Static assets
├── capacitor.config.ts # Capacitor configuration
└── electron-builder.config.js # Electron builder config
```

## Configuration

### Electron
Edit `electron-builder.config.js` to customize:
- App ID and name
- Icons
- Build targets
- Installer options

### Capacitor
Edit `capacitor.config.ts` to customize:
- App ID and name
- Web directory
- Plugin configurations

## Notes

- **Static Export**: For Android builds, the app uses static export (`NEXT_EXPORT=true`). Some Next.js features that require a server won't work in the Android build.
- **Electron**: The Electron build can use either static export or run Next.js as a server, depending on your build configuration.
- **Development**: In development, Electron connects to the Next.js dev server for hot reloading.

## Troubleshooting

### Electron won't start
- Make sure Next.js dev server is running on port 3000
- Check that all dependencies are installed

### Android build fails
- Ensure Android Studio is installed
- Check that Java JDK is properly configured
- Run `npm run capacitor:sync` before building

### Static export issues
- Some Next.js features (API routes, server components with dynamic data) won't work in static export
- Consider using client-side data fetching for Android builds

## License

Private project

