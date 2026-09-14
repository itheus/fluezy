const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_ROOT_ICON = path.join(__dirname, '..', 'icon.png');
const RESOURCES_ICON = path.join(process.resourcesPath || '', 'icon.png');
const START_PATH = path.join(__dirname, 'start', 'index.html');
const START_URL_SUFFIX = path.join('start', 'index.html');
const HTML_EXTENSIONS = new Set(['.html', '.htm']);
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.1;

let openDialogActive = false;

function isHtmlPath(filePath) {
  return typeof filePath === 'string' &&
    HTML_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function focusedWin() {
  return BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0] || null;
}

function resolveTitle(win, title) {
  const clean = typeof title === 'string' ? title.trim() : '';
  const url = win.webContents.getURL();

  if (url.includes(START_URL_SUFFIX)) {
    return clean || 'Fluezy';
  }
  if (clean) {
    return clean;
  }
  if (url.startsWith('file://')) {
    try {
      return path.basename(decodeURIComponent(new URL(url).pathname));
    } catch {
      return 'Fluezy';
    }
  }
  return 'Fluezy';
}

function loadStart(win) {
  if (!win || win.isDestroyed()) return false;
  win.loadFile(START_PATH).catch((error) => {
    console.error('Failed to load start page:', error);
  });
  return true;
}

function loadHtmlFile(win, filePath) {
  if (!win || win.isDestroyed() || !isHtmlPath(filePath)) {
    return false;
  }
  win.loadFile(filePath).catch((error) => {
    console.error('Failed to load file:', filePath, error);
  });
  return true;
}

function setZoom(win, factor) {
  if (!win || win.isDestroyed()) return;
  const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, factor));
  win.webContents.setZoomFactor(clamped);
}

async function openFileDialog(win) {
  if (!win || win.isDestroyed() || openDialogActive) {
    return { canceled: true };
  }

  openDialogActive = true;
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      title: 'Open HTML File',
      properties: ['openFile'],
      filters: [
        { name: 'HTML Files', extensions: ['html', 'htm'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (canceled || filePaths.length === 0) {
      return { canceled: true };
    }

    const filePath = filePaths[0];
    loadHtmlFile(win, filePath);
    return { canceled: false, filePath };
  } finally {
    openDialogActive = false;
  }
}

function buildMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          click: () => openFileDialog(focusedWin())
        },
        {
          label: 'Return to Start',
          click: () => loadStart(focusedWin())
        },
        { type: 'separator' },
        { label: 'Quit', role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => setZoom(focusedWin(), 1)
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: () => {
            const win = focusedWin();
            if (win) setZoom(win, win.webContents.getZoomFactor() + ZOOM_STEP);
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const win = focusedWin();
            if (win) setZoom(win, win.webContents.getZoomFactor() - ZOOM_STEP);
          }
        },
        { type: 'separator' },
        {
          label: 'Toggle Fullscreen',
          accelerator: 'F11',
          click: () => {
            const win = focusedWin();
            if (win) win.setFullScreen(!win.isFullScreen());
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function resolveIconPath() {
  const candidates = [APP_ROOT_ICON, RESOURCES_ICON];
  for (const candidate of candidates) {
    try {
      if (candidate && fs.existsSync(candidate)) {
        return candidate;
      }
    } catch {}
  }
  return APP_ROOT_ICON;
}

function isExternalUrl(url) {
  return typeof url === 'string' &&
    (url.startsWith('http://') || url.startsWith('https://'));
}

function setupNavigation(win) {
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternalUrl(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (isExternalUrl(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 640,
    minHeight: 480,
    center: true,
    resizable: true,
    icon: resolveIconPath(),
    title: 'Fluezy',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  setupNavigation(win);

  win.webContents.on('page-title-updated', (event, title) => {
    event.preventDefault();
    win.setTitle(resolveTitle(win, title));
  });

  win.webContents.on('did-finish-load', async () => {
    let title = '';
    try {
      title = await win.webContents.executeJavaScript('document.title');
    } catch {
      title = '';
    }
    if (!win.isDestroyed()) {
      win.setTitle(resolveTitle(win, title));
    }
  });

  loadStart(win);
}

ipcMain.handle('dialog:open-file', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return openFileDialog(win);
});

ipcMain.handle('file:open-path', (event, filePath) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return { loaded: loadHtmlFile(win, filePath) };
});

app.whenReady().then(() => {
  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
