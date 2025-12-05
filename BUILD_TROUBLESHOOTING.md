# Build Troubleshooting Guide

## ✅ Build Status

The project builds successfully! Here's what was verified:

- ✅ Regular build: `npm run build` - **SUCCESS**
- ✅ Static export build: `npm run build:static` - **SUCCESS**
- ✅ No linting errors
- ✅ All dependencies installed
- ✅ Output directory created correctly

---

## 🔧 Common Build Issues & Solutions

### Issue 1: "Command not found: next"

**Solution:**
```bash
npm install
```

### Issue 2: "Module not found" errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: TypeScript errors

**Solution:**
The project has `ignoreBuildErrors: true` in `next.config.mjs`, so TypeScript errors won't block builds. But if you want to fix them:

```bash
npm run lint
```

### Issue 4: Port already in use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Issue 5: Memory errors during build

**Error:** `JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Issue 6: "Cannot find module" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules .next out
npm install
npm run build
```

### Issue 7: Build hangs or takes too long

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 🚀 Build Commands

### Regular Build (for development/production server)
```bash
npm run build
```
Output: `.next/` directory

### Static Export Build (for Android/Electron)
```bash
npm run build:static
```
Output: `out/` directory

### Development Server
```bash
npm run dev
```

### Production Server
```bash
npm run build
npm run start
```

---

## 📋 Pre-Build Checklist

Before building, ensure:

- [ ] Node.js version 18+ installed (`node --version`)
- [ ] npm version 9+ installed (`npm --version`)
- [ ] All dependencies installed (`npm install`)
- [ ] No syntax errors in code
- [ ] Sufficient disk space
- [ ] No other processes using port 3000/3001

---

## 🔍 Verify Your Build

### Check Build Output

After building, verify:

1. **Regular build:**
   ```bash
   ls -la .next/
   ```

2. **Static export:**
   ```bash
   ls -la out/
   ```

### Test the Build

1. **Test production build:**
   ```bash
   npm run build
   npm run start
   ```
   Visit: http://localhost:3000

2. **Test static export:**
   ```bash
   npm run build:static
   # Serve the out directory with any static server
   npx serve out
   ```

---

## 🐛 Specific Error Messages

### "Error: ENOENT: no such file or directory"

**Cause:** Missing files or incorrect paths

**Solution:**
```bash
# Reinstall everything
rm -rf node_modules .next out
npm install
npm run build
```

### "Error: Cannot find module '@/components/...'"

**Cause:** TypeScript path alias issue

**Solution:**
Check `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### "Error: Invalid next.config.mjs options"

**Cause:** Configuration syntax error

**Solution:**
Check `next.config.mjs` syntax is correct.

---

## 💻 System Requirements

- **Node.js:** 18.0.0 or higher
- **npm:** 9.0.0 or higher
- **OS:** macOS, Linux, or Windows
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 500MB free

---

## 🔄 Clean Build Process

If builds are failing, try this clean build:

```bash
# 1. Remove all build artifacts
rm -rf .next out node_modules package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall dependencies
npm install

# 4. Build
npm run build
```

---

## 📞 Still Having Issues?

If you're still experiencing build errors:

1. **Check the exact error message** - Copy the full error
2. **Check Node/npm versions:**
   ```bash
   node --version
   npm --version
   ```
3. **Check for conflicting packages:**
   ```bash
   npm list --depth=0
   ```
4. **Try building with verbose output:**
   ```bash
   npm run build -- --debug
   ```

---

## ✅ Success Indicators

Your build is successful if you see:

```
✓ Compiled successfully
✓ Generating static pages
Route (app)
┌ ○ /
├ ○ /alerts
├ ○ /data-logs
├ ○ /map
└ ○ /settings
```

And the output directories are created:
- `.next/` (regular build)
- `out/` (static export)

---

## 🎯 Quick Fixes

**Build failing? Try these in order:**

1. `npm install`
2. `rm -rf .next && npm run build`
3. `rm -rf node_modules && npm install && npm run build`
4. `npm cache clean --force && npm install && npm run build`

---

The project builds successfully on the system. If you're seeing specific errors, please share the exact error message for targeted help!

