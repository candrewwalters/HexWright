# HexWright

A browser-based hex map editor for tactical fantasy maps. Plain HTML/CSS/JS, no build step: open `index.html` or serve the folder statically.

## Layout

```
index.html            Markup only; loads the CSS and scripts below
css/                  main.css (layout), helpWindow.css, mapInfo.css, niftyButton.css
art/                  Images used for map features and UI
js/
  core/state.js       Global constants and editor state (hex size, zoom/focus, undo)
  core/hexGeometry.js Grid math: hex centers, vertices, adjacency, hit testing
  render/             Drawing onto the offscreen canvas
    mapRenderer.js    objectToOffscreen(): renders the whole map
    terrain.js        Walls, water, pits, lava, tar …
    features.js       Trapdoors, altars, debris, paths, megahexes …
    drawBridge.js     Bridges
    decorations.js    Small decorations (e.g. mushrooms)
    color.js          Color helpers
  io/                 mapText.js (text format <-> map object), shamat.js (Shamat II import), files.js
  ui/                 Dialogs and windows: palette, map info, help, settings, export, privacy, icons, keyboard
  view.js             Viewport: zoom, pan, display canvas, minimap
  tools.js            Editing tools
  app.js              Startup (initApp), text-change/undo, save-on-exit
```

All scripts are classic `<script>` files sharing one global scope. None of them run code at load time
except to register DOMContentLoaded handlers, so you can move a function between files freely.

## Rendering model

The map is drawn once at full resolution onto an offscreen canvas (`objectToOffscreen`). The visible
display canvas copies a window of it using a single uniform scale (`view.js`, `offscreenToDisplay`), and
clicks are mapped back through the same transform (`displayToOffscreen`), so drawing and clicking always agree.

## Map data

The saved format is plain text (see `io/mapText.js`), e.g. `Width: 12`, `Walls: 3,4 3,5`,
or `5,6 fire shadow`. In memory, `map.grid[x][y]` is an array of feature-name strings for each hex.
