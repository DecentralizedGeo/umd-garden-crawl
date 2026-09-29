/* Export toolbar for the Garden Crawl social artboards.
   Selects a [data-screen-label] frame and downloads PNG, JPG, or PDF
   at that frame's pixel size. PDF pages use 1 px = 1 pt.
   Rasterizing uses html2canvas.min.js (MIT) beside this file. */
(function () {
  if (window.__artboardExport) return;

  var selectedClass = "is-selected-artboard";
  var scriptUrl = document.currentScript && document.currentScript.src;
  var html2canvasPromise = null;

  function parsePx(value) {
    var n = parseFloat(value);
    return Number.isFinite(n) ? Math.round(n) : 0;
  }

  function slug(name) {
    return name
      .toLowerCase()
      .replace(/×/g, "x")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96);
  }

  function groupName(el) {
    var group = el.closest('[id="1a"], [id="1b"]');
    if (!group) return "";
    return group.id === "1a" ? "1a ledger" : "1b poster";
  }

  function boardSize(el) {
    return {
      w: parsePx(el.style.width) || el.offsetWidth,
      h: parsePx(el.style.height) || el.offsetHeight,
    };
  }

  function listBoards() {
    return Array.from(document.querySelectorAll("[data-screen-label]")).map(function (el, index) {
      var size = boardSize(el);
      var label = el.getAttribute("data-screen-label") || "Artboard";
      var group = groupName(el);
      var name = [group, label, size.w + "×" + size.h].filter(Boolean).join(" · ");
      var caption = "";
      var figure = el.closest("figure");
      if (figure) {
        var cap = figure.querySelector("figcaption");
        if (cap) caption = cap.textContent.replace(/\s+/g, " ").trim();
      }
      return {
        el: el,
        index: index,
        name: name,
        caption: caption,
        w: size.w,
        h: size.h,
        fileBase: slug(name) || "artboard-" + (index + 1),
      };
    });
  }

  function ensureHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve();
    if (!html2canvasPromise) {
      html2canvasPromise = new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = new URL("html2canvas.min.js", scriptUrl || location.href).href;
        script.onload = function () { resolve(); };
        script.onerror = function () {
          html2canvasPromise = null;
          reject(new Error("Could not load html2canvas.min.js next to this HTML file."));
        };
        document.head.appendChild(script);
      });
    }
    return html2canvasPromise;
  }

  function axisFraction(token) {
    var keywords = { left: 0, top: 0, center: 0.5, right: 1, bottom: 1 };
    if (Object.prototype.hasOwnProperty.call(keywords, token)) return keywords[token];
    if (token && token.slice(-1) === "%") return parseFloat(token) / 100;
    return null;
  }

  function placedImageOffset(token, container, rendered) {
    var fraction = axisFraction(token);
    if (fraction != null) return (container - rendered) * fraction;
    if (token && token.slice(-2) === "px") return parseFloat(token);
    return (container - rendered) * 0.5;
  }

  /* html2canvas draws every img stretched to its box and ignores object-fit.
     Paint cover/contain into a bitmap the size of that box first, then let
     the stretch become a 1:1 copy of an already-correct crop. */
  function bakeFittedImages(root) {
    var restores = [];
    var images = root.querySelectorAll("img");
    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      var style = getComputedStyle(img);
      var fit = style.objectFit;
      if (fit !== "cover" && fit !== "contain" && fit !== "scale-down") continue;
      var nw = img.naturalWidth;
      var nh = img.naturalHeight;
      var padX = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
      var padY = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
      var dw = Math.round(img.clientWidth - padX);
      var dh = Math.round(img.clientHeight - padY);
      if (!nw || !nh || dw < 1 || dh < 1) continue;

      var scale = fit === "contain"
        ? Math.min(dw / nw, dh / nh)
        : Math.max(dw / nw, dh / nh);
      if (fit === "scale-down") scale = Math.min(1, Math.min(dw / nw, dh / nh));
      var renderedW = nw * scale;
      var renderedH = nh * scale;
      var parts = (style.objectPosition || "50% 50%").trim().split(/\s+/);
      var xToken = parts[0] || "50%";
      var yToken = parts.length > 1 ? parts[1] : "50%";
      var offsetX = placedImageOffset(xToken, dw, renderedW);
      var offsetY = placedImageOffset(yToken, dh, renderedH);
      var sx = -offsetX / scale;
      var sy = -offsetY / scale;
      var sw = dw / scale;
      var sh = dh / scale;
      if (sx < 0) { sw += sx; sx = 0; }
      if (sy < 0) { sh += sy; sy = 0; }
      if (sx + sw > nw) sw = nw - sx;
      if (sy + sh > nh) sh = nh - sy;
      if (sw <= 0 || sh <= 0) continue;

      var baked = document.createElement("canvas");
      baked.width = dw;
      baked.height = dh;
      baked.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
      var previousSrc = img.getAttribute("src");
      var previousFit = img.style.objectFit;
      img.setAttribute("src", baked.toDataURL("image/png"));
      img.style.objectFit = "fill";
      restores.push({ img: img, src: previousSrc, fit: previousFit });
    }
    return function restore() {
      for (var r = 0; r < restores.length; r++) {
        restores[r].img.setAttribute("src", restores[r].src);
        restores[r].img.style.objectFit = restores[r].fit;
      }
    };
  }

  async function rasterize(el) {
    var size = boardSize(el);
    if (!size.w || !size.h) throw new Error("This artboard has no pixel size.");
    await ensureHtml2Canvas();
    await document.fonts.ready;
    await Promise.all(
      Array.from(el.querySelectorAll("img")).map(function (img) {
        if (img.complete && img.naturalWidth) return Promise.resolve();
        return img.decode().catch(function () {});
      })
    );

    var selected = el.classList.contains(selectedClass);
    if (selected) el.classList.remove(selectedClass);
    var restoreImages = bakeFittedImages(el);
    try {
      await Promise.all(
        Array.from(el.querySelectorAll("img")).map(function (img) {
          if (img.complete && img.naturalWidth) return Promise.resolve();
          return img.decode().catch(function () {});
        })
      );
      return await window.html2canvas(el, {
        scale: 1,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        onclone: function (doc) {
          doc.querySelectorAll("." + selectedClass).forEach(function (node) {
            node.classList.remove(selectedClass);
            node.style.outline = "none";
          });
        },
      });
    } finally {
      restoreImages();
      if (selected) el.classList.add(selectedClass);
    }
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (!blob) reject(new Error("Could not encode the image."));
        else resolve(blob);
      }, type, quality);
    });
  }

  function rgbBytes(ctx, w, h) {
    var data = ctx.getImageData(0, 0, w, h).data;
    var rgb = new Uint8Array(w * h * 3);
    for (var i = 0, j = 0; i < data.length; i += 4, j += 3) {
      rgb[j] = data[i];
      rgb[j + 1] = data[i + 1];
      rgb[j + 2] = data[i + 2];
    }
    return rgb;
  }

  async function zlibCompress(bytes) {
    if (typeof CompressionStream !== "function") {
      throw new Error("This browser cannot build a PDF (CompressionStream is missing).");
    }
    var stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  function utf8(text) {
    return new TextEncoder().encode(text);
  }

  async function canvasToPdf(canvas) {
    var w = canvas.width;
    var h = canvas.height;
    var compressed = await zlibCompress(rgbBytes(canvas.getContext("2d"), w, h));
    var parts = [];
    var length = 0;
    var offsets = [];
    function add(bytes) {
      parts.push(bytes);
      length += bytes.length;
    }
    function addText(text) {
      add(utf8(text));
    }
    addText("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");
    function object(n, textBefore, bytes, textAfter) {
      offsets[n] = length;
      addText(n + " 0 obj\n" + textBefore);
      if (bytes) add(bytes);
      addText(textAfter);
    }
    object(1, "<< /Type /Catalog /Pages 2 0 R >>\n", null, "endobj\n");
    object(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n", null, "endobj\n");
    object(
      3,
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + w + " " + h + "] /Contents 4 0 R /Resources << /XObject << /Im0 5 0 R >> >> >>\n",
      null,
      "endobj\n"
    );
    var content = utf8("q\n" + w + " 0 0 " + h + " 0 0 cm\n/Im0 Do\nQ\n");
    object(4, "<< /Length " + content.length + " >>\nstream\n", content, "endstream\nendobj\n");
    object(
      5,
      "<< /Type /XObject /Subtype /Image /Width " + w + " /Height " + h +
        " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length " +
        compressed.length + " >>\nstream\n",
      compressed,
      "\nendstream\nendobj\n"
    );
    var xrefAt = length;
    var xref = "xref\n0 6\n0000000000 65535 f \n";
    for (var n = 1; n <= 5; n++) xref += String(offsets[n]).padStart(10, "0") + " 00000 n \n";
    xref += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xrefAt + "\n%%EOF\n";
    addText(xref);
    var out = new Uint8Array(length);
    var offset = 0;
    for (var p = 0; p < parts.length; p++) {
      out.set(parts[p], offset);
      offset += parts[p].length;
    }
    return new Blob([out], { type: "application/pdf" });
  }

  function download(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 15000);
  }

  function colorCount(canvas) {
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var colors = new Set();
    var stepX = Math.max(1, Math.floor(w / 10));
    var stepY = Math.max(1, Math.floor(h / 10));
    for (var y = 2; y < h; y += stepY) {
      for (var x = 2; x < w; x += stepX) {
        var px = ctx.getImageData(x, y, 1, 1).data;
        colors.add(px[0] + "," + px[1] + "," + px[2]);
        if (colors.size > 4) return colors.size;
      }
    }
    return colors.size;
  }

  async function encode(board, format) {
    var canvas = await rasterize(board.el);
    if (canvas.width !== board.w || canvas.height !== board.h) {
      throw new Error("Export was " + canvas.width + "×" + canvas.height + " instead of " + board.w + "×" + board.h + ".");
    }
    if (colorCount(canvas) < 2) {
      throw new Error("Export came out blank.");
    }
    if (format === "png") return canvasToBlob(canvas, "image/png");
    if (format === "jpg") return canvasToBlob(canvas, "image/jpeg", 0.95);
    if (format === "pdf") return canvasToPdf(canvas);
    throw new Error("Unknown format " + format);
  }

  async function exportBoard(board, format) {
    var ext = format === "jpg" ? "jpg" : format;
    var filename = board.fileBase + "." + ext;
    download(await encode(board, format), filename);
    return filename;
  }

  function mount() {
    var style = document.createElement("style");
    style.textContent = [
      "#artboard-export-toolbar{position:fixed;left:16px;right:16px;bottom:16px;z-index:10000;",
      "display:flex;flex-wrap:nowrap;gap:10px;align-items:center;padding:10px 12px;",
      "background:#0b1015;color:#e4ecf0;border:1px solid #1c2a33;",
      "font:18px/1.2 'IBM Plex Mono',ui-monospace,monospace}",
      "#artboard-export-toolbar label{display:flex;align-items:center;gap:8px;min-width:0;",
      "letter-spacing:.08em;text-transform:uppercase;color:#ddd4c4}",
      "#artboard-export-toolbar select{font:inherit;color:#e4ecf0;background:#0e151b;",
      "border:1px solid #1c2a33;padding:6px 8px;max-width:min(40vw,480px)}",
      "#artboard-export-toolbar button{font:inherit;letter-spacing:.08em;text-transform:uppercase;",
      "background:transparent;color:#e4ecf0;border:1px solid #7ed4e2;padding:6px 10px;cursor:pointer}",
      "#artboard-export-toolbar button:disabled{opacity:.4;cursor:wait}",
      "#artboard-export-toolbar [data-export]{margin-left:auto;display:flex;align-items:center;gap:10px;flex-shrink:0}",
      "#artboard-export-toolbar [data-status]{color:#ddd4c4;font-size:18px}",
      "[data-screen-label]." + selectedClass + "{outline:3px solid #7ed4e2;outline-offset:10px}",
      "@media print{#artboard-export-toolbar{display:none!important}}"
    ].join("");
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "artboard-export-toolbar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Artboard export");
    var exportPrompt = "Select a filetype to export artboard";
    bar.innerHTML = [
      '<label>Artboard <select data-board></select></label>',
      '<div data-export>',
      '<span data-status>' + exportPrompt + '</span>',
      '<button type="button" data-format="png">PNG</button>',
      '<button type="button" data-format="jpg">JPG</button>',
      '<button type="button" data-format="pdf" title="PDF page matches the artboard in points (1 px = 1 pt)">PDF</button>',
      '</div>'
    ].join("");
    document.body.appendChild(bar);

    var select = bar.querySelector("[data-board]");
    var status = bar.querySelector("[data-status]");
    var buttons = Array.from(bar.querySelectorAll("button"));
    var signature = "";
    var busy = false;

    function setBusy(on) {
      busy = on;
      buttons.forEach(function (button) { button.disabled = on || !select.options.length; });
      select.disabled = on || !select.options.length;
    }

    function highlight(index, scroll) {
      var boards = listBoards();
      boards.forEach(function (board, i) {
        board.el.classList.toggle(selectedClass, i === index);
      });
      if (scroll && boards[index]) {
        boards[index].el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    }

    function refresh() {
      var boards = listBoards();
      var next = boards.map(function (board) { return board.name; }).join("\n");
      if (next === signature) return;
      var previous = select.selectedIndex;
      signature = next;
      select.replaceChildren();
      boards.forEach(function (board) {
        var option = document.createElement("option");
        option.value = String(board.index);
        option.textContent = board.name;
        if (board.caption) option.title = board.caption;
        select.appendChild(option);
      });
      if (!boards.length) {
        status.textContent = "Waiting for artboards…";
        setBusy(false);
        return;
      }
      select.selectedIndex = previous >= 0 && previous < boards.length ? previous : 0;
      if (!busy) status.textContent = exportPrompt;
      setBusy(false);
      highlight(select.selectedIndex, false);
    }

    select.addEventListener("change", function () {
      highlight(select.selectedIndex, true);
      if (!busy) status.textContent = exportPrompt;
    });

    buttons.forEach(function (button) {
      button.addEventListener("click", async function () {
        if (busy) return;
        var boards = listBoards();
        var board = boards[select.selectedIndex];
        if (!board) return;
        var format = button.getAttribute("data-format");
        setBusy(true);
        status.textContent = "Exporting " + board.name + "…";
        try {
          var filename = await exportBoard(board, format);
          status.textContent = "Downloaded " + filename;
        } catch (err) {
          console.error(err);
          status.textContent = err && err.message ? err.message : "Export failed";
        } finally {
          setBusy(false);
        }
      });
    });

    refresh();
    new MutationObserver(function () { refresh(); }).observe(document.body, { childList: true, subtree: true });

    window.__artboardExport = {
      listBoards: listBoards,
      exportBoard: exportBoard,
      encode: encode,
      rasterize: rasterize,
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
