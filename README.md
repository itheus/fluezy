<p align=center> <img title="" src="https://raw.githubusercontent.com/itheus/fluezy/refs/heads/main/icon.png" alt="Fluezy" width="137" /> </p>

<h1 align=center> Fluezy </h1>

<h5 align=center> A non-intrusive HTML viewer for developers. </h5>


## 
<br> Fluezy is essentially a small Electron Chromium window for local HTML files. No address bar, no tabs, no navigation buttons, and no toolbar sitting on top of your content. Open a file and it gets the whole window. It will hide the scrollbars for you as well.

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
- Stays the hell out of the way

## Download

Check out the [**Releases**](https://github.com/itheus/fluezy/releases) page.

## Use it

Use [**Gear Lever**](https://github.com/mijorus/gearlever) to integrate the AppImage on your system.

### Alternatively

Make the AppImage executable by launching a terminal window in your downloads folder (or wherever you downloaded the file) and type`chmod +x` followed by the full filename including the **.AppImage** extension.

Launch the app by typing `./filename.AppImage`

Press `Ctrl+O` or drag an HTML file directly into the window.

That's pretty much it.

## Run from source

You'll need Node.js and npm.

```bash
npm ci
npm start
```

## Build manually

To build the Linux AppImage yourself:

```bash
npm run build
```

## Notes

This is meant for viewing trusted local HTML files. The pages you open can run JavaScript just like they would in Chromium.
