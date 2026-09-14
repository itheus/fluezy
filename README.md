# Fluezy

A non-intrusive HTML viewer for developers.

Fluezy is essentially a small Electron Chromium window for local HTML files. No address bar, no tabs, no navigation buttons, and no toolbar sitting on top of your content. Open a file and it gets the whole window. It will hide the scrollbars for you as well.

This utility is useful for devs buidling apps with webview front-end interfaces. Get the clutter out of the way and emulate the behavior of your app. 


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

To build the Linux AppImage yourself:

```bash
npm run build
```

Check out the Releases page for the pre-built AppImage.

## Notes

This is meant for viewing trusted local HTML files. The pages you open can run JavaScript just like they would in Chromium.

