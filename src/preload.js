const { contextBridge, ipcRenderer, webFrame, webUtils } = require('electron');

const HIDE_SCROLLBARS_CSS = `
  ::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  html,
  body {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
`;

webFrame.insertCSS(HIDE_SCROLLBARS_CSS);

contextBridge.exposeInMainWorld('fluezy', {
  openFile: () => ipcRenderer.invoke('dialog:open-file'),
  openPath: (filePath) => ipcRenderer.invoke('file:open-path', filePath)
});

const HTML_PATTERN = /\.html?$/i;

function firstHtmlFile(fileList) {
  if (!fileList || fileList.length === 0) return null;
  for (const file of fileList) {
    const filePath = webUtils.getPathForFile(file);
    if (filePath && HTML_PATTERN.test(filePath)) {
      return filePath;
    }
  }
  return null;
}

window.addEventListener('dragover', (event) => {
  event.preventDefault();
});

window.addEventListener('drop', (event) => {
  event.preventDefault();
  const filePath = firstHtmlFile(event.dataTransfer && event.dataTransfer.files);
  if (filePath) {
    ipcRenderer.invoke('file:open-path', filePath);
  }
});
