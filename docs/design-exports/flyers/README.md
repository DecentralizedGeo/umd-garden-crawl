# Garden Crawl — flyer drafts

Standalone HTML for print and social artboards. Not production site code.

## Social storyboard

`flyer-working-design/Garden Crawl Social.html` is the working social set: nine frames in two directions (1a ledger, 1b poster). Each storyboard item in that HTML can be tweaked or adjusted.

Open the file in a browser. A toolbar at the bottom lists the storyboard frames to select from. Click on any of the filetype buttons PNG, JPG, or PDF to export the selected frame to disk, to the output dimensions noted in the storyboard name.

Keep `artboard-export.js` and `html2canvas.min.js` in `flyer-working-design/` next to the HTML.

## Files

- `garden-crawl-ledger.html` — dark + light letter artboards, print toolbar
- `weber-memorial.jpg` — Weber Memorial Garden specimen (720×540; replace with a higher-res original of the same frame before a real print run)
- `proofmode-mark.svg` — official Proofmode mark
- `CLAUDE-CODE-PROMPT.md` — paste-ready brief for Claude Code design

## View

From this folder:

```bash
python3 -m http.server 4177
```

Open http://127.0.0.1:4177/garden-crawl-ledger.html

Print: Letter, margins None, **Background graphics** on.
