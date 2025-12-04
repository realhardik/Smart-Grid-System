// Preload script for Electron
// This runs in a context that has access to both DOM APIs and Node.js APIs
// but is isolated from the main renderer process

const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// the APIs in a safe way
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
});

