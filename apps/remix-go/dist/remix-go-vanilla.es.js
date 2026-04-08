function ie({ src: r, onOverlayAdd: a, onTimeUpdate: e }) {
  const i = document.createElement("div");
  i.className = "video-editor";
  let s = null, c = null;
  i.innerHTML = `
    <div class="video-player-container relative bg-black rounded-lg overflow-hidden">
      <video id="editor-video" class="w-full h-full object-contain" controls playsinline></video>
      <div id="overlay-container" class="absolute inset-0 pointer-events-none" style="z-index: 10;"></div>
      <div id="video-controls" class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3">
        <button id="play-pause-btn" class="text-white hover:text-violet-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <div class="flex-1 flex items-center gap-2">
          <span id="current-time" class="text-xs text-gray-400 w-12">0:00</span>
          <input id="timeline-slider" type="range" min="0" max="100" value="0"
            class="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500">
          <span id="total-time" class="text-xs text-gray-400 w-12">0:00</span>
        </div>
        <button id="volume-btn" class="text-white hover:text-violet-400 transition-colors">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
        </button>
      </div>
    </div>
    <div id="timeline-track" class="mt-3 h-16 bg-white/5 rounded-lg relative overflow-hidden">
      <div class="absolute inset-x-0 top-0 h-6 bg-white/5 flex items-center px-2">
        <span class="text-xs text-gray-500">Overlays</span>
      </div>
      <div id="timeline-overlays" class="absolute inset-x-0 top-6 bottom-0 flex items-center px-1 gap-1"></div>
    </div>
  `, s = i.querySelector("#editor-video"), c = i.querySelector("#overlay-container");
  const d = i.querySelector("#play-pause-btn"), n = i.querySelector("#timeline-slider"), u = i.querySelector("#current-time"), o = i.querySelector("#total-time"), t = i.querySelector("#timeline-overlays");
  r && (s.src = r);
  function p(m) {
    const v = Math.floor(m / 60), g = Math.floor(m % 60);
    return `${v}:${String(g).padStart(2, "0")}`;
  }
  s.addEventListener("loadedmetadata", () => {
    o.textContent = p(s.duration), n.max = s.duration;
  }), s.addEventListener("timeupdate", () => {
    u.textContent = p(s.currentTime), n.value = s.currentTime, e && e(s.currentTime);
  });
  let l = !1;
  return d.addEventListener("click", () => {
    l ? (s.pause(), d.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>') : (s.play(), d.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'), l = !l;
  }), n.addEventListener("input", () => {
    s.currentTime = parseFloat(n.value);
  }), i.setSource = (m) => {
    s.src = m;
  }, i.addOverlayElement = (m) => {
    const v = document.createElement("div");
    v.className = "overlay-element absolute pointer-events-auto", v.style.top = m.top || "10%", v.style.left = m.left || "10%", v.style.width = m.width || "80%", v.dataset.overlayId = m.id, m.type === "text" ? v.innerHTML = `<p class="text-white text-lg font-bold" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8)">${m.text || "Text"}</p>` : m.type === "image" ? v.innerHTML = `<img src="${m.src}" class="w-full rounded" alt="overlay">` : m.type === "cta" && (v.innerHTML = `<a href="${m.href || "#"}" class="inline-block px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-500">${m.text || "Click Here"}</a>`), c.appendChild(v);
    const g = document.createElement("div");
    g.className = "h-full rounded bg-violet-500/50 text-white text-xs flex items-center px-1 truncate", g.style.minWidth = "40px", g.style.flex = "1", g.textContent = m.type || "overlay", g.dataset.overlayId = m.id, t.appendChild(g);
  }, i.getVideo = () => s, i.getOverlayContainer = () => c, i;
}
const W = () => import("./VideoExport-CFj96DiV.js");
function se({ src: r, onOverlayAdd: a, onTimeUpdate: e, project: i }) {
  const s = document.createElement("div");
  s.className = "enhanced-video-editor flex flex-col h-full";
  let c = null, d = null, n = 0, u = 0, o = !1, t = 1, p = /* @__PURE__ */ new Set(), l = (i == null ? void 0 : i.overlays) || [], m = 1, v = null;
  s.innerHTML = `
    <!-- Video Player Section -->
    <div class="video-player-section flex-1 flex flex-col bg-black rounded-lg overflow-hidden mb-4">
      <!-- Video Display -->
      <div class="video-display flex-1 relative bg-black">
        <video id="editor-video" class="w-full h-full object-contain" playsinline></video>
        <div id="overlay-container" class="absolute inset-0 pointer-events-none" style="z-index: 10;"></div>

        <!-- Video Controls Overlay -->
        <div id="video-overlay-controls" class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div class="flex items-center gap-4">
            <!-- Play/Pause -->
            <button id="play-pause-btn" class="text-white hover:text-violet-400 transition-colors">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>

            <!-- Timeline -->
            <div class="flex-1 flex items-center gap-2">
              <span id="current-time" class="text-sm text-white font-mono w-16">0:00.00</span>
              <div class="flex-1 relative">
                <input id="timeline-slider" type="range" min="0" max="100" value="0" step="0.01"
                  class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500">
                <div id="seek-preview" class="absolute top-0 left-0 h-2 bg-violet-400/50 rounded-lg pointer-events-none opacity-0 transition-opacity"></div>
              </div>
              <span id="total-time" class="text-sm text-white font-mono w-16">0:00.00</span>
            </div>

            <!-- Volume -->
            <div class="flex items-center gap-2">
              <button id="volume-btn" class="text-white hover:text-violet-400 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
              </button>
              <input id="volume-slider" type="range" min="0" max="1" value="0.8" step="0.1"
                class="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500">
            </div>

            <!-- Speed -->
            <select id="speed-select" class="bg-white/20 text-white text-sm rounded px-2 py-1">
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1" selected>1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline Section -->
    <div class="timeline-section bg-white/5 rounded-lg p-4">
      <!-- Timeline Controls -->
      <div class="timeline-controls flex items-center justify-between mb-4">
        <div class="flex items-center gap-4">
          <!-- Zoom Controls -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">Zoom:</span>
            <button id="zoom-out" class="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </button>
            <span id="zoom-level" class="text-sm text-white min-w-[3rem] text-center">100%</span>
            <button id="zoom-in" class="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
            <button id="zoom-fit" class="ml-2 px-2 py-1 text-xs rounded bg-violet-600 hover:bg-violet-500 text-white">Fit</button>
          </div>

          <!-- View Options -->
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 text-sm">
              <input id="show-keyframes" type="checkbox" checked class="accent-violet-500">
              <span class="text-gray-300">Keyframes</span>
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input id="show-markers" type="checkbox" checked class="accent-violet-500">
              <span class="text-gray-300">Markers</span>
            </label>
          </div>
        </div>

        <!-- Timeline Actions -->
        <div class="flex items-center gap-2">
          <button id="add-marker" class="px-3 py-1 text-sm rounded bg-white/10 hover:bg-white/20 text-white">
            Add Marker
          </button>
          <button id="clear-selection" class="px-3 py-1 text-sm rounded bg-white/10 hover:bg-white/20 text-white">
            Clear Selection
          </button>
        </div>
      </div>

      <!-- Timeline Tracks -->
      <div class="timeline-tracks relative">
        <!-- Time Ruler -->
        <div id="time-ruler" class="h-8 bg-black/20 rounded-t border-b border-white/10 relative overflow-hidden">
          <div id="ruler-marks" class="absolute inset-0"></div>
          <div id="playhead" class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"></div>
        </div>

        <!-- Track Container -->
        <div id="tracks-container" class="relative overflow-x-auto overflow-y-auto max-h-96">
          <div id="tracks-wrapper" class="relative min-w-full">
            <!-- Video Track -->
            <div class="track video-track h-16 bg-black/10 border-b border-white/5 relative">
              <div class="track-header absolute left-0 top-0 bottom-0 w-32 bg-black/20 flex items-center px-3 border-r border-white/10">
                <span class="text-sm text-white font-medium">Video</span>
              </div>
              <div id="video-track-content" class="absolute left-32 right-0 top-0 bottom-0">
                <div id="video-waveform" class="h-full bg-violet-600/20 rounded mx-2 my-1 relative">
                  <div id="video-playhead" class="absolute top-0 bottom-0 w-0.5 bg-white z-10"></div>
                </div>
              </div>
            </div>

            <!-- Overlay Tracks -->
            <div id="overlay-tracks" class="relative">
              <!-- Tracks will be dynamically added here -->
            </div>

            <!-- Add Track Button -->
            <div class="track add-track h-12 bg-white/5 border-b border-white/5 flex items-center justify-center">
              <button id="add-track-btn" class="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Add Track
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Section -->
      <div class="mt-6">
        <div id="export-container" class="export-section">
          <!-- VideoExport component will be inserted here -->
        </div>
      </div>
    </div>
  `, c = s.querySelector("#editor-video"), d = s.querySelector("#overlay-container"), r && (c.src = r);
  const g = s.querySelector("#timeline-slider"), h = s.querySelector("#current-time"), b = s.querySelector("#total-time"), x = s.querySelector("#playhead"), y = s.querySelector("#video-playhead");
  s.querySelector("#tracks-wrapper");
  const S = s.querySelector("#time-ruler");
  f(), E(), j(), z(), U(), c.addEventListener("loadedmetadata", () => {
    u = c.duration, b.textContent = q(u), g.max = u, w(), C();
  }), c.addEventListener("timeupdate", () => {
    v || (n = c.currentTime, h.textContent = q(n), g.value = n, C()), e && e(n);
  }), c.addEventListener("play", () => {
    o = !0, $();
  }), c.addEventListener("pause", () => {
    o = !1, $();
  }), c.addEventListener("ended", () => {
    o = !1, $();
  });
  function q(k) {
    const L = Math.floor(k / 3600), A = Math.floor(k % 3600 / 60), T = Math.floor(k % 60), M = Math.floor(k % 1 * 100);
    return L > 0 ? `${L}:${String(A).padStart(2, "0")}:${String(T).padStart(2, "0")}.${String(M).padStart(2, "0")}` : `${A}:${String(T).padStart(2, "0")}.${String(M).padStart(2, "0")}`;
  }
  function $() {
    const k = s.querySelector("#play-pause-btn");
    o ? k.innerHTML = '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' : k.innerHTML = '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  }
  function C() {
    if (!S) return;
    const k = S.offsetWidth - 128, L = n / u, A = 128 + L * k;
    x.style.left = `${A}px`, y.style.left = `${L * 100}%`;
  }
  function f() {
    w();
  }
  function w() {
    const k = s.querySelector("#ruler-marks");
    if (!k) return;
    k.innerHTML = "";
    const L = S.offsetWidth - 128, A = Math.max(1, Math.floor(10 / m)), T = A / 10;
    for (let M = 0; M <= u; M += T) {
      const I = 128 + M / u * L;
      if (M % A === 0) {
        const P = document.createElement("div");
        P.className = "absolute top-0 bottom-0 w-px bg-white/30", P.style.left = `${I}px`;
        const B = document.createElement("div");
        B.className = "absolute top-0 text-xs text-white transform -translate-x-1/2", B.style.left = `${I}px`, B.textContent = q(M).split(".")[0], k.appendChild(P), k.appendChild(B);
      } else {
        const P = document.createElement("div");
        P.className = "absolute top-2 bottom-2 w-px bg-white/10", P.style.left = `${I}px`, k.appendChild(P);
      }
    }
  }
  function E() {
    const k = s.querySelector("#play-pause-btn"), L = s.querySelector("#volume-slider"), A = s.querySelector("#speed-select");
    k.addEventListener("click", () => {
      o ? c.pause() : c.play();
    }), g.addEventListener("input", (T) => {
      const M = parseFloat(T.target.value);
      c.currentTime = M, n = M, h.textContent = q(M), C();
    }), g.addEventListener("mousedown", () => {
      v = !0;
    }), g.addEventListener("mouseup", () => {
      v = !1;
    }), L.addEventListener("input", (T) => {
      c.volume = parseFloat(T.target.value);
    }), A.addEventListener("change", (T) => {
      t = parseFloat(T.target.value), c.playbackRate = t;
    });
  }
  function j() {
    const k = s.querySelector("#zoom-in"), L = s.querySelector("#zoom-out"), A = s.querySelector("#zoom-fit"), T = s.querySelector("#zoom-level");
    k.addEventListener("click", () => {
      m = Math.min(m * 1.5, 10), M();
    }), L.addEventListener("click", () => {
      m = Math.max(m / 1.5, 0.1), M();
    }), A.addEventListener("click", () => {
      m = 1, M();
    });
    function M() {
      T.textContent = `${Math.round(m * 100)}%`, w(), z();
    }
    const I = s.querySelector("#tracks-container");
    I.addEventListener("scroll", () => {
      I.scrollLeft;
    });
  }
  function z() {
    const k = s.querySelector("#overlay-tracks");
    k.innerHTML = "", l.forEach((L, A) => {
      const T = document.createElement("div");
      T.className = "track overlay-track h-16 bg-white/5 border-b border-white/5 relative", T.dataset.overlayId = L.id, T.innerHTML = `
        <div class="track-header absolute left-0 top-0 bottom-0 w-32 bg-white/10 flex items-center px-3 border-r border-white/10">
          <span class="text-sm text-white font-medium">${L.type || "Overlay"} ${A + 1}</span>
        </div>
        <div class="overlay-track-content absolute left-32 right-0 top-0 bottom-0 relative">
          <div class="overlay-segment absolute top-2 bottom-2 bg-violet-500/30 rounded border border-violet-500/50 cursor-pointer hover:bg-violet-500/40"
               style="left: ${L.start / u * 100}%; width: ${(L.end - L.start) / u * 100}%">
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs text-white font-medium truncate px-2">${L.text || L.type}</span>
            </div>
            <!-- Resize handles -->
            <div class="resize-handle left-0 top-0 bottom-0 w-2 bg-violet-400 cursor-ew-resize absolute"></div>
            <div class="resize-handle right-0 top-0 bottom-0 w-2 bg-violet-400 cursor-ew-resize absolute"></div>
          </div>
        </div>
      `, T.querySelector(".overlay-segment").addEventListener("click", (I) => {
        I.shiftKey || p.clear(), p.add(L.id), V();
      }), k.appendChild(T);
    });
  }
  function V() {
    s.querySelectorAll(".overlay-segment").forEach((k) => {
      const L = k.closest(".track").dataset.overlayId;
      p.has(L) ? k.classList.add("ring-2", "ring-violet-400") : k.classList.remove("ring-2", "ring-violet-400");
    });
  }
  s.setSource = (k) => {
    c && (c.src = k, o = !1, n = 0, $(), C());
  }, s.addOverlay = (k) => {
    l.push(k), z(), a && a(k);
  }, s.removeOverlay = (k) => {
    l = l.filter((L) => L.id !== k), z();
  }, s.updateOverlay = (k, L) => {
    const A = l.findIndex((T) => T.id === k);
    A > -1 && (l[A] = { ...l[A], ...L }, z());
  };
  async function U() {
    try {
      const k = s.querySelector("#export-container");
      if (k) {
        const A = (await W()).default, T = A({
          project: i,
          onExportComplete: (M) => {
            console.log("Video export completed:", M);
          },
          onExportError: (M) => {
            console.error("Video export failed:", M);
          }
        });
        k.appendChild(T);
      }
    } catch (k) {
      console.error("Failed to initialize video export:", k);
    }
  }
  return s.getCurrentTime = () => n, s.getDuration = () => u, s.getVideo = () => c, s.getOverlayContainer = () => d, s;
}
function ae({ onElementSelect: r, onElementUpdate: a, onSeek: e }) {
  const i = {
    popcorn: null,
    activeElement: null,
    currentCheckpoint: null
  }, s = document.createElement("div");
  s.className = "construction-workspace w-full h-full bg-gray-900 relative";
  function c(t) {
    if (window.Popcorn) {
      const p = Popcorn(t);
      return p.main = !0, p.on("elementSelected", (l) => {
        const { element: m } = l;
        i.activeElement = m, r && r(m);
      }), p.on("elementUpdated", (l) => {
        const { element: m, options: v } = l;
        a && a(m, v);
      }), i.popcorn = p, p;
    } else
      return console.warn("Popcorn.js not loaded"), null;
  }
  function d(t) {
    i.popcorn && (i.popcorn.seek(t), i.currentCheckpoint = t, e && e(t));
  }
  function n() {
    i.activeElement = null, i.popcorn && i.popcorn.emit("elementSelected", { element: null });
  }
  function u() {
    s.innerHTML = `
      <div class="video-canvas-container w-full h-full bg-gray-800 relative">
        <div id="popcorn-wrapper" class="w-full h-full">
          <div class="flex items-center justify-center h-full">
            <div class="text-center text-gray-400">
              <i class="fa fa-video-camera text-4xl mb-4"></i>
              <p>Video Editor Canvas</p>
              <p class="text-sm">Initialize Popcorn.js for video editing</p>
            </div>
          </div>
        </div>
        <div class="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          <i class="fa fa-clock mr-1"></i>
          Current: ${i.currentCheckpoint || "00:00"}
        </div>
      </div>

      <div class="checkpoints-panel absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4">
        <div class="flex items-center gap-2 mb-2">
          <i class="fa fa-film text-gray-400"></i>
          <span class="text-sm font-medium text-white">Checkpoints</span>
        </div>
        <div class="checkpoints-list flex gap-2 overflow-x-auto">
          <div class="checkpoint-item flex-shrink-0 w-20 h-16 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-violet-500"
               data-time="00:00">
            <div class="w-full h-full rounded-t-lg bg-gray-700 flex items-center justify-center">
              <i class="fa fa-play text-gray-400 text-xs"></i>
            </div>
            <div class="text-xs text-gray-400 text-center mt-1">00:00</div>
          </div>
        </div>
      </div>
    `, o();
  }
  function o() {
    const t = s.querySelector("#popcorn-wrapper");
    t && setTimeout(() => {
      const p = c(t);
      p && p.on("timeupdate", () => {
      });
    }, 100), s.addEventListener("click", (p) => {
      p.target === s && n();
    }), s.querySelectorAll(".checkpoint-item").forEach((p) => {
      p.addEventListener("click", () => {
        const l = p.dataset.time;
        d(l);
      });
    });
  }
  return u(), s.api = {
    seekToCheckpoint: d,
    resignActiveElement: n,
    getActiveElement: () => i.activeElement,
    getCurrentCheckpoint: () => i.currentCheckpoint,
    getPopcorn: () => i.popcorn
  }, s;
}
function re({ onPopcornInitialize: r }) {
  const a = document.createElement("div");
  a.className = "construction-scene w-full h-full bg-gray-900";
  let e = null, i = null, s = null;
  function c() {
    i && r && r(i);
  }
  function d() {
    s && s();
  }
  function n() {
    a.innerHTML = `
      <div class="embed-wrapper w-full h-full relative">
        <div id="video-container-scene" class="construction-container w-full h-full" data-butter="target">
          <div class="popcorn-wrapper w-full h-full"></div>
        </div>
      </div>
    `, e = a.querySelector(".embed-wrapper"), i = a.querySelector(".popcorn-wrapper"), setTimeout(() => {
      c(), window.videoResizer && (s = window.videoResizer(e)), window.addEventListener("resize", d), d();
    }, 100);
  }
  function u() {
    window.removeEventListener("resize", d);
  }
  return n(), a.addEventListener("remove", u), a.api = {
    sceneResize: d,
    getPopcornWrapper: () => i,
    getEmbedWrapper: () => e
  }, a;
}
function ne({ checkpoints: r = [], onCheckpointSelect: a }) {
  const e = document.createElement("div");
  e.className = "checkpoints-list w-full bg-gray-900 border-t border-gray-800";
  function i() {
    e.innerHTML = `
      <div class="thumbnail-canvas w-full">
        <div class="thumbnail-canvas-scroll flex gap-2 p-4 overflow-x-auto">
          ${r.map((d, n) => `
            <div class="thumbnail-wrapper flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                 data-checkpoint="${d}"
                 data-index="${n}">
              <div class="w-24 h-16 bg-gray-800 rounded-lg border border-gray-700 hover:border-violet-500 flex items-center justify-center">
                <div class="text-center">
                  <i class="fa fa-play text-gray-400 text-sm mb-1"></i>
                  <div class="text-xs text-gray-400">${s(d)}</div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `, c();
  }
  function s(d) {
    const n = Math.floor(d / 60), u = Math.floor(d % 60);
    return `${n}:${u.toString().padStart(2, "0")}`;
  }
  function c() {
    e.querySelectorAll(".thumbnail-wrapper").forEach((d) => {
      d.addEventListener("click", () => {
        const n = parseFloat(d.dataset.checkpoint);
        a && a(n);
      });
    });
  }
  return i(), e.api = {
    updateCheckpoints: (d) => {
      r = d, i();
    }
  }, e;
}
function le({ at: r, className: a = "" }) {
  const e = document.createElement("div");
  e.className = `checkpoint thumbnail-container ${a}`;
  let i = null, s = null, c = null;
  function d() {
    s && window.Popcorn && (Popcorn(s).seek(r), window.videoResizer && (c = window.videoResizer(i, 2)), window.addEventListener("resize", n), n());
  }
  function n() {
    c && c();
  }
  function u() {
    e.innerHTML = `
      <div class="wrapper embed w-full h-full bg-gray-800 rounded-lg overflow-hidden">
        <div id="video-container-${r}" class="construction-container w-full h-full" data-butter="target">
          <div class="popcorn-wrapper w-full h-full"></div>
        </div>
      </div>
    `, i = e.querySelector(".embed"), s = e.querySelector(".popcorn-wrapper"), setTimeout(() => {
      d();
    }, 100);
  }
  function o() {
    window.removeEventListener("resize", n);
  }
  return u(), e.addEventListener("remove", o), e;
}
function de({ onVideoSelected: r, className: a = "" }) {
  const e = {
    scope: "library",
    // 'library' or 'uploads'
    library: {
      hasMore: !0,
      elements: [],
      query: "",
      loading: !1
    },
    uploads: {
      hasMore: !0,
      elements: [],
      query: "",
      loading: !1
    },
    currentPlayback: null
  }, i = document.createElement("div");
  i.className = `video-selection-workspace ${a}`;
  function s(u, o = "", t = 0) {
    const p = e[u];
    p.loading || (p.loading = !0, d(), setTimeout(() => {
      const l = Array.from({ length: 12 }, (v, g) => ({
        id: `${u}-${t + g}`,
        title: `Video ${t + g + 1}`,
        url: `https://example.com/video-${t + g}.mp4`,
        thumbnail: `https://images.unsplash.com/photo-${15e11 + t + g}?w=400&h=225&fit=crop`,
        duration: Math.floor(Math.random() * 300) + 30,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1e3).toISOString()
      })), m = o ? l.filter((v) => v.title.toLowerCase().includes(o.toLowerCase())) : l;
      t === 0 ? p.elements = m : p.elements = [...p.elements, ...m], p.hasMore = m.length >= 12, p.loading = !1, d();
    }, 1e3));
  }
  function c(u, o) {
    const t = document.createElement("div");
    t.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/75", t.innerHTML = `
      <div class="bg-gray-900 rounded-xl p-6 max-w-4xl w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-white">${u}</h3>
          <button class="text-gray-400 hover:text-white text-xl" id="close-preview">&times;</button>
        </div>
        <video class="w-full rounded-lg" controls autoplay>
          <source src="${o}" type="video/mp4">
        </video>
      </div>
    `, document.body.appendChild(t), t.querySelector("#close-preview").addEventListener("click", () => {
      document.body.removeChild(t);
    });
  }
  function d() {
    const u = e[e.scope];
    i.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div class="flex bg-gray-800 rounded-lg p-1">
            <button class="px-4 py-2 rounded text-sm font-medium transition-colors ${e.scope === "library" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}"
                    data-scope="library">
              Library
            </button>
            <button class="px-4 py-2 rounded text-sm font-medium transition-colors ${e.scope === "uploads" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}"
                    data-scope="uploads">
              Uploads
            </button>
          </div>
        </div>

        <div class="relative">
          <input type="text" id="search-input"
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            placeholder="Search videos...">
          <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
        </div>

        <div class="video-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${u.elements.map((o, t) => `
            <div class="video-item bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-violet-500 transition-all cursor-pointer group">
              <div class="aspect-video bg-gray-700 relative overflow-hidden">
                <img src="${o.thumbnail}" alt="${o.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button class="preview-btn w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                          data-url="${o.url}" data-title="${o.title}">
                    <i class="fa fa-play text-white"></i>
                  </button>
                </div>
                <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  ${Math.floor(o.duration / 60)}:${(o.duration % 60).toString().padStart(2, "0")}
                </div>
              </div>
              <div class="p-3">
                <h4 class="text-sm font-medium text-white truncate">${o.title}</h4>
                <p class="text-xs text-gray-500 mt-1">${new Date(o.createdAt).toLocaleDateString()}</p>
                <div class="flex gap-2 mt-2">
                  <button class="use-btn flex-1 bg-violet-600 text-white text-xs py-1.5 rounded hover:bg-violet-500 transition-colors"
                          data-video-id="${o.id}">
                    Use Video
                  </button>
                  ${e.scope === "uploads" ? `
                    <input type="text" value="${o.title}" class="rename-input flex-1 px-2 py-1 bg-gray-700 border border-gray-600 text-white text-xs rounded focus:outline-none focus:border-violet-500"
                           data-video-id="${o.id}">
                  ` : ""}
                </div>
              </div>
            </div>
          `).join("")}

          ${u.hasMore ? `
            <div class="load-more col-span-full flex justify-center py-8">
              <button class="load-more-btn px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors ${u.loading ? "opacity-50 cursor-not-allowed" : ""}"
                      ${u.loading ? "disabled" : ""}>
                ${u.loading ? '<i class="fa fa-spinner fa-spin mr-2"></i>Loading...' : '<i class="fa fa-plus mr-2"></i>Load More'}
              </button>
            </div>
          ` : ""}
        </div>

        ${u.elements.length === 0 && !u.loading ? `
          <div class="text-center py-20">
            <div class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-video text-gray-600 text-2xl"></i>
            </div>
            <h3 class="text-lg text-white font-medium mb-2">No videos found</h3>
            <p class="text-sm text-gray-500">Try adjusting your search or upload some videos</p>
          </div>
        ` : ""}
      </div>
    `, n();
  }
  function n() {
    i.querySelectorAll("[data-scope]").forEach((t) => {
      t.addEventListener("click", () => {
        const p = t.dataset.scope;
        p !== e.scope && (e.scope = p, e[p].elements.length === 0 && s(p), d());
      });
    });
    const u = i.querySelector("#search-input");
    u && u.addEventListener("input", (t) => {
      const p = t.target.value;
      e[e.scope].query = p, s(e.scope, p);
    }), i.querySelectorAll(".preview-btn").forEach((t) => {
      t.addEventListener("click", (p) => {
        p.stopPropagation();
        const l = t.dataset.url, m = t.dataset.title;
        c(m, l);
      });
    }), i.querySelectorAll(".use-btn").forEach((t) => {
      t.addEventListener("click", (p) => {
        p.stopPropagation();
        const l = t.dataset.videoId, m = e[e.scope].elements.find((v) => v.id === l);
        m && r && r(m);
      });
    }), i.querySelectorAll(".rename-input").forEach((t) => {
      t.addEventListener("blur", async (p) => {
        const l = t.dataset.videoId, m = p.target.value;
        console.log("Renaming video", l, "to", m);
      });
    });
    const o = i.querySelector(".load-more-btn");
    o && o.addEventListener("click", () => {
      s(e.scope, e[e.scope].query, e[e.scope].elements.length);
    });
  }
  return s(e.scope), d(), i.api = {
    loadVideos: s,
    getCurrentScope: () => e.scope,
    getVideos: (u) => {
      var o;
      return ((o = e[u]) == null ? void 0 : o.elements) || [];
    }
  }, i;
}
function ce({ onAudioSelected: r, className: a = "" }) {
  const e = {
    scope: "library",
    // 'library' or 'uploads'
    library: {
      hasMore: !0,
      elements: [],
      query: "",
      loading: !1
    },
    uploads: {
      hasMore: !0,
      elements: [],
      query: "",
      loading: !1
    }
  }, i = document.createElement("div");
  i.className = `audio-selection-workspace ${a}`;
  function s(n, u = "", o = 0) {
    const t = e[n];
    t.loading || (t.loading = !0, c(), setTimeout(() => {
      const p = Array.from({ length: 12 }, (m, v) => ({
        id: `${n}-audio-${o + v}`,
        title: `Audio Track ${o + v + 1}`,
        url: `https://example.com/audio-${o + v}.mp3`,
        duration: Math.floor(Math.random() * 300) + 30,
        type: ["music", "voice", "effect"][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1e3).toISOString()
      })), l = u ? p.filter((m) => m.title.toLowerCase().includes(u.toLowerCase())) : p;
      o === 0 ? t.elements = l : t.elements = [...t.elements, ...l], t.hasMore = l.length >= 12, t.loading = !1, c();
    }, 1e3));
  }
  function c() {
    const n = e[e.scope];
    i.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div class="flex bg-gray-800 rounded-lg p-1">
            <button class="px-4 py-2 rounded text-sm font-medium transition-colors ${e.scope === "library" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}"
                    data-scope="library">
              Library
            </button>
            <button class="px-4 py-2 rounded text-sm font-medium transition-colors ${e.scope === "uploads" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}"
                    data-scope="uploads">
              Uploads
            </button>
          </div>
        </div>

        <div class="relative">
          <input type="text" id="search-input"
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            placeholder="Search audio...">
          <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
        </div>

        <div class="audio-list space-y-2">
          ${n.elements.map((u, o) => `
            <div class="audio-item bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-violet-500 transition-all">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <i class="fa fa-music text-gray-400"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-white truncate">${u.title}</h4>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-gray-500">${u.type}</span>
                    <span class="text-xs text-gray-500">•</span>
                    <span class="text-xs text-gray-500">${Math.floor(u.duration / 60)}:${(u.duration % 60).toString().padStart(2, "0")}</span>
                    <span class="text-xs text-gray-500">•</span>
                    <span class="text-xs text-gray-500">${new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <button class="play-btn w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                            data-url="${u.url}" data-title="${u.title}">
                      <i class="fa fa-play text-gray-400 text-xs"></i>
                    </button>
                    <div class="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-violet-500 rounded-full" style="width: 0%"></div>
                    </div>
                    <span class="text-xs text-gray-500 w-12 text-right">0:00</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button class="use-btn px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 transition-colors"
                          data-audio-id="${u.id}">
                    Use Audio
                  </button>
                  ${e.scope === "uploads" ? `
                    <input type="text" value="${u.title}" class="rename-input px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm rounded focus:outline-none focus:border-violet-500 w-32"
                           data-audio-id="${u.id}">
                  ` : ""}
                </div>
              </div>
            </div>
          `).join("")}

          ${n.hasMore ? `
            <div class="load-more flex justify-center py-4">
              <button class="load-more-btn px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors ${n.loading ? "opacity-50 cursor-not-allowed" : ""}"
                      ${n.loading ? "disabled" : ""}>
                ${n.loading ? '<i class="fa fa-spinner fa-spin mr-2"></i>Loading...' : '<i class="fa fa-plus mr-2"></i>Load More'}
              </button>
            </div>
          ` : ""}
        </div>

        ${n.elements.length === 0 && !n.loading ? `
          <div class="text-center py-20">
            <div class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-music text-gray-600 text-2xl"></i>
            </div>
            <h3 class="text-lg text-white font-medium mb-2">No audio found</h3>
            <p class="text-sm text-gray-500">Try adjusting your search or upload some audio files</p>
          </div>
        ` : ""}
      </div>
    `, d();
  }
  function d() {
    i.querySelectorAll("[data-scope]").forEach((o) => {
      o.addEventListener("click", () => {
        const t = o.dataset.scope;
        t !== e.scope && (e.scope = t, e[t].elements.length === 0 && s(t), c());
      });
    });
    const n = i.querySelector("#search-input");
    n && n.addEventListener("input", (o) => {
      const t = o.target.value;
      e[e.scope].query = t, s(e.scope, t);
    }), i.querySelectorAll(".play-btn").forEach((o) => {
      o.addEventListener("click", (t) => {
        t.stopPropagation();
        const p = o.dataset.url;
        o.dataset.title;
        const l = new Audio(p);
        l.play(), o.innerHTML = '<i class="fa fa-pause text-violet-400 text-xs"></i>', o.classList.add("playing"), l.onended = () => {
          o.innerHTML = '<i class="fa fa-play text-gray-400 text-xs"></i>', o.classList.remove("playing");
        };
      });
    }), i.querySelectorAll(".use-btn").forEach((o) => {
      o.addEventListener("click", (t) => {
        t.stopPropagation();
        const p = o.dataset.audioId, l = e[e.scope].elements.find((m) => m.id === p);
        l && r && r(l);
      });
    }), i.querySelectorAll(".rename-input").forEach((o) => {
      o.addEventListener("blur", async (t) => {
        const p = o.dataset.audioId, l = t.target.value;
        console.log("Renaming audio", p, "to", l);
      });
    });
    const u = i.querySelector(".load-more-btn");
    u && u.addEventListener("click", () => {
      s(e.scope, e[e.scope].query, e[e.scope].elements.length);
    });
  }
  return s(e.scope), c(), i.api = {
    loadAudio: s,
    getCurrentScope: () => e.scope,
    getAudio: (n) => {
      var u;
      return ((u = e[n]) == null ? void 0 : u.elements) || [];
    }
  }, i;
}
function ue({ onGenerate: r, onSave: a }) {
  const e = {
    contentType: "blog-post",
    prompt: "",
    tone: "professional",
    length: "medium",
    audience: "general",
    keywords: "",
    customInstructions: "",
    isGenerating: !1,
    generatedContent: "",
    contentHistory: [],
    selectedTemplate: null,
    showTemplates: !1
  }, i = [
    { id: "blog-post", name: "Blog Post", icon: "fa-newspaper", description: "Complete blog article with introduction, body, and conclusion" },
    { id: "social-media", name: "Social Media Post", icon: "fa-share-alt", description: "Engaging posts for platforms like Twitter, Facebook, LinkedIn" },
    { id: "email", name: "Email Campaign", icon: "fa-envelope", description: "Marketing emails, newsletters, and promotional content" },
    { id: "product-description", name: "Product Description", icon: "fa-shopping-cart", description: "Detailed product descriptions with features and benefits" },
    { id: "headline", name: "Headlines & Titles", icon: "fa-heading", description: "Attention-grabbing headlines and titles" },
    { id: "ad-copy", name: "Ad Copy", icon: "fa-bullhorn", description: "Persuasive advertising copy for campaigns" },
    { id: "landing-page", name: "Landing Page Copy", icon: "fa-rocket", description: "Conversion-focused landing page content" },
    { id: "seo-content", name: "SEO Content", icon: "fa-search", description: "Search engine optimized content with keywords" },
    { id: "video-script", name: "Video Script", icon: "fa-video", description: "Scripts for videos, tutorials, and presentations" },
    { id: "faq", name: "FAQ Content", icon: "fa-question-circle", description: "Frequently asked questions and answers" }
  ], s = [
    { id: "professional", name: "Professional", description: "Business-like, formal, and authoritative" },
    { id: "casual", name: "Casual", description: "Relaxed, conversational, and approachable" },
    { id: "friendly", name: "Friendly", description: "Warm, welcoming, and personable" },
    { id: "formal", name: "Formal", description: "Traditional, proper, and structured" },
    { id: "enthusiastic", name: "Enthusiastic", description: "Energetic, excited, and motivational" },
    { id: "serious", name: "Serious", description: "Solemn, thoughtful, and analytical" },
    { id: "humorous", name: "Humorous", description: "Funny, light-hearted, and entertaining" },
    { id: "persuasive", name: "Persuasive", description: "Convincing, compelling, and influential" }
  ], c = [
    { id: "short", name: "Short", description: "50-150 words" },
    { id: "medium", name: "Medium", description: "200-500 words" },
    { id: "long", name: "Long", description: "600-1000 words" },
    { id: "extra-long", name: "Extra Long", description: "1000+ words" }
  ], d = [
    { id: "general", name: "General Public", description: "Broad audience with varied interests" },
    { id: "business", name: "Business Professionals", description: "Corporate executives, managers, entrepreneurs" },
    { id: "students", name: "Students", description: "College/university students and researchers" },
    { id: "seniors", name: "Seniors", description: "Older adults, retirees, senior citizens" },
    { id: "tech-savvy", name: "Tech Enthusiasts", description: "Technology professionals and hobbyists" },
    { id: "parents", name: "Parents", description: "Families with children, parenting community" },
    { id: "millennials", name: "Millennials", description: "Young adults aged 25-40" },
    { id: "gen-z", name: "Gen Z", description: "Young people aged 18-24" }
  ], n = [
    { id: "how-to-guide", name: "How-To Guide", type: "blog-post", prompt: "Write a comprehensive guide on [TOPIC] that includes step-by-step instructions, tips, and common mistakes to avoid.", keywords: ["tutorial", "guide", "how-to", "step-by-step"] },
    { id: "product-review", name: "Product Review", type: "blog-post", prompt: "Create an honest review of [PRODUCT] covering its features, pros and cons, pricing, and who it's best suited for.", keywords: ["review", "product", "features", "comparison"] },
    { id: "industry-trends", name: "Industry Trends", type: "blog-post", prompt: "Analyze the latest trends in [INDUSTRY] including emerging technologies, market changes, and future predictions.", keywords: ["trends", "industry", "analysis", "future"] },
    { id: "social-post", name: "Engaging Social Post", type: "social-media", prompt: "Create an engaging social media post about [TOPIC] that encourages interaction and shares.", keywords: ["social media", "engagement", "viral", "share"] },
    { id: "email-newsletter", name: "Newsletter Campaign", type: "email", prompt: "Write a compelling newsletter about [TOPIC] with engaging content, calls-to-action, and value for subscribers.", keywords: ["newsletter", "email", "campaign", "subscribers"] },
    { id: "product-launch", name: "Product Launch Copy", type: "ad-copy", prompt: "Create persuasive advertising copy for launching [PRODUCT] that highlights unique features and creates urgency.", keywords: ["launch", "product", "advertising", "urgency"] }
  ], u = document.createElement("div");
  u.className = "ai-content-generator flex flex-col h-full bg-gray-900";
  function o() {
    i.find((v) => v.id === e.contentType);
    const m = n.filter((v) => v.type === e.contentType);
    u.innerHTML = `
      <div class="generator-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">AI Content Generator</h2>
            <p class="text-xs text-gray-400">Create content with AI assistance</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium">
            <i class="fa fa-coins mr-1"></i> 50 credits
          </span>
        </div>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <div class="w-72 border-r border-gray-800 p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Content Type</h3>
            <div class="space-y-2">
              ${i.map((v) => `
                <div class="content-type-card p-3 rounded-lg border border-gray-700 cursor-pointer transition-all hover:border-violet-500 ${e.contentType === v.id ? "border-violet-500 bg-violet-500/10" : "bg-gray-800/50"}"
                     data-type="${v.id}">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <i class="fa ${v.icon} text-gray-400"></i>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-white">${v.name}</h4>
                      <p class="text-xs text-gray-500 mt-1">${v.description}</p>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          ${e.showTemplates ? `
            <div>
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Templates</h3>
              <div class="space-y-2">
                ${m.map((v) => `
                  <div class="template-item p-3 rounded-lg border border-gray-700 cursor-pointer transition-all hover:border-violet-500 bg-gray-800/50"
                       data-template="${v.id}">
                    <h4 class="text-sm font-medium text-white">${v.name}</h4>
                    <p class="text-xs text-gray-500 mt-1 line-clamp-2">${v.prompt}</p>
                    <div class="flex gap-1 mt-2">
                      ${v.keywords.map((g) => `<span class="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-xs">${g}</span>`).join("")}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ""}
        </div>

        <div class="flex-1 flex flex-col p-6 overflow-y-auto">
          <div class="space-y-6 max-w-3xl">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Tone</label>
                <select id="tone-select" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  ${s.map((v) => `<option value="${v.id}" ${e.tone === v.id ? "selected" : ""}>${v.name}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">Length</label>
                <select id="length-select" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  ${c.map((v) => `<option value="${v.id}" ${e.length === v.id ? "selected" : ""}>${v.name}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">Audience</label>
                <select id="audience-select" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  ${d.map((v) => `<option value="${v.id}" ${e.audience === v.id ? "selected" : ""}>${v.name}</option>`).join("")}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-4 items-end">
              <div class="col-span-3">
                <label class="block text-xs text-gray-500 mb-2">Prompt or Topic</label>
                <textarea id="prompt-input" rows="3"
                  class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
                  placeholder="Describe what you want to generate... (e.g., 'Write about the benefits of remote work')">${e.prompt}</textarea>
              </div>
              <button id="templates-toggle" class="px-4 py-3 rounded-lg bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                <i class="fa fa-bookmark"></i> Templates
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Keywords (Optional)</label>
                <input id="keywords-input" type="text" value="${e.keywords}"
                  class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="keyword1, keyword2, keyword3">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">Custom Instructions (Optional)</label>
                <input id="custom-input" type="text" value="${e.customInstructions}"
                  class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Any specific requirements...">
              </div>
            </div>

            <button id="generate-btn"
              class="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-3 ${e.isGenerating || !e.prompt.trim() ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:shadow-violet-500/25"}"
              ${e.isGenerating || !e.prompt.trim() ? "disabled" : ""}>
              ${e.isGenerating ? `
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              ` : `
                <i class="fa fa-magic"></i>
                Generate Content
              `}
            </button>

            ${e.generatedContent ? `
              <div class="border border-gray-700 rounded-xl bg-gray-800/50 overflow-hidden">
                <div class="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h3 class="text-sm font-semibold text-white">Generated Content</h3>
                  <div class="flex gap-2">
                    <button id="copy-btn" class="px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 transition-colors flex items-center gap-1">
                      <i class="fa fa-copy"></i> Copy
                    </button>
                    <button id="save-btn" class="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs hover:bg-violet-500 transition-colors flex items-center gap-1">
                      <i class="fa fa-save"></i> Save
                    </button>
                    <button id="clear-btn" class="px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 transition-colors flex items-center gap-1">
                      <i class="fa fa-trash"></i> Clear
                    </button>
                  </div>
                </div>
                <div class="p-4 max-h-64 overflow-y-auto">
                  <pre class="text-sm text-gray-300 whitespace-pre-wrap font-sans">${e.generatedContent}</pre>
                </div>
              </div>
            ` : `
              <div class="border border-gray-700 rounded-xl bg-gray-800/30 p-8 text-center">
                <div class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <i class="fa fa-file-text text-gray-500 text-2xl"></i>
                </div>
                <h4 class="text-white font-medium mb-2">Your generated content will appear here</h4>
                <p class="text-sm text-gray-500">Enter a prompt and click "Generate Content" to get started</p>
              </div>
            `}
          </div>
        </div>

        ${e.contentHistory.length > 0 ? `
          <div class="w-72 border-l border-gray-800 p-4 overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">History</h3>
              <button id="clear-history" class="text-xs text-gray-500 hover:text-red-400 transition-colors">
                <i class="fa fa-trash"></i> Clear
              </button>
            </div>
            <div class="space-y-2">
              ${e.contentHistory.map((v) => `
                <div class="history-item p-3 rounded-lg bg-gray-800/50 border border-gray-700 cursor-pointer hover:border-violet-500 transition-all"
                     data-history-id="${v.id}">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs text-gray-500">${new Date(v.id).toLocaleTimeString()}</span>
                    <span class="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-xs">${v.type}</span>
                  </div>
                  <p class="text-xs text-gray-400 line-clamp-2">${v.prompt}</p>
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `, t();
  }
  function t() {
    u.querySelectorAll(".content-type-card").forEach((w) => {
      w.addEventListener("click", () => {
        e.contentType = w.dataset.type, e.selectedTemplate = null, e.generatedContent = "", o();
      });
    }), u.querySelectorAll(".template-item").forEach((w) => {
      w.addEventListener("click", () => {
        const E = n.find((j) => j.id === w.dataset.template);
        E && (e.selectedTemplate = E, e.contentType = E.type, e.prompt = E.prompt, e.showTemplates = !1, o());
      });
    });
    const m = u.querySelector("#tone-select");
    m && m.addEventListener("change", (w) => {
      e.tone = w.target.value;
    });
    const v = u.querySelector("#length-select");
    v && v.addEventListener("change", (w) => {
      e.length = w.target.value;
    });
    const g = u.querySelector("#audience-select");
    g && g.addEventListener("change", (w) => {
      e.audience = w.target.value;
    });
    const h = u.querySelector("#prompt-input");
    h && h.addEventListener("input", (w) => {
      e.prompt = w.target.value;
    });
    const b = u.querySelector("#keywords-input");
    b && b.addEventListener("input", (w) => {
      e.keywords = w.target.value;
    });
    const x = u.querySelector("#custom-input");
    x && x.addEventListener("input", (w) => {
      e.customInstructions = w.target.value;
    });
    const y = u.querySelector("#templates-toggle");
    y && y.addEventListener("click", () => {
      e.showTemplates = !e.showTemplates, o();
    });
    const S = u.querySelector("#generate-btn");
    S && S.addEventListener("click", p);
    const q = u.querySelector("#copy-btn");
    q && q.addEventListener("click", () => {
      navigator.clipboard.writeText(e.generatedContent);
    });
    const $ = u.querySelector("#save-btn");
    $ && $.addEventListener("click", () => {
      a && a(e.generatedContent), l();
    });
    const C = u.querySelector("#clear-btn");
    C && C.addEventListener("click", () => {
      e.generatedContent = "", o();
    });
    const f = u.querySelector("#clear-history");
    f && f.addEventListener("click", () => {
      e.contentHistory = [], o();
    }), u.querySelectorAll(".history-item").forEach((w) => {
      w.addEventListener("click", () => {
        const E = e.contentHistory.find((j) => j.id === parseInt(w.dataset.historyId));
        E && (e.generatedContent = E.content, o());
      });
    });
  }
  async function p() {
    if (!(!e.prompt.trim() || e.isGenerating)) {
      e.isGenerating = !0, o();
      try {
        await new Promise((v) => setTimeout(v, 2500));
        const m = {
          "blog-post": "# The Power of Remote Work\\n\\nRemote work has transformed how businesses operate across the globe. Here are key benefits you should know:\\n\\n## Flexibility and Work-Life Balance\\n\\nEmployees gain autonomy over their schedules, leading to improved satisfaction and retention rates. Studies show 77% of remote workers report higher satisfaction.\\n\\n## Cost Savings\\n\\nOrganizations save an average of $11,000 per employee annually on office space and related expenses.",
          "social-media": "🚀 Remote work is here to stay! \\n\\nDid you know that 77% of remote workers report higher job satisfaction? \\n\\nHere are 3 reasons why:\\n✅ Better work-life balance\\n✅ Increased productivity\\n✅ Reduced commute stress\\n\\nWhat's your favorite benefit of remote work? 👇",
          email: "Subject: Unlock Your Team's Potential with Remote Work\\n\\nHi there,\\n\\nI hope this email finds you well. I wanted to share some insights about remote work that could benefit your team.\\n\\nRecent studies show that remote workers are 47% more productive and take shorter breaks.\\n\\nReady to learn more? Reply to this email and let's chat.",
          "product-description": "Transform your workspace with our Remote Work Essentials Bundle.\\n\\n**What's Included:**\\n- Ergonomic laptop stand\\n- Wireless noise-canceling headphones\\n- Blue light blocking glasses\\n- Adjustable desk lamp\\n\\n**Key Benefits:**\\n✓ Improve posture and comfort\\n✓ Block distractions\\n✓ Reduce eye strain\\n\\nPerfect for professionals working from home.",
          headline: "10 Proven Strategies to Maximize Productivity in Remote Work\\n\\nThe Ultimate Guide to Thriving as a Remote Employee\\n\\nWhy Remote Work is Revolutionizing the Modern Workplace",
          "ad-copy": "⚡️Work From Anywhere, Succeed Everywhere⚡️\\n\\nJoin 10,000+ professionals who've transformed their careers with remote work.\\n\\n✅ Flexible hours\\n✅ No commute\\n✅ Higher earning potential\\n\\n🎯 Limited time: Get 50% off your first month\\n\\n👉 [CTA Button: Start Your Remote Journey]",
          "landing-page": "## Work Smarter, Not Harder\\n\\nDiscover the freedom of remote work with our proven framework.\\n\\n**Join thousands who have:**\\n- Increased productivity by 47%\\n- Achieved better work-life balance\\n- Advanced their careers faster\\n\\n🔐 30-day money-back guarantee\\n\\n[Get Started Now - No Credit Card Required]",
          "seo-content": "Remote work has become essential for modern businesses. This comprehensive guide covers everything from setting up your home office to maintaining team collaboration.\\n\\n**Key Topics:**\\n1. Best practices for remote teams\\n2. Essential tools and software\\n3. Communication strategies\\n4. Productivity tips\\n5. Work-life balance\\n\\nWhether you're new to remote work or looking to optimize your current setup, this guide has you covered.",
          "video-script": `[Opening shot: Person working from a cozy home office]\\n\\nNARRATOR: "What if I told you that you could increase your productivity by 47%?\\n\\n[Cut to statistics screen]\\n\\nStudies show that remote workers are not just more productive—they're happier too.\\n\\n[Screenshot of remote work tools]\\n\\nLet's dive into the top 5 remote work tools that will transform your workflow...\\n\\n[Music fade out]`,
          faq: "**Q: What is remote work?**\\nA: Remote work allows employees to work from locations outside of a traditional office, typically from home or co-working spaces.\\n\\n**Q: What equipment do I need?**\\nA: Essential equipment includes a reliable computer, high-speed internet, and a comfortable workspace. Many companies provide additional tools.\\n\\n**Q: How do teams collaborate remotely?**\\nA: Remote teams use tools like Slack, Zoom, and project management software to stay connected and productive."
        };
        e.generatedContent = m[e.contentType] || m["blog-post"], r && r(e.generatedContent, {
          type: e.contentType,
          prompt: e.prompt,
          tone: e.tone,
          length: e.length,
          audience: e.audience
        });
      } catch (m) {
        console.error("Generation error:", m);
      } finally {
        e.isGenerating = !1, o();
      }
    }
  }
  function l() {
    e.generatedContent && (e.contentHistory.unshift({
      id: Date.now(),
      type: e.contentType,
      prompt: e.prompt,
      content: e.generatedContent
    }), e.contentHistory.length > 20 && (e.contentHistory = e.contentHistory.slice(0, 20)), o());
  }
  return o(), u;
}
function pe({ commands: r = [], onSelect: a }) {
  const e = {
    isOpen: !1,
    searchQuery: "",
    selectedIndex: 0
  }, i = [
    { id: "new-project", name: "New Project", shortcut: "Ctrl+N", icon: "fa-plus", category: "File", action: () => {
    } },
    { id: "open-project", name: "Open Project", shortcut: "Ctrl+O", icon: "fa-folder-open", category: "File", action: () => {
    } },
    { id: "save-project", name: "Save Project", shortcut: "Ctrl+S", icon: "fa-save", category: "File", action: () => {
    } },
    { id: "export-video", name: "Export Video", shortcut: "Ctrl+E", icon: "fa-film", category: "File", action: () => {
    } },
    { id: "undo", name: "Undo", shortcut: "Ctrl+Z", icon: "fa-undo", category: "Edit", action: () => {
    } },
    { id: "redo", name: "Redo", shortcut: "Ctrl+Y", icon: "fa-redo", category: "Edit", action: () => {
    } },
    { id: "cut", name: "Cut", shortcut: "Ctrl+X", icon: "fa-cut", category: "Edit", action: () => {
    } },
    { id: "copy", name: "Copy", shortcut: "Ctrl+C", icon: "fa-copy", category: "Edit", action: () => {
    } },
    { id: "paste", name: "Paste", shortcut: "Ctrl+V", icon: "fa-paste", category: "Edit", action: () => {
    } },
    { id: "select-all", name: "Select All", shortcut: "Ctrl+A", icon: "fa-check-square", category: "Edit", action: () => {
    } },
    { id: "duplicate", name: "Duplicate", shortcut: "Ctrl+D", icon: "fa-clone", category: "Edit", action: () => {
    } },
    { id: "delete", name: "Delete", shortcut: "Delete", icon: "fa-trash", category: "Edit", action: () => {
    } },
    { id: "play-pause", name: "Play / Pause", shortcut: "Space", icon: "fa-play", category: "Playback", action: () => {
    } },
    { id: "stop", name: "Stop", shortcut: "K", icon: "fa-stop", category: "Playback", action: () => {
    } },
    { id: "previous-frame", name: "Previous Frame", shortcut: "Left", icon: "fa-step-backward", category: "Playback", action: () => {
    } },
    { id: "next-frame", name: "Next Frame", shortcut: "Right", icon: "fa-step-forward", category: "Playback", action: () => {
    } },
    { id: "mute", name: "Mute", shortcut: "M", icon: "fa-volume-mute", category: "Playback", action: () => {
    } },
    { id: "fullscreen", name: "Toggle Fullscreen", shortcut: "F", icon: "fa-expand", category: "View", action: () => {
    } },
    { id: "zoom-in", name: "Zoom In", shortcut: "Ctrl+=", icon: "fa-search-plus", category: "View", action: () => {
    } },
    { id: "zoom-out", name: "Zoom Out", shortcut: "Ctrl+-", icon: "fa-search-minus", category: "View", action: () => {
    } },
    { id: "reset-zoom", name: "Reset Zoom", shortcut: "Ctrl+0", icon: "fa-compress", category: "View", action: () => {
    } },
    { id: "toggle-sidebar", name: "Toggle Sidebar", shortcut: "Ctrl+B", icon: "fa-columns", category: "View", action: () => {
    } },
    { id: "ai-generate", name: "AI Generate", shortcut: "Ctrl+G", icon: "fa-magic", category: "AI", action: () => {
    } },
    { id: "ai-script", name: "AI Script Writer", shortcut: "Ctrl+Shift+S", icon: "fa-pen", category: "AI", action: () => {
    } },
    { id: "ai-voice", name: "AI Voice Clone", shortcut: "Ctrl+Shift+V", icon: "fa-microphone", category: "AI", action: () => {
    } },
    { id: "ai-avatar", name: "Avatar Generator", shortcut: "Ctrl+Shift+A", icon: "fa-user-circle", category: "AI", action: () => {
    } },
    { id: "settings", name: "Settings", shortcut: "Ctrl+,", icon: "fa-cog", category: "Preferences", action: () => {
    } },
    { id: "keyboard-shortcuts", name: "Keyboard Shortcuts", shortcut: "?", icon: "fa-keyboard", category: "Preferences", action: () => {
    } },
    { id: "help", name: "Help Center", shortcut: "F1", icon: "fa-question-circle", category: "Help", action: () => {
    } },
    { id: "getting-started", name: "Getting Started", shortcut: "", icon: "fa-graduation-cap", category: "Help", action: () => {
    } }
  ], s = r.length > 0 ? r : i, c = document.createElement("div");
  c.className = "command-palette-container";
  function d() {
    if (!e.searchQuery.trim()) return s;
    const v = e.searchQuery.toLowerCase().trim();
    return s.filter(
      (g) => {
        var h, b;
        return g.name.toLowerCase().includes(v) || ((h = g.category) == null ? void 0 : h.toLowerCase().includes(v)) || ((b = g.shortcut) == null ? void 0 : b.toLowerCase().includes(v));
      }
    );
  }
  function n() {
    const v = d(), g = {};
    return v.forEach((h) => {
      const b = h.category || "Other";
      g[b] || (g[b] = []), g[b].push(h);
    }), g;
  }
  function u() {
    e.isOpen = !0, e.searchQuery = "", e.selectedIndex = 0, l(), setTimeout(() => {
      const v = c.querySelector("#command-input");
      v && v.focus();
    }, 50);
  }
  function o() {
    e.isOpen = !1, e.searchQuery = "", e.selectedIndex = 0, l();
  }
  function t(v) {
    v.action && v.action(), a && a(v), o();
  }
  function p(v) {
    if ((v.ctrlKey || v.metaKey) && v.key === "k") {
      v.preventDefault(), e.isOpen ? o() : u();
      return;
    }
    if (v.key === "Escape" && e.isOpen) {
      v.preventDefault(), o();
      return;
    }
    if (!e.isOpen) return;
    const g = d();
    switch (v.key) {
      case "ArrowDown":
        v.preventDefault(), e.selectedIndex = (e.selectedIndex + 1) % g.length, l();
        break;
      case "ArrowUp":
        v.preventDefault(), e.selectedIndex = (e.selectedIndex - 1 + g.length) % g.length, l();
        break;
      case "Enter":
        v.preventDefault(), g[e.selectedIndex] && t(g[e.selectedIndex]);
        break;
    }
  }
  function l() {
    if (!e.isOpen)
      c.innerHTML = `
        <div class="fixed bottom-4 right-4 z-50">
          <button id="command-palette-trigger"
            class="w-12 h-12 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500 transition-all flex items-center justify-center group"
            title="Command Palette (Ctrl+K)">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span class="absolute right-full mr-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ctrl+K
            </span>
          </button>
        </div>
      `;
    else {
      const v = n();
      let g = 0;
      c.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm" id="command-palette-overlay">
          <div class="w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl shadow-black/50 border border-gray-800 overflow-hidden">
            <div class="p-4 border-b border-gray-800">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input id="command-input"
                  type="text"
                  class="flex-1 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
                  placeholder="Type a command or search..."
                  value="${e.searchQuery}"
                  autocomplete="off">
                <span class="px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs">ESC</span>
              </div>
            </div>

            <div class="max-h-96 overflow-y-auto">
              ${Object.keys(v).length === 0 ? `
                <div class="p-8 text-center text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p>No commands found</p>
                </div>
              ` : Object.entries(v).map(([h, b]) => `
                <div class="command-category">
                  <div class="px-4 py-2 text-xs font-semibold text-violet-400 uppercase tracking-wider bg-gray-800/50">
                    ${h}
                  </div>
                  ${b.map((x) => {
        const y = g === e.selectedIndex, S = g++;
        return `
                      <div class="command-item px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${y ? "bg-violet-600 text-white" : "text-gray-300 hover:bg-gray-800"}"
                           data-index="${S}"
                           data-command-id="${x.id}">
                        <div class="w-8 h-8 rounded-lg ${y ? "bg-white/20" : "bg-gray-800"} flex items-center justify-center flex-shrink-0">
                          <i class="fa ${x.icon}"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="font-medium">${x.name}</div>
                          ${x.description ? `<div class="text-xs ${y ? "text-white/70" : "text-gray-500"}">${x.description}</div>` : ""}
                        </div>
                        ${x.shortcut ? `
                          <span class="px-2 py-1 rounded ${y ? "bg-white/20" : "bg-gray-800"} text-xs font-mono">
                            ${x.shortcut}
                          </span>
                        ` : ""}
                      </div>
                    `;
      }).join("")}
                </div>
              `).join("")}
            </div>

            <div class="px-4 py-2 bg-gray-800/50 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 rounded bg-gray-700">↑↓</kbd> to navigate
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 rounded bg-gray-700">↵</kbd> to select
                </span>
              </div>
              <span>${d().length} commands</span>
            </div>
          </div>
        </div>
      `;
    }
    m();
  }
  function m() {
    const v = c.querySelector("#command-palette-trigger");
    v && v.addEventListener("click", u);
    const g = c.querySelector("#command-palette-overlay");
    g && g.addEventListener("click", (b) => {
      b.target === g && o();
    });
    const h = c.querySelector("#command-input");
    h && h.addEventListener("input", (b) => {
      e.searchQuery = b.target.value, e.selectedIndex = 0, l();
    }), c.querySelectorAll(".command-item").forEach((b) => {
      b.addEventListener("click", () => {
        const x = b.dataset.commandId, y = s.find((S) => S.id === x);
        y && t(y);
      }), b.addEventListener("mouseenter", () => {
        e.selectedIndex = parseInt(b.dataset.index), l();
      });
    });
  }
  return document.addEventListener("keydown", p), c.addEventListener("remove", () => {
    document.removeEventListener("keydown", p);
  }), l(), c.api = {
    open: u,
    close: o,
    isOpen: () => e.isOpen
  }, c;
}
function ve({ onSave: r, initialConfig: a = {} }) {
  const e = {
    ctaConfig: {
      type: "button",
      style: "primary",
      size: "medium",
      shape: "rounded",
      content: {
        text: "Get Started Today",
        subtext: "",
        icon: "",
        iconPosition: "left"
      },
      action: {
        type: "link",
        target: "#",
        modalId: "",
        scrollTarget: "",
        downloadUrl: "",
        phoneNumber: "",
        emailAddress: "",
        emailSubject: ""
      },
      appearance: {
        backgroundColor: "#8b5cf6",
        textColor: "#ffffff",
        borderColor: "#8b5cf6",
        borderWidth: "2px",
        shadow: "medium",
        hoverEffect: "lift",
        animation: "fade-in"
      },
      positioning: {
        alignment: "center",
        margin: "16px 0",
        width: "auto",
        customWidth: "200px"
      },
      conversion: {
        urgencyText: "",
        socialProof: "",
        guarantee: "",
        tracking: {
          eventName: "cta_click",
          eventCategory: "conversion",
          eventLabel: ""
        }
      }
    },
    activeTab: "content",
    isPreviewMode: !0,
    previewHover: !1
  };
  Object.assign(e.ctaConfig, a);
  const i = [
    { id: "primary", name: "Primary", color: "#8b5cf6" },
    { id: "secondary", name: "Secondary", color: "#6b7280" },
    { id: "success", name: "Success", color: "#10b981" },
    { id: "danger", name: "Danger", color: "#ef4444" },
    { id: "warning", name: "Warning", color: "#f59e0b" },
    { id: "info", name: "Info", color: "#3b82f6" },
    { id: "light", name: "Light", color: "#f3f4f6" },
    { id: "dark", name: "Dark", color: "#1f2937" },
    { id: "outline", name: "Outline", color: "transparent" },
    { id: "ghost", name: "Ghost", color: "transparent" },
    { id: "gradient", name: "Gradient", gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" }
  ], s = [
    { id: "small", name: "Small", scale: 0.85 },
    { id: "medium", name: "Medium", scale: 1 },
    { id: "large", name: "Large", scale: 1.15 },
    { id: "extra-large", name: "Extra Large", scale: 1.3 }
  ], c = [
    { id: "square", name: "Square", radius: "4px" },
    { id: "rounded", name: "Rounded", radius: "8px" },
    { id: "pill", name: "Pill", radius: "9999px" },
    { id: "circle", name: "Circle", radius: "50%" }
  ], d = [
    { id: "none", name: "None" },
    { id: "lift", name: "Lift", transform: "translateY(-2px)" },
    { id: "glow", name: "Glow", boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" },
    { id: "scale", name: "Scale", transform: "scale(1.05)" },
    { id: "slide", name: "Slide", transform: "translateX(4px)" }
  ], n = document.createElement("div");
  n.className = "cta-builder bg-gray-900 rounded-xl border border-gray-800 overflow-hidden";
  function u() {
    const l = e.ctaConfig, m = i.find((b) => b.id === l.style);
    s.find((b) => b.id === l.size);
    const v = c.find((b) => b.id === l.shape), g = d.find((b) => b.id === l.appearance.hoverEffect);
    let h = "";
    return m != null && m.gradient ? h = m.gradient : h = l.style === "outline" || l.style === "ghost" ? "transparent" : (m == null ? void 0 : m.color) || l.appearance.backgroundColor, {
      background: h,
      color: l.style === "outline" || l.style === "ghost" ? l.appearance.backgroundColor : l.appearance.textColor,
      border: l.style === "outline" ? `${l.appearance.borderWidth} solid ${l.appearance.borderColor}` : "none",
      borderRadius: (v == null ? void 0 : v.radius) || "8px",
      padding: l.size === "small" ? "8px 16px" : l.size === "medium" ? "12px 24px" : l.size === "large" ? "16px 32px" : "20px 40px",
      fontSize: l.size === "small" ? "14px" : l.size === "medium" ? "16px" : l.size === "large" ? "18px" : "20px",
      width: l.positioning.width === "full" ? "100%" : l.positioning.width === "custom" ? l.positioning.customWidth : "auto",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: l.appearance.shadow === "small" ? "0 1px 3px rgba(0,0,0,0.1)" : l.appearance.shadow === "medium" ? "0 4px 6px rgba(0,0,0,0.1)" : l.appearance.shadow === "large" ? "0 10px 25px rgba(0,0,0,0.15)" : "none",
      transform: e.previewHover && (g != null && g.transform) ? g.transform : "none"
    };
  }
  function o(l) {
    return Object.entries(l).map(([m, v]) => `${m.replace(/[A-Z]/g, (g) => "-" + g.toLowerCase())}: ${v}`).join("; ");
  }
  function t() {
    var v;
    const l = e.ctaConfig, m = o(u());
    n.innerHTML = `
      <div class="cta-builder-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">CTA Builder</h2>
            <p class="text-xs text-gray-400">Create high-converting call-to-action buttons</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button id="preview-toggle" class="px-3 py-1.5 rounded-lg ${e.isPreviewMode ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-300"} text-sm font-medium transition-colors flex items-center gap-2">
            <i class="fa fa-eye"></i> Preview
          </button>
          <button id="save-cta" class="px-4 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-save"></i> Save CTA
          </button>
        </div>
      </div>

      <div class="flex">
        <div class="w-80 border-r border-gray-800 p-4 overflow-y-auto" style="max-height: 600px;">
          <div class="flex border-b border-gray-800 mb-4">
            ${["content", "appearance", "action", "advanced"].map((g) => `
              <button class="tab-btn flex-1 py-2 text-sm font-medium ${e.activeTab === g ? "text-violet-400 border-b-2 border-violet-400" : "text-gray-500 hover:text-gray-300"}"
                      data-tab="${g}">
                ${g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            `).join("")}
          </div>

          ${e.activeTab === "content" ? `
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Button Text</label>
                <input id="btn-text" type="text" value="${l.content.text}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Subtext (Optional)</label>
                <input id="btn-subtext" type="text" value="${l.content.subtext}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Limited time offer">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Icon</label>
                <div class="grid grid-cols-6 gap-2">
                  ${["", "fa-arrow-right", "fa-download", "fa-envelope", "fa-phone", "fa-play", "fa-plus", "fa-check", "fa-star", "fa-heart", "fa-bolt", "fa-shopping-cart", "fa-external-link", "fa-chevron-right", "fa-angle-right"].map((g) => `
                    <button class="icon-btn w-10 h-10 rounded-lg border ${l.content.icon === g ? "border-violet-500 bg-violet-500/20 text-violet-300" : "border-gray-700 text-gray-400 hover:border-gray-500"} flex items-center justify-center transition-colors"
                            data-icon="${g}">
                      ${g ? `<i class="fa ${g}"></i>` : '<span class="text-xs">None</span>'}
                    </button>
                  `).join("")}
                </div>
              </div>

              ${l.content.icon ? `
                <div>
                  <label class="block text-xs text-gray-500 mb-2">Icon Position</label>
                  <div class="grid grid-cols-2 gap-2">
                    ${[["left", "Left"], ["right", "Right"]].map(([g, h]) => `
                      <button class="pos-btn py-2 rounded-lg border text-sm ${l.content.iconPosition === g ? "border-violet-500 bg-violet-500/20 text-violet-300" : "border-gray-700 text-gray-400"}"
                              data-position="${g}">
                        ${h}
                      </button>
                    `).join("")}
                  </div>
                </div>
              ` : ""}

              <div>
                <label class="block text-xs text-gray-500 mb-2">Style</label>
                <div class="space-y-2">
                  ${i.map((g) => `
                    <button class="style-btn w-full p-3 rounded-lg border flex items-center gap-3 transition-colors ${l.style === g.id ? "border-violet-500 bg-violet-500/10" : "border-gray-700 hover:border-gray-600"}"
                            data-style="${g.id}">
                      <div class="w-8 h-8 rounded" style="background: ${g.gradient || g.color}; ${g.id === "outline" || g.id === "ghost" ? "border: 2px solid #8b5cf6" : ""}"></div>
                      <span class="text-sm text-white">${g.name}</span>
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Size</label>
                <div class="grid grid-cols-2 gap-2">
                  ${s.map((g) => `
                    <button class="size-btn py-2 rounded-lg border text-sm ${l.size === g.id ? "border-violet-500 bg-violet-500/20 text-violet-300" : "border-gray-700 text-gray-400 hover:border-gray-600"}"
                            data-size="${g.id}">
                      ${g.name}
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Shape</label>
                <div class="grid grid-cols-2 gap-2">
                  ${c.map((g) => `
                    <button class="shape-btn py-2 rounded-lg border text-sm ${l.shape === g.id ? "border-violet-500 bg-violet-500/20 text-violet-300" : "border-gray-700 text-gray-400 hover:border-gray-600"}"
                            data-shape="${g.id}">
                      ${g.name}
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>
          ` : ""}

          ${e.activeTab === "appearance" ? `
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Background Color</label>
                <div class="flex gap-2">
                  <input id="bg-color" type="color" value="${l.appearance.backgroundColor}"
                    class="w-12 h-10 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer">
                  <input id="bg-color-text" type="text" value="${l.appearance.backgroundColor}"
                    class="flex-1 p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Text Color</label>
                <div class="flex gap-2">
                  <input id="text-color" type="color" value="${l.appearance.textColor}"
                    class="w-12 h-10 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer">
                  <input id="text-color-text" type="text" value="${l.appearance.textColor}"
                    class="flex-1 p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Shadow</label>
                <div class="grid grid-cols-2 gap-2">
                  ${["none", "small", "medium", "large"].map((g) => `
                    <button class="shadow-btn py-2 rounded-lg border text-sm ${l.appearance.shadow === g ? "border-violet-500 bg-violet-500/20 text-violet-300" : "border-gray-700 text-gray-400"}"
                            data-shadow="${g}">
                      ${g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Hover Effect</label>
                <div class="space-y-2">
                  ${d.map((g) => `
                    <button class="hover-btn w-full p-3 rounded-lg border text-sm flex items-center gap-2 ${l.appearance.hoverEffect === g.id ? "border-violet-500 bg-violet-500/10 text-violet-300" : "border-gray-700 text-gray-400"}"
                            data-hover="${g.id}">
                      <span>${g.name}</span>
                      ${g.transform !== "none" ? '<i class="fa fa-arrow-up text-xs opacity-50"></i>' : ""}
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>
          ` : ""}

          ${e.activeTab === "action" ? `
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Action Type</label>
                <div class="space-y-2">
                  ${[
      ["link", "Link to URL", "fa-link"],
      ["modal", "Open Modal", "fa-window-maximize"],
      ["scroll", "Scroll to Section", "fa-arrow-down"],
      ["download", "Download File", "fa-download"],
      ["phone", "Call Phone", "fa-phone"],
      ["email", "Send Email", "fa-envelope"]
    ].map(([g, h, b]) => `
                    <button class="action-type-btn w-full p-3 rounded-lg border flex items-center gap-3 ${l.action.type === g ? "border-violet-500 bg-violet-500/10" : "border-gray-700 hover:border-gray-600"}"
                            data-action-type="${g}">
                      <i class="fa ${b} text-gray-400"></i>
                      <span class="text-sm text-white">${h}</span>
                    </button>
                  `).join("")}
                </div>
              </div>

              ${l.action.type === "link" ? `
                <div>
                  <label class="block text-xs text-gray-500 mb-2">URL</label>
                  <input id="action-target" type="text" value="${l.action.target}"
                    class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                    placeholder="https://example.com">
                </div>
              ` : ""}

              ${l.action.type === "email" ? `
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-2">Email Address</label>
                    <input id="email-address" type="email" value="${l.action.emailAddress}"
                      class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-2">Subject (Optional)</label>
                    <input id="email-subject" type="text" value="${l.action.emailSubject}"
                      class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  </div>
                </div>
              ` : ""}

              ${l.action.type === "phone" ? `
                <div>
                  <label class="block text-xs text-gray-500 mb-2">Phone Number</label>
                  <input id="phone-number" type="tel" value="${l.action.phoneNumber}"
                    class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                    placeholder="+1 (555) 123-4567">
                </div>
              ` : ""}

              <div>
                <label class="block text-xs text-gray-500 mb-2">Alignment</label>
                <div class="grid grid-cols-3 gap-2">
                  ${[["left", "Left"], ["center", "Center"], ["right", "Right"]].map(([g, h]) => `
                    <button class="align-btn py-2 rounded-lg border text-sm ${l.positioning.alignment === g ? "border-violet-500 bg-violet-500/20 text-violet-300" : "border-gray-700 text-gray-400"}"
                            data-align="${g}">
                      ${h}
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>
          ` : ""}

          ${e.activeTab === "advanced" ? `
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Urgency Text</label>
                <input id="urgency-text" type="text" value="${l.conversion.urgencyText}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Limited time offer - ends soon!">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Social Proof</label>
                <input id="social-proof" type="text" value="${l.conversion.socialProof}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Join 10,000+ satisfied customers">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Guarantee Badge</label>
                <input id="guarantee-text" type="text" value="${l.conversion.guarantee}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="30-day money back guarantee">
              </div>

              <div class="pt-4 border-t border-gray-800">
                <label class="block text-xs text-gray-500 mb-2">Tracking Event Name</label>
                <input id="tracking-event" type="text" value="${l.conversion.tracking.eventName}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Custom CSS</label>
                <textarea id="custom-css" rows="4"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm font-mono resize-none focus:outline-none focus:border-violet-500"
                  placeholder="/* Custom CSS styles */"></textarea>
              </div>
            </div>
          ` : ""}
        </div>

        <div class="flex-1 p-8 flex flex-col">
          <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Preview</h3>
          <div class="flex-1 bg-gray-800/50 rounded-xl p-8 flex flex-col items-${l.positioning.alignment} justify-center border border-gray-700">
            ${l.conversion.socialProof ? `
              <div class="text-xs text-green-400 mb-3 flex items-center gap-1">
                <i class="fa fa-users"></i>
                ${l.conversion.socialProof}
              </div>
            ` : ""}

            <button id="cta-preview-btn" class="cta-preview-btn inline-flex items-center justify-center gap-2 transition-all"
                    style="${m}"
                    onmouseenter="this.style.transform = '${((v = d.find((g) => g.id === l.appearance.hoverEffect)) == null ? void 0 : v.transform) || "none"}'"
                    onmouseleave="this.style.transform = 'none'">
              ${l.content.icon && l.content.iconPosition === "left" ? `<i class="fa ${l.content.icon}"></i>` : ""}
              <span>${l.content.text}</span>
              ${l.content.icon && l.content.iconPosition === "right" ? `<i class="fa ${l.content.icon}"></i>` : ""}
            </button>

            ${l.content.subtext ? `
              <p class="text-xs text-gray-500 mt-2">${l.content.subtext}</p>
            ` : ""}

            ${l.conversion.urgencyText ? `
              <div class="text-xs text-orange-400 mt-2 flex items-center gap-1">
                <i class="fa fa-clock"></i>
                ${l.conversion.urgencyText}
              </div>
            ` : ""}

            ${l.conversion.guarantee ? `
              <div class="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <i class="fa fa-shield-alt"></i>
                ${l.conversion.guarantee}
              </div>
            ` : ""}
          </div>

          <div class="mt-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div class="text-xs text-gray-500 mb-2">HTML Code</div>
            <code class="text-xs text-gray-300 font-mono break-all" id="html-code">
              &lt;button class="cta-button" style="${m.replace(/"/g, "&quot;")}"&gt;${l.content.text}&lt;/button&gt;
            </code>
          </div>
        </div>
      </div>
    `, p();
  }
  function p() {
    n.querySelectorAll(".tab-btn").forEach((f) => {
      f.addEventListener("click", () => {
        e.activeTab = f.dataset.tab, t();
      });
    });
    const l = n.querySelector("#preview-toggle");
    l && l.addEventListener("click", () => {
      e.isPreviewMode = !e.isPreviewMode, t();
    });
    const m = n.querySelector("#save-cta");
    m && m.addEventListener("click", () => {
      r && r(e.ctaConfig);
    });
    const v = n.querySelector("#btn-text");
    v && v.addEventListener("input", (f) => {
      e.ctaConfig.content.text = f.target.value, t();
    });
    const g = n.querySelector("#btn-subtext");
    g && g.addEventListener("input", (f) => {
      e.ctaConfig.content.subtext = f.target.value, t();
    }), n.querySelectorAll(".icon-btn").forEach((f) => {
      f.addEventListener("click", () => {
        e.ctaConfig.content.icon = f.dataset.icon, t();
      });
    }), n.querySelectorAll(".pos-btn").forEach((f) => {
      f.addEventListener("click", () => {
        e.ctaConfig.content.iconPosition = f.dataset.position, t();
      });
    }), n.querySelectorAll(".style-btn").forEach((f) => {
      f.addEventListener("click", () => {
        e.ctaConfig.style = f.dataset.style, t();
      });
    }), n.querySelectorAll(".size-btn").forEach((f) => {
      f.addEventListener("click", () => {
        e.ctaConfig.size = f.dataset.size, t();
      });
    }), n.querySelectorAll(".shape-btn").forEach((f) => {
      f.addEventListener("click", () => {
        e.ctaConfig.shape = f.dataset.shape, t();
      });
    });
    const h = n.querySelector("#bg-color"), b = n.querySelector("#bg-color-text");
    h && h.addEventListener("input", (f) => {
      e.ctaConfig.appearance.backgroundColor = f.target.value, b && (b.value = f.target.value), t();
    }), b && b.addEventListener("input", (f) => {
      e.ctaConfig.appearance.backgroundColor = f.target.value, h && (h.value = f.target.value), t();
    });
    const x = n.querySelector("#text-color"), y = n.querySelector("#text-color-text");
    x && x.addEventListener("input", (f) => {
      e.ctaConfig.appearance.textColor = f.target.value, y && (y.value = f.target.value), t();
    }), y && y.addEventListener("input", (f) => {
      e.ctaConfig.appearance.textColor = f.target.value, x && (x.value = f.target.value), t();
    }), n.querySelectorAll(".shadow-btn").forEach((f) => {
      f.addEventListener("click", () => {
        e.ctaConfig.appearance.shadow = f.dataset.shadow, t();
      });
    }), n.querySelectorAll(".hover-btn").forEach((f) => {
      f.addEventListener("click", () => {
        e.ctaConfig.appearance.hoverEffect = f.dataset.hover, t();
      });
    }), n.querySelectorAll(".action-type-btn").forEach((f) => {
      f.addEventListener("click", () => {
        e.ctaConfig.action.type = f.dataset.actionType, t();
      });
    }), n.querySelectorAll(".align-btn").forEach((f) => {
      f.addEventListener("click", () => {
        e.ctaConfig.positioning.alignment = f.dataset.align, t();
      });
    });
    const S = n.querySelector("#urgency-text");
    S && S.addEventListener("input", (f) => {
      e.ctaConfig.conversion.urgencyText = f.target.value, t();
    });
    const q = n.querySelector("#social-proof");
    q && q.addEventListener("input", (f) => {
      e.ctaConfig.conversion.socialProof = f.target.value, t();
    });
    const $ = n.querySelector("#guarantee-text");
    $ && $.addEventListener("input", (f) => {
      e.ctaConfig.conversion.guarantee = f.target.value, t();
    });
    const C = n.querySelector("#cta-preview-btn");
    C && (C.addEventListener("mouseenter", () => {
      e.previewHover = !0;
    }), C.addEventListener("mouseleave", () => {
      e.previewHover = !1;
    }));
  }
  return t(), n.api = {
    getConfig: () => e.ctaConfig,
    setConfig: (l) => {
      Object.assign(e.ctaConfig, l), t();
    }
  }, n;
}
function ge({ analyticsData: r = {} }) {
  const e = { ...{
    views: 12345,
    uniqueVisitors: 8762,
    avgWatchTime: 156,
    completionRate: 0.68,
    interactions: 3421,
    clicks: 1892,
    conversions: 456,
    bounceRate: 0.24,
    deviceBreakdown: { desktop: 0.45, mobile: 0.42, tablet: 0.13 },
    trafficSources: { organic: 0.35, social: 0.28, direct: 0.2, referral: 0.17 },
    topPages: [
      { path: "/home", views: 5200 },
      { path: "/about", views: 1800 },
      { path: "/contact", views: 1200 },
      { path: "/products", views: 980 }
    ],
    geographic: [
      { country: "US", visitors: 3500, percentage: 0.4 },
      { country: "UK", visitors: 1800, percentage: 0.21 },
      { country: "CA", visitors: 1200, percentage: 0.14 },
      { country: "AU", visitors: 800, percentage: 0.09 }
    ],
    hourly: Array.from({ length: 24 }, (o, t) => ({
      hour: t,
      activity: Math.random() * 100 + (t >= 9 && t <= 17 ? 50 : 20)
    })),
    daily: Array.from({ length: 7 }, (o, t) => ({
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][t],
      visits: Math.floor(Math.random() * 2e3 + 500)
    })),
    events: [
      { name: "CTA Click", count: 1892, conversion: 0.24 },
      { name: "Video Play", count: 8762, conversion: 1 },
      { name: "Form Submit", count: 456, conversion: 0.05 },
      { name: "Share", count: 234, conversion: 0.03 },
      { name: "Download", count: 189, conversion: 0.02 }
    ]
  }, ...r }, i = {
    timeRange: "7d",
    activeTab: "overview"
  }, s = document.createElement("div");
  s.className = "behavioral-analytics flex flex-col h-full bg-gray-900";
  function c(o) {
    return o >= 1e6 ? (o / 1e6).toFixed(1) + "M" : o >= 1e3 ? (o / 1e3).toFixed(1) + "K" : o.toString();
  }
  function d(o) {
    const t = Math.floor(o / 60), p = o % 60;
    return `${t}:${p.toString().padStart(2, "0")}`;
  }
  function n() {
    s.innerHTML = `
      <div class="analytics-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Behavioral Analytics</h2>
            <p class="text-xs text-gray-400">Track user engagement and interactions</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <select id="time-range" class="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
            <option value="24h">Last 24 hours</option>
            <option value="7d" selected>Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button id="export-btn" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-download"></i> Export
          </button>
        </div>
      </div>

      <div class="flex border-b border-gray-800">
        ${[
      ["overview", "Overview", "fa-chart-pie"],
      ["engagement", "Engagement", "fa-chart-line"],
      ["audience", "Audience", "fa-users"],
      ["events", "Events", "fa-bolt"]
    ].map(([o, t, p]) => `
          <button class="tab-btn flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${i.activeTab === o ? "text-violet-400 border-b-2 border-violet-400" : "text-gray-400 hover:text-white"}"
                  data-tab="${o}">
            <i class="fa ${p}"></i>
            ${t}
          </button>
        `).join("")}
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        ${i.activeTab === "overview" ? `
          <div class="space-y-6">
            <div class="grid grid-cols-4 gap-4">
              ${[
      { label: "Total Views", value: c(e.views), change: "+12.5%", positive: !0, icon: "fa-eye", color: "blue" },
      { label: "Unique Visitors", value: c(e.uniqueVisitors), change: "+8.3%", positive: !0, icon: "fa-user", color: "green" },
      { label: "Avg Watch Time", value: d(e.avgWatchTime), change: "+5.2%", positive: !0, icon: "fa-clock", color: "purple" },
      { label: "Completion Rate", value: (e.completionRate * 100).toFixed(0) + "%", change: "-2.1%", positive: !1, icon: "fa-check-circle", color: "orange" }
    ].map((o) => `
                <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wider">${o.label}</p>
                      <p class="text-2xl font-bold text-white mt-1">${o.value}</p>
                    </div>
                    <div class="w-8 h-8 rounded-lg bg-${o.color}-500/20 text-${o.color}-400 flex items-center justify-center">
                      <i class="fa ${o.icon}"></i>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 mt-3">
                    <span class="text-xs ${o.positive ? "text-green-400" : "text-red-400"}">
                      <i class="fa ${o.positive ? "fa-arrow-up" : "fa-arrow-down"}"></i> ${o.change}
                    </span>
                    <span class="text-xs text-gray-500">vs last period</span>
                  </div>
                </div>
              `).join("")}
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <i class="fa fa-chart-area text-violet-400"></i>
                  Activity Over Time
                </h3>
                <div class="h-48 flex items-end justify-between gap-1">
                  ${e.daily.map((o) => `
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <div class="w-full bg-violet-500/30 rounded-t hover:bg-violet-500/50 transition-colors relative group"
                           style="height: ${o.visits / Math.max(...e.daily.map((t) => t.visits)) * 100}%">
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${c(o.visits)} visits
                        </div>
                      </div>
                      <span class="text-xs text-gray-500">${o.day}</span>
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <i class="fa fa-clock text-violet-400"></i>
                  Hourly Activity
                </h3>
                <div class="h-48 flex items-end justify-between gap-px">
                  ${e.hourly.map((o) => `
                    <div class="flex-1 relative group">
                      <div class="w-full bg-fuchsia-500/30 rounded-t hover:bg-fuchsia-500/50 transition-colors"
                           style="height: ${o.activity / Math.max(...e.hourly.map((t) => t.activity)) * 100}%">
                      </div>
                      ${o.hour % 4 === 0 ? `<span class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500">${o.hour}:00</span>` : ""}
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Device Breakdown</h3>
                <div class="space-y-3">
                  ${[
      { device: "Desktop", value: e.deviceBreakdown.desktop, icon: "fa-desktop", color: "blue" },
      { device: "Mobile", value: e.deviceBreakdown.mobile, icon: "fa-mobile-alt", color: "green" },
      { device: "Tablet", value: e.deviceBreakdown.tablet, icon: "fa-tablet-alt", color: "purple" }
    ].map((o) => `
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-400 flex items-center gap-2">
                          <i class="fa ${o.icon}"></i>
                          ${o.device}
                        </span>
                        <span class="text-white">${(o.value * 100).toFixed(0)}%</span>
                      </div>
                      <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-${o.color}-500 rounded-full" style="width: ${o.value * 100}%"></div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Traffic Sources</h3>
                <div class="space-y-3">
                  ${[
      { source: "Organic Search", value: e.trafficSources.organic, icon: "fa-search", color: "green" },
      { source: "Social Media", value: e.trafficSources.social, icon: "fa-share-alt", color: "blue" },
      { source: "Direct", value: e.trafficSources.direct, icon: "fa-link", color: "purple" },
      { source: "Referral", value: e.trafficSources.referral, icon: "fa-share", color: "orange" }
    ].map((o) => `
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-400 flex items-center gap-2">
                          <i class="fa ${o.icon}"></i>
                          ${o.source}
                        </span>
                        <span class="text-white">${(o.value * 100).toFixed(0)}%</span>
                      </div>
                      <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-${o.color}-500 rounded-full" style="width: ${o.value * 100}%"></div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Top Pages</h3>
                <div class="space-y-3">
                  ${e.topPages.map((o, t) => `
                    <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div class="flex items-center gap-3">
                        <span class="w-5 h-5 rounded-full bg-gray-700 text-gray-400 text-xs flex items-center justify-center">${t + 1}</span>
                        <span class="text-sm text-gray-300">${o.path}</span>
                      </div>
                      <span class="text-sm text-gray-500">${c(o.views)}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>
        ` : ""}

        ${i.activeTab === "engagement" ? `
          <div class="space-y-6">
            <div class="grid grid-cols-3 gap-4">
              <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p class="text-xs text-gray-500 uppercase">Interactions</p>
                <p class="text-3xl font-bold text-white mt-2">${c(e.interactions)}</p>
                <div class="text-xs text-green-400 mt-1">
                  <i class="fa fa-arrow-up"></i> 15.3% vs last week
                </div>
              </div>
              <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p class="text-xs text-gray-500 uppercase">Click Rate</p>
                <p class="text-3xl font-bold text-white mt-2">${(e.clicks / e.views * 100).toFixed(1)}%</p>
                <div class="text-xs text-green-400 mt-1">
                  <i class="fa fa-arrow-up"></i> 3.2% vs last week
                </div>
              </div>
              <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p class="text-xs text-gray-500 uppercase">Conversion Rate</p>
                <p class="text-3xl font-bold text-white mt-2">${(e.conversions / e.views * 100).toFixed(1)}%</p>
                <div class="text-xs text-red-400 mt-1">
                  <i class="fa fa-arrow-down"></i> 1.1% vs last week
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
              <h3 class="text-sm font-semibold text-white mb-4">Engagement Funnel</h3>
              <div class="space-y-4">
                ${[
      { stage: "Views", value: e.views, percent: 100, color: "violet" },
      { stage: "Watched > 10s", value: Math.floor(e.views * 0.72), percent: 72, color: "fuchsia" },
      { stage: "Watched > 50%", value: Math.floor(e.views * 0.45), percent: 45, color: "pink" },
      { stage: "Watched to End", value: Math.floor(e.views * e.completionRate), percent: Math.floor(e.completionRate * 100), color: "rose" },
      { stage: "Click CTA", value: e.clicks, percent: Math.floor(e.clicks / e.views * 100), color: "red" },
      { stage: "Converted", value: e.conversions, percent: Math.floor(e.conversions / e.views * 100), color: "orange" }
    ].map((o, t) => `
                  <div class="relative">
                    <div class="flex items-center gap-4">
                      <div class="w-32 text-sm text-gray-400 text-right">${o.stage}</div>
                      <div class="flex-1">
                        <div class="h-8 bg-gray-700/50 rounded-lg overflow-hidden">
                          <div class="h-full bg-${o.color}-500/80 rounded-lg flex items-center px-3 transition-all duration-500"
                               style="width: ${o.percent}%">
                            <span class="text-white text-sm font-medium">${c(o.value)}</span>
                          </div>
                        </div>
                      </div>
                      <div class="w-16 text-sm text-white font-medium">${o.percent}%</div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        ` : ""}

        ${i.activeTab === "audience" ? `
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Geographic Distribution</h3>
                <div class="space-y-2">
                  ${e.geographic.map((o) => `
                    <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">${o.country}</div>
                      <div class="flex-1">
                        <div class="flex justify-between text-sm mb-1">
                          <span class="text-gray-400">${o.country === "US" ? "United States" : o.country === "UK" ? "United Kingdom" : o.country === "CA" ? "Canada" : o.country === "AU" ? "Australia" : o.country}</span>
                          <span class="text-white">${c(o.visitors)}</span>
                        </div>
                        <div class="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div class="h-full bg-violet-500 rounded-full" style="width: ${o.percentage * 100}%"></div>
                        </div>
                      </div>
                      <span class="text-sm text-gray-500">${(o.percentage * 100).toFixed(0)}%</span>
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Device Analytics</h3>
                <div class="grid grid-cols-3 gap-4 mb-6">
                  ${[
      { device: "Desktop", percent: 45, sessions: 3943, avgTime: "4:32", icon: "fa-desktop" },
      { device: "Mobile", percent: 42, sessions: 3680, avgTime: "2:18", icon: "fa-mobile-alt" },
      { device: "Tablet", percent: 13, sessions: 1139, avgTime: "3:45", icon: "fa-tablet-alt" }
    ].map((o) => `
                    <div class="text-center p-4 rounded-lg bg-gray-700/50">
                      <i class="fa ${o.icon} text-2xl text-violet-400 mb-2"></i>
                      <p class="text-lg font-semibold text-white">${o.percent}%</p>
                      <p class="text-xs text-gray-500">${o.sessions.toLocaleString()}</p>
                    </div>
                  `).join("")}
                </div>
                <div class="space-y-3">
                  <h4 class="text-sm font-medium text-gray-400">Browser Distribution</h4>
                  ${[
      { browser: "Chrome", share: 0.62 },
      { browser: "Safari", share: 0.19 },
      { browser: "Firefox", share: 0.09 },
      { browser: "Edge", share: 0.06 },
      { browser: "Other", share: 0.04 }
    ].map((o) => `
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-400">${o.browser}</span>
                      <div class="flex items-center gap-2">
                        <div class="w-24 h-1.5 bg-gray-700 rounded-full">
                          <div class="h-full bg-violet-500 rounded-full" style="width: ${o.share * 100}%"></div>
                        </div>
                        <span class="text-sm text-white w-10 text-right">${(o.share * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>
        ` : ""}

        ${i.activeTab === "events" ? `
          <div class="space-y-6">
            <div class="grid grid-cols-5 gap-4">
              ${e.events.map((o) => `
                <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-center">
                  <p class="text-2xl font-bold text-white">${c(o.count)}</p>
                  <p class="text-xs text-gray-500 mt-1">${o.name}</p>
                  <p class="text-sm text-violet-400 mt-2">${(o.conversion * 100).toFixed(1)}%</p>
                </div>
              `).join("")}
            </div>

            <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
              <h3 class="text-sm font-semibold text-white mb-4">Event Timeline</h3>
              <div class="space-y-4">
                ${e.events.map((o, t) => `
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center">
                      <span class="text-sm font-bold">${t + 1}</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between mb-1">
                        <span class="text-sm font-medium text-white">${o.name}</span>
                        <span class="text-sm text-gray-400">${c(o.count)} events</span>
                      </div>
                      <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style="width: ${Math.min(o.count / e.views * 100 * 3, 100)}%"></div>
                      </div>
                    </div>
                    <span class="text-sm font-medium text-violet-400">${(o.conversion * 100).toFixed(1)}%</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        ` : ""}
      </div>
    `, u();
  }
  function u() {
    s.querySelectorAll(".tab-btn").forEach((p) => {
      p.addEventListener("click", () => {
        i.activeTab = p.dataset.tab, n();
      });
    });
    const o = s.querySelector("#time-range");
    o && o.addEventListener("change", (p) => {
      i.timeRange = p.target.value;
    });
    const t = s.querySelector("#export-btn");
    t && t.addEventListener("click", () => {
      const p = {
        ...e,
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        timeRange: i.timeRange
      }, l = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }), m = URL.createObjectURL(l), v = document.createElement("a");
      v.href = m, v.download = `analytics-${i.timeRange}-${Date.now()}.json`, v.click(), URL.revokeObjectURL(m);
    });
  }
  return n(), s.api = {
    refresh: () => n(),
    setTimeRange: (o) => {
      i.timeRange = o, n();
    }
  }, s;
}
function me({ initialTheme: r = {}, onChange: a, onSave: e }) {
  const i = {
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#06b6d4",
      background: "#111827",
      surface: "#1f2937",
      text: "#f9fafb",
      muted: "#6b7280",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444"
    },
    typography: {
      fontFamily: "Inter",
      headingFont: "Inter",
      baseSize: 16,
      lineHeight: 1.6,
      headingWeight: 600,
      bodyWeight: 400
    },
    spacing: {
      base: 4,
      scale: 1.5
    },
    radius: {
      small: "4px",
      medium: "8px",
      large: "16px",
      xl: "24px"
    },
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.1)",
      md: "0 4px 6px rgba(0,0,0,0.1)",
      lg: "0 10px 25px rgba(0,0,0,0.15)",
      glow: "0 0 20px rgba(139, 92, 246, 0.3)"
    },
    animations: {
      enabled: !0,
      duration: 300,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    darkMode: !0,
    glassMorphism: !0
  }, s = {
    theme: { ...i, ...r },
    activeTab: "colors",
    presets: [
      { name: "Default Dark", colors: i.colors },
      { name: "Midnight", colors: { ...i.colors, primary: "#6366f1", background: "#0f172a", surface: "#1e293b" } },
      { name: "Forest", colors: { ...i.colors, primary: "#22c55e", secondary: "#84cc16", accent: "#14b8a6" } },
      { name: "Sunset", colors: { ...i.colors, primary: "#f97316", secondary: "#f43f5e", accent: "#eab308" } },
      { name: "Ocean", colors: { ...i.colors, primary: "#0ea5e9", secondary: "#06b6d4", accent: "#8b5cf6" } }
    ]
  }, c = document.createElement("div");
  c.className = "theme-customizer flex flex-col h-full bg-gray-900";
  function d(t, p) {
    const l = t.split(".");
    let m = s.theme;
    for (let v = 0; v < l.length - 1; v++)
      m = m[l[v]];
    m[l[l.length - 1]] = p, a && a(s.theme), u();
  }
  function n() {
    const t = s.theme;
    return `
:root {
  --color-primary: ${t.colors.primary};
  --color-secondary: ${t.colors.secondary};
  --color-accent: ${t.colors.accent};
  --color-bg: ${t.colors.background};
  --color-surface: ${t.colors.surface};
  --color-text: ${t.colors.text};
  --color-muted: ${t.colors.muted};
  --font-main: ${t.typography.fontFamily}, sans-serif;
  --font-heading: ${t.typography.headingFont}, sans-serif;
  --radius-sm: ${t.radius.small};
  --radius-md: ${t.radius.medium};
  --radius-lg: ${t.radius.large};
  --shadow-glow: ${t.shadows.glow};
}`;
  }
  function u() {
    const t = s.theme;
    c.innerHTML = `
      <div class="theme-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Theme Customizer</h2>
            <p class="text-xs text-gray-400">Design your brand experience</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <select id="preset-select" class="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
            <option value="">Load Preset...</option>
            ${s.presets.map((p, l) => `<option value="${l}">${p.name}</option>`).join("")}
          </select>
          <button id="save-theme" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-save"></i> Save
          </button>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <div class="w-64 border-r border-gray-800 p-4 space-y-2">
          ${[
      ["colors", "Colors", "fa-palette"],
      ["typography", "Typography", "fa-font"],
      ["layout", "Layout & Spacing", "fa-expand"],
      ["effects", "Effects", "fa-magic"]
    ].map(([p, l, m]) => `
            <button class="tab-btn w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${s.activeTab === p ? "bg-violet-500/20 text-violet-300" : "text-gray-400 hover:bg-gray-800"}"
                    data-tab="${p}">
              <i class="fa ${m} w-5"></i>
              <span class="text-sm font-medium">${l}</span>
            </button>
          `).join("")}
        </div>

        <div class="flex-1 flex">
          <div class="flex-1 p-6 overflow-y-auto space-y-6">
            ${s.activeTab === "colors" ? `
              <div>
                <h3 class="text-sm font-semibold text-white mb-4">Brand Colors</h3>
                <div class="grid grid-cols-2 gap-4">
                  ${[
      ["colors.primary", "Primary", "The main brand color used for buttons and CTAs"],
      ["colors.secondary", "Secondary", "Accent color for highlights and secondary actions"],
      ["colors.accent", "Accent", "Tertiary color for emphasis and special elements"]
    ].map(([p, l, m]) => `
                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-medium text-white">${l}</label>
                        <div class="flex items-center gap-2">
                          <input type="color" value="${t.colors[p.split(".")[1]]}" 
                                 class="w-8 h-8 rounded cursor-pointer bg-transparent"
                                 data-color-path="${p}">
                          <input type="text" value="${t.colors[p.split(".")[1]]}" 
                                 class="w-20 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white text-xs uppercase font-mono"
                                 data-color-text-path="${p}">
                        </div>
                      </div>
                      <p class="text-xs text-gray-500">${m}</p>
                    </div>
                  `).join("")}
                </div>

                <h3 class="text-sm font-semibold text-white mb-4 mt-6">UI Colors</h3>
                <div class="grid grid-cols-3 gap-4">
                  ${[
      ["colors.background", "Background", "Main page background color"],
      ["colors.surface", "Surface", "Cards, modals, and elevated surfaces"],
      ["colors.text", "Text", "Primary text color for readability"],
      ["colors.muted", "Muted", "Secondary and placeholder text"],
      ["colors.success", "Success", "Success states and confirmations"],
      ["colors.error", "Error", "Error states and warnings"]
    ].map(([p, l, m]) => `
                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-medium text-white">${l}</label>
                        <div class="flex items-center gap-2">
                          <input type="color" value="${t.colors[p.split(".")[1]]}" 
                                 class="w-6 h-6 rounded cursor-pointer bg-transparent"
                                 data-color-path="${p}">
                          <input type="text" value="${t.colors[p.split(".")[1]]}" 
                                 class="w-16 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white text-xs uppercase font-mono"
                                 data-color-text-path="${p}">
                        </div>
                      </div>
                      <p class="text-xs text-gray-500">${m}</p>
                    </div>
                  `).join("")}
                </div>

                <div class="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-white">Dark Mode</label>
                      <p class="text-xs text-gray-500">Enable dark color scheme by default</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="dark-mode-toggle" class="sr-only peer" ${t.darkMode ? "checked" : ""}>
                      <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            ` : ""}

            ${s.activeTab === "typography" ? `
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Font Family</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Primary Font</label>
                      <select id="font-family" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                        <option value="Inter" ${t.typography.fontFamily === "Inter" ? "selected" : ""}>Inter</option>
                        <option value="Roboto" ${t.typography.fontFamily === "Roboto" ? "selected" : ""}>Roboto</option>
                        <option value="Open Sans" ${t.typography.fontFamily === "Open Sans" ? "selected" : ""}>Open Sans</option>
                        <option value="Poppins" ${t.typography.fontFamily === "Poppins" ? "selected" : ""}>Poppins</option>
                        <option value="Manrope" ${t.typography.fontFamily === "Manrope" ? "selected" : ""}>Manrope</option>
                        <option value="DM Sans" ${t.typography.fontFamily === "DM Sans" ? "selected" : ""}>DM Sans</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Heading Font</label>
                      <select id="heading-font" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                        <option value="Inter" ${t.typography.headingFont === "Inter" ? "selected" : ""}>Inter</option>
                        <option value="Poppins" ${t.typography.headingFont === "Poppins" ? "selected" : ""}>Poppins</option>
                        <option value="Montserrat" ${t.typography.headingFont === "Montserrat" ? "selected" : ""}>Montserrat</option>
                        <option value="Outfit" ${t.typography.headingFont === "Outfit" ? "selected" : ""}>Outfit</option>
                        <option value="Syne" ${t.typography.headingFont === "Syne" ? "selected" : ""}>Syne</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Text Sizing</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Base Font Size</label>
                      <input type="range" id="base-size" min="12" max="20" value="${t.typography.baseSize}" class="w-full">
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>12px</span>
                        <span class="text-white">${t.typography.baseSize}px</span>
                        <span>20px</span>
                      </div>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Line Height</label>
                      <input type="range" id="line-height" min="1" max="2" step="0.1" value="${t.typography.lineHeight}" class="w-full">
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1.0</span>
                        <span class="text-white">${t.typography.lineHeight}</span>
                        <span>2.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ` : ""}

            ${s.activeTab === "layout" ? `
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Border Radius</h3>
                  <div class="grid grid-cols-2 gap-4">
                    ${[
      ["radius.small", "Small", "Inputs, badges"],
      ["radius.medium", "Medium", "Buttons, cards"],
      ["radius.large", "Large", "Modals, containers"],
      ["radius.xl", "Extra Large", "Hero elements"]
    ].map(([p, l, m]) => `
                      <div class="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <label class="text-sm text-white block mb-1">${l}</label>
                        <input type="text" value="${t.radius[p.split(".")[1]]}" 
                               class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                               data-radius-path="${p}">
                        <span class="text-xs text-gray-500">${m}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Spacing</h3>
                  <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                    <label class="text-xs text-gray-500 mb-2 block">Spacing Scale Multiplier</label>
                    <input type="range" id="spacing-scale" min="1" max="2" step="0.1" value="${t.spacing.scale}" class="w-full">
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Compact (1.0)</span>
                      <span class="text-white">${t.spacing.scale}x</span>
                      <span>Spacious (2.0)</span>
                    </div>
                  </div>
                </div>
              </div>
            ` : ""}

            ${s.activeTab === "effects" ? `
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Visual Effects</h3>
                  <div class="space-y-4">
                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-white">Glass Morphism</label>
                        <p class="text-xs text-gray-500">Frosted glass effect on overlays</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="glass-toggle" class="sr-only peer" ${t.glassMorphism ? "checked" : ""}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>

                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-white">Animations</label>
                        <p class="text-xs text-gray-500">Enable smooth transitions and micro-interactions</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="animations-toggle" class="sr-only peer" ${t.animations.enabled ? "checked" : ""}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>

                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <label class="text-sm font-medium text-white block mb-2">Animation Duration</label>
                      <input type="range" id="anim-duration" min="100" max="1000" step="50" value="${t.animations.duration}" class="w-full">
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Fast (100ms)</span>
                        <span class="text-white">${t.animations.duration}ms</span>
                        <span>Slow (1000ms)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Shadow Presets</h3>
                  <div class="grid grid-cols-2 gap-3">
                    ${Object.entries(t.shadows).map(([p, l]) => `
                      <div class="p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:border-violet-500 transition-colors"
                           style="box-shadow: ${l}">
                        <span class="text-sm text-white capitalize">${p}</span>
                        <p class="text-xs text-gray-500 truncate">${l.substring(0, 40)}...</p>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>
            ` : ""}
          </div>

          <div class="w-80 border-l border-gray-800 p-6">
            <h3 class="text-sm font-semibold text-white mb-4">Live Preview</h3>
            <div class="p-6 rounded-xl" style="background: ${t.colors.surface}; border: 1px solid ${t.colors.muted}40;">
              <h4 style="color: ${t.colors.text}; font-size: ${t.typography.baseSize * 1.5}px; margin-bottom: 12px;">Heading Text</h4>
              <p style="color: ${t.colors.muted}; font-size: ${t.typography.baseSize}px; line-height: ${t.typography.lineHeight}; margin-bottom: 16px;">This is how body text appears in your theme.</p>
              <button style="background: ${t.colors.primary}; color: ${t.colors.text}; padding: 10px 20px; border-radius: ${t.radius.medium}; border: none; font-weight: 500; cursor: pointer;">
                Primary Button
              </button>
            </div>

            <div class="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <h4 class="text-sm font-semibold text-white mb-2">CSS Variables</h4>
              <pre class="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap" style="max-height: 200px; overflow-y: auto;">${n()}</pre>
            </div>

            <button id="copy-css" class="w-full mt-4 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
              <i class="fa fa-copy"></i> Copy CSS
            </button>
          </div>
        </div>
      </div>
    `, o();
  }
  function o() {
    c.querySelectorAll(".tab-btn").forEach(($) => {
      $.addEventListener("click", () => {
        s.activeTab = $.dataset.tab, u();
      });
    }), c.querySelectorAll("[data-color-path]").forEach(($) => {
      $.addEventListener("input", (C) => {
        const f = C.target.dataset.colorPath;
        d(f, C.target.value);
        const w = c.querySelector(`[data-color-text-path="${f}"]`);
        w && (w.value = C.target.value);
      });
    }), c.querySelectorAll("[data-color-text-path]").forEach(($) => {
      $.addEventListener("input", (C) => {
        const f = C.target.dataset.colorTextPath;
        d(f, C.target.value);
        const w = c.querySelector(`[data-color-path="${f}"]`);
        w && (w.value = C.target.value);
      });
    });
    const t = c.querySelector("#preset-select");
    t && t.addEventListener("change", ($) => {
      const C = s.presets[parseInt($.target.value)];
      C && (s.theme.colors = { ...C.colors }, a && a(s.theme), u());
    });
    const p = c.querySelector("#save-theme");
    p && p.addEventListener("click", () => {
      e && e(s.theme);
    });
    const l = c.querySelector("#dark-mode-toggle");
    l && l.addEventListener("change", ($) => {
      d("darkMode", $.target.checked);
    });
    const m = c.querySelector("#font-family");
    m && m.addEventListener("change", ($) => {
      d("typography.fontFamily", $.target.value);
    });
    const v = c.querySelector("#heading-font");
    v && v.addEventListener("change", ($) => {
      d("typography.headingFont", $.target.value);
    });
    const g = c.querySelector("#base-size");
    g && g.addEventListener("input", ($) => {
      d("typography.baseSize", parseInt($.target.value));
    });
    const h = c.querySelector("#line-height");
    h && h.addEventListener("input", ($) => {
      d("typography.lineHeight", parseFloat($.target.value));
    });
    const b = c.querySelector("#spacing-scale");
    b && b.addEventListener("input", ($) => {
      d("spacing.scale", parseFloat($.target.value));
    });
    const x = c.querySelector("#glass-toggle");
    x && x.addEventListener("change", ($) => {
      d("glassMorphism", $.target.checked);
    });
    const y = c.querySelector("#animations-toggle");
    y && y.addEventListener("change", ($) => {
      d("animations.enabled", $.target.checked);
    });
    const S = c.querySelector("#anim-duration");
    S && S.addEventListener("input", ($) => {
      d("animations.duration", parseInt($.target.value));
    });
    const q = c.querySelector("#copy-css");
    q && q.addEventListener("click", () => {
      navigator.clipboard.writeText(n());
    });
  }
  return u(), c.api = {
    getTheme: () => s.theme,
    setTheme: (t) => {
      s.theme = { ...s.theme, ...t }, u();
    }
  }, c;
}
function be({ onSelect: r, onImport: a }) {
  const e = {
    templates: [
      {
        id: "welcome-video",
        name: "Welcome Video",
        category: "Onboarding",
        thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f1c59?w=400&h=225&fit=crop",
        duration: 30,
        tags: ["intro", "welcome", "company"],
        popular: !0,
        createdAt: "2024-01-15",
        lastUsed: "2024-03-10"
      },
      {
        id: "product-demo",
        name: "Product Demo",
        category: "Marketing",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
        duration: 90,
        tags: ["demo", "features", "showcase"],
        popular: !0,
        createdAt: "2024-01-20",
        lastUsed: "2024-03-12"
      },
      {
        id: "testimonial",
        name: "Customer Testimonial",
        category: "Social Proof",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
        duration: 60,
        tags: ["review", "testimonial", "feedback"],
        popular: !1,
        createdAt: "2024-02-01",
        lastUsed: "2024-03-08"
      },
      {
        id: "how-to",
        name: "How-To Guide",
        category: "Educational",
        thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop",
        duration: 180,
        tags: ["tutorial", "guide", "education"],
        popular: !1,
        createdAt: "2024-02-10",
        lastUsed: "2024-03-05"
      },
      {
        id: "event-invite",
        name: "Event Invitation",
        category: "Events",
        thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=225&fit=crop",
        duration: 45,
        tags: ["event", "invite", "announcement"],
        popular: !0,
        createdAt: "2024-02-15",
        lastUsed: "2024-03-14"
      },
      {
        id: "sale-promo",
        name: "Sale Promotion",
        category: "Marketing",
        thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop",
        duration: 30,
        tags: ["sale", "promo", "discount"],
        popular: !1,
        createdAt: "2024-02-20",
        lastUsed: "2024-03-01"
      },
      {
        id: "team-intro",
        name: "Team Introduction",
        category: "Onboarding",
        thumbnail: "https://images.unsplash.com/photo-1522071820081-009f012c7c71?w=400&h=225&fit=crop",
        duration: 120,
        tags: ["team", "intro", "culture"],
        popular: !1,
        createdAt: "2024-02-25",
        lastUsed: "2024-02-28"
      },
      {
        id: "announcement",
        name: "Company Announcement",
        category: "Internal",
        thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop",
        duration: 45,
        tags: ["news", "update", "announcement"],
        popular: !1,
        createdAt: "2024-03-01",
        lastUsed: "2024-03-10"
      }
    ],
    categories: ["All", "Onboarding", "Marketing", "Educational", "Social Proof", "Events", "Internal"],
    selectedCategory: "All",
    searchQuery: "",
    viewMode: "grid",
    sortBy: "name",
    showImportModal: !1
  }, i = document.createElement("div");
  i.className = "template-system flex flex-col h-full bg-gray-900";
  function s(u) {
    const o = Math.floor(u / 60), t = u % 60;
    return o > 0 ? `${o}:${t.toString().padStart(2, "0")}` : `${t}s`;
  }
  function c() {
    let u = e.templates;
    if (e.selectedCategory !== "All" && (u = u.filter((o) => o.category === e.selectedCategory)), e.searchQuery.trim()) {
      const o = e.searchQuery.toLowerCase();
      u = u.filter(
        (t) => t.name.toLowerCase().includes(o) || t.category.toLowerCase().includes(o) || t.tags.some((p) => p.toLowerCase().includes(o))
      );
    }
    return u = [...u].sort((o, t) => e.sortBy === "name" ? o.name.localeCompare(t.name) : e.sortBy === "popular" ? (t.popular ? 1 : 0) - (o.popular ? 1 : 0) : e.sortBy === "recent" ? new Date(t.createdAt) - new Date(o.createdAt) : e.sortBy === "duration" ? o.duration - t.duration : 0), u;
  }
  function d() {
    const u = c();
    i.innerHTML = `
      <div class="template-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Template Library</h2>
            <p class="text-xs text-gray-400">${e.templates.length} templates available</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button id="import-btn" class="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
            <i class="fa fa-upload"></i> Import
          </button>
          <button id="create-btn" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-plus"></i> Create New
          </button>
        </div>
      </div>

      <div class="p-4 border-b border-gray-800 space-y-4">
        <div class="flex items-center gap-4">
          <div class="flex-1 relative">
            <input id="search-input" type="text" value="${e.searchQuery}"
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
              placeholder="Search templates by name, category, or tags...">
            <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          </div>

          <select id="sort-select" class="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
            <option value="name" ${e.sortBy === "name" ? "selected" : ""}>Name</option>
            <option value="popular" ${e.sortBy === "popular" ? "selected" : ""}>Popularity</option>
            <option value="recent" ${e.sortBy === "recent" ? "selected" : ""}>Recently Added</option>
            <option value="duration" ${e.sortBy === "duration" ? "selected" : ""}>Duration</option>
          </select>

          <div class="flex border border-gray-700 rounded-lg p-1">
            <button class="view-btn px-3 py-1 rounded ${e.viewMode === "grid" ? "bg-violet-500/20 text-violet-400" : "text-gray-400"} text-sm transition-colors"
                    data-view="grid">
              <i class="fa fa-th-large"></i>
            </button>
            <button class="view-btn px-3 py-1 rounded ${e.viewMode === "list" ? "bg-violet-500/20 text-violet-400" : "text-gray-400"} text-sm transition-colors"
                    data-view="list">
              <i class="fa fa-list"></i>
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          ${e.categories.map((o) => `
            <button class="category-btn px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${e.selectedCategory === o ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}"
                    data-category="${o}">
              ${o}
              ${o !== "All" ? `<span class="ml-2 text-xs opacity-70">${e.templates.filter((t) => t.category === o).length}</span>` : ""}
            </button>
          `).join("")}
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        ${u.length === 0 ? `
          <div class="text-center py-20">
            <div class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-search text-gray-600 text-2xl"></i>
            </div>
            <h3 class="text-lg text-white font-medium mb-2">No templates found</h3>
            <p class="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ` : e.viewMode === "grid" ? `
          <div class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            ${u.map((o) => `
              <div class="template-card group relative rounded-xl bg-gray-800/50 border border-gray-700 hover:border-violet-500 transition-all overflow-hidden cursor-pointer"
                   data-template-id="${o.id}">
                <div class="aspect-video bg-gray-800 relative overflow-hidden">
                  <img src="${o.thumbnail}" alt="${o.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">${s(o.duration)}</div>
                  ${o.popular ? `
                    <div class="absolute top-2 left-2 px-2 py-1 rounded-full bg-violet-500/90 text-white text-xs flex items-center gap-1">
                      <i class="fa fa-fire"></i> Popular
                    </div>
                  ` : ""}
                  <div class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="preview-btn w-10 h-10 rounded-full bg-white/90 text-gray-900 hover:bg-white flex items-center justify-center transition-colors"
                            data-template-id="${o.id}">
                      <i class="fa fa-play"></i>
                    </button>
                  </div>
                </div>
                <div class="p-3">
                  <h3 class="text-sm font-medium text-white truncate">${o.name}</h3>
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-xs text-gray-500">${o.category}</span>
                    <span class="text-xs text-gray-500">${new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div class="flex flex-wrap gap-1 mt-2">
                    ${o.tags.slice(0, 2).map((t) => `
                      <span class="px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 text-xs">${t}</span>
                    `).join("")}
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        ` : `
          <div class="space-y-2">
            ${u.map((o) => `
              <div class="template-card flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-violet-500 transition-all cursor-pointer"
                   data-template-id="${o.id}">
                <div class="w-24 aspect-video rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                  <img src="${o.thumbnail}" alt="${o.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-medium text-white">${o.name}</h3>
                    ${o.popular ? `
                      <span class="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs">
                        <i class="fa fa-fire text-[10px]"></i>
                      </span>
                    ` : ""}
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">${o.category}</p>
                  <div class="flex items-center gap-2 mt-1">
                    ${o.tags.slice(0, 3).map((t) => `
                      <span class="px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 text-xs">${t}</span>
                    `).join("")}
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <div class="text-sm text-white">${s(o.duration)}</div>
                  <div class="text-xs text-gray-500">${new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button class="apply-btn px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs hover:bg-violet-500 transition-colors"
                          data-template-id="${o.id}">
                    Apply
                  </button>
                  <button class="action-btn w-8 h-8 rounded-lg bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center"
                          data-template-id="${o.id}">
                    <i class="fa fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>

      ${e.showImportModal ? `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" id="import-modal">
          <div class="w-full max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl">
            <h3 class="text-lg font-semibold text-white mb-4">Import Template</h3>
            <div class="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-violet-500 transition-colors cursor-pointer" id="drop-zone">
              <i class="fa fa-cloud-upload-alt text-4xl text-gray-600 mb-3"></i>
              <p class="text-white font-medium">Drop your template file here</p>
              <p class="text-sm text-gray-500 mt-2">or click to browse</p>
              <input type="file" id="template-file" accept=".json,.remix" class="hidden">
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button id="cancel-import" class="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      ` : ""}
    `, n();
  }
  function n() {
    const u = i.querySelector("#search-input");
    u && u.addEventListener("input", (g) => {
      e.searchQuery = g.target.value, d();
    });
    const o = i.querySelector("#sort-select");
    o && o.addEventListener("change", (g) => {
      e.sortBy = g.target.value, d();
    }), i.querySelectorAll(".view-btn").forEach((g) => {
      g.addEventListener("click", () => {
        e.viewMode = g.dataset.view, d();
      });
    }), i.querySelectorAll(".category-btn").forEach((g) => {
      g.addEventListener("click", () => {
        e.selectedCategory = g.dataset.category, d();
      });
    }), i.querySelectorAll(".template-card").forEach((g) => {
      g.addEventListener("click", (h) => {
        if (!h.target.closest(".preview-btn") && !h.target.closest(".apply-btn") && !h.target.closest(".action-btn")) {
          const b = e.templates.find((x) => x.id === g.dataset.templateId);
          b && r && r(b);
        }
      });
    }), i.querySelectorAll(".preview-btn").forEach((g) => {
      g.addEventListener("click", (h) => {
        h.stopPropagation();
        const b = e.templates.find((x) => x.id === g.dataset.templateId);
        b && console.log("Preview template:", b.name);
      });
    }), i.querySelectorAll(".apply-btn").forEach((g) => {
      g.addEventListener("click", (h) => {
        h.stopPropagation();
        const b = e.templates.find((x) => x.id === g.dataset.templateId);
        b && r && r(b);
      });
    });
    const t = i.querySelector("#import-btn");
    t && t.addEventListener("click", () => {
      e.showImportModal = !0, d();
    });
    const p = i.querySelector("#cancel-import");
    p && p.addEventListener("click", () => {
      e.showImportModal = !1, d();
    });
    const l = i.querySelector("#drop-zone"), m = i.querySelector("#template-file");
    l && m && (l.addEventListener("click", () => m.click()), l.addEventListener("dragover", (g) => {
      g.preventDefault(), l.classList.add("border-violet-500");
    }), l.addEventListener("dragleave", () => {
      l.classList.remove("border-violet-500");
    }), l.addEventListener("drop", (g) => {
      g.preventDefault(), l.classList.remove("border-violet-500");
      const h = g.dataTransfer.files;
      h.length > 0 && a && (a(h[0]), e.showImportModal = !1, d());
    }), m.addEventListener("change", (g) => {
      g.target.files.length > 0 && a && (a(g.target.files[0]), e.showImportModal = !1, d());
    }));
    const v = i.querySelector("#import-modal");
    v && v.addEventListener("click", (g) => {
      g.target === v && (e.showImportModal = !1, d());
    });
  }
  return d(), i.api = {
    getTemplates: () => e.templates,
    addTemplate: (u) => {
      e.templates.push({ ...u, id: Date.now().toString(), createdAt: (/* @__PURE__ */ new Date()).toISOString() }), d();
    },
    removeTemplate: (u) => {
      e.templates = e.templates.filter((o) => o.id !== u), d();
    }
  }, i;
}
function he({ onSave: r, onChange: a }) {
  const e = {
    navItems: [
      { id: "home", label: "Home", href: "/", icon: "fa-home", active: !0, visible: !0 },
      { id: "projects", label: "Projects", href: "/projects", icon: "fa-folder", active: !1, visible: !0 },
      { id: "templates", label: "Templates", href: "/templates", icon: "fa-th-large", active: !1, visible: !0 },
      { id: "analytics", label: "Analytics", href: "/analytics", icon: "fa-chart-bar", active: !1, visible: !0 },
      { id: "team", label: "Team", href: "/team", icon: "fa-users", active: !1, visible: !1 },
      { id: "settings", label: "Settings", href: "/settings", icon: "fa-cog", active: !1, visible: !0 }
    ],
    config: {
      position: "top",
      style: "horizontal",
      theme: "dark",
      collapsed: !1,
      showIcons: !0,
      showLabels: !0,
      enableDropdown: !0
    },
    editingItem: null,
    dragIndex: null
  }, i = document.createElement("div");
  i.className = "navigation-builder flex flex-col h-full bg-gray-900";
  function s() {
    i.innerHTML = `
      <div class="nav-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <i class="fa fa-compass text-white text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Navigation Builder</h2>
            <p class="text-xs text-gray-400">Customize your app navigation</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button id="reset-btn" class="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
            Reset
          </button>
          <button id="save-btn" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-save"></i> Save
          </button>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <div class="w-72 border-r border-gray-800 p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 class="text-sm font-semibold text-white mb-3">Navigation Items</h3>
            <p class="text-xs text-gray-500 mb-3">Drag to reorder</p>
            <div class="space-y-2" id="nav-items-list">
              ${e.navItems.map((n, u) => {
      var o;
      return `
                <div class="nav-item-card p-3 rounded-lg bg-gray-800/50 border border-gray-700 cursor-move transition-all hover:border-violet-500 ${((o = e.editingItem) == null ? void 0 : o.id) === n.id ? "border-violet-500 bg-violet-500/10" : ""} ${n.visible ? "" : "opacity-50"}"
                     draggable="true"
                     data-index="${u}"
                     data-item-id="${n.id}">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-gray-400">
                      <i class="fa fa-grip-vertical text-xs"></i>
                    </div>
                    <i class="fa ${n.icon} text-gray-500 w-5"></i>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm text-white font-medium">${n.label}</div>
                      <div class="text-xs text-gray-500 truncate">${n.href}</div>
                    </div>
                    <button class="edit-item-btn w-7 h-7 rounded hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center"
                            data-item-id="${n.id}">
                      <i class="fa fa-pencil text-xs"></i>
                    </button>
                    <button class="toggle-visibility-btn w-7 h-7 rounded hover:bg-gray-700 ${n.visible ? "text-gray-400" : "text-gray-600"} flex items-center justify-center"
                            data-item-id="${n.id}">
                      <i class="fa ${n.visible ? "fa-eye" : "fa-eye-slash"} text-xs"></i>
                    </button>
                  </div>
                </div>
              `;
    }).join("")}
            </div>

            <button id="add-item-btn" class="w-full mt-3 p-3 rounded-lg border border-dashed border-gray-700 text-gray-400 hover:border-violet-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-2">
              <i class="fa fa-plus"></i>
              <span class="text-sm">Add Navigation Item</span>
            </button>
          </div>
        </div>

        <div class="flex-1 flex flex-col">
          <div class="p-4 border-b border-gray-800 space-y-4">
            <div class="flex gap-6">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Position</label>
                <div class="flex rounded-lg bg-gray-800 p-1">
                  ${["top", "left", "right"].map((n) => `
                    <button class="position-btn px-4 py-1.5 rounded text-sm font-medium transition-colors ${e.config.position === n ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}"
                            data-position="${n}">
                      ${n.charAt(0).toUpperCase() + n.slice(1)}
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Style</label>
                <div class="flex rounded-lg bg-gray-800 p-1">
                  ${["horizontal", "vertical", "minimal"].map((n) => `
                    <button class="style-btn px-4 py-1.5 rounded text-sm font-medium transition-colors ${e.config.style === n ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}"
                            data-style="${n}">
                      ${n.charAt(0).toUpperCase() + n.slice(1)}
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Theme</label>
                <div class="flex rounded-lg bg-gray-800 p-1">
                  ${["dark", "light", "glass"].map((n) => `
                    <button class="theme-btn px-4 py-1.5 rounded text-sm font-medium transition-colors ${e.config.theme === n ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}"
                            data-theme="${n}">
                      ${n.charAt(0).toUpperCase() + n.slice(1)}
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="show-icons" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${e.config.showIcons ? "checked" : ""}>
                <span class="text-sm text-gray-400">Show Icons</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="show-labels" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${e.config.showLabels ? "checked" : ""}>
                <span class="text-sm text-gray-400">Show Labels</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="collapsed" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${e.config.collapsed ? "checked" : ""}>
                <span class="text-sm text-gray-400">Collapsed</span>
              </label>
            </div>
          </div>

          <div class="flex-1 p-8 bg-gray-800/30">
            <h3 class="text-sm font-semibold text-white mb-4">Preview</h3>
            ${c()}
          </div>
        </div>

        ${e.editingItem ? `
          <div class="w-80 border-l border-gray-800 p-4 bg-gray-800/30">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold text-white">Edit Item</h3>
              <button id="close-edit" class="text-gray-400 hover:text-white">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Label</label>
                <input id="edit-label" type="text" value="${e.editingItem.label}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">URL/Path</label>
                <input id="edit-href" type="text" value="${e.editingItem.href}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">Icon</label>
                <div class="grid grid-cols-5 gap-2">
                  ${["fa-home", "fa-folder", "fa-th-large", "fa-chart-bar", "fa-users", "fa-cog", "fa-file", "fa-envelope", "fa-bell", "fa-star", "fa-heart", "fa-image", "fa-video", "fa-music", "fa-link"].map((n) => `
                    <button class="icon-btn p-2 rounded-lg border ${e.editingItem.icon === n ? "border-violet-500 bg-violet-500/20 text-violet-400" : "border-gray-700 text-gray-400 hover:border-gray-600"}"
                            data-icon="${n}">
                      <i class="fa ${n}"></i>
                    </button>
                  `).join("")}
                </div>
              </div>
              <div class="pt-4 border-t border-gray-700 flex gap-2">
                <button id="update-item" class="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500">
                  Update
                </button>
                <button id="delete-item" class="py-2 px-4 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ` : ""}
      </div>
    `, d();
  }
  function c() {
    const { config: n } = e, u = e.navItems.filter((t) => t.visible), o = n.theme === "dark" ? "bg-gray-900 border-gray-800 text-white" : n.theme === "light" ? "bg-white border-gray-200 text-gray-900" : "bg-gray-900/50 backdrop-blur-lg border-white/10 text-white";
    return n.position === "top" ? `
        <div class="p-4 rounded-xl border ${o}">
          <nav class="flex items-center gap-1">
            <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center mr-4">
              <i class="fa fa-bolt text-white"></i>
            </div>
            ${n.style === "minimal" ? "" : `
              <div class="flex items-center gap-1">
                ${u.map((t) => `
                  <a href="${t.href}" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors ${t.active ? "bg-violet-600 text-white" : "hover:bg-white/10"}">
                    ${n.showIcons ? `<i class="fa ${t.icon} mr-2"></i>` : ""}
                    ${n.showLabels ? t.label : ""}
                  </a>
                `).join("")}
              </div>
            `}
            <div class="ml-auto flex items-center gap-2">
              <button class="p-2 rounded-lg hover:bg-white/10"><i class="fa fa-search"></i></button>
              <button class="p-2 rounded-lg hover:bg-white/10"><i class="fa fa-bell"></i></button>
              <div class="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                <span class="text-sm font-medium">U</span>
              </div>
            </div>
          </nav>
        </div>
      ` : `
        <div class="flex gap-4 ${n.position === "right" ? "flex-row-reverse" : ""}">
          <div class="w-64 p-4 rounded-xl border ${o}">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <i class="fa fa-bolt text-white"></i>
              </div>
              ${n.collapsed ? "" : '<span class="font-semibold">Remix Go</span>'}
            </div>
            <nav class="space-y-1">
              ${u.map((t) => `
                <a href="${t.href}" class="flex items-center ${n.collapsed ? "justify-center" : "gap-3"} px-3 py-2 rounded-lg text-sm font-medium transition-colors ${t.active ? "bg-violet-600 text-white" : "hover:bg-white/10"}">
                  <i class="fa ${t.icon} w-5 text-center"></i>
                  ${!n.collapsed && n.showLabels ? t.label : ""}
                </a>
              `).join("")}
            </nav>
          </div>
          <div class="flex-1 p-8 rounded-xl bg-gray-800/50 border border-gray-700">
            <div class="h-20 rounded-lg bg-gray-800 mb-4"></div>
            <div class="grid grid-cols-3 gap-4">
              <div class="h-32 rounded-lg bg-gray-800"></div>
              <div class="h-32 rounded-lg bg-gray-800"></div>
              <div class="h-32 rounded-lg bg-gray-800"></div>
            </div>
          </div>
        </div>
      `;
  }
  function d() {
    const n = i.querySelector("#nav-items-list");
    n && n.querySelectorAll(".nav-item-card").forEach((b) => {
      b.addEventListener("dragstart", (x) => {
        e.dragIndex = parseInt(b.dataset.index), b.classList.add("opacity-50");
      }), b.addEventListener("dragend", () => {
        b.classList.remove("opacity-50"), e.dragIndex = null;
      }), b.addEventListener("dragover", (x) => {
        if (x.preventDefault(), e.dragIndex !== null && e.dragIndex !== parseInt(b.dataset.index)) {
          const y = parseInt(b.dataset.index), S = [...e.navItems], [q] = S.splice(e.dragIndex, 1);
          S.splice(y, 0, q), e.navItems = S, e.dragIndex = y, s();
        }
      });
    }), i.querySelectorAll(".edit-item-btn").forEach((b) => {
      b.addEventListener("click", () => {
        const x = e.navItems.find((y) => y.id === b.dataset.itemId);
        x && (e.editingItem = { ...x }, s());
      });
    }), i.querySelectorAll(".toggle-visibility-btn").forEach((b) => {
      b.addEventListener("click", () => {
        const x = e.navItems.find((y) => y.id === b.dataset.itemId);
        x && (x.visible = !x.visible, s());
      });
    }), i.querySelectorAll(".position-btn").forEach((b) => {
      b.addEventListener("click", () => {
        e.config.position = b.dataset.position, s();
      });
    }), i.querySelectorAll(".style-btn").forEach((b) => {
      b.addEventListener("click", () => {
        e.config.style = b.dataset.style, s();
      });
    }), i.querySelectorAll(".theme-btn").forEach((b) => {
      b.addEventListener("click", () => {
        e.config.theme = b.dataset.theme, s();
      });
    });
    const u = i.querySelector("#show-icons");
    u && u.addEventListener("change", (b) => {
      e.config.showIcons = b.target.checked, s();
    });
    const o = i.querySelector("#show-labels");
    o && o.addEventListener("change", (b) => {
      e.config.showLabels = b.target.checked, s();
    });
    const t = i.querySelector("#collapsed");
    t && t.addEventListener("change", (b) => {
      e.config.collapsed = b.target.checked, s();
    });
    const p = i.querySelector("#close-edit");
    p && p.addEventListener("click", () => {
      e.editingItem = null, s();
    }), i.querySelectorAll(".icon-btn").forEach((b) => {
      b.addEventListener("click", () => {
        e.editingItem && (e.editingItem.icon = b.dataset.icon, s());
      });
    });
    const l = i.querySelector("#update-item");
    l && l.addEventListener("click", () => {
      const b = i.querySelector("#edit-label"), x = i.querySelector("#edit-href");
      if (e.editingItem && b && x) {
        const y = e.navItems.findIndex((S) => S.id === e.editingItem.id);
        y !== -1 && (e.navItems[y] = {
          ...e.navItems[y],
          label: b.value,
          href: x.value,
          icon: e.editingItem.icon
        }, e.editingItem = null, s());
      }
    });
    const m = i.querySelector("#delete-item");
    m && m.addEventListener("click", () => {
      e.editingItem && (e.navItems = e.navItems.filter((b) => b.id !== e.editingItem.id), e.editingItem = null, s());
    });
    const v = i.querySelector("#add-item-btn");
    v && v.addEventListener("click", () => {
      const b = Date.now().toString();
      e.navItems.push({
        id: b,
        label: "New Item",
        href: "/new",
        icon: "fa-link",
        visible: !0,
        active: !1
      }), e.editingItem = { ...e.navItems[e.navItems.length - 1] }, s();
    });
    const g = i.querySelector("#save-btn");
    g && g.addEventListener("click", () => {
      r && r(e.navItems, e.config);
    });
    const h = i.querySelector("#reset-btn");
    h && h.addEventListener("click", () => {
      e.navItems = [
        { id: "home", label: "Home", href: "/", icon: "fa-home", active: !0, visible: !0 },
        { id: "projects", label: "Projects", href: "/projects", icon: "fa-folder", active: !1, visible: !0 },
        { id: "templates", label: "Templates", href: "/templates", icon: "fa-th-large", active: !1, visible: !0 },
        { id: "analytics", label: "Analytics", href: "/analytics", icon: "fa-chart-bar", active: !1, visible: !0 },
        { id: "settings", label: "Settings", href: "/settings", icon: "fa-cog", active: !1, visible: !0 }
      ], e.config = {
        position: "top",
        style: "horizontal",
        theme: "dark",
        collapsed: !1,
        showIcons: !0,
        showLabels: !0,
        enableDropdown: !0
      }, s();
    });
  }
  return s(), i.api = {
    getNavItems: () => e.navItems,
    getConfig: () => e.config,
    setNavItems: (n) => {
      e.navItems = n, s();
    },
    setConfig: (n) => {
      e.config = { ...e.config, ...n }, s();
    }
  }, i;
}
function fe({ onSave: r, onExport: a }) {
  const e = {
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: !0,
        validation: { minLength: 2, maxLength: 100 }
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "you@example.com",
        required: !0,
        validation: { pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" }
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Enter your message...",
        required: !0,
        validation: { minLength: 10, maxLength: 1e3 }
      }
    ],
    settings: {
      title: "Contact Form",
      description: "Get in touch with us",
      submitText: "Submit",
      successMessage: "Thank you for your submission!",
      method: "POST",
      action: "/api/submit",
      styling: {
        theme: "default",
        layout: "vertical",
        labelPosition: "above",
        showPlaceholders: !0,
        showRequiredIndicator: !0
      }
    },
    selectedField: null
  }, i = [
    { id: "text", name: "Text Input", icon: "fa-font" },
    { id: "email", name: "Email", icon: "fa-envelope" },
    { id: "number", name: "Number", icon: "fa-hashtag" },
    { id: "tel", name: "Phone", icon: "fa-phone" },
    { id: "url", name: "Website URL", icon: "fa-link" },
    { id: "textarea", name: "Long Text", icon: "fa-align-left" },
    { id: "select", name: "Dropdown", icon: "fa-chevron-down" },
    { id: "radio", name: "Radio Buttons", icon: "fa-circle" },
    { id: "checkbox", name: "Checkbox", icon: "fa-check-square" },
    { id: "multiselect", name: "Multi Select", icon: "fa-tasks" },
    { id: "date", name: "Date Picker", icon: "fa-calendar" },
    { id: "file", name: "File Upload", icon: "fa-upload" }
  ], s = document.createElement("div");
  s.className = "form-builder flex flex-col h-full bg-gray-900";
  function c() {
    let o = `<form id="${`form-${Date.now()}`}" method="${e.settings.method}" action="${e.settings.action}" class="form-container">`;
    return o += `<h2 class="form-title">${e.settings.title}</h2>`, e.settings.description && (o += `<p class="form-description">${e.settings.description}</p>`), e.fields.forEach((t) => {
      const p = t.required ? " required" : "", l = t.placeholder ? ` placeholder="${t.placeholder}"` : "";
      o += '<div class="form-field">', o += `<label for="${t.id}">${t.label}${t.required && e.settings.styling.showRequiredIndicator ? " *" : ""}</label>`, t.type === "textarea" ? o += `<textarea id="${t.id}" name="${t.id}"${l}${p}></textarea>` : t.type === "select" ? (o += `<select id="${t.id}" name="${t.id}"${p}>`, o += '<option value="">Select an option</option>', (t.options || []).forEach((m) => {
        o += `<option value="${m.value}">${m.label}</option>`;
      }), o += "</select>") : o += `<input type="${t.type}" id="${t.id}" name="${t.id}"${l}${p}>`, o += "</div>";
    }), o += `<button type="submit" class="submit-btn">${e.settings.submitText}</button>`, o += "</form>", o;
  }
  function d() {
    var u, o;
    s.innerHTML = `
      <div class="form-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <i class="fa fa-wpforms text-white"></i>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Form Builder</h2>
            <p class="text-xs text-gray-400">Create custom forms</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button id="export-html" class="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors">
            <i class="fa fa-code mr-2"></i>Export HTML
          </button>
          <button id="save-form" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors">
            <i class="fa fa-save mr-2"></i>Save Form
          </button>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <div class="w-64 border-r border-gray-800 p-4">
          <h3 class="text-sm font-semibold text-white mb-3">Field Types</h3>
          <div class="grid grid-cols-2 gap-2">
            ${i.map((t) => `
              <button class="add-field-btn p-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-violet-500 transition-colors text-center"
                      data-field-type="${t.id}">
                <i class="fa ${t.icon} text-gray-400 text-lg mb-1"></i>
                <p class="text-xs text-gray-300">${t.name}</p>
              </button>
            `).join("")}
          </div>
        </div>

        <div class="flex-1 p-6 overflow-y-auto">
          <div class="max-w-2xl mx-auto bg-gray-800/30 rounded-2xl border border-gray-800 p-6">
            <div class="mb-6">
              <input id="form-title" type="text" value="${e.settings.title}"
                class="w-full text-xl font-semibold bg-transparent border-none text-white focus:outline-none focus:border-b focus:border-violet-500 placeholder-gray-500"
                placeholder="Form Title">
              <textarea id="form-description" rows="2"
                class="w-full mt-2 text-sm bg-transparent border-none text-gray-400 focus:outline-none resize-none"
                placeholder="Add a form description...">${e.settings.description}</textarea>
            </div>

            <div class="form-fields space-y-4">
              ${e.fields.map((t, p) => {
      var l, m;
      return `
                <div class="field-card group p-4 rounded-xl bg-gray-800 border border-gray-700 ${((l = e.selectedField) == null ? void 0 : l.id) === t.id ? "border-violet-500 ring-1 ring-violet-500/20" : "hover:border-gray-600"} transition-all cursor-pointer"
                     data-field-id="${t.id}">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-sm font-medium text-white">${t.label}</span>
                        ${t.required ? '<span class="text-red-400">*</span>' : ""}
                        <span class="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400">${((m = i.find((v) => v.id === t.type)) == null ? void 0 : m.name) || t.type}</span>
                      </div>
                      ${t.type === "textarea" ? `
                        <textarea disabled class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500 text-sm resize-none" placeholder="${t.placeholder || ""}" rows="3"></textarea>
                      ` : t.type === "select" ? `
                        <select disabled class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500 text-sm">
                          <option>${t.placeholder || "Select an option"}</option>
                        </select>
                      ` : `
                        <input disabled type="text" class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500 text-sm" placeholder="${t.placeholder || ""}">
                      `}
                    </div>
                    <div class="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button class="move-up-btn w-8 h-8 rounded hover:bg-gray-700 text-gray-400 hover:text-white ${p === 0 ? "opacity-50" : ""}"
                              data-index="${p}">
                        <i class="fa fa-arrow-up text-xs"></i>
                      </button>
                      <button class="move-down-btn w-8 h-8 rounded hover:bg-gray-700 text-gray-400 hover:text-white ${p === e.fields.length - 1 ? "opacity-50" : ""}"
                              data-index="${p}">
                        <i class="fa fa-arrow-down text-xs"></i>
                      </button>
                      <button class="delete-field-btn w-8 h-8 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                              data-field-id="${t.id}">
                        <i class="fa fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `;
    }).join("")}
            </div>

            <div class="mt-6 pt-6 border-t border-gray-700">
              <button id="submit-text" class="text-sm text-gray-400 hover:text-white">
                Submit button: <span class="text-white">${e.settings.submitText}</span>
              </button>
            </div>
          </div>
        </div>

        ${e.selectedField ? `
          <div class="w-72 border-l border-gray-800 p-4 bg-gray-800/30 overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold text-white">Field Settings</h3>
              <button id="close-settings" class="text-gray-400 hover:text-white">
                <i class="fa fa-times"></i>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Label</label>
                <input id="field-label" type="text" value="${e.selectedField.label}"
                  class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Placeholder</label>
                <input id="field-placeholder" type="text" value="${e.selectedField.placeholder || ""}"
                  class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div class="flex items-center gap-3">
                <input type="checkbox" id="field-required" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${e.selectedField.required ? "checked" : ""}>
                <label for="field-required" class="text-sm text-gray-300">Required field</label>
              </div>

              ${e.selectedField.type === "text" || e.selectedField.type === "textarea" ? `
                <div class="space-y-3 pt-3 border-t border-gray-700">
                  <h4 class="text-xs font-semibold text-gray-400">Validation</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Min Length</label>
                      <input id="field-min" type="number" value="${((u = e.selectedField.validation) == null ? void 0 : u.minLength) || ""}"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Max Length</label>
                      <input id="field-max" type="number" value="${((o = e.selectedField.validation) == null ? void 0 : o.maxLength) || ""}"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                    </div>
                  </div>
                </div>
              ` : ""}

              ${["select", "radio", "checkbox", "multiselect"].includes(e.selectedField.type) ? `
                <div class="space-y-3 pt-3 border-t border-gray-700">
                  <h4 class="text-xs font-semibold text-gray-400">Options</h4>
                  <div class="space-y-2" id="field-options">
                    ${(e.selectedField.options || [{ value: "option1", label: "Option 1" }]).map((t, p) => {
      var l;
      return `
                      <div class="flex gap-2">
                        <input type="text" value="${t.label}" class="option-label flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white text-sm" data-index="${p}">
                        <input type="text" value="${t.value}" class="option-value w-20 p-2 rounded bg-gray-800 border border-gray-700 text-white text-sm" data-index="${p}">
                        <button class="remove-option p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                ${(((l = e.selectedField.options) == null ? void 0 : l.length) || 1) <= 1 ? "disabled" : ""}>
                          <i class="fa fa-times"></i>
                        </button>
                      </div>
                    `;
    }).join("")}
                  </div>
                  <button id="add-option" class="w-full py-2 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-violet-500 hover:text-violet-400 text-sm">
                    + Add Option
                  </button>
                </div>
              ` : ""}
            </div>
          </div>
        ` : ""}
      </div>
    `, n();
  }
  function n() {
    const u = s.querySelector("#form-title");
    u && u.addEventListener("input", (h) => {
      e.settings.title = h.target.value;
    });
    const o = s.querySelector("#form-description");
    o && o.addEventListener("input", (h) => {
      e.settings.description = h.target.value;
    }), s.querySelectorAll(".add-field-btn").forEach((h) => {
      h.addEventListener("click", () => {
        var y;
        const b = h.dataset.fieldType, x = {
          id: `field-${Date.now()}`,
          type: b,
          label: `New ${((y = i.find((S) => S.id === b)) == null ? void 0 : y.name) || "Field"}`,
          placeholder: "",
          required: !1,
          validation: {}
        };
        ["select", "radio", "checkbox", "multiselect"].includes(b) && (x.options = [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" }
        ]), e.fields.push(x), e.selectedField = x, d();
      });
    }), s.querySelectorAll(".field-card").forEach((h) => {
      h.addEventListener("click", () => {
        const b = e.fields.find((x) => x.id === h.dataset.fieldId);
        b && (e.selectedField = b, d());
      });
    }), s.querySelectorAll(".delete-field-btn").forEach((h) => {
      h.addEventListener("click", (b) => {
        var x;
        b.stopPropagation(), e.fields = e.fields.filter((y) => y.id !== h.dataset.fieldId), ((x = e.selectedField) == null ? void 0 : x.id) === h.dataset.fieldId && (e.selectedField = null), d();
      });
    }), s.querySelectorAll(".move-up-btn").forEach((h) => {
      h.addEventListener("click", (b) => {
        b.stopPropagation();
        const x = parseInt(h.dataset.index);
        x > 0 && ([e.fields[x], e.fields[x - 1]] = [e.fields[x - 1], e.fields[x]], d());
      });
    }), s.querySelectorAll(".move-down-btn").forEach((h) => {
      h.addEventListener("click", (b) => {
        b.stopPropagation();
        const x = parseInt(h.dataset.index);
        x < e.fields.length - 1 && ([e.fields[x], e.fields[x + 1]] = [e.fields[x + 1], e.fields[x]], d());
      });
    });
    const t = s.querySelector("#close-settings");
    t && t.addEventListener("click", () => {
      e.selectedField = null, d();
    });
    const p = s.querySelector("#field-label");
    p && p.addEventListener("input", (h) => {
      e.selectedField && (e.selectedField.label = h.target.value, d());
    });
    const l = s.querySelector("#field-placeholder");
    l && l.addEventListener("input", (h) => {
      e.selectedField && (e.selectedField.placeholder = h.target.value, d());
    });
    const m = s.querySelector("#field-required");
    m && m.addEventListener("change", (h) => {
      e.selectedField && (e.selectedField.required = h.target.checked, d());
    });
    const v = s.querySelector("#save-form");
    v && v.addEventListener("click", () => {
      r && r(e.fields, e.settings);
    });
    const g = s.querySelector("#export-html");
    g && g.addEventListener("click", () => {
      const h = c(), b = new Blob([h], { type: "text/html" }), x = URL.createObjectURL(b), y = document.createElement("a");
      y.href = x, y.download = "form.html", y.click(), URL.revokeObjectURL(x);
    });
  }
  return d(), s.api = {
    getFields: () => e.fields,
    getSettings: () => e.settings,
    generateHTML: c
  }, s;
}
function xe({ type: r, title: a, message: e, onClose: i, onConfirm: s }) {
  var u, o, t;
  const c = document.createElement("div");
  c.className = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
  const d = {
    error: { icon: "❌", color: "text-red-400", btnClass: "bg-red-600 hover:bg-red-500" },
    success: { icon: "✅", color: "text-green-400", btnClass: "bg-green-600 hover:bg-green-500" },
    warning: { icon: "⚠️", color: "text-yellow-400", btnClass: "bg-yellow-600 hover:bg-yellow-500" },
    info: { icon: "ℹ️", color: "text-blue-400", btnClass: "bg-blue-600 hover:bg-blue-500" },
    confirm: { icon: "❓", color: "text-violet-400", btnClass: "bg-violet-600 hover:bg-violet-500" }
  }, n = d[r] || d.info;
  return c.innerHTML = `
    <div class="glass rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
      <div class="text-4xl mb-3">${n.icon}</div>
      <h3 class="text-lg font-semibold text-white mb-2">${a || "Alert"}</h3>
      <p class="text-gray-400 text-sm mb-6">${e || ""}</p>
      <div class="flex gap-3 justify-center">
        ${r === "confirm" ? `
          <button id="alert-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">Cancel</button>
          <button id="alert-confirm" class="px-4 py-2 rounded-lg ${n.btnClass} text-white text-sm font-semibold transition-colors">Confirm</button>
        ` : `
          <button id="alert-ok" class="px-6 py-2 rounded-lg ${n.btnClass} text-white text-sm font-semibold transition-colors">OK</button>
        `}
      </div>
    </div>
  `, r === "confirm" ? ((u = c.querySelector("#alert-cancel")) == null || u.addEventListener("click", () => {
    c.remove(), i && i();
  }), (o = c.querySelector("#alert-confirm")) == null || o.addEventListener("click", () => {
    c.remove(), s && s();
  })) : (t = c.querySelector("#alert-ok")) == null || t.addEventListener("click", () => {
    c.remove(), i && i();
  }), c.addEventListener("click", (p) => {
    p.target === c && (c.remove(), i && i());
  }), c;
}
function ye({
  title: r,
  message: a,
  confirmText: e = "Confirm",
  cancelText: i = "Cancel",
  type: s = "warning",
  onConfirm: c,
  onCancel: d
}) {
  const n = document.createElement("div");
  n.className = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
  const u = {
    warning: { icon: "⚠️", color: "text-yellow-400", btnColor: "bg-yellow-600 hover:bg-yellow-500" },
    danger: { icon: "🚨", color: "text-red-400", btnColor: "bg-red-600 hover:bg-red-500" },
    info: { icon: "ℹ️", color: "text-blue-400", btnColor: "bg-blue-600 hover:bg-blue-500" },
    success: { icon: "✅", color: "text-green-400", btnColor: "bg-green-600 hover:bg-green-500" }
  }, o = u[s] || u.warning;
  n.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
      <div class="text-4xl mb-4 ${o.color}">${o.icon}</div>
      <h3 class="text-lg font-semibold text-white mb-2">${r || "Are you sure?"}</h3>
      <p class="text-gray-400 text-sm mb-6">${a || "This action cannot be undone."}</p>

      <div class="flex gap-3 justify-center">
        <button id="confirm-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
          ${i}
        </button>
        <button id="confirm-ok" class="px-4 py-2 rounded-lg ${o.btnColor} text-white font-semibold transition-colors">
          ${e}
        </button>
      </div>
    </div>
  `, n.querySelector("#confirm-cancel").addEventListener("click", () => {
    d && d(), n.remove();
  }), n.querySelector("#confirm-ok").addEventListener("click", () => {
    c && c(), n.remove();
  });
  const t = (p) => {
    p.key === "Escape" && (d && d(), n.remove(), document.removeEventListener("keydown", t));
  };
  return document.addEventListener("keydown", t), n.addEventListener("remove", () => {
    document.removeEventListener("keydown", t);
  }), n;
}
function we({
  accept: r = "*",
  multiple: a = !1,
  maxSize: e = 100 * 1024 * 1024,
  // 100MB default
  onSelect: i,
  onClose: s,
  title: c = "Select Files"
}) {
  const d = document.createElement("div");
  d.className = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
  let n = [];
  d.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">${c}</h3>
        <button id="filepicker-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Upload Zone -->
      <div id="upload-zone" class="border-2 border-dashed border-white/20 rounded-xl p-8 text-center mb-6 transition-colors hover:border-violet-500">
        <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
        <p class="text-gray-300 mb-2">Drop files here or click to browse</p>
        <p class="text-gray-500 text-sm">Maximum file size: ${F(e)}</p>
        <input type="file" id="file-input" ${a ? "multiple" : ""} accept="${r}" class="hidden">
      </div>

      <!-- Filters and Search -->
      <div class="flex flex-wrap gap-4 mb-4 items-center">
        <div class="flex-1 min-w-[200px]">
          <input type="text" id="search-input" placeholder="Search files..."
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500">
        </div>
        <div class="flex gap-2">
          <select id="type-filter" class="p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500">
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>
          <select id="sort-select" class="p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500">
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="date">Date Modified</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      <!-- File Grid -->
      <div class="flex-1 overflow-y-auto">
        <div id="file-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <!-- Files will be populated here -->
        </div>
      </div>

      <!-- Selected Files Summary -->
      <div id="selection-summary" class="mt-4 p-3 bg-violet-600/20 rounded-lg hidden">
        <div class="flex items-center justify-between">
          <span id="selection-count" class="text-sm text-violet-300">0 files selected</span>
          <span id="selection-size" class="text-sm text-violet-400">0 MB total</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 justify-end mt-6 pt-4 border-t border-white/10">
        <button id="filepicker-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
          Cancel
        </button>
        <button id="filepicker-select" class="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          Select Files
        </button>
      </div>
    </div>
  `;
  let u = [], o = "", t = "name";
  const p = d.querySelector("#upload-zone"), l = d.querySelector("#file-input"), m = d.querySelector("#file-grid"), v = d.querySelector("#search-input"), g = d.querySelector("#type-filter"), h = d.querySelector("#sort-select"), b = d.querySelector("#filepicker-select"), x = d.querySelector("#selection-summary");
  S(), d.querySelector("#filepicker-close").addEventListener("click", () => {
    s && s(), d.remove();
  }), d.querySelector("#filepicker-cancel").addEventListener("click", () => {
    s && s(), d.remove();
  }), d.querySelector("#filepicker-select").addEventListener("click", () => {
    i && n.length > 0 && i(a ? n : n[0]), d.remove();
  }), p.addEventListener("click", () => l.click()), p.addEventListener("dragover", (f) => {
    f.preventDefault(), p.classList.add("border-violet-500", "bg-violet-500/10");
  }), p.addEventListener("dragleave", () => {
    p.classList.remove("border-violet-500", "bg-violet-500/10");
  }), p.addEventListener("drop", (f) => {
    f.preventDefault(), p.classList.remove("border-violet-500", "bg-violet-500/10");
    const w = Array.from(f.dataTransfer.files);
    y(w);
  }), l.addEventListener("change", () => {
    const f = Array.from(l.files);
    y(f);
  }), v.addEventListener("input", () => {
    S();
  }), g.addEventListener("change", () => {
    o = g.value, S();
  }), h.addEventListener("change", () => {
    t = h.value, S();
  });
  function y(f) {
    f.filter((E) => E.size > e ? (Z(`File "${E.name}" is too large. Maximum size: ${F(e)}`), !1) : !0).forEach((E) => {
      const j = {
        file: E,
        id: Date.now() + Math.random(),
        name: E.name,
        size: E.size,
        type: E.type,
        url: URL.createObjectURL(E),
        lastModified: E.lastModified,
        category: G(E.type)
      };
      u.push(j);
    }), S();
  }
  function S() {
    const f = v.value.toLowerCase();
    let w = u.filter((E) => {
      const j = E.name.toLowerCase().includes(f), z = !o || E.category === o;
      return j && z;
    });
    w.sort((E, j) => {
      switch (t) {
        case "size":
          return j.size - E.size;
        case "date":
          return j.lastModified - E.lastModified;
        case "type":
          return E.category.localeCompare(j.category);
        default:
          return E.name.localeCompare(j.name);
      }
    }), q(w), C();
  }
  function q(f) {
    if (m.innerHTML = "", f.length === 0) {
      m.innerHTML = `
        <div class="col-span-full text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p>No files found</p>
          <p class="text-sm">Upload files or adjust your search</p>
        </div>
      `;
      return;
    }
    f.forEach((w) => {
      const E = document.createElement("div"), j = n.includes(w);
      E.className = `file-item relative group cursor-pointer rounded-lg overflow-hidden transition-all ${j ? "ring-2 ring-violet-500 bg-violet-600/20" : "hover:bg-white/5"}`, E.innerHTML = `
        <div class="aspect-square bg-white/5 flex items-center justify-center p-2">
          ${K(w.category)}
        </div>
        <div class="p-2">
          <p class="text-xs text-white truncate" title="${w.name}">${w.name}</p>
          <p class="text-xs text-gray-500">${F(w.size)}</p>
        </div>
        ${j ? `
          <div class="absolute top-1 right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        ` : ""}
      `, E.addEventListener("click", () => {
        a ? $(w) : (n = [w], S(), C());
      }), m.appendChild(E);
    });
  }
  function $(f) {
    const w = n.indexOf(f);
    w > -1 ? n.splice(w, 1) : n.push(f), S(), C();
  }
  function C() {
    const f = n.length, w = n.reduce((E, j) => E + j.size, 0);
    f > 0 ? (x.classList.remove("hidden"), d.querySelector("#selection-count").textContent = `${f} file${f > 1 ? "s" : ""} selected`, d.querySelector("#selection-size").textContent = `${F(w)} total`) : x.classList.add("hidden"), b.disabled = f === 0;
  }
  return d;
}
function G(r) {
  return r.startsWith("image/") ? "image" : r.startsWith("video/") ? "video" : r.startsWith("audio/") ? "audio" : "document";
}
function K(r) {
  const a = {
    image: `<svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>`,
    video: `<svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
    </svg>`,
    audio: `<svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
    </svg>`,
    document: `<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>`
  };
  return a[r] || a.document;
}
function F(r) {
  if (r === 0) return "0 B";
  const a = 1024, e = ["B", "KB", "MB", "GB"], i = Math.floor(Math.log(r) / Math.log(a));
  return parseFloat((r / Math.pow(a, i)).toFixed(1)) + " " + e[i];
}
function Z(r) {
  const a = document.createElement("div");
  a.className = "fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg z-50", a.textContent = r, document.body.appendChild(a), setTimeout(() => a.remove(), 3e3);
}
function ke({ section: r, onClose: a }) {
  const e = document.createElement("div");
  e.className = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
  const i = R(r);
  e.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white flex items-center gap-2">
          <svg class="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Help & Documentation
        </h3>
        <button id="help-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="mb-6">
        <nav class="flex flex-wrap gap-2 mb-4">
          ${N().map((d) => `
            <button data-section="${d.id}"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors ${r === d.id ? "bg-violet-600 text-white" : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"}">
              ${d.title}
            </button>
          `).join("")}
        </nav>
      </div>

      <div id="help-content" class="prose prose-invert max-w-none">
        ${i}
      </div>

      <div class="flex gap-3 justify-between items-center mt-8 pt-4 border-t border-white/10">
        <div class="text-xs text-gray-500">
          Need more help? <a href="mailto:support@remix-go.com" class="text-violet-400 hover:text-violet-300">Contact Support</a>
        </div>
        <div class="flex gap-2">
          <button id="help-prev" class="px-3 py-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-sm">
            Previous
          </button>
          <button id="help-next" class="px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  `, e.querySelector("#help-close").addEventListener("click", () => {
    a && a(), e.remove();
  }), e.querySelectorAll("[data-section]").forEach((d) => {
    d.addEventListener("click", () => {
      const n = d.dataset.section;
      H(e, n);
    });
  });
  const s = N();
  let c = s.findIndex((d) => d.id === r) || 0;
  return e.querySelector("#help-prev").addEventListener("click", () => {
    c = Math.max(0, c - 1), H(e, s[c].id);
  }), e.querySelector("#help-next").addEventListener("click", () => {
    c = Math.min(s.length - 1, c + 1), H(e, s[c].id);
  }), D(e, c, s.length), e;
}
function H(r, a) {
  const e = r.querySelector("#help-content");
  r.querySelectorAll("[data-section]").forEach((d) => {
    const n = d.dataset.section === a;
    d.className = `px-3 py-1.5 rounded-lg text-sm transition-colors ${n ? "bg-violet-600 text-white" : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"}`;
  }), e.innerHTML = R(a);
  const s = N(), c = s.findIndex((d) => d.id === a);
  D(r, c, s.length);
}
function D(r, a, e) {
  const i = r.querySelector("#help-prev"), s = r.querySelector("#help-next");
  i.disabled = a === 0, s.disabled = a === e - 1, i.className = i.disabled ? "px-3 py-1.5 rounded-lg bg-white/5 text-gray-600 cursor-not-allowed text-sm" : "px-3 py-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-sm", s.className = s.disabled ? "px-3 py-1.5 rounded-lg bg-violet-600/50 text-gray-400 cursor-not-allowed text-sm" : "px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors text-sm";
}
function N() {
  return [
    { id: "getting-started", title: "Getting Started" },
    { id: "video-editor", title: "Video Editor" },
    { id: "timeline", title: "Timeline" },
    { id: "overlays", title: "Overlays" },
    { id: "personalization", title: "Personalization" },
    { id: "landing-pages", title: "Landing Pages" },
    { id: "publishing", title: "Publishing" },
    { id: "keyboard-shortcuts", title: "Shortcuts" },
    { id: "troubleshooting", title: "Troubleshooting" }
  ];
}
function R(r) {
  const a = {
    "getting-started": `
      <h4 class="text-lg font-semibold mb-4">Welcome to Remix Go!</h4>
      <p class="mb-4">Remix Go is a powerful video editor that lets you create personalized videos without coding experience.</p>

      <h5 class="font-semibold mb-2">Quick Start:</h5>
      <ol class="list-decimal list-inside space-y-1 mb-4">
        <li>Choose how to start: Generate with AI, upload a video, or record</li>
        <li>Add overlays like text, images, or forms</li>
        <li>Personalize with tokens like {{FIRSTNAME}}</li>
        <li>Publish and share your video</li>
      </ol>

      <div class="bg-violet-600/20 p-4 rounded-lg">
        <p class="text-sm"><strong>Pro Tip:</strong> Start with our AI video generator to create professional content in minutes!</p>
      </div>
    `,
    "video-editor": `
      <h4 class="text-lg font-semibold mb-4">Video Editor Overview</h4>
      <p class="mb-4">The video editor is divided into three main areas:</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="bg-white/5 p-3 rounded">
          <h6 class="font-semibold text-violet-400">Sidebar</h6>
          <p class="text-sm">Access tools, templates, and settings</p>
        </div>
        <div class="bg-white/5 p-3 rounded">
          <h6 class="font-semibold text-violet-400">Timeline</h6>
          <p class="text-sm">Control playback and overlay timing</p>
        </div>
        <div class="bg-white/5 p-3 rounded">
          <h6 class="font-semibold text-violet-400">Canvas</h6>
          <p class="text-sm">Visual preview of your video</p>
        </div>
      </div>

      <h5 class="font-semibold mb-2">Basic Workflow:</h5>
      <ul class="list-disc list-inside space-y-1">
        <li>Load or generate a video</li>
        <li>Add overlays (text, images, buttons)</li>
        <li>Adjust timing on the timeline</li>
        <li>Preview and export</li>
      </ul>
    `,
    timeline: `
      <h4 class="text-lg font-semibold mb-4">Timeline Controls</h4>

      <h5 class="font-semibold mb-2">Playback Controls:</h5>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><kbd class="bg-white/20 px-1 rounded text-xs">Space</kbd> - Play/Pause</li>
        <li><kbd class="bg-white/20 px-1 rounded text-xs">←→</kbd> - Scrub timeline</li>
        <li><kbd class="bg-white/20 px-1 rounded text-xs">Home/End</kbd> - Jump to start/end</li>
      </ul>

      <h5 class="font-semibold mb-2">Zoom & Navigation:</h5>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li>Mouse wheel to zoom in/out</li>
        <li>Click and drag to pan timeline</li>
        <li>Fit to window button for full view</li>
      </ul>

      <div class="bg-yellow-600/20 p-3 rounded">
        <p class="text-sm"><strong>Note:</strong> Overlay timing is visual - drag elements on the timeline to adjust when they appear.</p>
      </div>
    `,
    overlays: `
      <h4 class="text-lg font-semibold mb-4">Adding Overlays</h4>

      <h5 class="font-semibold mb-2">Types of Overlays:</h5>
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div>
          <h6 class="font-semibold text-green-400">Text</h6>
          <p class="text-sm">Titles, subtitles, callouts</p>
        </div>
        <div>
          <h6 class="font-semibold text-blue-400">Images</h6>
          <p class="text-sm">Logos, graphics, watermarks</p>
        </div>
        <div>
          <h6 class="font-semibold text-purple-400">Forms</h6>
          <p class="text-sm">Lead capture, email signup</p>
        </div>
        <div>
          <h6 class="font-semibold text-red-400">CTAs</h6>
          <p class="text-sm">Buttons, links, actions</p>
        </div>
      </div>

      <h5 class="font-semibold mb-2">Adding Overlays:</h5>
      <ol class="list-decimal list-inside space-y-1">
        <li>Click an overlay button in the sidebar</li>
        <li>Configure settings in the modal</li>
        <li>Position and resize on the canvas</li>
        <li>Set timing on the timeline</li>
      </ol>
    `,
    personalization: `
      <h4 class="text-lg font-semibold mb-4">Personalization with Tokens</h4>
      <p class="mb-4">Make your videos personal by using tokens that get replaced with viewer-specific information.</p>

      <h5 class="font-semibold mb-2">Available Tokens:</h5>
      <div class="grid grid-cols-2 gap-2 mb-4 font-mono text-sm">
        <div>{{FIRSTNAME}} - First name</div>
        <div>{{LASTNAME}} - Last name</div>
        <div>{{EMAIL}} - Email address</div>
        <div>{{COMPANY}} - Company name</div>
        <div>{{GEOCITY}} - City location</div>
        <div>{{GEOCOUNTRY}} - Country</div>
      </div>

      <h5 class="font-semibold mb-2">Token Formats:</h5>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><code>{{TOKEN}}</code> - Basic replacement</li>
        <li><code>{{up TOKEN}}</code> - Uppercase</li>
        <li><code>{{d TOKEN "default"}}</code> - With fallback</li>
      </ul>

      <div class="bg-green-600/20 p-3 rounded">
        <p class="text-sm"><strong>Example:</strong> "Hi {{FIRSTNAME}}, welcome to {{up COMPANY}}!"</p>
      </div>
    `,
    "landing-pages": `
      <h4 class="text-lg font-semibold mb-4">Landing Page Builder</h4>
      <p class="mb-4">Create professional landing pages with our drag-and-drop builder.</p>

      <h5 class="font-semibold mb-2">Available Components:</h5>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><strong>Hero Sections:</strong> Headlines, CTAs, backgrounds</li>
        <li><strong>Content Blocks:</strong> Text, images, testimonials</li>
        <li><strong>Forms:</strong> Contact forms, email signups</li>
        <li><strong>Interactive:</strong> Accordions, tabs, carousels</li>
      </ul>

      <h5 class="font-semibold mb-2">Building Pages:</h5>
      <ol class="list-decimal list-inside space-y-1">
        <li>Choose a template or start blank</li>
        <li>Drag components from the sidebar</li>
        <li>Edit content and styling</li>
        <li>Preview on different devices</li>
        <li>Export HTML or embed directly</li>
      </ol>
    `,
    publishing: `
      <h4 class="text-lg font-semibold mb-4">Publishing Your Content</h4>

      <h5 class="font-semibold mb-2">Export Options:</h5>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><strong>Embed Code:</strong> Copy HTML for your website</li>
        <li><strong>Email Campaign:</strong> Generate personalized email links</li>
        <li><strong>Direct Links:</strong> Share URLs with token parameters</li>
        <li><strong>Batch Processing:</strong> Generate multiple personalized versions</li>
      </ul>

      <h5 class="font-semibold mb-2">Email Integration:</h5>
      <p class="mb-2">Works with all major email providers:</p>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li>MailChimp, AWeber, GetResponse</li>
        <li>Constant Contact, SendLane, Infusionsoft</li>
        <li>Custom providers with token replacement</li>
      </ul>

      <div class="bg-blue-600/20 p-3 rounded">
        <p class="text-sm"><strong>Analytics:</strong> Track opens, clicks, and conversions with built-in analytics.</p>
      </div>
    `,
    "keyboard-shortcuts": `
      <h4 class="text-lg font-semibold mb-4">Keyboard Shortcuts</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 class="font-semibold mb-2">Playback:</h5>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between"><span>Play/Pause</span><kbd class="bg-white/20 px-1 rounded">Space</kbd></div>
            <div class="flex justify-between"><span>Rewind 5s</span><kbd class="bg-white/20 px-1 rounded">←</kbd></div>
            <div class="flex justify-between"><span>Forward 5s</span><kbd class="bg-white/20 px-1 rounded">→</kbd></div>
            <div class="flex justify-between"><span>Jump to start</span><kbd class="bg-white/20 px-1 rounded">Home</kbd></div>
            <div class="flex justify-between"><span>Jump to end</span><kbd class="bg-white/20 px-1 rounded">End</kbd></div>
          </div>
        </div>

        <div>
          <h5 class="font-semibold mb-2">Editing:</h5>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between"><span>Undo</span><kbd class="bg-white/20 px-1 rounded">Ctrl+Z</kbd></div>
            <div class="flex justify-between"><span>Redo</span><kbd class="bg-white/20 px-1 rounded">Ctrl+Y</kbd></div>
            <div class="flex justify-between"><span>Copy</span><kbd class="bg-white/20 px-1 rounded">Ctrl+C</kbd></div>
            <div class="flex justify-between"><span>Paste</span><kbd class="bg-white/20 px-1 rounded">Ctrl+V</kbd></div>
            <div class="flex justify-between"><span>Delete</span><kbd class="bg-white/20 px-1 rounded">Del</kbd></div>
          </div>
        </div>
      </div>

      <div class="mt-4 p-3 bg-white/5 rounded">
        <p class="text-sm"><strong>Tip:</strong> Enable keyboard shortcuts in Settings for the full experience.</p>
      </div>
    `,
    troubleshooting: `
      <h4 class="text-lg font-semibold mb-4">Troubleshooting</h4>

      <h5 class="font-semibold mb-2">Common Issues:</h5>

      <div class="space-y-3 mb-4">
        <details class="bg-white/5 rounded p-3">
          <summary class="cursor-pointer font-semibold">Video won't load</summary>
          <div class="mt-2 text-sm">
            <p>Check that your video file is in a supported format (MP4, WebM) and under 500MB. Try refreshing the page or clearing your browser cache.</p>
          </div>
        </details>

        <details class="bg-white/5 rounded p-3">
          <summary class="cursor-pointer font-semibold">Overlays not appearing</summary>
          <div class="mt-2 text-sm">
            <p>Ensure overlays are positioned within the visible area and have timing set on the timeline. Check that the timeline is playing and overlays aren't hidden.</p>
          </div>
        </details>

        <details class="bg-white/5 rounded p-3">
          <summary class="cursor-pointer font-semibold">Personalization not working</summary>
          <div class="mt-2 text-sm">
            <p>Verify token format ({{TOKEN}}) and that URL parameters match your token names. Check browser console for errors.</p>
          </div>
        </details>

        <details class="bg-white/5 rounded p-3">
          <summary class="cursor-pointer font-semibold">Performance issues</summary>
          <div class="mt-2 text-sm">
            <p>Try reducing video resolution, clearing cache, or using a smaller video file. Check your internet connection and browser performance.</p>
          </div>
        </details>
      </div>

      <h5 class="font-semibold mb-2">Getting Help:</h5>
      <ul class="list-disc list-inside space-y-1">
        <li>Check browser console for error messages</li>
        <li>Try a different browser (Chrome, Firefox, Safari)</li>
        <li>Clear browser cache and cookies</li>
        <li>Contact support with error details</li>
      </ul>
    `
  };
  return a[r] || a["getting-started"];
}
function $e({ onClose: r }) {
  var s, c;
  const a = document.createElement("div");
  a.className = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
  const e = [
    {
      category: "Playback",
      shortcuts: [
        { keys: ["Space"], description: "Play/Pause video" },
        { keys: ["←"], description: "Rewind 5 seconds" },
        { keys: ["→"], description: "Forward 5 seconds" },
        { keys: ["Home"], description: "Jump to start" },
        { keys: ["End"], description: "Jump to end" },
        { keys: ["Ctrl", "+"], description: "Increase playback speed" },
        { keys: ["Ctrl", "−"], description: "Decrease playback speed" }
      ]
    },
    {
      category: "Timeline",
      shortcuts: [
        { keys: ["Mouse Wheel"], description: "Zoom timeline in/out" },
        { keys: ["Click", "+", "Drag"], description: "Pan timeline" },
        { keys: ["Ctrl", "+", "A"], description: "Select all overlays" },
        { keys: ["Delete"], description: "Delete selected overlays" },
        { keys: ["Ctrl", "+", "C"], description: "Copy selected overlays" },
        { keys: ["Ctrl", "+", "V"], description: "Paste overlays" }
      ]
    },
    {
      category: "Editing",
      shortcuts: [
        { keys: ["Ctrl", "+", "Z"], description: "Undo last action" },
        { keys: ["Ctrl", "+", "Y"], description: "Redo last action" },
        { keys: ["Ctrl", "+", "S"], description: "Save project" },
        { keys: ["Ctrl", "+", "N"], description: "New project" },
        { keys: ["Ctrl", "+", "O"], description: "Open project" },
        { keys: ["F2"], description: "Rename selected item" }
      ]
    },
    {
      category: "Overlays",
      shortcuts: [
        { keys: ["T"], description: "Add text overlay" },
        { keys: ["I"], description: "Add image overlay" },
        { keys: ["F"], description: "Add form overlay" },
        { keys: ["C"], description: "Add CTA overlay" },
        { keys: ["P"], description: "Add popup overlay" },
        { keys: ["Escape"], description: "Deselect current overlay" }
      ]
    },
    {
      category: "Navigation",
      shortcuts: [
        { keys: ["Ctrl", "+", "1"], description: "Switch to Getting Started" },
        { keys: ["Ctrl", "+", "2"], description: "Switch to Editor" },
        { keys: ["Ctrl", "+", "3"], description: "Switch to Publisher" },
        { keys: ["Ctrl", "+", "4"], description: "Switch to Landing Pages" },
        { keys: ["F1"], description: "Show help" },
        { keys: ["F11"], description: "Toggle fullscreen" }
      ]
    },
    {
      category: "Personalization",
      shortcuts: [
        { keys: ["Ctrl", "+", "P"], description: "Open personalizer" },
        { keys: ["{{}}"], description: "Insert token (type {{TOKEN}})" },
        { keys: ["Ctrl", "+", "Shift", "+", "P"], description: "Preview personalization" }
      ]
    }
  ];
  a.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white flex items-center gap-2">
          <svg class="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          Keyboard Shortcuts
        </h3>
        <button id="shortcuts-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="mb-4 p-3 bg-violet-600/20 rounded-lg">
        <p class="text-sm text-violet-300 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <strong>Tip:</strong> Enable keyboard shortcuts in Settings for full functionality
        </p>
      </div>

      <div class="space-y-6">
        ${e.map((d) => `
          <div class="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
            <h4 class="text-lg font-semibold text-white mb-3">${d.category}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${d.shortcuts.map((n) => `
                <div class="flex items-center justify-between py-2">
                  <span class="text-sm text-gray-300">${n.description}</span>
                  <div class="flex gap-1">
                    ${n.keys.map((u, o) => `
                      <kbd class="bg-white/20 text-white text-xs px-2 py-1 rounded font-mono ${o > 0 ? "ml-1" : ""}">
                        ${u}
                      </kbd>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>

      <div class="flex gap-3 justify-end mt-8 pt-4 border-t border-white/10">
        <button id="shortcuts-print" class="px-3 py-1.5 rounded bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-sm">
          Print
        </button>
        <button id="shortcuts-customize" class="px-3 py-1.5 rounded bg-violet-600 text-white hover:bg-violet-500 transition-colors text-sm">
          Customize
        </button>
      </div>
    </div>
  `, a.querySelector("#shortcuts-close").addEventListener("click", () => {
    r && r(), a.remove();
  }), (s = a.querySelector("#shortcuts-print")) == null || s.addEventListener("click", () => {
    window.print();
  }), (c = a.querySelector("#shortcuts-customize")) == null || c.addEventListener("click", () => {
    alert("Keyboard shortcut customization coming soon!");
  });
  const i = (d) => {
    d.key === "Escape" && (r && r(), a.remove(), document.removeEventListener("keydown", i));
  };
  return document.addEventListener("keydown", i), a.addEventListener("remove", () => {
    document.removeEventListener("keydown", i);
  }), a;
}
function Se({ onComplete: r, onSkip: a }) {
  const e = document.createElement("div");
  e.className = "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50";
  const i = [
    {
      title: "Welcome to Remix Go!",
      content: `
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">🎬</div>
          <p class="text-lg text-gray-300 mb-4">
            Create personalized videos without coding experience
          </p>
          <p class="text-sm text-gray-400">
            Follow this quick tour to learn the basics
          </p>
        </div>
      `,
      action: "Next"
    },
    {
      title: "Getting Started",
      content: `
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded bg-violet-600 flex items-center justify-center text-white font-semibold">1</div>
            <div>
              <h4 class="font-semibold text-white mb-1">Choose Your Method</h4>
              <p class="text-sm text-gray-400">Start with AI generation, upload your video, or record directly</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded bg-violet-600 flex items-center justify-center text-white font-semibold">2</div>
            <div>
              <h4 class="font-semibold text-white mb-1">Add Personalization</h4>
              <p class="text-sm text-gray-400">Use tokens like {{FIRSTNAME}} to make videos personal</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded bg-violet-600 flex items-center justify-center text-white font-semibold">3</div>
            <div>
              <h4 class="font-semibold text-white mb-1">Publish & Share</h4>
              <p class="text-sm text-gray-400">Generate embed codes and email campaigns</p>
            </div>
          </div>
        </div>
      `,
      action: "Next"
    },
    {
      title: "Key Features",
      content: `
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/5 p-4 rounded-lg">
            <div class="text-2xl mb-2">🤖</div>
            <h4 class="font-semibold text-white mb-1">AI Generation</h4>
            <p class="text-xs text-gray-400">Create videos from text prompts</p>
          </div>
          <div class="bg-white/5 p-4 rounded-lg">
            <div class="text-2xl mb-2">🎭</div>
            <h4 class="font-semibold text-white mb-1">Overlays</h4>
            <p class="text-xs text-gray-400">Text, images, forms, CTAs</p>
          </div>
          <div class="bg-white/5 p-4 rounded-lg">
            <div class="text-2xl mb-2">🎯</div>
            <h4 class="font-semibold text-white mb-1">Personalization</h4>
            <p class="text-xs text-gray-400">Dynamic token replacement</p>
          </div>
          <div class="bg-white/5 p-4 rounded-lg">
            <div class="text-2xl mb-2">📄</div>
            <h4 class="font-semibold text-white mb-1">Landing Pages</h4>
            <p class="text-xs text-gray-400">Drag-and-drop page builder</p>
          </div>
        </div>
      `,
      action: "Next"
    },
    {
      title: "Keyboard Shortcuts",
      content: `
        <div class="space-y-3">
          <div class="bg-white/5 p-3 rounded">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-white">Play/Pause</span>
              <kbd class="bg-white/20 px-2 py-1 rounded text-xs">Space</kbd>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-white">Undo/Redo</span>
              <kbd class="bg-white/20 px-2 py-1 rounded text-xs">Ctrl+Z / Ctrl+Y</kbd>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-white">Help</span>
              <kbd class="bg-white/20 px-2 py-1 rounded text-xs">F1</kbd>
            </div>
          </div>
          <p class="text-sm text-gray-400 text-center">
            Enable keyboard shortcuts in Settings for full functionality
          </p>
        </div>
      `,
      action: "Get Started"
    }
  ];
  let s = 0;
  function c() {
    const u = i[s];
    e.innerHTML = `
      <div class="glass rounded-2xl p-8 max-w-lg w-full mx-4">
        <!-- Progress Indicator -->
        <div class="flex justify-center mb-6">
          <div class="flex gap-2">
            ${i.map((v, g) => `
              <div class="w-2 h-2 rounded-full transition-colors ${g <= s ? "bg-violet-500" : "bg-white/20"}"></div>
            `).join("")}
          </div>
        </div>

        <!-- Content -->
        <div class="text-center mb-8">
          <h3 class="text-xl font-semibold text-white mb-4">${u.title}</h3>
          <div class="text-left">
            ${u.content}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 justify-between">
          <button id="onboarding-skip" class="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">
            Skip Tour
          </button>
          <div class="flex gap-2">
            ${s > 0 ? `
              <button id="onboarding-prev" class="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                Back
              </button>
            ` : ""}
            <button id="onboarding-next" class="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
              ${u.action}
            </button>
          </div>
        </div>

        <!-- Skip All -->
        ${s === 0 ? `
          <div class="mt-4 pt-4 border-t border-white/10">
            <button id="onboarding-skip-all" class="w-full text-center text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Don't show this again
            </button>
          </div>
        ` : ""}
      </div>
    `;
    const o = e.querySelector("#onboarding-next"), t = e.querySelector("#onboarding-prev"), p = e.querySelector("#onboarding-skip"), l = e.querySelector("#onboarding-skip-all");
    o && o.addEventListener("click", () => {
      s < i.length - 1 ? (s++, c()) : d();
    }), t && t.addEventListener("click", () => {
      s > 0 && (s--, c());
    }), p && p.addEventListener("click", () => {
      a && a(), e.remove();
    }), l && l.addEventListener("click", () => {
      localStorage.setItem("remix-go-skip-onboarding", "true"), a && a(), e.remove();
    });
    const m = (v) => {
      v.key === "ArrowRight" || v.key === " " ? (v.preventDefault(), o == null || o.click()) : v.key === "ArrowLeft" && t ? (v.preventDefault(), t.click()) : v.key === "Escape" && p && p.click();
    };
    document.addEventListener("keydown", m), e.addEventListener("remove", () => {
      document.removeEventListener("keydown", m);
    });
  }
  function d() {
    localStorage.setItem("remix-go-onboarding-completed", "true"), r && r(), e.remove(), n();
  }
  function n() {
    const u = document.createElement("div");
    u.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50 flex items-center gap-2", u.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      Welcome to Remix Go! You're all set to start creating.
    `, document.body.appendChild(u), setTimeout(() => u.remove(), 3e3);
  }
  return c(), e;
}
function Ee({
  content: r,
  type: a = "video",
  // video, image, page, embed
  title: e = "Preview",
  onClose: i,
  options: s = {}
}) {
  const c = document.createElement("div");
  c.className = "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50";
  const d = Y(r, a, s);
  return c.innerHTML = `
    <div class="glass rounded-2xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">${e}</h3>
        <div class="flex items-center gap-3">
          ${Q(a)}
          <button id="preview-close" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-hidden bg-black/20 rounded-lg">
        ${d}
      </div>

      ${J(a, s)}
    </div>
  `, c.querySelector("#preview-close").addEventListener("click", () => {
    i && i(), c.remove();
  }), _(c, a, r, s), c;
}
function Y(r, a, e) {
  switch (a) {
    case "video":
      return `
        <div class="w-full h-full flex items-center justify-center p-4">
          <video id="preview-video" controls class="max-w-full max-h-full rounded" ${e.autoplay ? "autoplay" : ""}>
            <source src="${r.src || r}" type="${r.type || "video/mp4"}">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    case "image":
      return `
        <div class="w-full h-full flex items-center justify-center p-4">
          <img id="preview-image" src="${r.src || r}" alt="Preview"
            class="max-w-full max-h-full object-contain rounded">
        </div>
      `;
    case "page":
      return `
        <div class="w-full h-full">
          <iframe id="preview-iframe" src="${r.src || r}"
            class="w-full h-full border-0 rounded" sandbox="allow-scripts allow-same-origin">
          </iframe>
        </div>
      `;
    case "embed":
      return `
        <div class="w-full h-full flex items-center justify-center p-4">
          <div class="w-full max-w-4xl">
            <div id="embed-preview" class="bg-white rounded-lg overflow-hidden">
              ${r.html || r}
            </div>
          </div>
        </div>
      `;
    default:
      return `
        <div class="w-full h-full flex items-center justify-center p-4">
          <div class="text-center text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p>Preview not available for this content type</p>
          </div>
        </div>
      `;
  }
}
function Q(r, a) {
  switch (r) {
    case "video":
      return `
        <div class="flex items-center gap-2">
          <button id="preview-play" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <button id="preview-pause" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
          <span class="text-xs text-gray-400 mx-2">|</span>
          <select id="preview-speed" class="bg-white/10 text-white text-xs rounded px-2 py-1">
            <option value="0.5">0.5x</option>
            <option value="1" selected>1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      `;
    case "image":
      return `
        <div class="flex items-center gap-2">
          <button id="preview-zoom-in" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M10 7v3m0 0v3m0-3h3m-3 0H7"/>
            </svg>
          </button>
          <button id="preview-zoom-out" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M13 10H7"/>
            </svg>
          </button>
          <button id="preview-fit" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5"/>
            </svg>
          </button>
        </div>
      `;
    case "page":
      return `
        <div class="flex items-center gap-2">
          <select id="preview-device" class="bg-white/10 text-white text-xs rounded px-2 py-1">
            <option value="desktop" selected>Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
          <button id="preview-refresh" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      `;
    default:
      return "";
  }
}
function J(r, a) {
  const e = [];
  return a.downloadable && e.push(`
      <button id="preview-download" class="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        Download
      </button>
    `), a.shareable && e.push(`
      <button id="preview-share" class="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        Share
      </button>
    `), e.length > 0 ? `
      <div class="flex gap-2 justify-center mt-4 pt-4 border-t border-white/10">
        ${e.join("")}
      </div>
    ` : "";
}
function _(r, a, e, i) {
  switch (a) {
    case "video":
      const d = r.querySelector("#preview-video"), n = r.querySelector("#preview-play"), u = r.querySelector("#preview-pause"), o = r.querySelector("#preview-speed");
      n && n.addEventListener("click", () => d.play()), u && u.addEventListener("click", () => d.pause()), o && o.addEventListener("change", (y) => {
        d.playbackRate = parseFloat(y.target.value);
      });
      break;
    case "image":
      const t = r.querySelector("#preview-image"), p = r.querySelector("#preview-zoom-in"), l = r.querySelector("#preview-zoom-out"), m = r.querySelector("#preview-fit");
      let v = 1;
      const g = () => {
        t.style.transform = `scale(${v})`;
      };
      p && p.addEventListener("click", () => {
        v = Math.min(v * 1.2, 5), g();
      }), l && l.addEventListener("click", () => {
        v = Math.max(v / 1.2, 0.1), g();
      }), m && m.addEventListener("click", () => {
        v = 1, g();
      });
      break;
    case "page":
      const h = r.querySelector("#preview-iframe"), b = r.querySelector("#preview-device"), x = r.querySelector("#preview-refresh");
      b && b.addEventListener("change", (y) => {
        const S = y.target.value, q = { desktop: "100%", tablet: "768px", mobile: "375px" };
        h.style.width = q[S] || "100%";
      }), x && x.addEventListener("click", () => {
        h.src = h.src;
      });
      break;
  }
  const s = r.querySelector("#preview-download"), c = r.querySelector("#preview-share");
  s && i.downloadable && s.addEventListener("click", () => {
    if (a === "image") {
      const d = document.createElement("a");
      d.href = r.querySelector("#preview-image").src, d.download = "preview-image.jpg", d.click();
    } else a === "video" && alert("Video download not yet implemented");
  }), c && i.shareable && c.addEventListener("click", () => {
    navigator.share ? navigator.share({
      title: i.shareTitle || "Preview",
      text: i.shareText || "Check out this preview",
      url: i.shareUrl || window.location.href
    }) : (navigator.clipboard.writeText(i.shareUrl || window.location.href), alert("Link copied to clipboard!"));
  });
}
function Le({ title: r, message: a, progress: e, onCancel: i }) {
  var n;
  const s = document.createElement("div");
  s.className = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
  const c = e || 0, d = `${Math.min(100, Math.max(0, c))}%`;
  return s.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-md w-full mx-4 text-center">
      <div class="text-4xl mb-4">⏳</div>
      <h3 class="text-lg font-semibold text-white mb-2">${r || "Processing..."}</h3>
      <p class="text-gray-400 text-sm mb-6">${a || "Please wait while we process your request."}</p>

      <div class="mb-6">
        <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div class="h-full bg-violet-500 rounded-full transition-all duration-300 ease-out"
               style="width: ${d}"></div>
        </div>
        <div class="text-xs text-gray-500 mt-2">${c.toFixed(0)}% complete</div>
      </div>

      ${i ? `
        <button id="progress-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
          Cancel
        </button>
      ` : ""}
    </div>
  `, c >= 100 && setTimeout(() => {
    s.parentNode && s.remove();
  }, 1e3), i && ((n = s.querySelector("#progress-cancel")) == null || n.addEventListener("click", () => {
    i(), s.remove();
  })), i || s.addEventListener("click", (u) => {
    u.target === s && s.remove();
  }), s.updateProgress = (u, o) => {
    const t = s.querySelector(".bg-violet-500"), p = s.querySelector(".text-xs"), l = s.querySelector("p");
    if (t && u !== void 0) {
      const m = Math.min(100, Math.max(0, u));
      t.style.width = `${m}%`, p && (p.textContent = `${m.toFixed(0)}% complete`), m >= 100 && setTimeout(() => {
        s.parentNode && s.remove();
      }, 1e3);
    }
    l && o && (l.textContent = o);
  }, s;
}
function Ce({ onSave: r, onClose: a, initialSettings: e = {} }) {
  const i = document.createElement("div");
  i.className = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
  const s = {
    theme: localStorage.getItem("remix-go-theme") || e.theme || "dark",
    language: localStorage.getItem("remix-go-language") || e.language || "en",
    autoplay: localStorage.getItem("remix-go-autoplay") === "true" || e.autoplay || !1,
    showTips: localStorage.getItem("remix-go-showTips") !== "false" || e.showTips || !0,
    keyboardShortcuts: localStorage.getItem("remix-go-keyboardShortcuts") === "true" || e.keyboardShortcuts || !1,
    autoSave: localStorage.getItem("remix-go-autoSave") !== "false" || e.autoSave || !0,
    highContrast: localStorage.getItem("remix-go-highContrast") === "true" || e.highContrast || !1,
    reducedMotion: localStorage.getItem("remix-go-reducedMotion") === "true" || e.reducedMotion || !1,
    ...e
  };
  i.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">Settings</h3>
        <button id="settings-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="space-y-6">
        <!-- Appearance -->
        <div class="border-b border-white/10 pb-4">
          <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Appearance</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-300 mb-2">Theme</label>
              <select id="theme-select" class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500">
                <option value="dark" ${s.theme === "dark" ? "selected" : ""}>Dark</option>
                <option value="light" ${s.theme === "light" ? "selected" : ""}>Light</option>
                <option value="auto" ${s.theme === "auto" ? "selected" : ""}>Auto (System)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">Language</label>
              <select id="language-select" class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500">
                <option value="en" ${s.language === "en" ? "selected" : ""}>English</option>
                <option value="es" ${s.language === "es" ? "selected" : ""}>Español</option>
                <option value="fr" ${s.language === "fr" ? "selected" : ""}>Français</option>
                <option value="de" ${s.language === "de" ? "selected" : ""}>Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Behavior -->
        <div class="border-b border-white/10 pb-4">
          <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Behavior</h4>
          <div class="space-y-3">
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Auto-play videos</span>
              <input id="autoplay-toggle" type="checkbox" ${s.autoplay ? "checked" : ""} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Show tips and hints</span>
              <input id="tips-toggle" type="checkbox" ${s.showTips ? "checked" : ""} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Enable keyboard shortcuts</span>
              <input id="shortcuts-toggle" type="checkbox" ${s.keyboardShortcuts ? "checked" : ""} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Auto-save projects</span>
              <input id="autosave-toggle" type="checkbox" ${s.autoSave ? "checked" : ""} class="accent-violet-500">
            </label>
          </div>
        </div>

        <!-- Accessibility -->
        <div class="border-b border-white/10 pb-4">
          <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Accessibility</h4>
          <div class="space-y-3">
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">High contrast mode</span>
              <input id="contrast-toggle" type="checkbox" ${s.highContrast ? "checked" : ""} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Reduce motion</span>
              <input id="motion-toggle" type="checkbox" ${s.reducedMotion ? "checked" : ""} class="accent-violet-500">
            </label>
          </div>
        </div>

        <!-- Storage & Privacy -->
        <div>
          <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Storage & Privacy</h4>
          <div class="space-y-3">
            <button id="clear-cache" class="w-full p-3 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-left">
              Clear Cache & Temporary Files
            </button>
            <button id="reset-settings" class="w-full p-3 rounded-lg bg-red-600/20 text-red-400 hover:text-red-300 hover:bg-red-600/30 transition-colors text-left">
              Reset All Settings
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-3 justify-end mt-8 pt-4 border-t border-white/10">
        <button id="settings-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
          Cancel
        </button>
        <button id="settings-save" class="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  `, i.querySelector("#settings-close").addEventListener("click", () => {
    a && a(), i.remove();
  }), i.querySelector("#settings-cancel").addEventListener("click", () => {
    a && a(), i.remove();
  }), i.querySelector("#settings-save").addEventListener("click", () => {
    const d = {
      theme: i.querySelector("#theme-select").value,
      language: i.querySelector("#language-select").value,
      autoplay: i.querySelector("#autoplay-toggle").checked,
      showTips: i.querySelector("#tips-toggle").checked,
      keyboardShortcuts: i.querySelector("#shortcuts-toggle").checked,
      autoSave: i.querySelector("#autosave-toggle").checked,
      highContrast: i.querySelector("#contrast-toggle").checked,
      reducedMotion: i.querySelector("#motion-toggle").checked
    };
    Object.entries(d).forEach(([n, u]) => {
      localStorage.setItem(`remix-go-${n}`, u.toString());
    }), X(d.theme), ee(d), r && r(d), i.remove();
  }), i.querySelector("#clear-cache").addEventListener("click", () => {
    confirm("Clear all cached data? This will remove temporary files and cached assets.") && (Object.keys(localStorage).filter(
      (n) => n.startsWith("remix-go-") && !["theme", "language", "autoplay", "showTips", "keyboardShortcuts", "autoSave", "highContrast", "reducedMotion"].some(
        (u) => n.includes(u)
      )
    ).forEach((n) => localStorage.removeItem(n)), "caches" in window && caches.keys().then((n) => {
      n.forEach((u) => caches.delete(u));
    }), alert("Cache cleared successfully!"));
  }), i.querySelector("#reset-settings").addEventListener("click", () => {
    confirm("Reset all settings to defaults? This cannot be undone.") && (Object.keys(localStorage).filter((d) => d.startsWith("remix-go-")).forEach((d) => {
      localStorage.removeItem(d);
    }), i.querySelector("#theme-select").value = "dark", i.querySelector("#language-select").value = "en", i.querySelector("#autoplay-toggle").checked = !1, i.querySelector("#tips-toggle").checked = !0, i.querySelector("#shortcuts-toggle").checked = !1, i.querySelector("#autosave-toggle").checked = !0, i.querySelector("#contrast-toggle").checked = !1, i.querySelector("#motion-toggle").checked = !1, alert("Settings reset to defaults!"));
  });
  const c = (d) => {
    d.key === "Escape" && (a && a(), i.remove(), document.removeEventListener("keydown", c));
  };
  return document.addEventListener("keydown", c), i;
}
function X(r) {
  const a = document.documentElement;
  if (r === "light")
    a.classList.add("light-theme"), a.classList.remove("dark-theme");
  else if (r === "auto") {
    const e = window.matchMedia("(prefers-color-scheme: dark)").matches;
    a.classList.toggle("light-theme", !e), a.classList.toggle("dark-theme", e);
  } else
    a.classList.add("dark-theme"), a.classList.remove("light-theme");
}
function ee(r) {
  const a = document.documentElement;
  a.classList.toggle("high-contrast", r.highContrast), a.classList.toggle("reduced-motion", r.reducedMotion);
  const e = document.querySelector('meta[name="theme-color"]');
  e && e.setAttribute("content", r.highContrast ? "#000000" : "#0f0f13");
}
function Te({ onGenerate: r }) {
  const a = document.createElement("div");
  a.className = "ai-generate-panel p-4 space-y-4", a.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">AI Video Generation</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Describe your video</label>
        <textarea id="ai-prompt" rows="3"
          class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
          placeholder="A professional product demo showing..."></textarea>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Negative prompt (optional)</label>
        <input id="ai-negative" type="text"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          placeholder="blurry, low quality, watermark">
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Model</label>
          <select id="ai-model"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="kling-v3">Kling v3.0</option>
            <option value="kling-v2">Kling v2.0</option>
            <option value="sora">Sora</option>
            <option value="veo-3">Veo 3</option>
            <option value="wan-2.2">Wan 2.2</option>
            <option value="seedance">Seedance</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Duration</label>
          <select id="ai-duration"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
            <option value="15" selected>15 seconds</option>
            <option value="30">30 seconds</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Aspect Ratio</label>
          <select id="ai-aspect"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="16:9" selected>16:9 Landscape</option>
            <option value="9:16">9:16 Portrait</option>
            <option value="1:1">1:1 Square</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Quality</label>
          <select id="ai-quality"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="standard">Standard</option>
            <option value="hd" selected>HD</option>
            <option value="4k">4K</option>
          </select>
        </div>
      </div>
      
      <button id="ai-generate-btn"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Generate Video
      </button>
    </div>
    
    <hr class="border-white/10">
    
    <div class="space-y-3">
      <h4 class="text-xs font-semibold text-gray-500 uppercase">Image to Video</h4>
      <div id="i2v-upload-zone"
        class="p-4 rounded-lg border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 transition-colors">
        <p class="text-gray-500 text-sm">Drop image or click to upload</p>
        <input type="file" id="i2v-file" accept="image/*" class="hidden">
      </div>
      <button id="ai-i2v-btn"
        class="w-full p-3 rounded-lg bg-violet-600/50 text-white font-semibold hover:bg-violet-600 transition-colors">
        Animate Image
      </button>
    </div>
    
    <hr class="border-white/10">
    
    <div class="space-y-3">
      <h4 class="text-xs font-semibold text-gray-500 uppercase">AI Music</h4>
      <textarea id="ai-music-prompt" rows="2"
        class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
        placeholder="Upbeat corporate background music..."></textarea>
      <button id="ai-music-btn"
        class="w-full p-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors">
        Generate Music
      </button>
    </div>
  `;
  const e = a.querySelector("#ai-generate-btn"), i = a.querySelector("#ai-i2v-btn"), s = a.querySelector("#ai-music-btn"), c = a.querySelector("#i2v-upload-zone"), d = a.querySelector("#i2v-file");
  return c.addEventListener("click", () => d.click()), c.addEventListener("dragover", (n) => {
    n.preventDefault(), c.classList.add("border-violet-500");
  }), c.addEventListener("dragleave", () => {
    c.classList.remove("border-violet-500");
  }), c.addEventListener("drop", (n) => {
    n.preventDefault(), c.classList.remove("border-violet-500"), n.dataTransfer.files.length && (d.files = n.dataTransfer.files, c.querySelector("p").textContent = n.dataTransfer.files[0].name);
  }), e.addEventListener("click", () => {
    r && r({
      type: "text-to-video",
      prompt: a.querySelector("#ai-prompt").value,
      negativePrompt: a.querySelector("#ai-negative").value,
      model: a.querySelector("#ai-model").value,
      duration: parseInt(a.querySelector("#ai-duration").value, 10),
      aspectRatio: a.querySelector("#ai-aspect").value,
      quality: a.querySelector("#ai-quality").value
    });
  }), i.addEventListener("click", () => {
    r && r({
      type: "image-to-video",
      file: d.files[0] || null,
      prompt: a.querySelector("#ai-prompt").value,
      model: a.querySelector("#ai-model").value,
      duration: parseInt(a.querySelector("#ai-duration").value, 10)
    });
  }), s.addEventListener("click", () => {
    r && r({
      type: "music",
      prompt: a.querySelector("#ai-music-prompt").value
    });
  }), a;
}
function Me({ onAvatarReady: r }) {
  var m;
  const a = document.createElement("div");
  a.className = "avatar-generator p-4 rounded-xl glass", a.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">AI Talking Avatar</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Photo of Person</label>
        <div id="avatar-upload-zone"
          class="p-6 rounded-lg border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 transition-colors">
          <svg class="w-8 h-8 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <p class="text-gray-400 text-sm">Drop photo or click to upload</p>
          <p class="text-gray-600 text-xs">Clear face photo, PNG/JPG</p>
          <input type="file" id="avatar-file" accept="image/*" class="hidden">
        </div>
        <div id="avatar-preview" class="mt-2 hidden">
          <img id="avatar-preview-img" class="w-20 h-20 rounded-full object-cover mx-auto border-2 border-violet-500/50">
        </div>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Audio Source</label>
        <div class="flex gap-2">
          <input id="avatar-audio-url" type="url"
            class="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
            placeholder="Audio URL or upload voice sample">
          <button id="avatar-upload-audio"
            class="px-3 py-2 rounded-lg bg-white/10 text-gray-400 text-sm hover:text-white hover:bg-white/20 transition-colors">
            Upload
          </button>
        </div>
        <input type="file" id="avatar-audio-file" accept="audio/*" class="hidden">
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Or Enter Text (TTS)</label>
        <textarea id="avatar-text" rows="2"
          class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
          placeholder="Hi, I'm excited to show you..."></textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Model</label>
          <select id="avatar-model"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="kling-v2-avatar-pro">Kling Avatar Pro</option>
            <option value="wan2.2-speech-to-video">Wan 2.2 Speech→Video</option>
            <option value="infinitetalk-image-to-video">InfiniteTalk</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Duration</label>
          <select id="avatar-duration"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="5">5 seconds</option>
            <option value="10" selected>10 seconds</option>
            <option value="15">15 seconds</option>
          </select>
        </div>
      </div>
      
      <button id="generate-avatar-btn"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Generate Talking Avatar
      </button>
    </div>
    
    <div id="avatar-result" class="mt-4 hidden">
      <label class="block text-xs text-gray-500 mb-2">Generated Avatar Video</label>
      <video id="avatar-video" controls class="w-full rounded-lg border border-white/10"></video>
      <div class="flex gap-2 mt-3">
        <button id="avatar-download" class="flex-1 px-3 py-2 rounded-lg bg-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Download</button>
        <button id="avatar-use" class="flex-1 px-3 py-2 rounded-lg bg-violet-600 text-sm text-white font-semibold hover:bg-violet-500 transition-colors">Use in Editor</button>
      </div>
    </div>
  `;
  const e = a.querySelector("#avatar-upload-zone"), i = a.querySelector("#avatar-file"), s = a.querySelector("#avatar-preview"), c = a.querySelector("#avatar-preview-img"), d = a.querySelector("#avatar-audio-file"), n = a.querySelector("#avatar-audio-url"), u = a.querySelector("#avatar-upload-audio"), o = a.querySelector("#generate-avatar-btn"), t = a.querySelector("#avatar-result"), p = a.querySelector("#avatar-video");
  e.addEventListener("click", () => i.click()), e.addEventListener("dragover", (v) => v.preventDefault()), e.addEventListener("drop", (v) => {
    v.preventDefault(), v.dataTransfer.files.length && l(v.dataTransfer.files[0]);
  }), i.addEventListener("change", () => {
    i.files.length && l(i.files[0]);
  });
  function l(v) {
    c.src = URL.createObjectURL(v), s.classList.remove("hidden");
  }
  return u.addEventListener("click", () => d.click()), d.addEventListener("change", () => {
    d.files.length && (n.value = URL.createObjectURL(d.files[0]));
  }), o.addEventListener("click", () => {
    o.disabled = !0, o.textContent = "Generating...", setTimeout(() => {
      t.classList.remove("hidden"), o.disabled = !1, o.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Talking Avatar';
    }, 3e3);
  }), (m = a.querySelector("#avatar-use")) == null || m.addEventListener("click", () => {
    r && r({
      videoUrl: p.src,
      photoUrl: c.src,
      audioUrl: n.value,
      text: a.querySelector("#avatar-text").value
    });
  }), a;
}
function qe({ contacts: r, onGenerate: a, onComplete: e }) {
  let i = r || [], s = !1, c = { current: 0, total: 0, results: [] };
  const d = document.createElement("div");
  d.className = "batch-generator p-4 rounded-xl glass";
  function n() {
    d.innerHTML = `
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Batch Video Generator</h3>
      
      <div class="space-y-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Contacts (CSV or paste)</label>
          <textarea id="batch-contacts" rows="4"
            class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500 font-mono"
            placeholder="FIRSTNAME,EMAIL,COMPANY
John,john@acme.com,Acme Inc
Jane,jane@widget.co,Widget Co">${i.map((p) => Object.values(p).join(",")).join(`
`)}</textarea>
          <p class="text-xs text-gray-600 mt-1">First row is headers. Each subsequent row is a contact.</p>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Video Template</label>
            <select id="batch-template"
              class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
              <option value="intro">AI Intro</option>
              <option value="outreach">Sales Outreach</option>
              <option value="followup">Follow Up</option>
              <option value="demo">Product Demo</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Background</label>
            <select id="batch-bg"
              class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
              <option value="ai">AI Generated</option>
              <option value="website">Prospect Website</option>
              <option value="solid">Solid Color</option>
            </select>
          </div>
        </div>
        
        <button id="parse-contacts-btn"
          class="w-full p-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
          Parse Contacts
        </button>
        
        <div id="batch-parsed" class="hidden">
          <div class="flex items-center justify-between mb-2">
            <span id="batch-count" class="text-sm text-gray-400">0 contacts</span>
            <span id="batch-status" class="text-xs text-gray-600"></span>
          </div>
          <div id="batch-preview" class="max-h-32 overflow-y-auto space-y-1"></div>
        </div>
        
        <button id="batch-start-btn"
          class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          ${i.length === 0 ? "disabled" : ""}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Generate ${i.length} Videos
        </button>
      </div>
      
      ${s || c.results.length > 0 ? `
        <div class="mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-500">Progress</span>
            <span class="text-xs text-gray-400">${c.current}/${c.total}</span>
          </div>
          <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-violet-500 rounded-full transition-all" style="width: ${c.total ? c.current / c.total * 100 : 0}%"></div>
          </div>
          
          ${c.results.length > 0 ? `
            <div class="mt-3 max-h-40 overflow-y-auto space-y-1">
              ${c.results.map((p) => `
                <div class="flex items-center justify-between p-2 rounded bg-white/5 text-xs">
                  <span class="text-gray-400">${p.name}</span>
                  <span class="${p.success ? "text-green-400" : "text-red-400"}">${p.success ? "✓ Generated" : "✗ Failed"}</span>
                </div>
              `).join("")}
            </div>
          ` : ""}
        </div>
      ` : ""}
    `;
    const u = d.querySelector("#parse-contacts-btn"), o = d.querySelector("#batch-start-btn"), t = d.querySelector("#batch-contacts");
    u == null || u.addEventListener("click", () => {
      const p = t.value.trim().split(`
`).filter((h) => h.trim());
      if (p.length < 2) return;
      const l = p[0].split(",").map((h) => h.trim().toUpperCase());
      i = p.slice(1).map((h) => {
        const b = h.split(",").map((y) => y.trim()), x = {};
        return l.forEach((y, S) => {
          x[y] = b[S] || "";
        }), x;
      });
      const m = d.querySelector("#batch-parsed"), v = d.querySelector("#batch-count"), g = d.querySelector("#batch-preview");
      m.classList.remove("hidden"), v.textContent = `${i.length} contacts`, g.innerHTML = i.slice(0, 5).map(
        (h) => `<div class="text-xs text-gray-500 p-1 rounded bg-white/5">${h.FIRSTNAME || h.NAME || Object.values(h)[0]} - ${h.EMAIL || ""}</div>`
      ).join(""), o.disabled = !1, o.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate ${i.length} Videos`;
    }), o == null || o.addEventListener("click", async () => {
      if (!(!i.length || s)) {
        s = !0, c = { current: 0, total: i.length, results: [] }, n();
        for (let p = 0; p < i.length; p++) {
          const l = i[p];
          try {
            a && await a(l, p), c.results.push({ name: l.FIRSTNAME || l.NAME || `Contact ${p + 1}`, success: !0 });
          } catch {
            c.results.push({ name: l.FIRSTNAME || l.NAME || `Contact ${p + 1}`, success: !1 });
          }
          c.current = p + 1, n();
        }
        s = !1, e && e(c.results), n();
      }
    });
  }
  return n(), d;
}
function je({ onScriptGenerated: r }) {
  var d, n;
  let a = "";
  const e = document.createElement("div");
  e.className = "script-writer p-4 rounded-xl glass", e.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">AI Script Writer</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Topic / Purpose</label>
        <textarea id="script-topic" rows="2"
          class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
          placeholder="A sales introduction for a SaaS product that helps teams collaborate..."></textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Tone</label>
          <select id="script-tone"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="authoritative">Authoritative</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Length</label>
          <select id="script-length"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="15">15 seconds</option>
            <option value="30" selected>30 seconds</option>
            <option value="60">60 seconds</option>
            <option value="90">90 seconds</option>
            <option value="120">2 minutes</option>
          </select>
        </div>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Include (optional)</label>
        <input id="script-include" type="text"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          placeholder="Mention our free trial, mention {{FIRSTNAME}}, call to action...">
      </div>
      
      <button id="generate-script-btn"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Generate Script
      </button>
    </div>
    
    <div id="script-result" class="mt-4 hidden">
      <label class="block text-xs text-gray-500 mb-2">Generated Script</label>
      <div id="script-output" class="p-4 rounded-lg bg-black/30 text-white text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]"></div>
      <div class="flex gap-2 mt-3">
        <button id="copy-script" class="flex-1 px-3 py-2 rounded-lg bg-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
        <button id="use-script" class="flex-1 px-3 py-2 rounded-lg bg-violet-600 text-sm text-white font-semibold hover:bg-violet-500 transition-colors">Use Script</button>
      </div>
    </div>
  `;
  const i = e.querySelector("#generate-script-btn"), s = e.querySelector("#script-result"), c = e.querySelector("#script-output");
  return i.addEventListener("click", () => {
    const u = e.querySelector("#script-topic").value, o = e.querySelector("#script-tone").value;
    e.querySelector("#script-length").value;
    const t = e.querySelector("#script-include").value;
    u.trim() && (i.disabled = !0, i.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...', setTimeout(() => {
      const p = {
        professional: `Hi {{FIRSTNAME}}, I hope this message finds you well. I wanted to reach out because ${u}. I'd love to show you how this could benefit your team. ${t || "Would you be open to a quick call this week?"}`,
        friendly: `Hey {{FIRSTNAME}}! I came across your profile and thought of you right away. ${u} I think you'd really love what we're building. ${t || "Want to check it out?"}`,
        casual: `Hey {{FIRSTNAME}}, quick question — ${u}? I built something that makes this super easy. ${t || "Happy to show you a quick demo if you're interested."}`,
        enthusiastic: `{{FIRSTNAME}}, this is exciting! ${u} and the results have been incredible. ${t || "I'd love for you to see it in action. Are you free for a quick chat?"}`,
        authoritative: `{{FIRSTNAME}}, after working with hundreds of teams, we've found that ${u}. ${t || "I'd like to share our findings with you. When would be a good time to connect?"}`
      };
      a = p[o] || p.professional, c.textContent = a, s.classList.remove("hidden"), i.disabled = !1, i.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Script';
    }, 1500));
  }), (d = e.querySelector("#copy-script")) == null || d.addEventListener("click", () => {
    navigator.clipboard.writeText(a), e.querySelector("#copy-script").textContent = "Copied!", setTimeout(() => e.querySelector("#copy-script").textContent = "Copy", 2e3);
  }), (n = e.querySelector("#use-script")) == null || n.addEventListener("click", () => {
    r && r(a);
  }), e.getScript = () => a, e;
}
function Ae({ onVoiceGenerated: r }) {
  var t;
  let a = null;
  const e = document.createElement("div");
  e.className = "voice-clone p-4 rounded-xl glass", e.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">AI Voice Cloning</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Voice Sample (30+ seconds)</label>
        <div id="voice-upload-zone"
          class="p-6 rounded-lg border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 transition-colors">
          <svg class="w-8 h-8 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
          </svg>
          <p class="text-gray-400 text-sm">Drop audio file or click to upload</p>
          <p class="text-gray-600 text-xs">MP3, WAV, M4A - minimum 30 seconds</p>
          <input type="file" id="voice-file" accept="audio/*" class="hidden">
        </div>
        <p id="voice-file-name" class="text-xs text-gray-500 mt-1 hidden"></p>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Text to Speak</label>
        <textarea id="voice-text" rows="3"
          class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
          placeholder="Hi {{FIRSTNAME}}, I wanted to reach out personally..."></textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Model</label>
          <select id="voice-model"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="minimax-voice-clone">MiniMax Voice Clone</option>
            <option value="minimax-speech-2.6-hd">MiniMax Speech 2.6 HD</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Speed</label>
          <select id="voice-speed"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="0.8">Slow</option>
            <option value="1.0" selected>Normal</option>
            <option value="1.2">Fast</option>
          </select>
        </div>
      </div>
      
      <button id="generate-voice-btn"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Generate Cloned Voice
      </button>
    </div>
    
    <div id="voice-result" class="mt-4 hidden">
      <label class="block text-xs text-gray-500 mb-2">Generated Audio</label>
      <audio id="voice-audio" controls class="w-full rounded-lg"></audio>
      <div class="flex gap-2 mt-3">
        <button id="voice-download" class="flex-1 px-3 py-2 rounded-lg bg-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Download</button>
        <button id="voice-use" class="flex-1 px-3 py-2 rounded-lg bg-violet-600 text-sm text-white font-semibold hover:bg-violet-500 transition-colors">Use Audio</button>
      </div>
    </div>
  `;
  const i = e.querySelector("#voice-upload-zone"), s = e.querySelector("#voice-file"), c = e.querySelector("#voice-file-name"), d = e.querySelector("#generate-voice-btn"), n = e.querySelector("#voice-result"), u = e.querySelector("#voice-audio");
  i.addEventListener("click", () => s.click()), i.addEventListener("dragover", (p) => {
    p.preventDefault(), i.classList.add("border-violet-500");
  }), i.addEventListener("dragleave", () => {
    i.classList.remove("border-violet-500");
  }), i.addEventListener("drop", (p) => {
    p.preventDefault(), i.classList.remove("border-violet-500"), p.dataTransfer.files.length && o(p.dataTransfer.files[0]);
  }), s.addEventListener("change", () => {
    s.files.length && o(s.files[0]);
  });
  function o(p) {
    a = URL.createObjectURL(p), c.textContent = p.name, c.classList.remove("hidden");
  }
  return d.addEventListener("click", () => {
    e.querySelector("#voice-text").value.trim() && (d.disabled = !0, d.textContent = "Generating...", setTimeout(() => {
      n.classList.remove("hidden"), d.disabled = !1, d.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Cloned Voice';
    }, 2e3));
  }), (t = e.querySelector("#voice-use")) == null || t.addEventListener("click", () => {
    r && r({
      audioUrl: u.src,
      text: e.querySelector("#voice-text").value,
      sampleUrl: a
    });
  }), e;
}
function Ie({ showBackButton: r = !0, onBackClick: a, theme: e = {} }) {
  const i = document.createElement("header");
  i.className = "brand-header flex items-center justify-between p-4 border-b border-gray-800";
  const c = { ...{
    name: "RemixGo",
    logo: "/logo.png",
    colors: {
      primary: "#8b5cf6",
      light: "#ffffff",
      accent: "#ec4899"
    }
  }, ...e };
  function d() {
    i.innerHTML = `
      <div class="flex items-center gap-4">
        ${r ? `
          <button class="back-button flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                  aria-label="Back to main app">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span class="back-text">Back to ${c.name}</span>
          </button>
        ` : ""}

        <div class="brand-info flex items-center gap-3">
          <img src="${c.logo}" alt="${c.name} logo" class="brand-logo w-8 h-8 rounded-lg" onerror="this.style.display='none'">
          <div>
            <h1 class="brand-name text-xl font-bold text-white">${c.name}</h1>
            <p class="brand-tagline text-sm text-gray-400">Video Editor</p>
          </div>
        </div>
      </div>

      <div class="header-actions flex items-center gap-3">
        <button class="notification-btn w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                title="Notifications">
          <i class="fa fa-bell"></i>
        </button>
        <button class="profile-btn w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                title="Profile">
          <i class="fa fa-user"></i>
        </button>
      </div>
    `, n();
  }
  function n() {
    const u = i.querySelector(".back-button");
    u && u.addEventListener("click", () => {
      a ? a() : window.location.href = "/";
    });
    const o = i.querySelector(".notification-btn");
    o && o.addEventListener("click", () => {
      console.log("Notifications clicked");
    });
    const t = i.querySelector(".profile-btn");
    t && t.addEventListener("click", () => {
      console.log("Profile clicked");
    });
  }
  return d(), i.api = {
    updateTheme: (u) => {
      Object.assign(c, u), d();
    }
  }, i;
}
function ze({ items: r, activeItem: a }) {
  const i = r || [
    { id: "getting-started", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "editor", label: "Video Editor", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { id: "landing-page", label: "Landing Pages", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "publisher", label: "Publish", icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" }
  ], s = a || (window.location.hash.slice(1) || "getting-started").split("?")[0], c = document.createElement("aside");
  c.className = "fixed left-0 top-14 bottom-0 w-56 bg-black/30 border-r border-white/5 overflow-y-auto z-40";
  const d = document.createElement("nav");
  d.className = "p-3 space-y-1", i.forEach((u) => {
    const o = u.id === s, t = document.createElement("a");
    t.href = `#${u.id}`, t.className = `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${o ? "bg-violet-600/20 text-violet-300" : "text-gray-400 hover:text-white hover:bg-white/5"}`, t.innerHTML = `
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${u.icon}"/>
      </svg>
      <span>${u.label}</span>
    `, d.appendChild(t);
  }), c.appendChild(d);
  const n = document.createElement("div");
  return n.className = "absolute bottom-0 left-0 right-0 p-3 border-t border-white/5", n.innerHTML = `
    <a href="https://github.com/deangilmoreremix/Open-Higgsfield-AI" target="_blank"
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      Higgsfield AI
    </a>
  `, c.appendChild(n), c;
}
function Pe({ steps: r, currentStep: a, onStepChange: e }) {
  const s = r || [
    { id: "source", label: "Source", description: "Upload or generate video" },
    { id: "edit", label: "Edit", description: "Add overlays and effects" },
    { id: "personalize", label: "Personalize", description: "Add tokens and campaigns" },
    { id: "publish", label: "Publish", description: "Share your video" }
  ], c = a || 0, d = document.createElement("div");
  return d.className = "wizard-stepper flex items-center justify-center gap-2 p-4", s.forEach((n, u) => {
    const o = u === c, t = u < c, p = document.createElement("div");
    p.className = "flex items-center";
    const l = document.createElement("button");
    l.className = `flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${o ? "bg-violet-600 text-white" : t ? "bg-green-600 text-white" : "bg-white/10 text-gray-500"}`, l.innerHTML = t ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>' : String(u + 1), l.title = n.label, l.addEventListener("click", () => {
      e && e(u, n);
    });
    const m = document.createElement("span");
    if (m.className = `ml-2 text-xs hidden sm:inline ${o ? "text-violet-300" : t ? "text-gray-400" : "text-gray-600"}`, m.textContent = n.label, p.appendChild(l), p.appendChild(m), u < s.length - 1) {
      const v = document.createElement("div");
      v.className = `w-8 sm:w-16 h-0.5 mx-2 ${t ? "bg-green-600" : "bg-white/10"}`, p.appendChild(v);
    }
    d.appendChild(p);
  }), d;
}
const Be = {
  state: {
    activeElement: null,
    project: null,
    checkpoints: [],
    currentCheckpoint: 0
  },
  setActiveElement(r) {
    this.state.activeElement = r;
  },
  getActiveElement() {
    return this.state.activeElement;
  },
  setProject(r) {
    this.state.project = r;
  },
  getProject() {
    return this.state.project;
  },
  addCheckpoint(r) {
    this.state.checkpoints.push(r);
  },
  setCurrentCheckpoint(r) {
    this.state.currentCheckpoint = r;
  },
  getCurrentCheckpoint() {
    return this.state.checkpoints[this.state.currentCheckpoint];
  }
}, Fe = {
  createProject(r, a = {}) {
    return {
      id: Date.now().toString(),
      name: r,
      settings: a,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  },
  updateProject(r, a) {
    return {
      ...r,
      ...a,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};
function He(r) {
  const a = Math.floor(r / 60), e = Math.floor(r % 60);
  return `${a}:${e.toString().padStart(2, "0")}`;
}
function Ne(r) {
  if (r === 0) return "0 Bytes";
  const a = 1024, e = ["Bytes", "KB", "MB", "GB"], i = Math.floor(Math.log(r) / Math.log(a));
  return parseFloat((r / Math.pow(a, i)).toFixed(2)) + " " + e[i];
}
function De(r, a) {
  let e;
  return function(...s) {
    const c = () => {
      clearTimeout(e), r(...s);
    };
    clearTimeout(e), e = setTimeout(c, a);
  };
}
function Re(r, a) {
  let e;
  return function() {
    const i = arguments, s = this;
    e || (r.apply(s, i), e = !0, setTimeout(() => e = !1, a));
  };
}
function Oe() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
function Ve(r) {
  return JSON.parse(JSON.stringify(r));
}
function Ue(r) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r);
}
function We(r) {
  return r.charAt(0).toUpperCase() + r.slice(1);
}
function Ge(r, a) {
  return r.length <= a ? r : r.slice(0, a) + "...";
}
const Ke = {
  themes: {
    default: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#06b6d4",
      background: "#111827",
      surface: "#1f2937",
      text: "#f9fafb",
      muted: "#6b7280"
    },
    dark: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#0f172a",
      surface: "#1e293b",
      text: "#f8fafc",
      muted: "#64748b"
    },
    light: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b",
      muted: "#64748b"
    }
  },
  currentTheme: "default",
  setTheme(r) {
    this.themes[r] && (this.currentTheme = r, this.applyTheme(this.themes[r]));
  },
  applyTheme(r) {
    const a = document.documentElement;
    Object.entries(r).forEach(([e, i]) => {
      a.style.setProperty(`--color-${e}`, i);
    });
  },
  getCurrentTheme() {
    return this.themes[this.currentTheme];
  },
  customizeTheme(r) {
    return { ...this.getCurrentTheme(), ...r };
  }
}, te = {
  alerts: [],
  show(r, a = "info", e = 5e3) {
    const i = {
      id: Date.now().toString(),
      message: r,
      type: a,
      duration: e
    };
    return this.alerts.push(i), this.renderAlert(i), e > 0 && setTimeout(() => {
      this.remove(i.id);
    }, e), i.id;
  },
  success(r, a) {
    return this.show(r, "success", a);
  },
  error(r, a) {
    return this.show(r, "error", a);
  },
  warning(r, a) {
    return this.show(r, "warning", a);
  },
  info(r, a) {
    return this.show(r, "info", a);
  },
  remove(r) {
    this.alerts = this.alerts.filter((e) => e.id !== r);
    const a = document.querySelector(`[data-alert-id="${r}"]`);
    a && a.remove();
  },
  clear() {
    this.alerts.forEach((r) => this.remove(r.id));
  },
  renderAlert(r) {
    const a = this.getContainer(), e = document.createElement("div");
    e.className = `alert alert-${r.type} fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm`, e.setAttribute("data-alert-id", r.id);
    const i = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-black",
      info: "bg-blue-500 text-white"
    };
    e.classList.add(...i[r.type].split(" ")), e.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${r.message}</span>
        <button class="ml-4 text-current hover:opacity-75" onclick="alertService.remove('${r.id}')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `, a.appendChild(e), setTimeout(() => {
      e.style.transform = "translateX(0)", e.style.opacity = "1";
    }, 10);
  },
  getContainer() {
    let r = document.getElementById("alert-container");
    return r || (r = document.createElement("div"), r.id = "alert-container", r.className = "fixed top-4 right-4 z-50 space-y-2", document.body.appendChild(r)), r;
  }
};
window.alertService = te;
class O {
  constructor(a, e = {}) {
    this.container = a, this.options = {
      theme: "dark",
      ...e
    }, this.components = /* @__PURE__ */ new Map(), this.initialize();
  }
  initialize() {
    this.container.innerHTML = `
      <div class="remix-go-app w-full h-screen bg-gray-900 flex flex-col">
        <div id="app-header" class="flex-shrink-0"></div>
        <div id="app-main" class="flex-1 flex overflow-hidden">
          <div id="app-sidebar" class="flex-shrink-0"></div>
          <div id="app-content" class="flex-1 overflow-hidden"></div>
        </div>
        <div id="app-footer" class="flex-shrink-0"></div>
      </div>
    `, this.applyTheme();
  }
  applyTheme() {
    document.documentElement.classList.toggle("dark", this.options.theme === "dark");
  }
  // Component management
  mount(a, e, i = "#app-content") {
    const s = this.container.querySelector(i);
    s && (s.innerHTML = "", s.appendChild(e), this.components.set(a, e));
  }
  getComponent(a) {
    return this.components.get(a);
  }
  // Utility methods
  showModal(a) {
    var s;
    const e = document.createElement("div");
    e.className = "fixed inset-0 z-50 flex items-center justify-center", e.appendChild(a), document.body.appendChild(e);
    const i = (s = a.api) == null ? void 0 : s.close;
    i && (a.api.close = () => {
      i(), document.body.removeChild(e);
    });
  }
  // Lifecycle methods
  destroy() {
    this.components.forEach((a) => {
      var e;
      (e = a.api) != null && e.destroy && a.api.destroy();
    }), this.components.clear();
  }
}
function oe(r, a = {}) {
  return new O(r, a);
}
const Ze = {
  RemixGoVanilla: O,
  createRemixGoApp: oe
  // All component exports are available as named exports
};
export {
  ue as AIContentGenerator,
  Te as AIGeneratePanel,
  xe as AlertModal,
  ce as AudioSelectionWorkspace,
  Me as AvatarGenerator,
  qe as BatchGenerator,
  ge as BehavioralAnalytics,
  Ie as BrandHeader,
  ve as CTABuilder,
  le as Checkpoint,
  ne as CheckpointsList,
  pe as CommandPalette,
  ye as ConfirmationModal,
  re as ConstructionScene,
  ae as ConstructionWorkspace,
  se as EnhancedVideoEditor,
  we as FilePickerModal,
  fe as FormBuilder,
  ke as HelpModal,
  $e as KeyboardShortcutsModal,
  he as NavigationBuilder,
  Se as OnboardingModal,
  Ee as PreviewModal,
  Le as ProgressModal,
  O as RemixGoVanilla,
  je as ScriptWriter,
  Ce as SettingsModal,
  ze as Sidebar,
  be as TemplateSystem,
  me as ThemeCustomizer,
  ie as VideoEditor,
  de as VideoSelectionWorkspace,
  Ae as VoiceClone,
  Pe as WizardStepper,
  te as alertService,
  We as capitalizeFirst,
  oe as createRemixGoApp,
  De as debounce,
  Ve as deepClone,
  Ze as default,
  Be as editorStateManager,
  He as formatDuration,
  Ne as formatFileSize,
  Oe as generateId,
  Ue as isValidEmail,
  Fe as projectUtils,
  Re as throttle,
  Ge as truncateText,
  Ke as whiteLabelSystem
};
