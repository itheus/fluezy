# Fluezy

A non-intrusive HTML viewer for developers.

I made this because sometimes I just want to open an HTML file without opening a full browser around it. This is especially useful for me because I built a few Python apps that have a web-based interface.

Fluezy is basically a small Electron Chromium window for local HTML files. No address bar, no tabs, no navigation buttons, and no toolbar sitting on top of your content. Open a file and it gets the whole window. It will hide the scrollbars for you as well.

Since it's Chromium-based, modern HTML, CSS, and JavaScript work normally, including local scripts, stylesheets, images, fonts, and other files referenced with relative paths.

## What it does

- Opens `.html` and `.htm` files
- Runs JavaScript
- Supports modern HTML and CSS
- Loads local relative assets normally
- Supports drag and drop
- Supports `Ctrl+O`
- Opens external links in your normal browser
- Includes zoom and fullscreen controls in the View menu (`Ctrl+=`, `Ctrl+-`, `Ctrl+0`, `F11`)
- Stays out of the way

## Using it

Launch the AppImage and click **Open File**.

You can also press `Ctrl+O` or drag an HTML file directly into the window.

Use Gearlever to integrate the AppImage on your system permanently.

That's pretty much it.

## Running from source

You'll need Node.js and npm.

```bash
npm ci
npm start
```

## Building

To build the Linux AppImage:

```bash
npm run build
```

The finished AppImage will be placed in the `dist` folder.

## Notes

This is meant for viewing trusted local HTML files. The pages you open can run JavaScript just like they would in Chromium.

The current build target is Linux, packaged as an AppImage.
