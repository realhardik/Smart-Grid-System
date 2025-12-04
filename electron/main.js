const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.svg'),
    show: false,
  });

  // Load the app
  if (isDev) {
    // In development, load from Next.js dev server
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from static export if available, otherwise start Next.js server
    const fs = require('fs');
    const indexPath = path.join(__dirname, '../out/index.html');
    
    if (fs.existsSync(indexPath)) {
      // Use static export
      mainWindow.loadFile(indexPath);
    } else {
      // Start Next.js production server
      const { spawn } = require('child_process');
      const nextServer = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['start'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, PORT: '3000', NODE_ENV: 'production' },
        stdio: 'ignore',
      });
      
      // Wait for server to be ready, then load
      const checkServer = setInterval(() => {
        const http = require('http');
        const req = http.get('http://localhost:3000', (res) => {
          if (res.statusCode === 200) {
            clearInterval(checkServer);
            mainWindow.loadURL('http://localhost:3000');
          }
        });
        req.on('error', () => {
          // Server not ready yet, continue waiting
        });
        req.setTimeout(1000, () => req.destroy());
      }, 500);
      
      // Cleanup on window close
      mainWindow.on('closed', () => {
        clearInterval(checkServer);
        if (nextServer) nextServer.kill();
      });
    }
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

