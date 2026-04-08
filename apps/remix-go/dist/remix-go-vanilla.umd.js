(function(y,F){typeof exports=="object"&&typeof module<"u"?F(exports):typeof define=="function"&&define.amd?define(["exports"],F):(y=typeof globalThis<"u"?globalThis:y||self,F(y.RemixGoVanilla={}))})(this,function(y){"use strict";function F({src:n,onOverlayAdd:s,onTimeUpdate:e}){const t=document.createElement("div");t.className="video-editor";let r=null,d=null;t.innerHTML=`
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
  `,r=t.querySelector("#editor-video"),d=t.querySelector("#overlay-container");const l=t.querySelector("#play-pause-btn"),a=t.querySelector("#timeline-slider"),u=t.querySelector("#current-time"),i=t.querySelector("#total-time"),o=t.querySelector("#timeline-overlays");n&&(r.src=n);function p(m){const v=Math.floor(m/60),g=Math.floor(m%60);return`${v}:${String(g).padStart(2,"0")}`}r.addEventListener("loadedmetadata",()=>{i.textContent=p(r.duration),a.max=r.duration}),r.addEventListener("timeupdate",()=>{u.textContent=p(r.currentTime),a.value=r.currentTime,e&&e(r.currentTime)});let c=!1;return l.addEventListener("click",()=>{c?(r.pause(),l.innerHTML='<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'):(r.play(),l.innerHTML='<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'),c=!c}),a.addEventListener("input",()=>{r.currentTime=parseFloat(a.value)}),t.setSource=m=>{r.src=m},t.addOverlayElement=m=>{const v=document.createElement("div");v.className="overlay-element absolute pointer-events-auto",v.style.top=m.top||"10%",v.style.left=m.left||"10%",v.style.width=m.width||"80%",v.dataset.overlayId=m.id,m.type==="text"?v.innerHTML=`<p class="text-white text-lg font-bold" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8)">${m.text||"Text"}</p>`:m.type==="image"?v.innerHTML=`<img src="${m.src}" class="w-full rounded" alt="overlay">`:m.type==="cta"&&(v.innerHTML=`<a href="${m.href||"#"}" class="inline-block px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-500">${m.text||"Click Here"}</a>`),d.appendChild(v);const g=document.createElement("div");g.className="h-full rounded bg-violet-500/50 text-white text-xs flex items-center px-1 truncate",g.style.minWidth="40px",g.style.flex="1",g.textContent=m.type||"overlay",g.dataset.overlayId=m.id,o.appendChild(g)},t.getVideo=()=>r,t.getOverlayContainer=()=>d,t}const Y=()=>Promise.resolve().then(()=>Je);function Z({src:n,onOverlayAdd:s,onTimeUpdate:e,project:t}){const r=document.createElement("div");r.className="enhanced-video-editor flex flex-col h-full";let d=null,l=null,a=0,u=0,i=!1,o=1,p=new Set,c=(t==null?void 0:t.overlays)||[],m=1,v=null;r.innerHTML=`
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
  `,d=r.querySelector("#editor-video"),l=r.querySelector("#overlay-container"),n&&(d.src=n);const g=r.querySelector("#timeline-slider"),f=r.querySelector("#current-time"),h=r.querySelector("#total-time"),b=r.querySelector("#playhead"),w=r.querySelector("#video-playhead");r.querySelector("#tracks-wrapper");const E=r.querySelector("#time-ruler");x(),C(),A(),P(),Xe(),d.addEventListener("loadedmetadata",()=>{u=d.duration,h.textContent=L(u),g.max=u,k(),M()}),d.addEventListener("timeupdate",()=>{v||(a=d.currentTime,f.textContent=L(a),g.value=a,M()),e&&e(a)}),d.addEventListener("play",()=>{i=!0,$()}),d.addEventListener("pause",()=>{i=!1,$()}),d.addEventListener("ended",()=>{i=!1,$()});function L(S){const T=Math.floor(S/3600),I=Math.floor(S%3600/60),q=Math.floor(S%60),j=Math.floor(S%1*100);return T>0?`${T}:${String(I).padStart(2,"0")}:${String(q).padStart(2,"0")}.${String(j).padStart(2,"0")}`:`${I}:${String(q).padStart(2,"0")}.${String(j).padStart(2,"0")}`}function $(){const S=r.querySelector("#play-pause-btn");i?S.innerHTML='<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>':S.innerHTML='<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'}function M(){if(!E)return;const S=E.offsetWidth-128,T=a/u,I=128+T*S;b.style.left=`${I}px`,w.style.left=`${T*100}%`}function x(){k()}function k(){const S=r.querySelector("#ruler-marks");if(!S)return;S.innerHTML="";const T=E.offsetWidth-128,I=Math.max(1,Math.floor(10/m)),q=I/10;for(let j=0;j<=u;j+=q){const z=128+j/u*T;if(j%I===0){const B=document.createElement("div");B.className="absolute top-0 bottom-0 w-px bg-white/30",B.style.left=`${z}px`;const H=document.createElement("div");H.className="absolute top-0 text-xs text-white transform -translate-x-1/2",H.style.left=`${z}px`,H.textContent=L(j).split(".")[0],S.appendChild(B),S.appendChild(H)}else{const B=document.createElement("div");B.className="absolute top-2 bottom-2 w-px bg-white/10",B.style.left=`${z}px`,S.appendChild(B)}}}function C(){const S=r.querySelector("#play-pause-btn"),T=r.querySelector("#volume-slider"),I=r.querySelector("#speed-select");S.addEventListener("click",()=>{i?d.pause():d.play()}),g.addEventListener("input",q=>{const j=parseFloat(q.target.value);d.currentTime=j,a=j,f.textContent=L(j),M()}),g.addEventListener("mousedown",()=>{v=!0}),g.addEventListener("mouseup",()=>{v=!1}),T.addEventListener("input",q=>{d.volume=parseFloat(q.target.value)}),I.addEventListener("change",q=>{o=parseFloat(q.target.value),d.playbackRate=o})}function A(){const S=r.querySelector("#zoom-in"),T=r.querySelector("#zoom-out"),I=r.querySelector("#zoom-fit"),q=r.querySelector("#zoom-level");S.addEventListener("click",()=>{m=Math.min(m*1.5,10),j()}),T.addEventListener("click",()=>{m=Math.max(m/1.5,.1),j()}),I.addEventListener("click",()=>{m=1,j()});function j(){q.textContent=`${Math.round(m*100)}%`,k(),P()}const z=r.querySelector("#tracks-container");z.addEventListener("scroll",()=>{z.scrollLeft})}function P(){const S=r.querySelector("#overlay-tracks");S.innerHTML="",c.forEach((T,I)=>{const q=document.createElement("div");q.className="track overlay-track h-16 bg-white/5 border-b border-white/5 relative",q.dataset.overlayId=T.id,q.innerHTML=`
        <div class="track-header absolute left-0 top-0 bottom-0 w-32 bg-white/10 flex items-center px-3 border-r border-white/10">
          <span class="text-sm text-white font-medium">${T.type||"Overlay"} ${I+1}</span>
        </div>
        <div class="overlay-track-content absolute left-32 right-0 top-0 bottom-0 relative">
          <div class="overlay-segment absolute top-2 bottom-2 bg-violet-500/30 rounded border border-violet-500/50 cursor-pointer hover:bg-violet-500/40"
               style="left: ${T.start/u*100}%; width: ${(T.end-T.start)/u*100}%">
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs text-white font-medium truncate px-2">${T.text||T.type}</span>
            </div>
            <!-- Resize handles -->
            <div class="resize-handle left-0 top-0 bottom-0 w-2 bg-violet-400 cursor-ew-resize absolute"></div>
            <div class="resize-handle right-0 top-0 bottom-0 w-2 bg-violet-400 cursor-ew-resize absolute"></div>
          </div>
        </div>
      `,q.querySelector(".overlay-segment").addEventListener("click",z=>{z.shiftKey||p.clear(),p.add(T.id),_e()}),S.appendChild(q)})}function _e(){r.querySelectorAll(".overlay-segment").forEach(S=>{const T=S.closest(".track").dataset.overlayId;p.has(T)?S.classList.add("ring-2","ring-violet-400"):S.classList.remove("ring-2","ring-violet-400")})}r.setSource=S=>{d&&(d.src=S,i=!1,a=0,$(),M())},r.addOverlay=S=>{c.push(S),P(),s&&s(S)},r.removeOverlay=S=>{c=c.filter(T=>T.id!==S),P()},r.updateOverlay=(S,T)=>{const I=c.findIndex(q=>q.id===S);I>-1&&(c[I]={...c[I],...T},P())};async function Xe(){try{const S=r.querySelector("#export-container");if(S){const I=(await Y()).default,q=I({project:t,onExportComplete:j=>{console.log("Video export completed:",j)},onExportError:j=>{console.error("Video export failed:",j)}});S.appendChild(q)}}catch(S){console.error("Failed to initialize video export:",S)}}return r.getCurrentTime=()=>a,r.getDuration=()=>u,r.getVideo=()=>d,r.getOverlayContainer=()=>l,r}function Q({onElementSelect:n,onElementUpdate:s,onSeek:e}){const t={popcorn:null,activeElement:null,currentCheckpoint:null},r=document.createElement("div");r.className="construction-workspace w-full h-full bg-gray-900 relative";function d(o){if(window.Popcorn){const p=Popcorn(o);return p.main=!0,p.on("elementSelected",c=>{const{element:m}=c;t.activeElement=m,n&&n(m)}),p.on("elementUpdated",c=>{const{element:m,options:v}=c;s&&s(m,v)}),t.popcorn=p,p}else return console.warn("Popcorn.js not loaded"),null}function l(o){t.popcorn&&(t.popcorn.seek(o),t.currentCheckpoint=o,e&&e(o))}function a(){t.activeElement=null,t.popcorn&&t.popcorn.emit("elementSelected",{element:null})}function u(){r.innerHTML=`
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
          Current: ${t.currentCheckpoint||"00:00"}
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
    `,i()}function i(){const o=r.querySelector("#popcorn-wrapper");o&&setTimeout(()=>{const p=d(o);p&&p.on("timeupdate",()=>{})},100),r.addEventListener("click",p=>{p.target===r&&a()}),r.querySelectorAll(".checkpoint-item").forEach(p=>{p.addEventListener("click",()=>{const c=p.dataset.time;l(c)})})}return u(),r.api={seekToCheckpoint:l,resignActiveElement:a,getActiveElement:()=>t.activeElement,getCurrentCheckpoint:()=>t.currentCheckpoint,getPopcorn:()=>t.popcorn},r}function J({onPopcornInitialize:n}){const s=document.createElement("div");s.className="construction-scene w-full h-full bg-gray-900";let e=null,t=null,r=null;function d(){t&&n&&n(t)}function l(){r&&r()}function a(){s.innerHTML=`
      <div class="embed-wrapper w-full h-full relative">
        <div id="video-container-scene" class="construction-container w-full h-full" data-butter="target">
          <div class="popcorn-wrapper w-full h-full"></div>
        </div>
      </div>
    `,e=s.querySelector(".embed-wrapper"),t=s.querySelector(".popcorn-wrapper"),setTimeout(()=>{d(),window.videoResizer&&(r=window.videoResizer(e)),window.addEventListener("resize",l),l()},100)}function u(){window.removeEventListener("resize",l)}return a(),s.addEventListener("remove",u),s.api={sceneResize:l,getPopcornWrapper:()=>t,getEmbedWrapper:()=>e},s}function _({checkpoints:n=[],onCheckpointSelect:s}){const e=document.createElement("div");e.className="checkpoints-list w-full bg-gray-900 border-t border-gray-800";function t(){e.innerHTML=`
      <div class="thumbnail-canvas w-full">
        <div class="thumbnail-canvas-scroll flex gap-2 p-4 overflow-x-auto">
          ${n.map((l,a)=>`
            <div class="thumbnail-wrapper flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                 data-checkpoint="${l}"
                 data-index="${a}">
              <div class="w-24 h-16 bg-gray-800 rounded-lg border border-gray-700 hover:border-violet-500 flex items-center justify-center">
                <div class="text-center">
                  <i class="fa fa-play text-gray-400 text-sm mb-1"></i>
                  <div class="text-xs text-gray-400">${r(l)}</div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `,d()}function r(l){const a=Math.floor(l/60),u=Math.floor(l%60);return`${a}:${u.toString().padStart(2,"0")}`}function d(){e.querySelectorAll(".thumbnail-wrapper").forEach(l=>{l.addEventListener("click",()=>{const a=parseFloat(l.dataset.checkpoint);s&&s(a)})})}return t(),e.api={updateCheckpoints:l=>{n=l,t()}},e}function X({at:n,className:s=""}){const e=document.createElement("div");e.className=`checkpoint thumbnail-container ${s}`;let t=null,r=null,d=null;function l(){r&&window.Popcorn&&(Popcorn(r).seek(n),window.videoResizer&&(d=window.videoResizer(t,2)),window.addEventListener("resize",a),a())}function a(){d&&d()}function u(){e.innerHTML=`
      <div class="wrapper embed w-full h-full bg-gray-800 rounded-lg overflow-hidden">
        <div id="video-container-${n}" class="construction-container w-full h-full" data-butter="target">
          <div class="popcorn-wrapper w-full h-full"></div>
        </div>
      </div>
    `,t=e.querySelector(".embed"),r=e.querySelector(".popcorn-wrapper"),setTimeout(()=>{l()},100)}function i(){window.removeEventListener("resize",a)}return u(),e.addEventListener("remove",i),e}function ee({onVideoSelected:n,className:s=""}){const e={scope:"library",library:{hasMore:!0,elements:[],query:"",loading:!1},uploads:{hasMore:!0,elements:[],query:"",loading:!1},currentPlayback:null},t=document.createElement("div");t.className=`video-selection-workspace ${s}`;function r(u,i="",o=0){const p=e[u];p.loading||(p.loading=!0,l(),setTimeout(()=>{const c=Array.from({length:12},(v,g)=>({id:`${u}-${o+g}`,title:`Video ${o+g+1}`,url:`https://example.com/video-${o+g}.mp4`,thumbnail:`https://images.unsplash.com/photo-${15e11+o+g}?w=400&h=225&fit=crop`,duration:Math.floor(Math.random()*300)+30,createdAt:new Date(Date.now()-Math.random()*30*24*60*60*1e3).toISOString()})),m=i?c.filter(v=>v.title.toLowerCase().includes(i.toLowerCase())):c;o===0?p.elements=m:p.elements=[...p.elements,...m],p.hasMore=m.length>=12,p.loading=!1,l()},1e3))}function d(u,i){const o=document.createElement("div");o.className="fixed inset-0 z-50 flex items-center justify-center bg-black/75",o.innerHTML=`
      <div class="bg-gray-900 rounded-xl p-6 max-w-4xl w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-white">${u}</h3>
          <button class="text-gray-400 hover:text-white text-xl" id="close-preview">&times;</button>
        </div>
        <video class="w-full rounded-lg" controls autoplay>
          <source src="${i}" type="video/mp4">
        </video>
      </div>
    `,document.body.appendChild(o),o.querySelector("#close-preview").addEventListener("click",()=>{document.body.removeChild(o)})}function l(){const u=e[e.scope];t.innerHTML=`
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div class="flex bg-gray-800 rounded-lg p-1">
            <button class="px-4 py-2 rounded text-sm font-medium transition-colors ${e.scope==="library"?"bg-violet-600 text-white":"text-gray-400 hover:text-white"}"
                    data-scope="library">
              Library
            </button>
            <button class="px-4 py-2 rounded text-sm font-medium transition-colors ${e.scope==="uploads"?"bg-violet-600 text-white":"text-gray-400 hover:text-white"}"
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
          ${u.elements.map((i,o)=>`
            <div class="video-item bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-violet-500 transition-all cursor-pointer group">
              <div class="aspect-video bg-gray-700 relative overflow-hidden">
                <img src="${i.thumbnail}" alt="${i.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button class="preview-btn w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                          data-url="${i.url}" data-title="${i.title}">
                    <i class="fa fa-play text-white"></i>
                  </button>
                </div>
                <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  ${Math.floor(i.duration/60)}:${(i.duration%60).toString().padStart(2,"0")}
                </div>
              </div>
              <div class="p-3">
                <h4 class="text-sm font-medium text-white truncate">${i.title}</h4>
                <p class="text-xs text-gray-500 mt-1">${new Date(i.createdAt).toLocaleDateString()}</p>
                <div class="flex gap-2 mt-2">
                  <button class="use-btn flex-1 bg-violet-600 text-white text-xs py-1.5 rounded hover:bg-violet-500 transition-colors"
                          data-video-id="${i.id}">
                    Use Video
                  </button>
                  ${e.scope==="uploads"?`
                    <input type="text" value="${i.title}" class="rename-input flex-1 px-2 py-1 bg-gray-700 border border-gray-600 text-white text-xs rounded focus:outline-none focus:border-violet-500"
                           data-video-id="${i.id}">
                  `:""}
                </div>
              </div>
            </div>
          `).join("")}

          ${u.hasMore?`
            <div class="load-more col-span-full flex justify-center py-8">
              <button class="load-more-btn px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors ${u.loading?"opacity-50 cursor-not-allowed":""}"
                      ${u.loading?"disabled":""}>
                ${u.loading?'<i class="fa fa-spinner fa-spin mr-2"></i>Loading...':'<i class="fa fa-plus mr-2"></i>Load More'}
              </button>
            </div>
          `:""}
        </div>

        ${u.elements.length===0&&!u.loading?`
          <div class="text-center py-20">
            <div class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-video text-gray-600 text-2xl"></i>
            </div>
            <h3 class="text-lg text-white font-medium mb-2">No videos found</h3>
            <p class="text-sm text-gray-500">Try adjusting your search or upload some videos</p>
          </div>
        `:""}
      </div>
    `,a()}function a(){t.querySelectorAll("[data-scope]").forEach(o=>{o.addEventListener("click",()=>{const p=o.dataset.scope;p!==e.scope&&(e.scope=p,e[p].elements.length===0&&r(p),l())})});const u=t.querySelector("#search-input");u&&u.addEventListener("input",o=>{const p=o.target.value;e[e.scope].query=p,r(e.scope,p)}),t.querySelectorAll(".preview-btn").forEach(o=>{o.addEventListener("click",p=>{p.stopPropagation();const c=o.dataset.url,m=o.dataset.title;d(m,c)})}),t.querySelectorAll(".use-btn").forEach(o=>{o.addEventListener("click",p=>{p.stopPropagation();const c=o.dataset.videoId,m=e[e.scope].elements.find(v=>v.id===c);m&&n&&n(m)})}),t.querySelectorAll(".rename-input").forEach(o=>{o.addEventListener("blur",async p=>{const c=o.dataset.videoId,m=p.target.value;console.log("Renaming video",c,"to",m)})});const i=t.querySelector(".load-more-btn");i&&i.addEventListener("click",()=>{r(e.scope,e[e.scope].query,e[e.scope].elements.length)})}return r(e.scope),l(),t.api={loadVideos:r,getCurrentScope:()=>e.scope,getVideos:u=>{var i;return((i=e[u])==null?void 0:i.elements)||[]}},t}function te({onAudioSelected:n,className:s=""}){const e={scope:"library",library:{hasMore:!0,elements:[],query:"",loading:!1},uploads:{hasMore:!0,elements:[],query:"",loading:!1}},t=document.createElement("div");t.className=`audio-selection-workspace ${s}`;function r(a,u="",i=0){const o=e[a];o.loading||(o.loading=!0,d(),setTimeout(()=>{const p=Array.from({length:12},(m,v)=>({id:`${a}-audio-${i+v}`,title:`Audio Track ${i+v+1}`,url:`https://example.com/audio-${i+v}.mp3`,duration:Math.floor(Math.random()*300)+30,type:["music","voice","effect"][Math.floor(Math.random()*3)],createdAt:new Date(Date.now()-Math.random()*30*24*60*60*1e3).toISOString()})),c=u?p.filter(m=>m.title.toLowerCase().includes(u.toLowerCase())):p;i===0?o.elements=c:o.elements=[...o.elements,...c],o.hasMore=c.length>=12,o.loading=!1,d()},1e3))}function d(){const a=e[e.scope];t.innerHTML=`
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div class="flex bg-gray-800 rounded-lg p-1">
            <button class="px-4 py-2 rounded text-sm font-medium transition-colors ${e.scope==="library"?"bg-violet-600 text-white":"text-gray-400 hover:text-white"}"
                    data-scope="library">
              Library
            </button>
            <button class="px-4 py-2 rounded text-sm font-medium transition-colors ${e.scope==="uploads"?"bg-violet-600 text-white":"text-gray-400 hover:text-white"}"
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
          ${a.elements.map((u,i)=>`
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
                    <span class="text-xs text-gray-500">${Math.floor(u.duration/60)}:${(u.duration%60).toString().padStart(2,"0")}</span>
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
                  ${e.scope==="uploads"?`
                    <input type="text" value="${u.title}" class="rename-input px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm rounded focus:outline-none focus:border-violet-500 w-32"
                           data-audio-id="${u.id}">
                  `:""}
                </div>
              </div>
            </div>
          `).join("")}

          ${a.hasMore?`
            <div class="load-more flex justify-center py-4">
              <button class="load-more-btn px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors ${a.loading?"opacity-50 cursor-not-allowed":""}"
                      ${a.loading?"disabled":""}>
                ${a.loading?'<i class="fa fa-spinner fa-spin mr-2"></i>Loading...':'<i class="fa fa-plus mr-2"></i>Load More'}
              </button>
            </div>
          `:""}
        </div>

        ${a.elements.length===0&&!a.loading?`
          <div class="text-center py-20">
            <div class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-music text-gray-600 text-2xl"></i>
            </div>
            <h3 class="text-lg text-white font-medium mb-2">No audio found</h3>
            <p class="text-sm text-gray-500">Try adjusting your search or upload some audio files</p>
          </div>
        `:""}
      </div>
    `,l()}function l(){t.querySelectorAll("[data-scope]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.scope;o!==e.scope&&(e.scope=o,e[o].elements.length===0&&r(o),d())})});const a=t.querySelector("#search-input");a&&a.addEventListener("input",i=>{const o=i.target.value;e[e.scope].query=o,r(e.scope,o)}),t.querySelectorAll(".play-btn").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const p=i.dataset.url;i.dataset.title;const c=new Audio(p);c.play(),i.innerHTML='<i class="fa fa-pause text-violet-400 text-xs"></i>',i.classList.add("playing"),c.onended=()=>{i.innerHTML='<i class="fa fa-play text-gray-400 text-xs"></i>',i.classList.remove("playing")}})}),t.querySelectorAll(".use-btn").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const p=i.dataset.audioId,c=e[e.scope].elements.find(m=>m.id===p);c&&n&&n(c)})}),t.querySelectorAll(".rename-input").forEach(i=>{i.addEventListener("blur",async o=>{const p=i.dataset.audioId,c=o.target.value;console.log("Renaming audio",p,"to",c)})});const u=t.querySelector(".load-more-btn");u&&u.addEventListener("click",()=>{r(e.scope,e[e.scope].query,e[e.scope].elements.length)})}return r(e.scope),d(),t.api={loadAudio:r,getCurrentScope:()=>e.scope,getAudio:a=>{var u;return((u=e[a])==null?void 0:u.elements)||[]}},t}function oe({onGenerate:n,onSave:s}){const e={contentType:"blog-post",prompt:"",tone:"professional",length:"medium",audience:"general",keywords:"",customInstructions:"",isGenerating:!1,generatedContent:"",contentHistory:[],selectedTemplate:null,showTemplates:!1},t=[{id:"blog-post",name:"Blog Post",icon:"fa-newspaper",description:"Complete blog article with introduction, body, and conclusion"},{id:"social-media",name:"Social Media Post",icon:"fa-share-alt",description:"Engaging posts for platforms like Twitter, Facebook, LinkedIn"},{id:"email",name:"Email Campaign",icon:"fa-envelope",description:"Marketing emails, newsletters, and promotional content"},{id:"product-description",name:"Product Description",icon:"fa-shopping-cart",description:"Detailed product descriptions with features and benefits"},{id:"headline",name:"Headlines & Titles",icon:"fa-heading",description:"Attention-grabbing headlines and titles"},{id:"ad-copy",name:"Ad Copy",icon:"fa-bullhorn",description:"Persuasive advertising copy for campaigns"},{id:"landing-page",name:"Landing Page Copy",icon:"fa-rocket",description:"Conversion-focused landing page content"},{id:"seo-content",name:"SEO Content",icon:"fa-search",description:"Search engine optimized content with keywords"},{id:"video-script",name:"Video Script",icon:"fa-video",description:"Scripts for videos, tutorials, and presentations"},{id:"faq",name:"FAQ Content",icon:"fa-question-circle",description:"Frequently asked questions and answers"}],r=[{id:"professional",name:"Professional",description:"Business-like, formal, and authoritative"},{id:"casual",name:"Casual",description:"Relaxed, conversational, and approachable"},{id:"friendly",name:"Friendly",description:"Warm, welcoming, and personable"},{id:"formal",name:"Formal",description:"Traditional, proper, and structured"},{id:"enthusiastic",name:"Enthusiastic",description:"Energetic, excited, and motivational"},{id:"serious",name:"Serious",description:"Solemn, thoughtful, and analytical"},{id:"humorous",name:"Humorous",description:"Funny, light-hearted, and entertaining"},{id:"persuasive",name:"Persuasive",description:"Convincing, compelling, and influential"}],d=[{id:"short",name:"Short",description:"50-150 words"},{id:"medium",name:"Medium",description:"200-500 words"},{id:"long",name:"Long",description:"600-1000 words"},{id:"extra-long",name:"Extra Long",description:"1000+ words"}],l=[{id:"general",name:"General Public",description:"Broad audience with varied interests"},{id:"business",name:"Business Professionals",description:"Corporate executives, managers, entrepreneurs"},{id:"students",name:"Students",description:"College/university students and researchers"},{id:"seniors",name:"Seniors",description:"Older adults, retirees, senior citizens"},{id:"tech-savvy",name:"Tech Enthusiasts",description:"Technology professionals and hobbyists"},{id:"parents",name:"Parents",description:"Families with children, parenting community"},{id:"millennials",name:"Millennials",description:"Young adults aged 25-40"},{id:"gen-z",name:"Gen Z",description:"Young people aged 18-24"}],a=[{id:"how-to-guide",name:"How-To Guide",type:"blog-post",prompt:"Write a comprehensive guide on [TOPIC] that includes step-by-step instructions, tips, and common mistakes to avoid.",keywords:["tutorial","guide","how-to","step-by-step"]},{id:"product-review",name:"Product Review",type:"blog-post",prompt:"Create an honest review of [PRODUCT] covering its features, pros and cons, pricing, and who it's best suited for.",keywords:["review","product","features","comparison"]},{id:"industry-trends",name:"Industry Trends",type:"blog-post",prompt:"Analyze the latest trends in [INDUSTRY] including emerging technologies, market changes, and future predictions.",keywords:["trends","industry","analysis","future"]},{id:"social-post",name:"Engaging Social Post",type:"social-media",prompt:"Create an engaging social media post about [TOPIC] that encourages interaction and shares.",keywords:["social media","engagement","viral","share"]},{id:"email-newsletter",name:"Newsletter Campaign",type:"email",prompt:"Write a compelling newsletter about [TOPIC] with engaging content, calls-to-action, and value for subscribers.",keywords:["newsletter","email","campaign","subscribers"]},{id:"product-launch",name:"Product Launch Copy",type:"ad-copy",prompt:"Create persuasive advertising copy for launching [PRODUCT] that highlights unique features and creates urgency.",keywords:["launch","product","advertising","urgency"]}],u=document.createElement("div");u.className="ai-content-generator flex flex-col h-full bg-gray-900";function i(){t.find(v=>v.id===e.contentType);const m=a.filter(v=>v.type===e.contentType);u.innerHTML=`
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
              ${t.map(v=>`
                <div class="content-type-card p-3 rounded-lg border border-gray-700 cursor-pointer transition-all hover:border-violet-500 ${e.contentType===v.id?"border-violet-500 bg-violet-500/10":"bg-gray-800/50"}"
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

          ${e.showTemplates?`
            <div>
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Templates</h3>
              <div class="space-y-2">
                ${m.map(v=>`
                  <div class="template-item p-3 rounded-lg border border-gray-700 cursor-pointer transition-all hover:border-violet-500 bg-gray-800/50"
                       data-template="${v.id}">
                    <h4 class="text-sm font-medium text-white">${v.name}</h4>
                    <p class="text-xs text-gray-500 mt-1 line-clamp-2">${v.prompt}</p>
                    <div class="flex gap-1 mt-2">
                      ${v.keywords.map(g=>`<span class="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-xs">${g}</span>`).join("")}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `:""}
        </div>

        <div class="flex-1 flex flex-col p-6 overflow-y-auto">
          <div class="space-y-6 max-w-3xl">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Tone</label>
                <select id="tone-select" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  ${r.map(v=>`<option value="${v.id}" ${e.tone===v.id?"selected":""}>${v.name}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">Length</label>
                <select id="length-select" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  ${d.map(v=>`<option value="${v.id}" ${e.length===v.id?"selected":""}>${v.name}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">Audience</label>
                <select id="audience-select" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  ${l.map(v=>`<option value="${v.id}" ${e.audience===v.id?"selected":""}>${v.name}</option>`).join("")}
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
              class="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-3 ${e.isGenerating||!e.prompt.trim()?"opacity-50 cursor-not-allowed":"hover:shadow-lg hover:shadow-violet-500/25"}"
              ${e.isGenerating||!e.prompt.trim()?"disabled":""}>
              ${e.isGenerating?`
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              `:`
                <i class="fa fa-magic"></i>
                Generate Content
              `}
            </button>

            ${e.generatedContent?`
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
            `:`
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

        ${e.contentHistory.length>0?`
          <div class="w-72 border-l border-gray-800 p-4 overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">History</h3>
              <button id="clear-history" class="text-xs text-gray-500 hover:text-red-400 transition-colors">
                <i class="fa fa-trash"></i> Clear
              </button>
            </div>
            <div class="space-y-2">
              ${e.contentHistory.map(v=>`
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
        `:""}
      </div>
    `,o()}function o(){u.querySelectorAll(".content-type-card").forEach(k=>{k.addEventListener("click",()=>{e.contentType=k.dataset.type,e.selectedTemplate=null,e.generatedContent="",i()})}),u.querySelectorAll(".template-item").forEach(k=>{k.addEventListener("click",()=>{const C=a.find(A=>A.id===k.dataset.template);C&&(e.selectedTemplate=C,e.contentType=C.type,e.prompt=C.prompt,e.showTemplates=!1,i())})});const m=u.querySelector("#tone-select");m&&m.addEventListener("change",k=>{e.tone=k.target.value});const v=u.querySelector("#length-select");v&&v.addEventListener("change",k=>{e.length=k.target.value});const g=u.querySelector("#audience-select");g&&g.addEventListener("change",k=>{e.audience=k.target.value});const f=u.querySelector("#prompt-input");f&&f.addEventListener("input",k=>{e.prompt=k.target.value});const h=u.querySelector("#keywords-input");h&&h.addEventListener("input",k=>{e.keywords=k.target.value});const b=u.querySelector("#custom-input");b&&b.addEventListener("input",k=>{e.customInstructions=k.target.value});const w=u.querySelector("#templates-toggle");w&&w.addEventListener("click",()=>{e.showTemplates=!e.showTemplates,i()});const E=u.querySelector("#generate-btn");E&&E.addEventListener("click",p);const L=u.querySelector("#copy-btn");L&&L.addEventListener("click",()=>{navigator.clipboard.writeText(e.generatedContent)});const $=u.querySelector("#save-btn");$&&$.addEventListener("click",()=>{s&&s(e.generatedContent),c()});const M=u.querySelector("#clear-btn");M&&M.addEventListener("click",()=>{e.generatedContent="",i()});const x=u.querySelector("#clear-history");x&&x.addEventListener("click",()=>{e.contentHistory=[],i()}),u.querySelectorAll(".history-item").forEach(k=>{k.addEventListener("click",()=>{const C=e.contentHistory.find(A=>A.id===parseInt(k.dataset.historyId));C&&(e.generatedContent=C.content,i())})})}async function p(){if(!(!e.prompt.trim()||e.isGenerating)){e.isGenerating=!0,i();try{await new Promise(v=>setTimeout(v,2500));const m={"blog-post":"# The Power of Remote Work\\n\\nRemote work has transformed how businesses operate across the globe. Here are key benefits you should know:\\n\\n## Flexibility and Work-Life Balance\\n\\nEmployees gain autonomy over their schedules, leading to improved satisfaction and retention rates. Studies show 77% of remote workers report higher satisfaction.\\n\\n## Cost Savings\\n\\nOrganizations save an average of $11,000 per employee annually on office space and related expenses.","social-media":"🚀 Remote work is here to stay! \\n\\nDid you know that 77% of remote workers report higher job satisfaction? \\n\\nHere are 3 reasons why:\\n✅ Better work-life balance\\n✅ Increased productivity\\n✅ Reduced commute stress\\n\\nWhat's your favorite benefit of remote work? 👇",email:"Subject: Unlock Your Team's Potential with Remote Work\\n\\nHi there,\\n\\nI hope this email finds you well. I wanted to share some insights about remote work that could benefit your team.\\n\\nRecent studies show that remote workers are 47% more productive and take shorter breaks.\\n\\nReady to learn more? Reply to this email and let's chat.","product-description":"Transform your workspace with our Remote Work Essentials Bundle.\\n\\n**What's Included:**\\n- Ergonomic laptop stand\\n- Wireless noise-canceling headphones\\n- Blue light blocking glasses\\n- Adjustable desk lamp\\n\\n**Key Benefits:**\\n✓ Improve posture and comfort\\n✓ Block distractions\\n✓ Reduce eye strain\\n\\nPerfect for professionals working from home.",headline:"10 Proven Strategies to Maximize Productivity in Remote Work\\n\\nThe Ultimate Guide to Thriving as a Remote Employee\\n\\nWhy Remote Work is Revolutionizing the Modern Workplace","ad-copy":"⚡️Work From Anywhere, Succeed Everywhere⚡️\\n\\nJoin 10,000+ professionals who've transformed their careers with remote work.\\n\\n✅ Flexible hours\\n✅ No commute\\n✅ Higher earning potential\\n\\n🎯 Limited time: Get 50% off your first month\\n\\n👉 [CTA Button: Start Your Remote Journey]","landing-page":"## Work Smarter, Not Harder\\n\\nDiscover the freedom of remote work with our proven framework.\\n\\n**Join thousands who have:**\\n- Increased productivity by 47%\\n- Achieved better work-life balance\\n- Advanced their careers faster\\n\\n🔐 30-day money-back guarantee\\n\\n[Get Started Now - No Credit Card Required]","seo-content":"Remote work has become essential for modern businesses. This comprehensive guide covers everything from setting up your home office to maintaining team collaboration.\\n\\n**Key Topics:**\\n1. Best practices for remote teams\\n2. Essential tools and software\\n3. Communication strategies\\n4. Productivity tips\\n5. Work-life balance\\n\\nWhether you're new to remote work or looking to optimize your current setup, this guide has you covered.","video-script":`[Opening shot: Person working from a cozy home office]\\n\\nNARRATOR: "What if I told you that you could increase your productivity by 47%?\\n\\n[Cut to statistics screen]\\n\\nStudies show that remote workers are not just more productive—they're happier too.\\n\\n[Screenshot of remote work tools]\\n\\nLet's dive into the top 5 remote work tools that will transform your workflow...\\n\\n[Music fade out]`,faq:"**Q: What is remote work?**\\nA: Remote work allows employees to work from locations outside of a traditional office, typically from home or co-working spaces.\\n\\n**Q: What equipment do I need?**\\nA: Essential equipment includes a reliable computer, high-speed internet, and a comfortable workspace. Many companies provide additional tools.\\n\\n**Q: How do teams collaborate remotely?**\\nA: Remote teams use tools like Slack, Zoom, and project management software to stay connected and productive."};e.generatedContent=m[e.contentType]||m["blog-post"],n&&n(e.generatedContent,{type:e.contentType,prompt:e.prompt,tone:e.tone,length:e.length,audience:e.audience})}catch(m){console.error("Generation error:",m)}finally{e.isGenerating=!1,i()}}}function c(){e.generatedContent&&(e.contentHistory.unshift({id:Date.now(),type:e.contentType,prompt:e.prompt,content:e.generatedContent}),e.contentHistory.length>20&&(e.contentHistory=e.contentHistory.slice(0,20)),i())}return i(),u}function ie({commands:n=[],onSelect:s}){const e={isOpen:!1,searchQuery:"",selectedIndex:0},t=[{id:"new-project",name:"New Project",shortcut:"Ctrl+N",icon:"fa-plus",category:"File",action:()=>{}},{id:"open-project",name:"Open Project",shortcut:"Ctrl+O",icon:"fa-folder-open",category:"File",action:()=>{}},{id:"save-project",name:"Save Project",shortcut:"Ctrl+S",icon:"fa-save",category:"File",action:()=>{}},{id:"export-video",name:"Export Video",shortcut:"Ctrl+E",icon:"fa-film",category:"File",action:()=>{}},{id:"undo",name:"Undo",shortcut:"Ctrl+Z",icon:"fa-undo",category:"Edit",action:()=>{}},{id:"redo",name:"Redo",shortcut:"Ctrl+Y",icon:"fa-redo",category:"Edit",action:()=>{}},{id:"cut",name:"Cut",shortcut:"Ctrl+X",icon:"fa-cut",category:"Edit",action:()=>{}},{id:"copy",name:"Copy",shortcut:"Ctrl+C",icon:"fa-copy",category:"Edit",action:()=>{}},{id:"paste",name:"Paste",shortcut:"Ctrl+V",icon:"fa-paste",category:"Edit",action:()=>{}},{id:"select-all",name:"Select All",shortcut:"Ctrl+A",icon:"fa-check-square",category:"Edit",action:()=>{}},{id:"duplicate",name:"Duplicate",shortcut:"Ctrl+D",icon:"fa-clone",category:"Edit",action:()=>{}},{id:"delete",name:"Delete",shortcut:"Delete",icon:"fa-trash",category:"Edit",action:()=>{}},{id:"play-pause",name:"Play / Pause",shortcut:"Space",icon:"fa-play",category:"Playback",action:()=>{}},{id:"stop",name:"Stop",shortcut:"K",icon:"fa-stop",category:"Playback",action:()=>{}},{id:"previous-frame",name:"Previous Frame",shortcut:"Left",icon:"fa-step-backward",category:"Playback",action:()=>{}},{id:"next-frame",name:"Next Frame",shortcut:"Right",icon:"fa-step-forward",category:"Playback",action:()=>{}},{id:"mute",name:"Mute",shortcut:"M",icon:"fa-volume-mute",category:"Playback",action:()=>{}},{id:"fullscreen",name:"Toggle Fullscreen",shortcut:"F",icon:"fa-expand",category:"View",action:()=>{}},{id:"zoom-in",name:"Zoom In",shortcut:"Ctrl+=",icon:"fa-search-plus",category:"View",action:()=>{}},{id:"zoom-out",name:"Zoom Out",shortcut:"Ctrl+-",icon:"fa-search-minus",category:"View",action:()=>{}},{id:"reset-zoom",name:"Reset Zoom",shortcut:"Ctrl+0",icon:"fa-compress",category:"View",action:()=>{}},{id:"toggle-sidebar",name:"Toggle Sidebar",shortcut:"Ctrl+B",icon:"fa-columns",category:"View",action:()=>{}},{id:"ai-generate",name:"AI Generate",shortcut:"Ctrl+G",icon:"fa-magic",category:"AI",action:()=>{}},{id:"ai-script",name:"AI Script Writer",shortcut:"Ctrl+Shift+S",icon:"fa-pen",category:"AI",action:()=>{}},{id:"ai-voice",name:"AI Voice Clone",shortcut:"Ctrl+Shift+V",icon:"fa-microphone",category:"AI",action:()=>{}},{id:"ai-avatar",name:"Avatar Generator",shortcut:"Ctrl+Shift+A",icon:"fa-user-circle",category:"AI",action:()=>{}},{id:"settings",name:"Settings",shortcut:"Ctrl+,",icon:"fa-cog",category:"Preferences",action:()=>{}},{id:"keyboard-shortcuts",name:"Keyboard Shortcuts",shortcut:"?",icon:"fa-keyboard",category:"Preferences",action:()=>{}},{id:"help",name:"Help Center",shortcut:"F1",icon:"fa-question-circle",category:"Help",action:()=>{}},{id:"getting-started",name:"Getting Started",shortcut:"",icon:"fa-graduation-cap",category:"Help",action:()=>{}}],r=n.length>0?n:t,d=document.createElement("div");d.className="command-palette-container";function l(){if(!e.searchQuery.trim())return r;const v=e.searchQuery.toLowerCase().trim();return r.filter(g=>{var f,h;return g.name.toLowerCase().includes(v)||((f=g.category)==null?void 0:f.toLowerCase().includes(v))||((h=g.shortcut)==null?void 0:h.toLowerCase().includes(v))})}function a(){const v=l(),g={};return v.forEach(f=>{const h=f.category||"Other";g[h]||(g[h]=[]),g[h].push(f)}),g}function u(){e.isOpen=!0,e.searchQuery="",e.selectedIndex=0,c(),setTimeout(()=>{const v=d.querySelector("#command-input");v&&v.focus()},50)}function i(){e.isOpen=!1,e.searchQuery="",e.selectedIndex=0,c()}function o(v){v.action&&v.action(),s&&s(v),i()}function p(v){if((v.ctrlKey||v.metaKey)&&v.key==="k"){v.preventDefault(),e.isOpen?i():u();return}if(v.key==="Escape"&&e.isOpen){v.preventDefault(),i();return}if(!e.isOpen)return;const g=l();switch(v.key){case"ArrowDown":v.preventDefault(),e.selectedIndex=(e.selectedIndex+1)%g.length,c();break;case"ArrowUp":v.preventDefault(),e.selectedIndex=(e.selectedIndex-1+g.length)%g.length,c();break;case"Enter":v.preventDefault(),g[e.selectedIndex]&&o(g[e.selectedIndex]);break}}function c(){if(!e.isOpen)d.innerHTML=`
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
      `;else{const v=a();let g=0;d.innerHTML=`
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
              ${Object.keys(v).length===0?`
                <div class="p-8 text-center text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p>No commands found</p>
                </div>
              `:Object.entries(v).map(([f,h])=>`
                <div class="command-category">
                  <div class="px-4 py-2 text-xs font-semibold text-violet-400 uppercase tracking-wider bg-gray-800/50">
                    ${f}
                  </div>
                  ${h.map(b=>{const w=g===e.selectedIndex,E=g++;return`
                      <div class="command-item px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${w?"bg-violet-600 text-white":"text-gray-300 hover:bg-gray-800"}"
                           data-index="${E}"
                           data-command-id="${b.id}">
                        <div class="w-8 h-8 rounded-lg ${w?"bg-white/20":"bg-gray-800"} flex items-center justify-center flex-shrink-0">
                          <i class="fa ${b.icon}"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="font-medium">${b.name}</div>
                          ${b.description?`<div class="text-xs ${w?"text-white/70":"text-gray-500"}">${b.description}</div>`:""}
                        </div>
                        ${b.shortcut?`
                          <span class="px-2 py-1 rounded ${w?"bg-white/20":"bg-gray-800"} text-xs font-mono">
                            ${b.shortcut}
                          </span>
                        `:""}
                      </div>
                    `}).join("")}
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
              <span>${l().length} commands</span>
            </div>
          </div>
        </div>
      `}m()}function m(){const v=d.querySelector("#command-palette-trigger");v&&v.addEventListener("click",u);const g=d.querySelector("#command-palette-overlay");g&&g.addEventListener("click",h=>{h.target===g&&i()});const f=d.querySelector("#command-input");f&&f.addEventListener("input",h=>{e.searchQuery=h.target.value,e.selectedIndex=0,c()}),d.querySelectorAll(".command-item").forEach(h=>{h.addEventListener("click",()=>{const b=h.dataset.commandId,w=r.find(E=>E.id===b);w&&o(w)}),h.addEventListener("mouseenter",()=>{e.selectedIndex=parseInt(h.dataset.index),c()})})}return document.addEventListener("keydown",p),d.addEventListener("remove",()=>{document.removeEventListener("keydown",p)}),c(),d.api={open:u,close:i,isOpen:()=>e.isOpen},d}function se({onSave:n,initialConfig:s={}}){const e={ctaConfig:{type:"button",style:"primary",size:"medium",shape:"rounded",content:{text:"Get Started Today",subtext:"",icon:"",iconPosition:"left"},action:{type:"link",target:"#",modalId:"",scrollTarget:"",downloadUrl:"",phoneNumber:"",emailAddress:"",emailSubject:""},appearance:{backgroundColor:"#8b5cf6",textColor:"#ffffff",borderColor:"#8b5cf6",borderWidth:"2px",shadow:"medium",hoverEffect:"lift",animation:"fade-in"},positioning:{alignment:"center",margin:"16px 0",width:"auto",customWidth:"200px"},conversion:{urgencyText:"",socialProof:"",guarantee:"",tracking:{eventName:"cta_click",eventCategory:"conversion",eventLabel:""}}},activeTab:"content",isPreviewMode:!0,previewHover:!1};Object.assign(e.ctaConfig,s);const t=[{id:"primary",name:"Primary",color:"#8b5cf6"},{id:"secondary",name:"Secondary",color:"#6b7280"},{id:"success",name:"Success",color:"#10b981"},{id:"danger",name:"Danger",color:"#ef4444"},{id:"warning",name:"Warning",color:"#f59e0b"},{id:"info",name:"Info",color:"#3b82f6"},{id:"light",name:"Light",color:"#f3f4f6"},{id:"dark",name:"Dark",color:"#1f2937"},{id:"outline",name:"Outline",color:"transparent"},{id:"ghost",name:"Ghost",color:"transparent"},{id:"gradient",name:"Gradient",gradient:"linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"}],r=[{id:"small",name:"Small",scale:.85},{id:"medium",name:"Medium",scale:1},{id:"large",name:"Large",scale:1.15},{id:"extra-large",name:"Extra Large",scale:1.3}],d=[{id:"square",name:"Square",radius:"4px"},{id:"rounded",name:"Rounded",radius:"8px"},{id:"pill",name:"Pill",radius:"9999px"},{id:"circle",name:"Circle",radius:"50%"}],l=[{id:"none",name:"None"},{id:"lift",name:"Lift",transform:"translateY(-2px)"},{id:"glow",name:"Glow",boxShadow:"0 0 20px rgba(139, 92, 246, 0.5)"},{id:"scale",name:"Scale",transform:"scale(1.05)"},{id:"slide",name:"Slide",transform:"translateX(4px)"}],a=document.createElement("div");a.className="cta-builder bg-gray-900 rounded-xl border border-gray-800 overflow-hidden";function u(){const c=e.ctaConfig,m=t.find(h=>h.id===c.style);r.find(h=>h.id===c.size);const v=d.find(h=>h.id===c.shape),g=l.find(h=>h.id===c.appearance.hoverEffect);let f="";return m!=null&&m.gradient?f=m.gradient:f=c.style==="outline"||c.style==="ghost"?"transparent":(m==null?void 0:m.color)||c.appearance.backgroundColor,{background:f,color:c.style==="outline"||c.style==="ghost"?c.appearance.backgroundColor:c.appearance.textColor,border:c.style==="outline"?`${c.appearance.borderWidth} solid ${c.appearance.borderColor}`:"none",borderRadius:(v==null?void 0:v.radius)||"8px",padding:c.size==="small"?"8px 16px":c.size==="medium"?"12px 24px":c.size==="large"?"16px 32px":"20px 40px",fontSize:c.size==="small"?"14px":c.size==="medium"?"16px":c.size==="large"?"18px":"20px",width:c.positioning.width==="full"?"100%":c.positioning.width==="custom"?c.positioning.customWidth:"auto",textAlign:"center",cursor:"pointer",transition:"all 0.3s ease",boxShadow:c.appearance.shadow==="small"?"0 1px 3px rgba(0,0,0,0.1)":c.appearance.shadow==="medium"?"0 4px 6px rgba(0,0,0,0.1)":c.appearance.shadow==="large"?"0 10px 25px rgba(0,0,0,0.15)":"none",transform:e.previewHover&&(g!=null&&g.transform)?g.transform:"none"}}function i(c){return Object.entries(c).map(([m,v])=>`${m.replace(/[A-Z]/g,g=>"-"+g.toLowerCase())}: ${v}`).join("; ")}function o(){var v;const c=e.ctaConfig,m=i(u());a.innerHTML=`
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
          <button id="preview-toggle" class="px-3 py-1.5 rounded-lg ${e.isPreviewMode?"bg-violet-600 text-white":"bg-gray-800 text-gray-300"} text-sm font-medium transition-colors flex items-center gap-2">
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
            ${["content","appearance","action","advanced"].map(g=>`
              <button class="tab-btn flex-1 py-2 text-sm font-medium ${e.activeTab===g?"text-violet-400 border-b-2 border-violet-400":"text-gray-500 hover:text-gray-300"}"
                      data-tab="${g}">
                ${g.charAt(0).toUpperCase()+g.slice(1)}
              </button>
            `).join("")}
          </div>

          ${e.activeTab==="content"?`
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Button Text</label>
                <input id="btn-text" type="text" value="${c.content.text}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Subtext (Optional)</label>
                <input id="btn-subtext" type="text" value="${c.content.subtext}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Limited time offer">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Icon</label>
                <div class="grid grid-cols-6 gap-2">
                  ${["","fa-arrow-right","fa-download","fa-envelope","fa-phone","fa-play","fa-plus","fa-check","fa-star","fa-heart","fa-bolt","fa-shopping-cart","fa-external-link","fa-chevron-right","fa-angle-right"].map(g=>`
                    <button class="icon-btn w-10 h-10 rounded-lg border ${c.content.icon===g?"border-violet-500 bg-violet-500/20 text-violet-300":"border-gray-700 text-gray-400 hover:border-gray-500"} flex items-center justify-center transition-colors"
                            data-icon="${g}">
                      ${g?`<i class="fa ${g}"></i>`:'<span class="text-xs">None</span>'}
                    </button>
                  `).join("")}
                </div>
              </div>

              ${c.content.icon?`
                <div>
                  <label class="block text-xs text-gray-500 mb-2">Icon Position</label>
                  <div class="grid grid-cols-2 gap-2">
                    ${[["left","Left"],["right","Right"]].map(([g,f])=>`
                      <button class="pos-btn py-2 rounded-lg border text-sm ${c.content.iconPosition===g?"border-violet-500 bg-violet-500/20 text-violet-300":"border-gray-700 text-gray-400"}"
                              data-position="${g}">
                        ${f}
                      </button>
                    `).join("")}
                  </div>
                </div>
              `:""}

              <div>
                <label class="block text-xs text-gray-500 mb-2">Style</label>
                <div class="space-y-2">
                  ${t.map(g=>`
                    <button class="style-btn w-full p-3 rounded-lg border flex items-center gap-3 transition-colors ${c.style===g.id?"border-violet-500 bg-violet-500/10":"border-gray-700 hover:border-gray-600"}"
                            data-style="${g.id}">
                      <div class="w-8 h-8 rounded" style="background: ${g.gradient||g.color}; ${g.id==="outline"||g.id==="ghost"?"border: 2px solid #8b5cf6":""}"></div>
                      <span class="text-sm text-white">${g.name}</span>
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Size</label>
                <div class="grid grid-cols-2 gap-2">
                  ${r.map(g=>`
                    <button class="size-btn py-2 rounded-lg border text-sm ${c.size===g.id?"border-violet-500 bg-violet-500/20 text-violet-300":"border-gray-700 text-gray-400 hover:border-gray-600"}"
                            data-size="${g.id}">
                      ${g.name}
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Shape</label>
                <div class="grid grid-cols-2 gap-2">
                  ${d.map(g=>`
                    <button class="shape-btn py-2 rounded-lg border text-sm ${c.shape===g.id?"border-violet-500 bg-violet-500/20 text-violet-300":"border-gray-700 text-gray-400 hover:border-gray-600"}"
                            data-shape="${g.id}">
                      ${g.name}
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>
          `:""}

          ${e.activeTab==="appearance"?`
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Background Color</label>
                <div class="flex gap-2">
                  <input id="bg-color" type="color" value="${c.appearance.backgroundColor}"
                    class="w-12 h-10 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer">
                  <input id="bg-color-text" type="text" value="${c.appearance.backgroundColor}"
                    class="flex-1 p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Text Color</label>
                <div class="flex gap-2">
                  <input id="text-color" type="color" value="${c.appearance.textColor}"
                    class="w-12 h-10 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer">
                  <input id="text-color-text" type="text" value="${c.appearance.textColor}"
                    class="flex-1 p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Shadow</label>
                <div class="grid grid-cols-2 gap-2">
                  ${["none","small","medium","large"].map(g=>`
                    <button class="shadow-btn py-2 rounded-lg border text-sm ${c.appearance.shadow===g?"border-violet-500 bg-violet-500/20 text-violet-300":"border-gray-700 text-gray-400"}"
                            data-shadow="${g}">
                      ${g.charAt(0).toUpperCase()+g.slice(1)}
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Hover Effect</label>
                <div class="space-y-2">
                  ${l.map(g=>`
                    <button class="hover-btn w-full p-3 rounded-lg border text-sm flex items-center gap-2 ${c.appearance.hoverEffect===g.id?"border-violet-500 bg-violet-500/10 text-violet-300":"border-gray-700 text-gray-400"}"
                            data-hover="${g.id}">
                      <span>${g.name}</span>
                      ${g.transform!=="none"?'<i class="fa fa-arrow-up text-xs opacity-50"></i>':""}
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>
          `:""}

          ${e.activeTab==="action"?`
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Action Type</label>
                <div class="space-y-2">
                  ${[["link","Link to URL","fa-link"],["modal","Open Modal","fa-window-maximize"],["scroll","Scroll to Section","fa-arrow-down"],["download","Download File","fa-download"],["phone","Call Phone","fa-phone"],["email","Send Email","fa-envelope"]].map(([g,f,h])=>`
                    <button class="action-type-btn w-full p-3 rounded-lg border flex items-center gap-3 ${c.action.type===g?"border-violet-500 bg-violet-500/10":"border-gray-700 hover:border-gray-600"}"
                            data-action-type="${g}">
                      <i class="fa ${h} text-gray-400"></i>
                      <span class="text-sm text-white">${f}</span>
                    </button>
                  `).join("")}
                </div>
              </div>

              ${c.action.type==="link"?`
                <div>
                  <label class="block text-xs text-gray-500 mb-2">URL</label>
                  <input id="action-target" type="text" value="${c.action.target}"
                    class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                    placeholder="https://example.com">
                </div>
              `:""}

              ${c.action.type==="email"?`
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-2">Email Address</label>
                    <input id="email-address" type="email" value="${c.action.emailAddress}"
                      class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-2">Subject (Optional)</label>
                    <input id="email-subject" type="text" value="${c.action.emailSubject}"
                      class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  </div>
                </div>
              `:""}

              ${c.action.type==="phone"?`
                <div>
                  <label class="block text-xs text-gray-500 mb-2">Phone Number</label>
                  <input id="phone-number" type="tel" value="${c.action.phoneNumber}"
                    class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                    placeholder="+1 (555) 123-4567">
                </div>
              `:""}

              <div>
                <label class="block text-xs text-gray-500 mb-2">Alignment</label>
                <div class="grid grid-cols-3 gap-2">
                  ${[["left","Left"],["center","Center"],["right","Right"]].map(([g,f])=>`
                    <button class="align-btn py-2 rounded-lg border text-sm ${c.positioning.alignment===g?"border-violet-500 bg-violet-500/20 text-violet-300":"border-gray-700 text-gray-400"}"
                            data-align="${g}">
                      ${f}
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>
          `:""}

          ${e.activeTab==="advanced"?`
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Urgency Text</label>
                <input id="urgency-text" type="text" value="${c.conversion.urgencyText}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Limited time offer - ends soon!">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Social Proof</label>
                <input id="social-proof" type="text" value="${c.conversion.socialProof}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Join 10,000+ satisfied customers">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Guarantee Badge</label>
                <input id="guarantee-text" type="text" value="${c.conversion.guarantee}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="30-day money back guarantee">
              </div>

              <div class="pt-4 border-t border-gray-800">
                <label class="block text-xs text-gray-500 mb-2">Tracking Event Name</label>
                <input id="tracking-event" type="text" value="${c.conversion.tracking.eventName}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Custom CSS</label>
                <textarea id="custom-css" rows="4"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm font-mono resize-none focus:outline-none focus:border-violet-500"
                  placeholder="/* Custom CSS styles */"></textarea>
              </div>
            </div>
          `:""}
        </div>

        <div class="flex-1 p-8 flex flex-col">
          <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Preview</h3>
          <div class="flex-1 bg-gray-800/50 rounded-xl p-8 flex flex-col items-${c.positioning.alignment} justify-center border border-gray-700">
            ${c.conversion.socialProof?`
              <div class="text-xs text-green-400 mb-3 flex items-center gap-1">
                <i class="fa fa-users"></i>
                ${c.conversion.socialProof}
              </div>
            `:""}

            <button id="cta-preview-btn" class="cta-preview-btn inline-flex items-center justify-center gap-2 transition-all"
                    style="${m}"
                    onmouseenter="this.style.transform = '${((v=l.find(g=>g.id===c.appearance.hoverEffect))==null?void 0:v.transform)||"none"}'"
                    onmouseleave="this.style.transform = 'none'">
              ${c.content.icon&&c.content.iconPosition==="left"?`<i class="fa ${c.content.icon}"></i>`:""}
              <span>${c.content.text}</span>
              ${c.content.icon&&c.content.iconPosition==="right"?`<i class="fa ${c.content.icon}"></i>`:""}
            </button>

            ${c.content.subtext?`
              <p class="text-xs text-gray-500 mt-2">${c.content.subtext}</p>
            `:""}

            ${c.conversion.urgencyText?`
              <div class="text-xs text-orange-400 mt-2 flex items-center gap-1">
                <i class="fa fa-clock"></i>
                ${c.conversion.urgencyText}
              </div>
            `:""}

            ${c.conversion.guarantee?`
              <div class="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <i class="fa fa-shield-alt"></i>
                ${c.conversion.guarantee}
              </div>
            `:""}
          </div>

          <div class="mt-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div class="text-xs text-gray-500 mb-2">HTML Code</div>
            <code class="text-xs text-gray-300 font-mono break-all" id="html-code">
              &lt;button class="cta-button" style="${m.replace(/"/g,"&quot;")}"&gt;${c.content.text}&lt;/button&gt;
            </code>
          </div>
        </div>
      </div>
    `,p()}function p(){a.querySelectorAll(".tab-btn").forEach(x=>{x.addEventListener("click",()=>{e.activeTab=x.dataset.tab,o()})});const c=a.querySelector("#preview-toggle");c&&c.addEventListener("click",()=>{e.isPreviewMode=!e.isPreviewMode,o()});const m=a.querySelector("#save-cta");m&&m.addEventListener("click",()=>{n&&n(e.ctaConfig)});const v=a.querySelector("#btn-text");v&&v.addEventListener("input",x=>{e.ctaConfig.content.text=x.target.value,o()});const g=a.querySelector("#btn-subtext");g&&g.addEventListener("input",x=>{e.ctaConfig.content.subtext=x.target.value,o()}),a.querySelectorAll(".icon-btn").forEach(x=>{x.addEventListener("click",()=>{e.ctaConfig.content.icon=x.dataset.icon,o()})}),a.querySelectorAll(".pos-btn").forEach(x=>{x.addEventListener("click",()=>{e.ctaConfig.content.iconPosition=x.dataset.position,o()})}),a.querySelectorAll(".style-btn").forEach(x=>{x.addEventListener("click",()=>{e.ctaConfig.style=x.dataset.style,o()})}),a.querySelectorAll(".size-btn").forEach(x=>{x.addEventListener("click",()=>{e.ctaConfig.size=x.dataset.size,o()})}),a.querySelectorAll(".shape-btn").forEach(x=>{x.addEventListener("click",()=>{e.ctaConfig.shape=x.dataset.shape,o()})});const f=a.querySelector("#bg-color"),h=a.querySelector("#bg-color-text");f&&f.addEventListener("input",x=>{e.ctaConfig.appearance.backgroundColor=x.target.value,h&&(h.value=x.target.value),o()}),h&&h.addEventListener("input",x=>{e.ctaConfig.appearance.backgroundColor=x.target.value,f&&(f.value=x.target.value),o()});const b=a.querySelector("#text-color"),w=a.querySelector("#text-color-text");b&&b.addEventListener("input",x=>{e.ctaConfig.appearance.textColor=x.target.value,w&&(w.value=x.target.value),o()}),w&&w.addEventListener("input",x=>{e.ctaConfig.appearance.textColor=x.target.value,b&&(b.value=x.target.value),o()}),a.querySelectorAll(".shadow-btn").forEach(x=>{x.addEventListener("click",()=>{e.ctaConfig.appearance.shadow=x.dataset.shadow,o()})}),a.querySelectorAll(".hover-btn").forEach(x=>{x.addEventListener("click",()=>{e.ctaConfig.appearance.hoverEffect=x.dataset.hover,o()})}),a.querySelectorAll(".action-type-btn").forEach(x=>{x.addEventListener("click",()=>{e.ctaConfig.action.type=x.dataset.actionType,o()})}),a.querySelectorAll(".align-btn").forEach(x=>{x.addEventListener("click",()=>{e.ctaConfig.positioning.alignment=x.dataset.align,o()})});const E=a.querySelector("#urgency-text");E&&E.addEventListener("input",x=>{e.ctaConfig.conversion.urgencyText=x.target.value,o()});const L=a.querySelector("#social-proof");L&&L.addEventListener("input",x=>{e.ctaConfig.conversion.socialProof=x.target.value,o()});const $=a.querySelector("#guarantee-text");$&&$.addEventListener("input",x=>{e.ctaConfig.conversion.guarantee=x.target.value,o()});const M=a.querySelector("#cta-preview-btn");M&&(M.addEventListener("mouseenter",()=>{e.previewHover=!0}),M.addEventListener("mouseleave",()=>{e.previewHover=!1}))}return o(),a.api={getConfig:()=>e.ctaConfig,setConfig:c=>{Object.assign(e.ctaConfig,c),o()}},a}function re({analyticsData:n={}}){const e={...{views:12345,uniqueVisitors:8762,avgWatchTime:156,completionRate:.68,interactions:3421,clicks:1892,conversions:456,bounceRate:.24,deviceBreakdown:{desktop:.45,mobile:.42,tablet:.13},trafficSources:{organic:.35,social:.28,direct:.2,referral:.17},topPages:[{path:"/home",views:5200},{path:"/about",views:1800},{path:"/contact",views:1200},{path:"/products",views:980}],geographic:[{country:"US",visitors:3500,percentage:.4},{country:"UK",visitors:1800,percentage:.21},{country:"CA",visitors:1200,percentage:.14},{country:"AU",visitors:800,percentage:.09}],hourly:Array.from({length:24},(i,o)=>({hour:o,activity:Math.random()*100+(o>=9&&o<=17?50:20)})),daily:Array.from({length:7},(i,o)=>({day:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][o],visits:Math.floor(Math.random()*2e3+500)})),events:[{name:"CTA Click",count:1892,conversion:.24},{name:"Video Play",count:8762,conversion:1},{name:"Form Submit",count:456,conversion:.05},{name:"Share",count:234,conversion:.03},{name:"Download",count:189,conversion:.02}]},...n},t={timeRange:"7d",activeTab:"overview"},r=document.createElement("div");r.className="behavioral-analytics flex flex-col h-full bg-gray-900";function d(i){return i>=1e6?(i/1e6).toFixed(1)+"M":i>=1e3?(i/1e3).toFixed(1)+"K":i.toString()}function l(i){const o=Math.floor(i/60),p=i%60;return`${o}:${p.toString().padStart(2,"0")}`}function a(){r.innerHTML=`
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
        ${[["overview","Overview","fa-chart-pie"],["engagement","Engagement","fa-chart-line"],["audience","Audience","fa-users"],["events","Events","fa-bolt"]].map(([i,o,p])=>`
          <button class="tab-btn flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${t.activeTab===i?"text-violet-400 border-b-2 border-violet-400":"text-gray-400 hover:text-white"}"
                  data-tab="${i}">
            <i class="fa ${p}"></i>
            ${o}
          </button>
        `).join("")}
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        ${t.activeTab==="overview"?`
          <div class="space-y-6">
            <div class="grid grid-cols-4 gap-4">
              ${[{label:"Total Views",value:d(e.views),change:"+12.5%",positive:!0,icon:"fa-eye",color:"blue"},{label:"Unique Visitors",value:d(e.uniqueVisitors),change:"+8.3%",positive:!0,icon:"fa-user",color:"green"},{label:"Avg Watch Time",value:l(e.avgWatchTime),change:"+5.2%",positive:!0,icon:"fa-clock",color:"purple"},{label:"Completion Rate",value:(e.completionRate*100).toFixed(0)+"%",change:"-2.1%",positive:!1,icon:"fa-check-circle",color:"orange"}].map(i=>`
                <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wider">${i.label}</p>
                      <p class="text-2xl font-bold text-white mt-1">${i.value}</p>
                    </div>
                    <div class="w-8 h-8 rounded-lg bg-${i.color}-500/20 text-${i.color}-400 flex items-center justify-center">
                      <i class="fa ${i.icon}"></i>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 mt-3">
                    <span class="text-xs ${i.positive?"text-green-400":"text-red-400"}">
                      <i class="fa ${i.positive?"fa-arrow-up":"fa-arrow-down"}"></i> ${i.change}
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
                  ${e.daily.map(i=>`
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <div class="w-full bg-violet-500/30 rounded-t hover:bg-violet-500/50 transition-colors relative group"
                           style="height: ${i.visits/Math.max(...e.daily.map(o=>o.visits))*100}%">
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${d(i.visits)} visits
                        </div>
                      </div>
                      <span class="text-xs text-gray-500">${i.day}</span>
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
                  ${e.hourly.map(i=>`
                    <div class="flex-1 relative group">
                      <div class="w-full bg-fuchsia-500/30 rounded-t hover:bg-fuchsia-500/50 transition-colors"
                           style="height: ${i.activity/Math.max(...e.hourly.map(o=>o.activity))*100}%">
                      </div>
                      ${i.hour%4===0?`<span class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500">${i.hour}:00</span>`:""}
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Device Breakdown</h3>
                <div class="space-y-3">
                  ${[{device:"Desktop",value:e.deviceBreakdown.desktop,icon:"fa-desktop",color:"blue"},{device:"Mobile",value:e.deviceBreakdown.mobile,icon:"fa-mobile-alt",color:"green"},{device:"Tablet",value:e.deviceBreakdown.tablet,icon:"fa-tablet-alt",color:"purple"}].map(i=>`
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-400 flex items-center gap-2">
                          <i class="fa ${i.icon}"></i>
                          ${i.device}
                        </span>
                        <span class="text-white">${(i.value*100).toFixed(0)}%</span>
                      </div>
                      <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-${i.color}-500 rounded-full" style="width: ${i.value*100}%"></div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Traffic Sources</h3>
                <div class="space-y-3">
                  ${[{source:"Organic Search",value:e.trafficSources.organic,icon:"fa-search",color:"green"},{source:"Social Media",value:e.trafficSources.social,icon:"fa-share-alt",color:"blue"},{source:"Direct",value:e.trafficSources.direct,icon:"fa-link",color:"purple"},{source:"Referral",value:e.trafficSources.referral,icon:"fa-share",color:"orange"}].map(i=>`
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-400 flex items-center gap-2">
                          <i class="fa ${i.icon}"></i>
                          ${i.source}
                        </span>
                        <span class="text-white">${(i.value*100).toFixed(0)}%</span>
                      </div>
                      <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-${i.color}-500 rounded-full" style="width: ${i.value*100}%"></div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Top Pages</h3>
                <div class="space-y-3">
                  ${e.topPages.map((i,o)=>`
                    <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div class="flex items-center gap-3">
                        <span class="w-5 h-5 rounded-full bg-gray-700 text-gray-400 text-xs flex items-center justify-center">${o+1}</span>
                        <span class="text-sm text-gray-300">${i.path}</span>
                      </div>
                      <span class="text-sm text-gray-500">${d(i.views)}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>
        `:""}

        ${t.activeTab==="engagement"?`
          <div class="space-y-6">
            <div class="grid grid-cols-3 gap-4">
              <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p class="text-xs text-gray-500 uppercase">Interactions</p>
                <p class="text-3xl font-bold text-white mt-2">${d(e.interactions)}</p>
                <div class="text-xs text-green-400 mt-1">
                  <i class="fa fa-arrow-up"></i> 15.3% vs last week
                </div>
              </div>
              <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p class="text-xs text-gray-500 uppercase">Click Rate</p>
                <p class="text-3xl font-bold text-white mt-2">${(e.clicks/e.views*100).toFixed(1)}%</p>
                <div class="text-xs text-green-400 mt-1">
                  <i class="fa fa-arrow-up"></i> 3.2% vs last week
                </div>
              </div>
              <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p class="text-xs text-gray-500 uppercase">Conversion Rate</p>
                <p class="text-3xl font-bold text-white mt-2">${(e.conversions/e.views*100).toFixed(1)}%</p>
                <div class="text-xs text-red-400 mt-1">
                  <i class="fa fa-arrow-down"></i> 1.1% vs last week
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
              <h3 class="text-sm font-semibold text-white mb-4">Engagement Funnel</h3>
              <div class="space-y-4">
                ${[{stage:"Views",value:e.views,percent:100,color:"violet"},{stage:"Watched > 10s",value:Math.floor(e.views*.72),percent:72,color:"fuchsia"},{stage:"Watched > 50%",value:Math.floor(e.views*.45),percent:45,color:"pink"},{stage:"Watched to End",value:Math.floor(e.views*e.completionRate),percent:Math.floor(e.completionRate*100),color:"rose"},{stage:"Click CTA",value:e.clicks,percent:Math.floor(e.clicks/e.views*100),color:"red"},{stage:"Converted",value:e.conversions,percent:Math.floor(e.conversions/e.views*100),color:"orange"}].map((i,o)=>`
                  <div class="relative">
                    <div class="flex items-center gap-4">
                      <div class="w-32 text-sm text-gray-400 text-right">${i.stage}</div>
                      <div class="flex-1">
                        <div class="h-8 bg-gray-700/50 rounded-lg overflow-hidden">
                          <div class="h-full bg-${i.color}-500/80 rounded-lg flex items-center px-3 transition-all duration-500"
                               style="width: ${i.percent}%">
                            <span class="text-white text-sm font-medium">${d(i.value)}</span>
                          </div>
                        </div>
                      </div>
                      <div class="w-16 text-sm text-white font-medium">${i.percent}%</div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `:""}

        ${t.activeTab==="audience"?`
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Geographic Distribution</h3>
                <div class="space-y-2">
                  ${e.geographic.map(i=>`
                    <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">${i.country}</div>
                      <div class="flex-1">
                        <div class="flex justify-between text-sm mb-1">
                          <span class="text-gray-400">${i.country==="US"?"United States":i.country==="UK"?"United Kingdom":i.country==="CA"?"Canada":i.country==="AU"?"Australia":i.country}</span>
                          <span class="text-white">${d(i.visitors)}</span>
                        </div>
                        <div class="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div class="h-full bg-violet-500 rounded-full" style="width: ${i.percentage*100}%"></div>
                        </div>
                      </div>
                      <span class="text-sm text-gray-500">${(i.percentage*100).toFixed(0)}%</span>
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Device Analytics</h3>
                <div class="grid grid-cols-3 gap-4 mb-6">
                  ${[{device:"Desktop",percent:45,sessions:3943,avgTime:"4:32",icon:"fa-desktop"},{device:"Mobile",percent:42,sessions:3680,avgTime:"2:18",icon:"fa-mobile-alt"},{device:"Tablet",percent:13,sessions:1139,avgTime:"3:45",icon:"fa-tablet-alt"}].map(i=>`
                    <div class="text-center p-4 rounded-lg bg-gray-700/50">
                      <i class="fa ${i.icon} text-2xl text-violet-400 mb-2"></i>
                      <p class="text-lg font-semibold text-white">${i.percent}%</p>
                      <p class="text-xs text-gray-500">${i.sessions.toLocaleString()}</p>
                    </div>
                  `).join("")}
                </div>
                <div class="space-y-3">
                  <h4 class="text-sm font-medium text-gray-400">Browser Distribution</h4>
                  ${[{browser:"Chrome",share:.62},{browser:"Safari",share:.19},{browser:"Firefox",share:.09},{browser:"Edge",share:.06},{browser:"Other",share:.04}].map(i=>`
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-400">${i.browser}</span>
                      <div class="flex items-center gap-2">
                        <div class="w-24 h-1.5 bg-gray-700 rounded-full">
                          <div class="h-full bg-violet-500 rounded-full" style="width: ${i.share*100}%"></div>
                        </div>
                        <span class="text-sm text-white w-10 text-right">${(i.share*100).toFixed(0)}%</span>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>
        `:""}

        ${t.activeTab==="events"?`
          <div class="space-y-6">
            <div class="grid grid-cols-5 gap-4">
              ${e.events.map(i=>`
                <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-center">
                  <p class="text-2xl font-bold text-white">${d(i.count)}</p>
                  <p class="text-xs text-gray-500 mt-1">${i.name}</p>
                  <p class="text-sm text-violet-400 mt-2">${(i.conversion*100).toFixed(1)}%</p>
                </div>
              `).join("")}
            </div>

            <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
              <h3 class="text-sm font-semibold text-white mb-4">Event Timeline</h3>
              <div class="space-y-4">
                ${e.events.map((i,o)=>`
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center">
                      <span class="text-sm font-bold">${o+1}</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between mb-1">
                        <span class="text-sm font-medium text-white">${i.name}</span>
                        <span class="text-sm text-gray-400">${d(i.count)} events</span>
                      </div>
                      <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style="width: ${Math.min(i.count/e.views*100*3,100)}%"></div>
                      </div>
                    </div>
                    <span class="text-sm font-medium text-violet-400">${(i.conversion*100).toFixed(1)}%</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `:""}
      </div>
    `,u()}function u(){r.querySelectorAll(".tab-btn").forEach(p=>{p.addEventListener("click",()=>{t.activeTab=p.dataset.tab,a()})});const i=r.querySelector("#time-range");i&&i.addEventListener("change",p=>{t.timeRange=p.target.value});const o=r.querySelector("#export-btn");o&&o.addEventListener("click",()=>{const p={...e,exportedAt:new Date().toISOString(),timeRange:t.timeRange},c=new Blob([JSON.stringify(p,null,2)],{type:"application/json"}),m=URL.createObjectURL(c),v=document.createElement("a");v.href=m,v.download=`analytics-${t.timeRange}-${Date.now()}.json`,v.click(),URL.revokeObjectURL(m)})}return a(),r.api={refresh:()=>a(),setTimeRange:i=>{t.timeRange=i,a()}},r}function ae({initialTheme:n={},onChange:s,onSave:e}){const t={colors:{primary:"#8b5cf6",secondary:"#ec4899",accent:"#06b6d4",background:"#111827",surface:"#1f2937",text:"#f9fafb",muted:"#6b7280",success:"#10b981",warning:"#f59e0b",error:"#ef4444"},typography:{fontFamily:"Inter",headingFont:"Inter",baseSize:16,lineHeight:1.6,headingWeight:600,bodyWeight:400},spacing:{base:4,scale:1.5},radius:{small:"4px",medium:"8px",large:"16px",xl:"24px"},shadows:{sm:"0 1px 2px rgba(0,0,0,0.1)",md:"0 4px 6px rgba(0,0,0,0.1)",lg:"0 10px 25px rgba(0,0,0,0.15)",glow:"0 0 20px rgba(139, 92, 246, 0.3)"},animations:{enabled:!0,duration:300,easing:"cubic-bezier(0.4, 0, 0.2, 1)"},darkMode:!0,glassMorphism:!0},r={theme:{...t,...n},activeTab:"colors",presets:[{name:"Default Dark",colors:t.colors},{name:"Midnight",colors:{...t.colors,primary:"#6366f1",background:"#0f172a",surface:"#1e293b"}},{name:"Forest",colors:{...t.colors,primary:"#22c55e",secondary:"#84cc16",accent:"#14b8a6"}},{name:"Sunset",colors:{...t.colors,primary:"#f97316",secondary:"#f43f5e",accent:"#eab308"}},{name:"Ocean",colors:{...t.colors,primary:"#0ea5e9",secondary:"#06b6d4",accent:"#8b5cf6"}}]},d=document.createElement("div");d.className="theme-customizer flex flex-col h-full bg-gray-900";function l(o,p){const c=o.split(".");let m=r.theme;for(let v=0;v<c.length-1;v++)m=m[c[v]];m[c[c.length-1]]=p,s&&s(r.theme),u()}function a(){const o=r.theme;return`
:root {
  --color-primary: ${o.colors.primary};
  --color-secondary: ${o.colors.secondary};
  --color-accent: ${o.colors.accent};
  --color-bg: ${o.colors.background};
  --color-surface: ${o.colors.surface};
  --color-text: ${o.colors.text};
  --color-muted: ${o.colors.muted};
  --font-main: ${o.typography.fontFamily}, sans-serif;
  --font-heading: ${o.typography.headingFont}, sans-serif;
  --radius-sm: ${o.radius.small};
  --radius-md: ${o.radius.medium};
  --radius-lg: ${o.radius.large};
  --shadow-glow: ${o.shadows.glow};
}`}function u(){const o=r.theme;d.innerHTML=`
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
            ${r.presets.map((p,c)=>`<option value="${c}">${p.name}</option>`).join("")}
          </select>
          <button id="save-theme" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-save"></i> Save
          </button>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <div class="w-64 border-r border-gray-800 p-4 space-y-2">
          ${[["colors","Colors","fa-palette"],["typography","Typography","fa-font"],["layout","Layout & Spacing","fa-expand"],["effects","Effects","fa-magic"]].map(([p,c,m])=>`
            <button class="tab-btn w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${r.activeTab===p?"bg-violet-500/20 text-violet-300":"text-gray-400 hover:bg-gray-800"}"
                    data-tab="${p}">
              <i class="fa ${m} w-5"></i>
              <span class="text-sm font-medium">${c}</span>
            </button>
          `).join("")}
        </div>

        <div class="flex-1 flex">
          <div class="flex-1 p-6 overflow-y-auto space-y-6">
            ${r.activeTab==="colors"?`
              <div>
                <h3 class="text-sm font-semibold text-white mb-4">Brand Colors</h3>
                <div class="grid grid-cols-2 gap-4">
                  ${[["colors.primary","Primary","The main brand color used for buttons and CTAs"],["colors.secondary","Secondary","Accent color for highlights and secondary actions"],["colors.accent","Accent","Tertiary color for emphasis and special elements"]].map(([p,c,m])=>`
                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-medium text-white">${c}</label>
                        <div class="flex items-center gap-2">
                          <input type="color" value="${o.colors[p.split(".")[1]]}" 
                                 class="w-8 h-8 rounded cursor-pointer bg-transparent"
                                 data-color-path="${p}">
                          <input type="text" value="${o.colors[p.split(".")[1]]}" 
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
                  ${[["colors.background","Background","Main page background color"],["colors.surface","Surface","Cards, modals, and elevated surfaces"],["colors.text","Text","Primary text color for readability"],["colors.muted","Muted","Secondary and placeholder text"],["colors.success","Success","Success states and confirmations"],["colors.error","Error","Error states and warnings"]].map(([p,c,m])=>`
                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-medium text-white">${c}</label>
                        <div class="flex items-center gap-2">
                          <input type="color" value="${o.colors[p.split(".")[1]]}" 
                                 class="w-6 h-6 rounded cursor-pointer bg-transparent"
                                 data-color-path="${p}">
                          <input type="text" value="${o.colors[p.split(".")[1]]}" 
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
                      <input type="checkbox" id="dark-mode-toggle" class="sr-only peer" ${o.darkMode?"checked":""}>
                      <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            `:""}

            ${r.activeTab==="typography"?`
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Font Family</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Primary Font</label>
                      <select id="font-family" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                        <option value="Inter" ${o.typography.fontFamily==="Inter"?"selected":""}>Inter</option>
                        <option value="Roboto" ${o.typography.fontFamily==="Roboto"?"selected":""}>Roboto</option>
                        <option value="Open Sans" ${o.typography.fontFamily==="Open Sans"?"selected":""}>Open Sans</option>
                        <option value="Poppins" ${o.typography.fontFamily==="Poppins"?"selected":""}>Poppins</option>
                        <option value="Manrope" ${o.typography.fontFamily==="Manrope"?"selected":""}>Manrope</option>
                        <option value="DM Sans" ${o.typography.fontFamily==="DM Sans"?"selected":""}>DM Sans</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Heading Font</label>
                      <select id="heading-font" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                        <option value="Inter" ${o.typography.headingFont==="Inter"?"selected":""}>Inter</option>
                        <option value="Poppins" ${o.typography.headingFont==="Poppins"?"selected":""}>Poppins</option>
                        <option value="Montserrat" ${o.typography.headingFont==="Montserrat"?"selected":""}>Montserrat</option>
                        <option value="Outfit" ${o.typography.headingFont==="Outfit"?"selected":""}>Outfit</option>
                        <option value="Syne" ${o.typography.headingFont==="Syne"?"selected":""}>Syne</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Text Sizing</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Base Font Size</label>
                      <input type="range" id="base-size" min="12" max="20" value="${o.typography.baseSize}" class="w-full">
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>12px</span>
                        <span class="text-white">${o.typography.baseSize}px</span>
                        <span>20px</span>
                      </div>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Line Height</label>
                      <input type="range" id="line-height" min="1" max="2" step="0.1" value="${o.typography.lineHeight}" class="w-full">
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1.0</span>
                        <span class="text-white">${o.typography.lineHeight}</span>
                        <span>2.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `:""}

            ${r.activeTab==="layout"?`
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Border Radius</h3>
                  <div class="grid grid-cols-2 gap-4">
                    ${[["radius.small","Small","Inputs, badges"],["radius.medium","Medium","Buttons, cards"],["radius.large","Large","Modals, containers"],["radius.xl","Extra Large","Hero elements"]].map(([p,c,m])=>`
                      <div class="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <label class="text-sm text-white block mb-1">${c}</label>
                        <input type="text" value="${o.radius[p.split(".")[1]]}" 
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
                    <input type="range" id="spacing-scale" min="1" max="2" step="0.1" value="${o.spacing.scale}" class="w-full">
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Compact (1.0)</span>
                      <span class="text-white">${o.spacing.scale}x</span>
                      <span>Spacious (2.0)</span>
                    </div>
                  </div>
                </div>
              </div>
            `:""}

            ${r.activeTab==="effects"?`
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
                        <input type="checkbox" id="glass-toggle" class="sr-only peer" ${o.glassMorphism?"checked":""}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>

                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-white">Animations</label>
                        <p class="text-xs text-gray-500">Enable smooth transitions and micro-interactions</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="animations-toggle" class="sr-only peer" ${o.animations.enabled?"checked":""}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>

                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <label class="text-sm font-medium text-white block mb-2">Animation Duration</label>
                      <input type="range" id="anim-duration" min="100" max="1000" step="50" value="${o.animations.duration}" class="w-full">
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Fast (100ms)</span>
                        <span class="text-white">${o.animations.duration}ms</span>
                        <span>Slow (1000ms)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Shadow Presets</h3>
                  <div class="grid grid-cols-2 gap-3">
                    ${Object.entries(o.shadows).map(([p,c])=>`
                      <div class="p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:border-violet-500 transition-colors"
                           style="box-shadow: ${c}">
                        <span class="text-sm text-white capitalize">${p}</span>
                        <p class="text-xs text-gray-500 truncate">${c.substring(0,40)}...</p>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>
            `:""}
          </div>

          <div class="w-80 border-l border-gray-800 p-6">
            <h3 class="text-sm font-semibold text-white mb-4">Live Preview</h3>
            <div class="p-6 rounded-xl" style="background: ${o.colors.surface}; border: 1px solid ${o.colors.muted}40;">
              <h4 style="color: ${o.colors.text}; font-size: ${o.typography.baseSize*1.5}px; margin-bottom: 12px;">Heading Text</h4>
              <p style="color: ${o.colors.muted}; font-size: ${o.typography.baseSize}px; line-height: ${o.typography.lineHeight}; margin-bottom: 16px;">This is how body text appears in your theme.</p>
              <button style="background: ${o.colors.primary}; color: ${o.colors.text}; padding: 10px 20px; border-radius: ${o.radius.medium}; border: none; font-weight: 500; cursor: pointer;">
                Primary Button
              </button>
            </div>

            <div class="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <h4 class="text-sm font-semibold text-white mb-2">CSS Variables</h4>
              <pre class="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap" style="max-height: 200px; overflow-y: auto;">${a()}</pre>
            </div>

            <button id="copy-css" class="w-full mt-4 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
              <i class="fa fa-copy"></i> Copy CSS
            </button>
          </div>
        </div>
      </div>
    `,i()}function i(){d.querySelectorAll(".tab-btn").forEach($=>{$.addEventListener("click",()=>{r.activeTab=$.dataset.tab,u()})}),d.querySelectorAll("[data-color-path]").forEach($=>{$.addEventListener("input",M=>{const x=M.target.dataset.colorPath;l(x,M.target.value);const k=d.querySelector(`[data-color-text-path="${x}"]`);k&&(k.value=M.target.value)})}),d.querySelectorAll("[data-color-text-path]").forEach($=>{$.addEventListener("input",M=>{const x=M.target.dataset.colorTextPath;l(x,M.target.value);const k=d.querySelector(`[data-color-path="${x}"]`);k&&(k.value=M.target.value)})});const o=d.querySelector("#preset-select");o&&o.addEventListener("change",$=>{const M=r.presets[parseInt($.target.value)];M&&(r.theme.colors={...M.colors},s&&s(r.theme),u())});const p=d.querySelector("#save-theme");p&&p.addEventListener("click",()=>{e&&e(r.theme)});const c=d.querySelector("#dark-mode-toggle");c&&c.addEventListener("change",$=>{l("darkMode",$.target.checked)});const m=d.querySelector("#font-family");m&&m.addEventListener("change",$=>{l("typography.fontFamily",$.target.value)});const v=d.querySelector("#heading-font");v&&v.addEventListener("change",$=>{l("typography.headingFont",$.target.value)});const g=d.querySelector("#base-size");g&&g.addEventListener("input",$=>{l("typography.baseSize",parseInt($.target.value))});const f=d.querySelector("#line-height");f&&f.addEventListener("input",$=>{l("typography.lineHeight",parseFloat($.target.value))});const h=d.querySelector("#spacing-scale");h&&h.addEventListener("input",$=>{l("spacing.scale",parseFloat($.target.value))});const b=d.querySelector("#glass-toggle");b&&b.addEventListener("change",$=>{l("glassMorphism",$.target.checked)});const w=d.querySelector("#animations-toggle");w&&w.addEventListener("change",$=>{l("animations.enabled",$.target.checked)});const E=d.querySelector("#anim-duration");E&&E.addEventListener("input",$=>{l("animations.duration",parseInt($.target.value))});const L=d.querySelector("#copy-css");L&&L.addEventListener("click",()=>{navigator.clipboard.writeText(a())})}return u(),d.api={getTheme:()=>r.theme,setTheme:o=>{r.theme={...r.theme,...o},u()}},d}function ne({onSelect:n,onImport:s}){const e={templates:[{id:"welcome-video",name:"Welcome Video",category:"Onboarding",thumbnail:"https://images.unsplash.com/photo-1536240478700-b869070f1c59?w=400&h=225&fit=crop",duration:30,tags:["intro","welcome","company"],popular:!0,createdAt:"2024-01-15",lastUsed:"2024-03-10"},{id:"product-demo",name:"Product Demo",category:"Marketing",thumbnail:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",duration:90,tags:["demo","features","showcase"],popular:!0,createdAt:"2024-01-20",lastUsed:"2024-03-12"},{id:"testimonial",name:"Customer Testimonial",category:"Social Proof",thumbnail:"https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",duration:60,tags:["review","testimonial","feedback"],popular:!1,createdAt:"2024-02-01",lastUsed:"2024-03-08"},{id:"how-to",name:"How-To Guide",category:"Educational",thumbnail:"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop",duration:180,tags:["tutorial","guide","education"],popular:!1,createdAt:"2024-02-10",lastUsed:"2024-03-05"},{id:"event-invite",name:"Event Invitation",category:"Events",thumbnail:"https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=225&fit=crop",duration:45,tags:["event","invite","announcement"],popular:!0,createdAt:"2024-02-15",lastUsed:"2024-03-14"},{id:"sale-promo",name:"Sale Promotion",category:"Marketing",thumbnail:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop",duration:30,tags:["sale","promo","discount"],popular:!1,createdAt:"2024-02-20",lastUsed:"2024-03-01"},{id:"team-intro",name:"Team Introduction",category:"Onboarding",thumbnail:"https://images.unsplash.com/photo-1522071820081-009f012c7c71?w=400&h=225&fit=crop",duration:120,tags:["team","intro","culture"],popular:!1,createdAt:"2024-02-25",lastUsed:"2024-02-28"},{id:"announcement",name:"Company Announcement",category:"Internal",thumbnail:"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop",duration:45,tags:["news","update","announcement"],popular:!1,createdAt:"2024-03-01",lastUsed:"2024-03-10"}],categories:["All","Onboarding","Marketing","Educational","Social Proof","Events","Internal"],selectedCategory:"All",searchQuery:"",viewMode:"grid",sortBy:"name",showImportModal:!1},t=document.createElement("div");t.className="template-system flex flex-col h-full bg-gray-900";function r(u){const i=Math.floor(u/60),o=u%60;return i>0?`${i}:${o.toString().padStart(2,"0")}`:`${o}s`}function d(){let u=e.templates;if(e.selectedCategory!=="All"&&(u=u.filter(i=>i.category===e.selectedCategory)),e.searchQuery.trim()){const i=e.searchQuery.toLowerCase();u=u.filter(o=>o.name.toLowerCase().includes(i)||o.category.toLowerCase().includes(i)||o.tags.some(p=>p.toLowerCase().includes(i)))}return u=[...u].sort((i,o)=>e.sortBy==="name"?i.name.localeCompare(o.name):e.sortBy==="popular"?(o.popular?1:0)-(i.popular?1:0):e.sortBy==="recent"?new Date(o.createdAt)-new Date(i.createdAt):e.sortBy==="duration"?i.duration-o.duration:0),u}function l(){const u=d();t.innerHTML=`
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
            <option value="name" ${e.sortBy==="name"?"selected":""}>Name</option>
            <option value="popular" ${e.sortBy==="popular"?"selected":""}>Popularity</option>
            <option value="recent" ${e.sortBy==="recent"?"selected":""}>Recently Added</option>
            <option value="duration" ${e.sortBy==="duration"?"selected":""}>Duration</option>
          </select>

          <div class="flex border border-gray-700 rounded-lg p-1">
            <button class="view-btn px-3 py-1 rounded ${e.viewMode==="grid"?"bg-violet-500/20 text-violet-400":"text-gray-400"} text-sm transition-colors"
                    data-view="grid">
              <i class="fa fa-th-large"></i>
            </button>
            <button class="view-btn px-3 py-1 rounded ${e.viewMode==="list"?"bg-violet-500/20 text-violet-400":"text-gray-400"} text-sm transition-colors"
                    data-view="list">
              <i class="fa fa-list"></i>
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          ${e.categories.map(i=>`
            <button class="category-btn px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${e.selectedCategory===i?"bg-violet-600 text-white":"bg-gray-800 text-gray-400 hover:bg-gray-700"}"
                    data-category="${i}">
              ${i}
              ${i!=="All"?`<span class="ml-2 text-xs opacity-70">${e.templates.filter(o=>o.category===i).length}</span>`:""}
            </button>
          `).join("")}
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        ${u.length===0?`
          <div class="text-center py-20">
            <div class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-search text-gray-600 text-2xl"></i>
            </div>
            <h3 class="text-lg text-white font-medium mb-2">No templates found</h3>
            <p class="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        `:e.viewMode==="grid"?`
          <div class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            ${u.map(i=>`
              <div class="template-card group relative rounded-xl bg-gray-800/50 border border-gray-700 hover:border-violet-500 transition-all overflow-hidden cursor-pointer"
                   data-template-id="${i.id}">
                <div class="aspect-video bg-gray-800 relative overflow-hidden">
                  <img src="${i.thumbnail}" alt="${i.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">${r(i.duration)}</div>
                  ${i.popular?`
                    <div class="absolute top-2 left-2 px-2 py-1 rounded-full bg-violet-500/90 text-white text-xs flex items-center gap-1">
                      <i class="fa fa-fire"></i> Popular
                    </div>
                  `:""}
                  <div class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="preview-btn w-10 h-10 rounded-full bg-white/90 text-gray-900 hover:bg-white flex items-center justify-center transition-colors"
                            data-template-id="${i.id}">
                      <i class="fa fa-play"></i>
                    </button>
                  </div>
                </div>
                <div class="p-3">
                  <h3 class="text-sm font-medium text-white truncate">${i.name}</h3>
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-xs text-gray-500">${i.category}</span>
                    <span class="text-xs text-gray-500">${new Date(i.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div class="flex flex-wrap gap-1 mt-2">
                    ${i.tags.slice(0,2).map(o=>`
                      <span class="px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 text-xs">${o}</span>
                    `).join("")}
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        `:`
          <div class="space-y-2">
            ${u.map(i=>`
              <div class="template-card flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-violet-500 transition-all cursor-pointer"
                   data-template-id="${i.id}">
                <div class="w-24 aspect-video rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                  <img src="${i.thumbnail}" alt="${i.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-medium text-white">${i.name}</h3>
                    ${i.popular?`
                      <span class="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs">
                        <i class="fa fa-fire text-[10px]"></i>
                      </span>
                    `:""}
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">${i.category}</p>
                  <div class="flex items-center gap-2 mt-1">
                    ${i.tags.slice(0,3).map(o=>`
                      <span class="px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 text-xs">${o}</span>
                    `).join("")}
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <div class="text-sm text-white">${r(i.duration)}</div>
                  <div class="text-xs text-gray-500">${new Date(i.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button class="apply-btn px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs hover:bg-violet-500 transition-colors"
                          data-template-id="${i.id}">
                    Apply
                  </button>
                  <button class="action-btn w-8 h-8 rounded-lg bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center"
                          data-template-id="${i.id}">
                    <i class="fa fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>

      ${e.showImportModal?`
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
      `:""}
    `,a()}function a(){const u=t.querySelector("#search-input");u&&u.addEventListener("input",g=>{e.searchQuery=g.target.value,l()});const i=t.querySelector("#sort-select");i&&i.addEventListener("change",g=>{e.sortBy=g.target.value,l()}),t.querySelectorAll(".view-btn").forEach(g=>{g.addEventListener("click",()=>{e.viewMode=g.dataset.view,l()})}),t.querySelectorAll(".category-btn").forEach(g=>{g.addEventListener("click",()=>{e.selectedCategory=g.dataset.category,l()})}),t.querySelectorAll(".template-card").forEach(g=>{g.addEventListener("click",f=>{if(!f.target.closest(".preview-btn")&&!f.target.closest(".apply-btn")&&!f.target.closest(".action-btn")){const h=e.templates.find(b=>b.id===g.dataset.templateId);h&&n&&n(h)}})}),t.querySelectorAll(".preview-btn").forEach(g=>{g.addEventListener("click",f=>{f.stopPropagation();const h=e.templates.find(b=>b.id===g.dataset.templateId);h&&console.log("Preview template:",h.name)})}),t.querySelectorAll(".apply-btn").forEach(g=>{g.addEventListener("click",f=>{f.stopPropagation();const h=e.templates.find(b=>b.id===g.dataset.templateId);h&&n&&n(h)})});const o=t.querySelector("#import-btn");o&&o.addEventListener("click",()=>{e.showImportModal=!0,l()});const p=t.querySelector("#cancel-import");p&&p.addEventListener("click",()=>{e.showImportModal=!1,l()});const c=t.querySelector("#drop-zone"),m=t.querySelector("#template-file");c&&m&&(c.addEventListener("click",()=>m.click()),c.addEventListener("dragover",g=>{g.preventDefault(),c.classList.add("border-violet-500")}),c.addEventListener("dragleave",()=>{c.classList.remove("border-violet-500")}),c.addEventListener("drop",g=>{g.preventDefault(),c.classList.remove("border-violet-500");const f=g.dataTransfer.files;f.length>0&&s&&(s(f[0]),e.showImportModal=!1,l())}),m.addEventListener("change",g=>{g.target.files.length>0&&s&&(s(g.target.files[0]),e.showImportModal=!1,l())}));const v=t.querySelector("#import-modal");v&&v.addEventListener("click",g=>{g.target===v&&(e.showImportModal=!1,l())})}return l(),t.api={getTemplates:()=>e.templates,addTemplate:u=>{e.templates.push({...u,id:Date.now().toString(),createdAt:new Date().toISOString()}),l()},removeTemplate:u=>{e.templates=e.templates.filter(i=>i.id!==u),l()}},t}function le({onSave:n,onChange:s}){const e={navItems:[{id:"home",label:"Home",href:"/",icon:"fa-home",active:!0,visible:!0},{id:"projects",label:"Projects",href:"/projects",icon:"fa-folder",active:!1,visible:!0},{id:"templates",label:"Templates",href:"/templates",icon:"fa-th-large",active:!1,visible:!0},{id:"analytics",label:"Analytics",href:"/analytics",icon:"fa-chart-bar",active:!1,visible:!0},{id:"team",label:"Team",href:"/team",icon:"fa-users",active:!1,visible:!1},{id:"settings",label:"Settings",href:"/settings",icon:"fa-cog",active:!1,visible:!0}],config:{position:"top",style:"horizontal",theme:"dark",collapsed:!1,showIcons:!0,showLabels:!0,enableDropdown:!0},editingItem:null,dragIndex:null},t=document.createElement("div");t.className="navigation-builder flex flex-col h-full bg-gray-900";function r(){t.innerHTML=`
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
              ${e.navItems.map((a,u)=>{var i;return`
                <div class="nav-item-card p-3 rounded-lg bg-gray-800/50 border border-gray-700 cursor-move transition-all hover:border-violet-500 ${((i=e.editingItem)==null?void 0:i.id)===a.id?"border-violet-500 bg-violet-500/10":""} ${a.visible?"":"opacity-50"}"
                     draggable="true"
                     data-index="${u}"
                     data-item-id="${a.id}">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-gray-400">
                      <i class="fa fa-grip-vertical text-xs"></i>
                    </div>
                    <i class="fa ${a.icon} text-gray-500 w-5"></i>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm text-white font-medium">${a.label}</div>
                      <div class="text-xs text-gray-500 truncate">${a.href}</div>
                    </div>
                    <button class="edit-item-btn w-7 h-7 rounded hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center"
                            data-item-id="${a.id}">
                      <i class="fa fa-pencil text-xs"></i>
                    </button>
                    <button class="toggle-visibility-btn w-7 h-7 rounded hover:bg-gray-700 ${a.visible?"text-gray-400":"text-gray-600"} flex items-center justify-center"
                            data-item-id="${a.id}">
                      <i class="fa ${a.visible?"fa-eye":"fa-eye-slash"} text-xs"></i>
                    </button>
                  </div>
                </div>
              `}).join("")}
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
                  ${["top","left","right"].map(a=>`
                    <button class="position-btn px-4 py-1.5 rounded text-sm font-medium transition-colors ${e.config.position===a?"bg-violet-600 text-white":"text-gray-400 hover:text-white"}"
                            data-position="${a}">
                      ${a.charAt(0).toUpperCase()+a.slice(1)}
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Style</label>
                <div class="flex rounded-lg bg-gray-800 p-1">
                  ${["horizontal","vertical","minimal"].map(a=>`
                    <button class="style-btn px-4 py-1.5 rounded text-sm font-medium transition-colors ${e.config.style===a?"bg-violet-600 text-white":"text-gray-400 hover:text-white"}"
                            data-style="${a}">
                      ${a.charAt(0).toUpperCase()+a.slice(1)}
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Theme</label>
                <div class="flex rounded-lg bg-gray-800 p-1">
                  ${["dark","light","glass"].map(a=>`
                    <button class="theme-btn px-4 py-1.5 rounded text-sm font-medium transition-colors ${e.config.theme===a?"bg-violet-600 text-white":"text-gray-400 hover:text-white"}"
                            data-theme="${a}">
                      ${a.charAt(0).toUpperCase()+a.slice(1)}
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="show-icons" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${e.config.showIcons?"checked":""}>
                <span class="text-sm text-gray-400">Show Icons</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="show-labels" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${e.config.showLabels?"checked":""}>
                <span class="text-sm text-gray-400">Show Labels</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="collapsed" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${e.config.collapsed?"checked":""}>
                <span class="text-sm text-gray-400">Collapsed</span>
              </label>
            </div>
          </div>

          <div class="flex-1 p-8 bg-gray-800/30">
            <h3 class="text-sm font-semibold text-white mb-4">Preview</h3>
            ${d()}
          </div>
        </div>

        ${e.editingItem?`
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
                  ${["fa-home","fa-folder","fa-th-large","fa-chart-bar","fa-users","fa-cog","fa-file","fa-envelope","fa-bell","fa-star","fa-heart","fa-image","fa-video","fa-music","fa-link"].map(a=>`
                    <button class="icon-btn p-2 rounded-lg border ${e.editingItem.icon===a?"border-violet-500 bg-violet-500/20 text-violet-400":"border-gray-700 text-gray-400 hover:border-gray-600"}"
                            data-icon="${a}">
                      <i class="fa ${a}"></i>
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
        `:""}
      </div>
    `,l()}function d(){const{config:a}=e,u=e.navItems.filter(o=>o.visible),i=a.theme==="dark"?"bg-gray-900 border-gray-800 text-white":a.theme==="light"?"bg-white border-gray-200 text-gray-900":"bg-gray-900/50 backdrop-blur-lg border-white/10 text-white";return a.position==="top"?`
        <div class="p-4 rounded-xl border ${i}">
          <nav class="flex items-center gap-1">
            <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center mr-4">
              <i class="fa fa-bolt text-white"></i>
            </div>
            ${a.style==="minimal"?"":`
              <div class="flex items-center gap-1">
                ${u.map(o=>`
                  <a href="${o.href}" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors ${o.active?"bg-violet-600 text-white":"hover:bg-white/10"}">
                    ${a.showIcons?`<i class="fa ${o.icon} mr-2"></i>`:""}
                    ${a.showLabels?o.label:""}
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
      `:`
        <div class="flex gap-4 ${a.position==="right"?"flex-row-reverse":""}">
          <div class="w-64 p-4 rounded-xl border ${i}">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <i class="fa fa-bolt text-white"></i>
              </div>
              ${a.collapsed?"":'<span class="font-semibold">Remix Go</span>'}
            </div>
            <nav class="space-y-1">
              ${u.map(o=>`
                <a href="${o.href}" class="flex items-center ${a.collapsed?"justify-center":"gap-3"} px-3 py-2 rounded-lg text-sm font-medium transition-colors ${o.active?"bg-violet-600 text-white":"hover:bg-white/10"}">
                  <i class="fa ${o.icon} w-5 text-center"></i>
                  ${!a.collapsed&&a.showLabels?o.label:""}
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
      `}function l(){const a=t.querySelector("#nav-items-list");a&&a.querySelectorAll(".nav-item-card").forEach(h=>{h.addEventListener("dragstart",b=>{e.dragIndex=parseInt(h.dataset.index),h.classList.add("opacity-50")}),h.addEventListener("dragend",()=>{h.classList.remove("opacity-50"),e.dragIndex=null}),h.addEventListener("dragover",b=>{if(b.preventDefault(),e.dragIndex!==null&&e.dragIndex!==parseInt(h.dataset.index)){const w=parseInt(h.dataset.index),E=[...e.navItems],[L]=E.splice(e.dragIndex,1);E.splice(w,0,L),e.navItems=E,e.dragIndex=w,r()}})}),t.querySelectorAll(".edit-item-btn").forEach(h=>{h.addEventListener("click",()=>{const b=e.navItems.find(w=>w.id===h.dataset.itemId);b&&(e.editingItem={...b},r())})}),t.querySelectorAll(".toggle-visibility-btn").forEach(h=>{h.addEventListener("click",()=>{const b=e.navItems.find(w=>w.id===h.dataset.itemId);b&&(b.visible=!b.visible,r())})}),t.querySelectorAll(".position-btn").forEach(h=>{h.addEventListener("click",()=>{e.config.position=h.dataset.position,r()})}),t.querySelectorAll(".style-btn").forEach(h=>{h.addEventListener("click",()=>{e.config.style=h.dataset.style,r()})}),t.querySelectorAll(".theme-btn").forEach(h=>{h.addEventListener("click",()=>{e.config.theme=h.dataset.theme,r()})});const u=t.querySelector("#show-icons");u&&u.addEventListener("change",h=>{e.config.showIcons=h.target.checked,r()});const i=t.querySelector("#show-labels");i&&i.addEventListener("change",h=>{e.config.showLabels=h.target.checked,r()});const o=t.querySelector("#collapsed");o&&o.addEventListener("change",h=>{e.config.collapsed=h.target.checked,r()});const p=t.querySelector("#close-edit");p&&p.addEventListener("click",()=>{e.editingItem=null,r()}),t.querySelectorAll(".icon-btn").forEach(h=>{h.addEventListener("click",()=>{e.editingItem&&(e.editingItem.icon=h.dataset.icon,r())})});const c=t.querySelector("#update-item");c&&c.addEventListener("click",()=>{const h=t.querySelector("#edit-label"),b=t.querySelector("#edit-href");if(e.editingItem&&h&&b){const w=e.navItems.findIndex(E=>E.id===e.editingItem.id);w!==-1&&(e.navItems[w]={...e.navItems[w],label:h.value,href:b.value,icon:e.editingItem.icon},e.editingItem=null,r())}});const m=t.querySelector("#delete-item");m&&m.addEventListener("click",()=>{e.editingItem&&(e.navItems=e.navItems.filter(h=>h.id!==e.editingItem.id),e.editingItem=null,r())});const v=t.querySelector("#add-item-btn");v&&v.addEventListener("click",()=>{const h=Date.now().toString();e.navItems.push({id:h,label:"New Item",href:"/new",icon:"fa-link",visible:!0,active:!1}),e.editingItem={...e.navItems[e.navItems.length-1]},r()});const g=t.querySelector("#save-btn");g&&g.addEventListener("click",()=>{n&&n(e.navItems,e.config)});const f=t.querySelector("#reset-btn");f&&f.addEventListener("click",()=>{e.navItems=[{id:"home",label:"Home",href:"/",icon:"fa-home",active:!0,visible:!0},{id:"projects",label:"Projects",href:"/projects",icon:"fa-folder",active:!1,visible:!0},{id:"templates",label:"Templates",href:"/templates",icon:"fa-th-large",active:!1,visible:!0},{id:"analytics",label:"Analytics",href:"/analytics",icon:"fa-chart-bar",active:!1,visible:!0},{id:"settings",label:"Settings",href:"/settings",icon:"fa-cog",active:!1,visible:!0}],e.config={position:"top",style:"horizontal",theme:"dark",collapsed:!1,showIcons:!0,showLabels:!0,enableDropdown:!0},r()})}return r(),t.api={getNavItems:()=>e.navItems,getConfig:()=>e.config,setNavItems:a=>{e.navItems=a,r()},setConfig:a=>{e.config={...e.config,...a},r()}},t}function de({onSave:n,onExport:s}){const e={fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0,validation:{minLength:2,maxLength:100}},{id:"email",type:"email",label:"Email Address",placeholder:"you@example.com",required:!0,validation:{pattern:"^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"}},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message...",required:!0,validation:{minLength:10,maxLength:1e3}}],settings:{title:"Contact Form",description:"Get in touch with us",submitText:"Submit",successMessage:"Thank you for your submission!",method:"POST",action:"/api/submit",styling:{theme:"default",layout:"vertical",labelPosition:"above",showPlaceholders:!0,showRequiredIndicator:!0}},selectedField:null},t=[{id:"text",name:"Text Input",icon:"fa-font"},{id:"email",name:"Email",icon:"fa-envelope"},{id:"number",name:"Number",icon:"fa-hashtag"},{id:"tel",name:"Phone",icon:"fa-phone"},{id:"url",name:"Website URL",icon:"fa-link"},{id:"textarea",name:"Long Text",icon:"fa-align-left"},{id:"select",name:"Dropdown",icon:"fa-chevron-down"},{id:"radio",name:"Radio Buttons",icon:"fa-circle"},{id:"checkbox",name:"Checkbox",icon:"fa-check-square"},{id:"multiselect",name:"Multi Select",icon:"fa-tasks"},{id:"date",name:"Date Picker",icon:"fa-calendar"},{id:"file",name:"File Upload",icon:"fa-upload"}],r=document.createElement("div");r.className="form-builder flex flex-col h-full bg-gray-900";function d(){let i=`<form id="${`form-${Date.now()}`}" method="${e.settings.method}" action="${e.settings.action}" class="form-container">`;return i+=`<h2 class="form-title">${e.settings.title}</h2>`,e.settings.description&&(i+=`<p class="form-description">${e.settings.description}</p>`),e.fields.forEach(o=>{const p=o.required?" required":"",c=o.placeholder?` placeholder="${o.placeholder}"`:"";i+='<div class="form-field">',i+=`<label for="${o.id}">${o.label}${o.required&&e.settings.styling.showRequiredIndicator?" *":""}</label>`,o.type==="textarea"?i+=`<textarea id="${o.id}" name="${o.id}"${c}${p}></textarea>`:o.type==="select"?(i+=`<select id="${o.id}" name="${o.id}"${p}>`,i+='<option value="">Select an option</option>',(o.options||[]).forEach(m=>{i+=`<option value="${m.value}">${m.label}</option>`}),i+="</select>"):i+=`<input type="${o.type}" id="${o.id}" name="${o.id}"${c}${p}>`,i+="</div>"}),i+=`<button type="submit" class="submit-btn">${e.settings.submitText}</button>`,i+="</form>",i}function l(){var u,i;r.innerHTML=`
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
            ${t.map(o=>`
              <button class="add-field-btn p-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-violet-500 transition-colors text-center"
                      data-field-type="${o.id}">
                <i class="fa ${o.icon} text-gray-400 text-lg mb-1"></i>
                <p class="text-xs text-gray-300">${o.name}</p>
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
              ${e.fields.map((o,p)=>{var c,m;return`
                <div class="field-card group p-4 rounded-xl bg-gray-800 border border-gray-700 ${((c=e.selectedField)==null?void 0:c.id)===o.id?"border-violet-500 ring-1 ring-violet-500/20":"hover:border-gray-600"} transition-all cursor-pointer"
                     data-field-id="${o.id}">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-sm font-medium text-white">${o.label}</span>
                        ${o.required?'<span class="text-red-400">*</span>':""}
                        <span class="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400">${((m=t.find(v=>v.id===o.type))==null?void 0:m.name)||o.type}</span>
                      </div>
                      ${o.type==="textarea"?`
                        <textarea disabled class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500 text-sm resize-none" placeholder="${o.placeholder||""}" rows="3"></textarea>
                      `:o.type==="select"?`
                        <select disabled class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500 text-sm">
                          <option>${o.placeholder||"Select an option"}</option>
                        </select>
                      `:`
                        <input disabled type="text" class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500 text-sm" placeholder="${o.placeholder||""}">
                      `}
                    </div>
                    <div class="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button class="move-up-btn w-8 h-8 rounded hover:bg-gray-700 text-gray-400 hover:text-white ${p===0?"opacity-50":""}"
                              data-index="${p}">
                        <i class="fa fa-arrow-up text-xs"></i>
                      </button>
                      <button class="move-down-btn w-8 h-8 rounded hover:bg-gray-700 text-gray-400 hover:text-white ${p===e.fields.length-1?"opacity-50":""}"
                              data-index="${p}">
                        <i class="fa fa-arrow-down text-xs"></i>
                      </button>
                      <button class="delete-field-btn w-8 h-8 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                              data-field-id="${o.id}">
                        <i class="fa fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `}).join("")}
            </div>

            <div class="mt-6 pt-6 border-t border-gray-700">
              <button id="submit-text" class="text-sm text-gray-400 hover:text-white">
                Submit button: <span class="text-white">${e.settings.submitText}</span>
              </button>
            </div>
          </div>
        </div>

        ${e.selectedField?`
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
                <input id="field-placeholder" type="text" value="${e.selectedField.placeholder||""}"
                  class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div class="flex items-center gap-3">
                <input type="checkbox" id="field-required" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${e.selectedField.required?"checked":""}>
                <label for="field-required" class="text-sm text-gray-300">Required field</label>
              </div>

              ${e.selectedField.type==="text"||e.selectedField.type==="textarea"?`
                <div class="space-y-3 pt-3 border-t border-gray-700">
                  <h4 class="text-xs font-semibold text-gray-400">Validation</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Min Length</label>
                      <input id="field-min" type="number" value="${((u=e.selectedField.validation)==null?void 0:u.minLength)||""}"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Max Length</label>
                      <input id="field-max" type="number" value="${((i=e.selectedField.validation)==null?void 0:i.maxLength)||""}"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                    </div>
                  </div>
                </div>
              `:""}

              ${["select","radio","checkbox","multiselect"].includes(e.selectedField.type)?`
                <div class="space-y-3 pt-3 border-t border-gray-700">
                  <h4 class="text-xs font-semibold text-gray-400">Options</h4>
                  <div class="space-y-2" id="field-options">
                    ${(e.selectedField.options||[{value:"option1",label:"Option 1"}]).map((o,p)=>{var c;return`
                      <div class="flex gap-2">
                        <input type="text" value="${o.label}" class="option-label flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white text-sm" data-index="${p}">
                        <input type="text" value="${o.value}" class="option-value w-20 p-2 rounded bg-gray-800 border border-gray-700 text-white text-sm" data-index="${p}">
                        <button class="remove-option p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                ${(((c=e.selectedField.options)==null?void 0:c.length)||1)<=1?"disabled":""}>
                          <i class="fa fa-times"></i>
                        </button>
                      </div>
                    `}).join("")}
                  </div>
                  <button id="add-option" class="w-full py-2 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-violet-500 hover:text-violet-400 text-sm">
                    + Add Option
                  </button>
                </div>
              `:""}
            </div>
          </div>
        `:""}
      </div>
    `,a()}function a(){const u=r.querySelector("#form-title");u&&u.addEventListener("input",f=>{e.settings.title=f.target.value});const i=r.querySelector("#form-description");i&&i.addEventListener("input",f=>{e.settings.description=f.target.value}),r.querySelectorAll(".add-field-btn").forEach(f=>{f.addEventListener("click",()=>{var w;const h=f.dataset.fieldType,b={id:`field-${Date.now()}`,type:h,label:`New ${((w=t.find(E=>E.id===h))==null?void 0:w.name)||"Field"}`,placeholder:"",required:!1,validation:{}};["select","radio","checkbox","multiselect"].includes(h)&&(b.options=[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"}]),e.fields.push(b),e.selectedField=b,l()})}),r.querySelectorAll(".field-card").forEach(f=>{f.addEventListener("click",()=>{const h=e.fields.find(b=>b.id===f.dataset.fieldId);h&&(e.selectedField=h,l())})}),r.querySelectorAll(".delete-field-btn").forEach(f=>{f.addEventListener("click",h=>{var b;h.stopPropagation(),e.fields=e.fields.filter(w=>w.id!==f.dataset.fieldId),((b=e.selectedField)==null?void 0:b.id)===f.dataset.fieldId&&(e.selectedField=null),l()})}),r.querySelectorAll(".move-up-btn").forEach(f=>{f.addEventListener("click",h=>{h.stopPropagation();const b=parseInt(f.dataset.index);b>0&&([e.fields[b],e.fields[b-1]]=[e.fields[b-1],e.fields[b]],l())})}),r.querySelectorAll(".move-down-btn").forEach(f=>{f.addEventListener("click",h=>{h.stopPropagation();const b=parseInt(f.dataset.index);b<e.fields.length-1&&([e.fields[b],e.fields[b+1]]=[e.fields[b+1],e.fields[b]],l())})});const o=r.querySelector("#close-settings");o&&o.addEventListener("click",()=>{e.selectedField=null,l()});const p=r.querySelector("#field-label");p&&p.addEventListener("input",f=>{e.selectedField&&(e.selectedField.label=f.target.value,l())});const c=r.querySelector("#field-placeholder");c&&c.addEventListener("input",f=>{e.selectedField&&(e.selectedField.placeholder=f.target.value,l())});const m=r.querySelector("#field-required");m&&m.addEventListener("change",f=>{e.selectedField&&(e.selectedField.required=f.target.checked,l())});const v=r.querySelector("#save-form");v&&v.addEventListener("click",()=>{n&&n(e.fields,e.settings)});const g=r.querySelector("#export-html");g&&g.addEventListener("click",()=>{const f=d(),h=new Blob([f],{type:"text/html"}),b=URL.createObjectURL(h),w=document.createElement("a");w.href=b,w.download="form.html",w.click(),URL.revokeObjectURL(b)})}return l(),r.api={getFields:()=>e.fields,getSettings:()=>e.settings,generateHTML:d},r}function ce({type:n,title:s,message:e,onClose:t,onConfirm:r}){var u,i,o;const d=document.createElement("div");d.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";const l={error:{icon:"❌",color:"text-red-400",btnClass:"bg-red-600 hover:bg-red-500"},success:{icon:"✅",color:"text-green-400",btnClass:"bg-green-600 hover:bg-green-500"},warning:{icon:"⚠️",color:"text-yellow-400",btnClass:"bg-yellow-600 hover:bg-yellow-500"},info:{icon:"ℹ️",color:"text-blue-400",btnClass:"bg-blue-600 hover:bg-blue-500"},confirm:{icon:"❓",color:"text-violet-400",btnClass:"bg-violet-600 hover:bg-violet-500"}},a=l[n]||l.info;return d.innerHTML=`
    <div class="glass rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
      <div class="text-4xl mb-3">${a.icon}</div>
      <h3 class="text-lg font-semibold text-white mb-2">${s||"Alert"}</h3>
      <p class="text-gray-400 text-sm mb-6">${e||""}</p>
      <div class="flex gap-3 justify-center">
        ${n==="confirm"?`
          <button id="alert-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">Cancel</button>
          <button id="alert-confirm" class="px-4 py-2 rounded-lg ${a.btnClass} text-white text-sm font-semibold transition-colors">Confirm</button>
        `:`
          <button id="alert-ok" class="px-6 py-2 rounded-lg ${a.btnClass} text-white text-sm font-semibold transition-colors">OK</button>
        `}
      </div>
    </div>
  `,n==="confirm"?((u=d.querySelector("#alert-cancel"))==null||u.addEventListener("click",()=>{d.remove(),t&&t()}),(i=d.querySelector("#alert-confirm"))==null||i.addEventListener("click",()=>{d.remove(),r&&r()})):(o=d.querySelector("#alert-ok"))==null||o.addEventListener("click",()=>{d.remove(),t&&t()}),d.addEventListener("click",p=>{p.target===d&&(d.remove(),t&&t())}),d}function ue({title:n,message:s,confirmText:e="Confirm",cancelText:t="Cancel",type:r="warning",onConfirm:d,onCancel:l}){const a=document.createElement("div");a.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";const u={warning:{icon:"⚠️",color:"text-yellow-400",btnColor:"bg-yellow-600 hover:bg-yellow-500"},danger:{icon:"🚨",color:"text-red-400",btnColor:"bg-red-600 hover:bg-red-500"},info:{icon:"ℹ️",color:"text-blue-400",btnColor:"bg-blue-600 hover:bg-blue-500"},success:{icon:"✅",color:"text-green-400",btnColor:"bg-green-600 hover:bg-green-500"}},i=u[r]||u.warning;a.innerHTML=`
    <div class="glass rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
      <div class="text-4xl mb-4 ${i.color}">${i.icon}</div>
      <h3 class="text-lg font-semibold text-white mb-2">${n||"Are you sure?"}</h3>
      <p class="text-gray-400 text-sm mb-6">${s||"This action cannot be undone."}</p>

      <div class="flex gap-3 justify-center">
        <button id="confirm-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
          ${t}
        </button>
        <button id="confirm-ok" class="px-4 py-2 rounded-lg ${i.btnColor} text-white font-semibold transition-colors">
          ${e}
        </button>
      </div>
    </div>
  `,a.querySelector("#confirm-cancel").addEventListener("click",()=>{l&&l(),a.remove()}),a.querySelector("#confirm-ok").addEventListener("click",()=>{d&&d(),a.remove()});const o=p=>{p.key==="Escape"&&(l&&l(),a.remove(),document.removeEventListener("keydown",o))};return document.addEventListener("keydown",o),a.addEventListener("remove",()=>{document.removeEventListener("keydown",o)}),a}function pe({accept:n="*",multiple:s=!1,maxSize:e=100*1024*1024,onSelect:t,onClose:r,title:d="Select Files"}){const l=document.createElement("div");l.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";let a=[];l.innerHTML=`
    <div class="glass rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">${d}</h3>
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
        <p class="text-gray-500 text-sm">Maximum file size: ${R(e)}</p>
        <input type="file" id="file-input" ${s?"multiple":""} accept="${n}" class="hidden">
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
  `;let u=[],i="",o="name";const p=l.querySelector("#upload-zone"),c=l.querySelector("#file-input"),m=l.querySelector("#file-grid"),v=l.querySelector("#search-input"),g=l.querySelector("#type-filter"),f=l.querySelector("#sort-select"),h=l.querySelector("#filepicker-select"),b=l.querySelector("#selection-summary");E(),l.querySelector("#filepicker-close").addEventListener("click",()=>{r&&r(),l.remove()}),l.querySelector("#filepicker-cancel").addEventListener("click",()=>{r&&r(),l.remove()}),l.querySelector("#filepicker-select").addEventListener("click",()=>{t&&a.length>0&&t(s?a:a[0]),l.remove()}),p.addEventListener("click",()=>c.click()),p.addEventListener("dragover",x=>{x.preventDefault(),p.classList.add("border-violet-500","bg-violet-500/10")}),p.addEventListener("dragleave",()=>{p.classList.remove("border-violet-500","bg-violet-500/10")}),p.addEventListener("drop",x=>{x.preventDefault(),p.classList.remove("border-violet-500","bg-violet-500/10");const k=Array.from(x.dataTransfer.files);w(k)}),c.addEventListener("change",()=>{const x=Array.from(c.files);w(x)}),v.addEventListener("input",()=>{E()}),g.addEventListener("change",()=>{i=g.value,E()}),f.addEventListener("change",()=>{o=f.value,E()});function w(x){x.filter(C=>C.size>e?(me(`File "${C.name}" is too large. Maximum size: ${R(e)}`),!1):!0).forEach(C=>{const A={file:C,id:Date.now()+Math.random(),name:C.name,size:C.size,type:C.type,url:URL.createObjectURL(C),lastModified:C.lastModified,category:ve(C.type)};u.push(A)}),E()}function E(){const x=v.value.toLowerCase();let k=u.filter(C=>{const A=C.name.toLowerCase().includes(x),P=!i||C.category===i;return A&&P});k.sort((C,A)=>{switch(o){case"size":return A.size-C.size;case"date":return A.lastModified-C.lastModified;case"type":return C.category.localeCompare(A.category);default:return C.name.localeCompare(A.name)}}),L(k),M()}function L(x){if(m.innerHTML="",x.length===0){m.innerHTML=`
        <div class="col-span-full text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p>No files found</p>
          <p class="text-sm">Upload files or adjust your search</p>
        </div>
      `;return}x.forEach(k=>{const C=document.createElement("div"),A=a.includes(k);C.className=`file-item relative group cursor-pointer rounded-lg overflow-hidden transition-all ${A?"ring-2 ring-violet-500 bg-violet-600/20":"hover:bg-white/5"}`,C.innerHTML=`
        <div class="aspect-square bg-white/5 flex items-center justify-center p-2">
          ${ge(k.category)}
        </div>
        <div class="p-2">
          <p class="text-xs text-white truncate" title="${k.name}">${k.name}</p>
          <p class="text-xs text-gray-500">${R(k.size)}</p>
        </div>
        ${A?`
          <div class="absolute top-1 right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        `:""}
      `,C.addEventListener("click",()=>{s?$(k):(a=[k],E(),M())}),m.appendChild(C)})}function $(x){const k=a.indexOf(x);k>-1?a.splice(k,1):a.push(x),E(),M()}function M(){const x=a.length,k=a.reduce((C,A)=>C+A.size,0);x>0?(b.classList.remove("hidden"),l.querySelector("#selection-count").textContent=`${x} file${x>1?"s":""} selected`,l.querySelector("#selection-size").textContent=`${R(k)} total`):b.classList.add("hidden"),h.disabled=x===0}return l}function ve(n){return n.startsWith("image/")?"image":n.startsWith("video/")?"video":n.startsWith("audio/")?"audio":"document"}function ge(n){const s={image:`<svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>`,video:`<svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
    </svg>`,audio:`<svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
    </svg>`,document:`<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>`};return s[n]||s.document}function R(n){if(n===0)return"0 B";const s=1024,e=["B","KB","MB","GB"],t=Math.floor(Math.log(n)/Math.log(s));return parseFloat((n/Math.pow(s,t)).toFixed(1))+" "+e[t]}function me(n){const s=document.createElement("div");s.className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg z-50",s.textContent=n,document.body.appendChild(s),setTimeout(()=>s.remove(),3e3)}function he({section:n,onClose:s}){const e=document.createElement("div");e.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";const t=W(n);e.innerHTML=`
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
          ${D().map(l=>`
            <button data-section="${l.id}"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors ${n===l.id?"bg-violet-600 text-white":"bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"}">
              ${l.title}
            </button>
          `).join("")}
        </nav>
      </div>

      <div id="help-content" class="prose prose-invert max-w-none">
        ${t}
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
  `,e.querySelector("#help-close").addEventListener("click",()=>{s&&s(),e.remove()}),e.querySelectorAll("[data-section]").forEach(l=>{l.addEventListener("click",()=>{const a=l.dataset.section;O(e,a)})});const r=D();let d=r.findIndex(l=>l.id===n)||0;return e.querySelector("#help-prev").addEventListener("click",()=>{d=Math.max(0,d-1),O(e,r[d].id)}),e.querySelector("#help-next").addEventListener("click",()=>{d=Math.min(r.length-1,d+1),O(e,r[d].id)}),U(e,d,r.length),e}function O(n,s){const e=n.querySelector("#help-content");n.querySelectorAll("[data-section]").forEach(l=>{const a=l.dataset.section===s;l.className=`px-3 py-1.5 rounded-lg text-sm transition-colors ${a?"bg-violet-600 text-white":"bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"}`}),e.innerHTML=W(s);const r=D(),d=r.findIndex(l=>l.id===s);U(n,d,r.length)}function U(n,s,e){const t=n.querySelector("#help-prev"),r=n.querySelector("#help-next");t.disabled=s===0,r.disabled=s===e-1,t.className=t.disabled?"px-3 py-1.5 rounded-lg bg-white/5 text-gray-600 cursor-not-allowed text-sm":"px-3 py-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-sm",r.className=r.disabled?"px-3 py-1.5 rounded-lg bg-violet-600/50 text-gray-400 cursor-not-allowed text-sm":"px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors text-sm"}function D(){return[{id:"getting-started",title:"Getting Started"},{id:"video-editor",title:"Video Editor"},{id:"timeline",title:"Timeline"},{id:"overlays",title:"Overlays"},{id:"personalization",title:"Personalization"},{id:"landing-pages",title:"Landing Pages"},{id:"publishing",title:"Publishing"},{id:"keyboard-shortcuts",title:"Shortcuts"},{id:"troubleshooting",title:"Troubleshooting"}]}function W(n){const s={"getting-started":`
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
    `,"video-editor":`
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
    `,timeline:`
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
    `,overlays:`
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
    `,personalization:`
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
    `,"landing-pages":`
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
    `,publishing:`
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
    `,"keyboard-shortcuts":`
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
    `,troubleshooting:`
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
    `};return s[n]||s["getting-started"]}function fe({onClose:n}){var r,d;const s=document.createElement("div");s.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";const e=[{category:"Playback",shortcuts:[{keys:["Space"],description:"Play/Pause video"},{keys:["←"],description:"Rewind 5 seconds"},{keys:["→"],description:"Forward 5 seconds"},{keys:["Home"],description:"Jump to start"},{keys:["End"],description:"Jump to end"},{keys:["Ctrl","+"],description:"Increase playback speed"},{keys:["Ctrl","−"],description:"Decrease playback speed"}]},{category:"Timeline",shortcuts:[{keys:["Mouse Wheel"],description:"Zoom timeline in/out"},{keys:["Click","+","Drag"],description:"Pan timeline"},{keys:["Ctrl","+","A"],description:"Select all overlays"},{keys:["Delete"],description:"Delete selected overlays"},{keys:["Ctrl","+","C"],description:"Copy selected overlays"},{keys:["Ctrl","+","V"],description:"Paste overlays"}]},{category:"Editing",shortcuts:[{keys:["Ctrl","+","Z"],description:"Undo last action"},{keys:["Ctrl","+","Y"],description:"Redo last action"},{keys:["Ctrl","+","S"],description:"Save project"},{keys:["Ctrl","+","N"],description:"New project"},{keys:["Ctrl","+","O"],description:"Open project"},{keys:["F2"],description:"Rename selected item"}]},{category:"Overlays",shortcuts:[{keys:["T"],description:"Add text overlay"},{keys:["I"],description:"Add image overlay"},{keys:["F"],description:"Add form overlay"},{keys:["C"],description:"Add CTA overlay"},{keys:["P"],description:"Add popup overlay"},{keys:["Escape"],description:"Deselect current overlay"}]},{category:"Navigation",shortcuts:[{keys:["Ctrl","+","1"],description:"Switch to Getting Started"},{keys:["Ctrl","+","2"],description:"Switch to Editor"},{keys:["Ctrl","+","3"],description:"Switch to Publisher"},{keys:["Ctrl","+","4"],description:"Switch to Landing Pages"},{keys:["F1"],description:"Show help"},{keys:["F11"],description:"Toggle fullscreen"}]},{category:"Personalization",shortcuts:[{keys:["Ctrl","+","P"],description:"Open personalizer"},{keys:["{{}}"],description:"Insert token (type {{TOKEN}})"},{keys:["Ctrl","+","Shift","+","P"],description:"Preview personalization"}]}];s.innerHTML=`
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
        ${e.map(l=>`
          <div class="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
            <h4 class="text-lg font-semibold text-white mb-3">${l.category}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${l.shortcuts.map(a=>`
                <div class="flex items-center justify-between py-2">
                  <span class="text-sm text-gray-300">${a.description}</span>
                  <div class="flex gap-1">
                    ${a.keys.map((u,i)=>`
                      <kbd class="bg-white/20 text-white text-xs px-2 py-1 rounded font-mono ${i>0?"ml-1":""}">
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
  `,s.querySelector("#shortcuts-close").addEventListener("click",()=>{n&&n(),s.remove()}),(r=s.querySelector("#shortcuts-print"))==null||r.addEventListener("click",()=>{window.print()}),(d=s.querySelector("#shortcuts-customize"))==null||d.addEventListener("click",()=>{alert("Keyboard shortcut customization coming soon!")});const t=l=>{l.key==="Escape"&&(n&&n(),s.remove(),document.removeEventListener("keydown",t))};return document.addEventListener("keydown",t),s.addEventListener("remove",()=>{document.removeEventListener("keydown",t)}),s}function be({onComplete:n,onSkip:s}){const e=document.createElement("div");e.className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50";const t=[{title:"Welcome to Remix Go!",content:`
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">🎬</div>
          <p class="text-lg text-gray-300 mb-4">
            Create personalized videos without coding experience
          </p>
          <p class="text-sm text-gray-400">
            Follow this quick tour to learn the basics
          </p>
        </div>
      `,action:"Next"},{title:"Getting Started",content:`
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
      `,action:"Next"},{title:"Key Features",content:`
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
      `,action:"Next"},{title:"Keyboard Shortcuts",content:`
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
      `,action:"Get Started"}];let r=0;function d(){const u=t[r];e.innerHTML=`
      <div class="glass rounded-2xl p-8 max-w-lg w-full mx-4">
        <!-- Progress Indicator -->
        <div class="flex justify-center mb-6">
          <div class="flex gap-2">
            ${t.map((v,g)=>`
              <div class="w-2 h-2 rounded-full transition-colors ${g<=r?"bg-violet-500":"bg-white/20"}"></div>
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
            ${r>0?`
              <button id="onboarding-prev" class="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                Back
              </button>
            `:""}
            <button id="onboarding-next" class="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
              ${u.action}
            </button>
          </div>
        </div>

        <!-- Skip All -->
        ${r===0?`
          <div class="mt-4 pt-4 border-t border-white/10">
            <button id="onboarding-skip-all" class="w-full text-center text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Don't show this again
            </button>
          </div>
        `:""}
      </div>
    `;const i=e.querySelector("#onboarding-next"),o=e.querySelector("#onboarding-prev"),p=e.querySelector("#onboarding-skip"),c=e.querySelector("#onboarding-skip-all");i&&i.addEventListener("click",()=>{r<t.length-1?(r++,d()):l()}),o&&o.addEventListener("click",()=>{r>0&&(r--,d())}),p&&p.addEventListener("click",()=>{s&&s(),e.remove()}),c&&c.addEventListener("click",()=>{localStorage.setItem("remix-go-skip-onboarding","true"),s&&s(),e.remove()});const m=v=>{v.key==="ArrowRight"||v.key===" "?(v.preventDefault(),i==null||i.click()):v.key==="ArrowLeft"&&o?(v.preventDefault(),o.click()):v.key==="Escape"&&p&&p.click()};document.addEventListener("keydown",m),e.addEventListener("remove",()=>{document.removeEventListener("keydown",m)})}function l(){localStorage.setItem("remix-go-onboarding-completed","true"),n&&n(),e.remove(),a()}function a(){const u=document.createElement("div");u.className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50 flex items-center gap-2",u.innerHTML=`
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      Welcome to Remix Go! You're all set to start creating.
    `,document.body.appendChild(u),setTimeout(()=>u.remove(),3e3)}return d(),e}function xe({content:n,type:s="video",title:e="Preview",onClose:t,options:r={}}){const d=document.createElement("div");d.className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50";const l=ye(n,s,r);return d.innerHTML=`
    <div class="glass rounded-2xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">${e}</h3>
        <div class="flex items-center gap-3">
          ${we(s)}
          <button id="preview-close" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-hidden bg-black/20 rounded-lg">
        ${l}
      </div>

      ${ke(s,r)}
    </div>
  `,d.querySelector("#preview-close").addEventListener("click",()=>{t&&t(),d.remove()}),Se(d,s,n,r),d}function ye(n,s,e){switch(s){case"video":return`
        <div class="w-full h-full flex items-center justify-center p-4">
          <video id="preview-video" controls class="max-w-full max-h-full rounded" ${e.autoplay?"autoplay":""}>
            <source src="${n.src||n}" type="${n.type||"video/mp4"}">
            Your browser does not support the video tag.
          </video>
        </div>
      `;case"image":return`
        <div class="w-full h-full flex items-center justify-center p-4">
          <img id="preview-image" src="${n.src||n}" alt="Preview"
            class="max-w-full max-h-full object-contain rounded">
        </div>
      `;case"page":return`
        <div class="w-full h-full">
          <iframe id="preview-iframe" src="${n.src||n}"
            class="w-full h-full border-0 rounded" sandbox="allow-scripts allow-same-origin">
          </iframe>
        </div>
      `;case"embed":return`
        <div class="w-full h-full flex items-center justify-center p-4">
          <div class="w-full max-w-4xl">
            <div id="embed-preview" class="bg-white rounded-lg overflow-hidden">
              ${n.html||n}
            </div>
          </div>
        </div>
      `;default:return`
        <div class="w-full h-full flex items-center justify-center p-4">
          <div class="text-center text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p>Preview not available for this content type</p>
          </div>
        </div>
      `}}function we(n,s){switch(n){case"video":return`
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
      `;case"image":return`
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
      `;case"page":return`
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
      `;default:return""}}function ke(n,s){const e=[];return s.downloadable&&e.push(`
      <button id="preview-download" class="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        Download
      </button>
    `),s.shareable&&e.push(`
      <button id="preview-share" class="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        Share
      </button>
    `),e.length>0?`
      <div class="flex gap-2 justify-center mt-4 pt-4 border-t border-white/10">
        ${e.join("")}
      </div>
    `:""}function Se(n,s,e,t){switch(s){case"video":const l=n.querySelector("#preview-video"),a=n.querySelector("#preview-play"),u=n.querySelector("#preview-pause"),i=n.querySelector("#preview-speed");a&&a.addEventListener("click",()=>l.play()),u&&u.addEventListener("click",()=>l.pause()),i&&i.addEventListener("change",w=>{l.playbackRate=parseFloat(w.target.value)});break;case"image":const o=n.querySelector("#preview-image"),p=n.querySelector("#preview-zoom-in"),c=n.querySelector("#preview-zoom-out"),m=n.querySelector("#preview-fit");let v=1;const g=()=>{o.style.transform=`scale(${v})`};p&&p.addEventListener("click",()=>{v=Math.min(v*1.2,5),g()}),c&&c.addEventListener("click",()=>{v=Math.max(v/1.2,.1),g()}),m&&m.addEventListener("click",()=>{v=1,g()});break;case"page":const f=n.querySelector("#preview-iframe"),h=n.querySelector("#preview-device"),b=n.querySelector("#preview-refresh");h&&h.addEventListener("change",w=>{const E=w.target.value,L={desktop:"100%",tablet:"768px",mobile:"375px"};f.style.width=L[E]||"100%"}),b&&b.addEventListener("click",()=>{f.src=f.src});break}const r=n.querySelector("#preview-download"),d=n.querySelector("#preview-share");r&&t.downloadable&&r.addEventListener("click",()=>{if(s==="image"){const l=document.createElement("a");l.href=n.querySelector("#preview-image").src,l.download="preview-image.jpg",l.click()}else s==="video"&&alert("Video download not yet implemented")}),d&&t.shareable&&d.addEventListener("click",()=>{navigator.share?navigator.share({title:t.shareTitle||"Preview",text:t.shareText||"Check out this preview",url:t.shareUrl||window.location.href}):(navigator.clipboard.writeText(t.shareUrl||window.location.href),alert("Link copied to clipboard!"))})}function $e({title:n,message:s,progress:e,onCancel:t}){var a;const r=document.createElement("div");r.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";const d=e||0,l=`${Math.min(100,Math.max(0,d))}%`;return r.innerHTML=`
    <div class="glass rounded-2xl p-8 max-w-md w-full mx-4 text-center">
      <div class="text-4xl mb-4">⏳</div>
      <h3 class="text-lg font-semibold text-white mb-2">${n||"Processing..."}</h3>
      <p class="text-gray-400 text-sm mb-6">${s||"Please wait while we process your request."}</p>

      <div class="mb-6">
        <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div class="h-full bg-violet-500 rounded-full transition-all duration-300 ease-out"
               style="width: ${l}"></div>
        </div>
        <div class="text-xs text-gray-500 mt-2">${d.toFixed(0)}% complete</div>
      </div>

      ${t?`
        <button id="progress-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
          Cancel
        </button>
      `:""}
    </div>
  `,d>=100&&setTimeout(()=>{r.parentNode&&r.remove()},1e3),t&&((a=r.querySelector("#progress-cancel"))==null||a.addEventListener("click",()=>{t(),r.remove()})),t||r.addEventListener("click",u=>{u.target===r&&r.remove()}),r.updateProgress=(u,i)=>{const o=r.querySelector(".bg-violet-500"),p=r.querySelector(".text-xs"),c=r.querySelector("p");if(o&&u!==void 0){const m=Math.min(100,Math.max(0,u));o.style.width=`${m}%`,p&&(p.textContent=`${m.toFixed(0)}% complete`),m>=100&&setTimeout(()=>{r.parentNode&&r.remove()},1e3)}c&&i&&(c.textContent=i)},r}function Ee({onSave:n,onClose:s,initialSettings:e={}}){const t=document.createElement("div");t.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";const r={theme:localStorage.getItem("remix-go-theme")||e.theme||"dark",language:localStorage.getItem("remix-go-language")||e.language||"en",autoplay:localStorage.getItem("remix-go-autoplay")==="true"||e.autoplay||!1,showTips:localStorage.getItem("remix-go-showTips")!=="false"||e.showTips||!0,keyboardShortcuts:localStorage.getItem("remix-go-keyboardShortcuts")==="true"||e.keyboardShortcuts||!1,autoSave:localStorage.getItem("remix-go-autoSave")!=="false"||e.autoSave||!0,highContrast:localStorage.getItem("remix-go-highContrast")==="true"||e.highContrast||!1,reducedMotion:localStorage.getItem("remix-go-reducedMotion")==="true"||e.reducedMotion||!1,...e};t.innerHTML=`
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
                <option value="dark" ${r.theme==="dark"?"selected":""}>Dark</option>
                <option value="light" ${r.theme==="light"?"selected":""}>Light</option>
                <option value="auto" ${r.theme==="auto"?"selected":""}>Auto (System)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">Language</label>
              <select id="language-select" class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500">
                <option value="en" ${r.language==="en"?"selected":""}>English</option>
                <option value="es" ${r.language==="es"?"selected":""}>Español</option>
                <option value="fr" ${r.language==="fr"?"selected":""}>Français</option>
                <option value="de" ${r.language==="de"?"selected":""}>Deutsch</option>
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
              <input id="autoplay-toggle" type="checkbox" ${r.autoplay?"checked":""} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Show tips and hints</span>
              <input id="tips-toggle" type="checkbox" ${r.showTips?"checked":""} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Enable keyboard shortcuts</span>
              <input id="shortcuts-toggle" type="checkbox" ${r.keyboardShortcuts?"checked":""} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Auto-save projects</span>
              <input id="autosave-toggle" type="checkbox" ${r.autoSave?"checked":""} class="accent-violet-500">
            </label>
          </div>
        </div>

        <!-- Accessibility -->
        <div class="border-b border-white/10 pb-4">
          <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Accessibility</h4>
          <div class="space-y-3">
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">High contrast mode</span>
              <input id="contrast-toggle" type="checkbox" ${r.highContrast?"checked":""} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Reduce motion</span>
              <input id="motion-toggle" type="checkbox" ${r.reducedMotion?"checked":""} class="accent-violet-500">
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
  `,t.querySelector("#settings-close").addEventListener("click",()=>{s&&s(),t.remove()}),t.querySelector("#settings-cancel").addEventListener("click",()=>{s&&s(),t.remove()}),t.querySelector("#settings-save").addEventListener("click",()=>{const l={theme:t.querySelector("#theme-select").value,language:t.querySelector("#language-select").value,autoplay:t.querySelector("#autoplay-toggle").checked,showTips:t.querySelector("#tips-toggle").checked,keyboardShortcuts:t.querySelector("#shortcuts-toggle").checked,autoSave:t.querySelector("#autosave-toggle").checked,highContrast:t.querySelector("#contrast-toggle").checked,reducedMotion:t.querySelector("#motion-toggle").checked};Object.entries(l).forEach(([a,u])=>{localStorage.setItem(`remix-go-${a}`,u.toString())}),Ce(l.theme),Le(l),n&&n(l),t.remove()}),t.querySelector("#clear-cache").addEventListener("click",()=>{confirm("Clear all cached data? This will remove temporary files and cached assets.")&&(Object.keys(localStorage).filter(a=>a.startsWith("remix-go-")&&!["theme","language","autoplay","showTips","keyboardShortcuts","autoSave","highContrast","reducedMotion"].some(u=>a.includes(u))).forEach(a=>localStorage.removeItem(a)),"caches"in window&&caches.keys().then(a=>{a.forEach(u=>caches.delete(u))}),alert("Cache cleared successfully!"))}),t.querySelector("#reset-settings").addEventListener("click",()=>{confirm("Reset all settings to defaults? This cannot be undone.")&&(Object.keys(localStorage).filter(l=>l.startsWith("remix-go-")).forEach(l=>{localStorage.removeItem(l)}),t.querySelector("#theme-select").value="dark",t.querySelector("#language-select").value="en",t.querySelector("#autoplay-toggle").checked=!1,t.querySelector("#tips-toggle").checked=!0,t.querySelector("#shortcuts-toggle").checked=!1,t.querySelector("#autosave-toggle").checked=!0,t.querySelector("#contrast-toggle").checked=!1,t.querySelector("#motion-toggle").checked=!1,alert("Settings reset to defaults!"))});const d=l=>{l.key==="Escape"&&(s&&s(),t.remove(),document.removeEventListener("keydown",d))};return document.addEventListener("keydown",d),t}function Ce(n){const s=document.documentElement;if(n==="light")s.classList.add("light-theme"),s.classList.remove("dark-theme");else if(n==="auto"){const e=window.matchMedia("(prefers-color-scheme: dark)").matches;s.classList.toggle("light-theme",!e),s.classList.toggle("dark-theme",e)}else s.classList.add("dark-theme"),s.classList.remove("light-theme")}function Le(n){const s=document.documentElement;s.classList.toggle("high-contrast",n.highContrast),s.classList.toggle("reduced-motion",n.reducedMotion);const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",n.highContrast?"#000000":"#0f0f13")}function Te({onGenerate:n}){const s=document.createElement("div");s.className="ai-generate-panel p-4 space-y-4",s.innerHTML=`
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
  `;const e=s.querySelector("#ai-generate-btn"),t=s.querySelector("#ai-i2v-btn"),r=s.querySelector("#ai-music-btn"),d=s.querySelector("#i2v-upload-zone"),l=s.querySelector("#i2v-file");return d.addEventListener("click",()=>l.click()),d.addEventListener("dragover",a=>{a.preventDefault(),d.classList.add("border-violet-500")}),d.addEventListener("dragleave",()=>{d.classList.remove("border-violet-500")}),d.addEventListener("drop",a=>{a.preventDefault(),d.classList.remove("border-violet-500"),a.dataTransfer.files.length&&(l.files=a.dataTransfer.files,d.querySelector("p").textContent=a.dataTransfer.files[0].name)}),e.addEventListener("click",()=>{n&&n({type:"text-to-video",prompt:s.querySelector("#ai-prompt").value,negativePrompt:s.querySelector("#ai-negative").value,model:s.querySelector("#ai-model").value,duration:parseInt(s.querySelector("#ai-duration").value,10),aspectRatio:s.querySelector("#ai-aspect").value,quality:s.querySelector("#ai-quality").value})}),t.addEventListener("click",()=>{n&&n({type:"image-to-video",file:l.files[0]||null,prompt:s.querySelector("#ai-prompt").value,model:s.querySelector("#ai-model").value,duration:parseInt(s.querySelector("#ai-duration").value,10)})}),r.addEventListener("click",()=>{n&&n({type:"music",prompt:s.querySelector("#ai-music-prompt").value})}),s}function Me({onAvatarReady:n}){var m;const s=document.createElement("div");s.className="avatar-generator p-4 rounded-xl glass",s.innerHTML=`
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
  `;const e=s.querySelector("#avatar-upload-zone"),t=s.querySelector("#avatar-file"),r=s.querySelector("#avatar-preview"),d=s.querySelector("#avatar-preview-img"),l=s.querySelector("#avatar-audio-file"),a=s.querySelector("#avatar-audio-url"),u=s.querySelector("#avatar-upload-audio"),i=s.querySelector("#generate-avatar-btn"),o=s.querySelector("#avatar-result"),p=s.querySelector("#avatar-video");e.addEventListener("click",()=>t.click()),e.addEventListener("dragover",v=>v.preventDefault()),e.addEventListener("drop",v=>{v.preventDefault(),v.dataTransfer.files.length&&c(v.dataTransfer.files[0])}),t.addEventListener("change",()=>{t.files.length&&c(t.files[0])});function c(v){d.src=URL.createObjectURL(v),r.classList.remove("hidden")}return u.addEventListener("click",()=>l.click()),l.addEventListener("change",()=>{l.files.length&&(a.value=URL.createObjectURL(l.files[0]))}),i.addEventListener("click",()=>{i.disabled=!0,i.textContent="Generating...",setTimeout(()=>{o.classList.remove("hidden"),i.disabled=!1,i.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Talking Avatar'},3e3)}),(m=s.querySelector("#avatar-use"))==null||m.addEventListener("click",()=>{n&&n({videoUrl:p.src,photoUrl:d.src,audioUrl:a.value,text:s.querySelector("#avatar-text").value})}),s}function qe({contacts:n,onGenerate:s,onComplete:e}){let t=n||[],r=!1,d={current:0,total:0,results:[]};const l=document.createElement("div");l.className="batch-generator p-4 rounded-xl glass";function a(){l.innerHTML=`
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Batch Video Generator</h3>
      
      <div class="space-y-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Contacts (CSV or paste)</label>
          <textarea id="batch-contacts" rows="4"
            class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500 font-mono"
            placeholder="FIRSTNAME,EMAIL,COMPANY
John,john@acme.com,Acme Inc
Jane,jane@widget.co,Widget Co">${t.map(p=>Object.values(p).join(",")).join(`
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
          ${t.length===0?"disabled":""}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Generate ${t.length} Videos
        </button>
      </div>
      
      ${r||d.results.length>0?`
        <div class="mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-500">Progress</span>
            <span class="text-xs text-gray-400">${d.current}/${d.total}</span>
          </div>
          <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-violet-500 rounded-full transition-all" style="width: ${d.total?d.current/d.total*100:0}%"></div>
          </div>
          
          ${d.results.length>0?`
            <div class="mt-3 max-h-40 overflow-y-auto space-y-1">
              ${d.results.map(p=>`
                <div class="flex items-center justify-between p-2 rounded bg-white/5 text-xs">
                  <span class="text-gray-400">${p.name}</span>
                  <span class="${p.success?"text-green-400":"text-red-400"}">${p.success?"✓ Generated":"✗ Failed"}</span>
                </div>
              `).join("")}
            </div>
          `:""}
        </div>
      `:""}
    `;const u=l.querySelector("#parse-contacts-btn"),i=l.querySelector("#batch-start-btn"),o=l.querySelector("#batch-contacts");u==null||u.addEventListener("click",()=>{const p=o.value.trim().split(`
`).filter(f=>f.trim());if(p.length<2)return;const c=p[0].split(",").map(f=>f.trim().toUpperCase());t=p.slice(1).map(f=>{const h=f.split(",").map(w=>w.trim()),b={};return c.forEach((w,E)=>{b[w]=h[E]||""}),b});const m=l.querySelector("#batch-parsed"),v=l.querySelector("#batch-count"),g=l.querySelector("#batch-preview");m.classList.remove("hidden"),v.textContent=`${t.length} contacts`,g.innerHTML=t.slice(0,5).map(f=>`<div class="text-xs text-gray-500 p-1 rounded bg-white/5">${f.FIRSTNAME||f.NAME||Object.values(f)[0]} - ${f.EMAIL||""}</div>`).join(""),i.disabled=!1,i.innerHTML=`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate ${t.length} Videos`}),i==null||i.addEventListener("click",async()=>{if(!(!t.length||r)){r=!0,d={current:0,total:t.length,results:[]},a();for(let p=0;p<t.length;p++){const c=t[p];try{s&&await s(c,p),d.results.push({name:c.FIRSTNAME||c.NAME||`Contact ${p+1}`,success:!0})}catch{d.results.push({name:c.FIRSTNAME||c.NAME||`Contact ${p+1}`,success:!1})}d.current=p+1,a()}r=!1,e&&e(d.results),a()}})}return a(),l}function je({onScriptGenerated:n}){var l,a;let s="";const e=document.createElement("div");e.className="script-writer p-4 rounded-xl glass",e.innerHTML=`
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
  `;const t=e.querySelector("#generate-script-btn"),r=e.querySelector("#script-result"),d=e.querySelector("#script-output");return t.addEventListener("click",()=>{const u=e.querySelector("#script-topic").value,i=e.querySelector("#script-tone").value;e.querySelector("#script-length").value;const o=e.querySelector("#script-include").value;u.trim()&&(t.disabled=!0,t.innerHTML='<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...',setTimeout(()=>{const p={professional:`Hi {{FIRSTNAME}}, I hope this message finds you well. I wanted to reach out because ${u}. I'd love to show you how this could benefit your team. ${o||"Would you be open to a quick call this week?"}`,friendly:`Hey {{FIRSTNAME}}! I came across your profile and thought of you right away. ${u} I think you'd really love what we're building. ${o||"Want to check it out?"}`,casual:`Hey {{FIRSTNAME}}, quick question — ${u}? I built something that makes this super easy. ${o||"Happy to show you a quick demo if you're interested."}`,enthusiastic:`{{FIRSTNAME}}, this is exciting! ${u} and the results have been incredible. ${o||"I'd love for you to see it in action. Are you free for a quick chat?"}`,authoritative:`{{FIRSTNAME}}, after working with hundreds of teams, we've found that ${u}. ${o||"I'd like to share our findings with you. When would be a good time to connect?"}`};s=p[i]||p.professional,d.textContent=s,r.classList.remove("hidden"),t.disabled=!1,t.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Script'},1500))}),(l=e.querySelector("#copy-script"))==null||l.addEventListener("click",()=>{navigator.clipboard.writeText(s),e.querySelector("#copy-script").textContent="Copied!",setTimeout(()=>e.querySelector("#copy-script").textContent="Copy",2e3)}),(a=e.querySelector("#use-script"))==null||a.addEventListener("click",()=>{n&&n(s)}),e.getScript=()=>s,e}function Ae({onVoiceGenerated:n}){var o;let s=null;const e=document.createElement("div");e.className="voice-clone p-4 rounded-xl glass",e.innerHTML=`
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
  `;const t=e.querySelector("#voice-upload-zone"),r=e.querySelector("#voice-file"),d=e.querySelector("#voice-file-name"),l=e.querySelector("#generate-voice-btn"),a=e.querySelector("#voice-result"),u=e.querySelector("#voice-audio");t.addEventListener("click",()=>r.click()),t.addEventListener("dragover",p=>{p.preventDefault(),t.classList.add("border-violet-500")}),t.addEventListener("dragleave",()=>{t.classList.remove("border-violet-500")}),t.addEventListener("drop",p=>{p.preventDefault(),t.classList.remove("border-violet-500"),p.dataTransfer.files.length&&i(p.dataTransfer.files[0])}),r.addEventListener("change",()=>{r.files.length&&i(r.files[0])});function i(p){s=URL.createObjectURL(p),d.textContent=p.name,d.classList.remove("hidden")}return l.addEventListener("click",()=>{e.querySelector("#voice-text").value.trim()&&(l.disabled=!0,l.textContent="Generating...",setTimeout(()=>{a.classList.remove("hidden"),l.disabled=!1,l.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Cloned Voice'},2e3))}),(o=e.querySelector("#voice-use"))==null||o.addEventListener("click",()=>{n&&n({audioUrl:u.src,text:e.querySelector("#voice-text").value,sampleUrl:s})}),e}function Ie({showBackButton:n=!0,onBackClick:s,theme:e={}}){const t=document.createElement("header");t.className="brand-header flex items-center justify-between p-4 border-b border-gray-800";const d={...{name:"RemixGo",logo:"/logo.png",colors:{primary:"#8b5cf6",light:"#ffffff",accent:"#ec4899"}},...e};function l(){t.innerHTML=`
      <div class="flex items-center gap-4">
        ${n?`
          <button class="back-button flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                  aria-label="Back to main app">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span class="back-text">Back to ${d.name}</span>
          </button>
        `:""}

        <div class="brand-info flex items-center gap-3">
          <img src="${d.logo}" alt="${d.name} logo" class="brand-logo w-8 h-8 rounded-lg" onerror="this.style.display='none'">
          <div>
            <h1 class="brand-name text-xl font-bold text-white">${d.name}</h1>
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
    `,a()}function a(){const u=t.querySelector(".back-button");u&&u.addEventListener("click",()=>{s?s():window.location.href="/"});const i=t.querySelector(".notification-btn");i&&i.addEventListener("click",()=>{console.log("Notifications clicked")});const o=t.querySelector(".profile-btn");o&&o.addEventListener("click",()=>{console.log("Profile clicked")})}return l(),t.api={updateTheme:u=>{Object.assign(d,u),l()}},t}function ze({items:n,activeItem:s}){const t=n||[{id:"getting-started",label:"Home",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{id:"editor",label:"Video Editor",icon:"M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"},{id:"landing-page",label:"Landing Pages",icon:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"},{id:"publisher",label:"Publish",icon:"M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"}],r=s||(window.location.hash.slice(1)||"getting-started").split("?")[0],d=document.createElement("aside");d.className="fixed left-0 top-14 bottom-0 w-56 bg-black/30 border-r border-white/5 overflow-y-auto z-40";const l=document.createElement("nav");l.className="p-3 space-y-1",t.forEach(u=>{const i=u.id===r,o=document.createElement("a");o.href=`#${u.id}`,o.className=`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${i?"bg-violet-600/20 text-violet-300":"text-gray-400 hover:text-white hover:bg-white/5"}`,o.innerHTML=`
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${u.icon}"/>
      </svg>
      <span>${u.label}</span>
    `,l.appendChild(o)}),d.appendChild(l);const a=document.createElement("div");return a.className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5",a.innerHTML=`
    <a href="https://github.com/deangilmoreremix/Open-Higgsfield-AI" target="_blank"
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      Higgsfield AI
    </a>
  `,d.appendChild(a),d}function Pe({steps:n,currentStep:s,onStepChange:e}){const r=n||[{id:"source",label:"Source",description:"Upload or generate video"},{id:"edit",label:"Edit",description:"Add overlays and effects"},{id:"personalize",label:"Personalize",description:"Add tokens and campaigns"},{id:"publish",label:"Publish",description:"Share your video"}],d=s||0,l=document.createElement("div");return l.className="wizard-stepper flex items-center justify-center gap-2 p-4",r.forEach((a,u)=>{const i=u===d,o=u<d,p=document.createElement("div");p.className="flex items-center";const c=document.createElement("button");c.className=`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${i?"bg-violet-600 text-white":o?"bg-green-600 text-white":"bg-white/10 text-gray-500"}`,c.innerHTML=o?'<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>':String(u+1),c.title=a.label,c.addEventListener("click",()=>{e&&e(u,a)});const m=document.createElement("span");if(m.className=`ml-2 text-xs hidden sm:inline ${i?"text-violet-300":o?"text-gray-400":"text-gray-600"}`,m.textContent=a.label,p.appendChild(c),p.appendChild(m),u<r.length-1){const v=document.createElement("div");v.className=`w-8 sm:w-16 h-0.5 mx-2 ${o?"bg-green-600":"bg-white/10"}`,p.appendChild(v)}l.appendChild(p)}),l}const Be={state:{activeElement:null,project:null,checkpoints:[],currentCheckpoint:0},setActiveElement(n){this.state.activeElement=n},getActiveElement(){return this.state.activeElement},setProject(n){this.state.project=n},getProject(){return this.state.project},addCheckpoint(n){this.state.checkpoints.push(n)},setCurrentCheckpoint(n){this.state.currentCheckpoint=n},getCurrentCheckpoint(){return this.state.checkpoints[this.state.currentCheckpoint]}},Fe={createProject(n,s={}){return{id:Date.now().toString(),name:n,settings:s,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}},updateProject(n,s){return{...n,...s,updatedAt:new Date().toISOString()}}};function Re(n){const s=Math.floor(n/60),e=Math.floor(n%60);return`${s}:${e.toString().padStart(2,"0")}`}function He(n){if(n===0)return"0 Bytes";const s=1024,e=["Bytes","KB","MB","GB"],t=Math.floor(Math.log(n)/Math.log(s));return parseFloat((n/Math.pow(s,t)).toFixed(2))+" "+e[t]}function Oe(n,s){let e;return function(...r){const d=()=>{clearTimeout(e),n(...r)};clearTimeout(e),e=setTimeout(d,s)}}function De(n,s){let e;return function(){const t=arguments,r=this;e||(n.apply(r,t),e=!0,setTimeout(()=>e=!1,s))}}function Ne(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}function Ve(n){return JSON.parse(JSON.stringify(n))}function Ue(n){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)}function We(n){return n.charAt(0).toUpperCase()+n.slice(1)}function Ge(n,s){return n.length<=s?n:n.slice(0,s)+"..."}const Ke={themes:{default:{primary:"#8b5cf6",secondary:"#ec4899",accent:"#06b6d4",background:"#111827",surface:"#1f2937",text:"#f9fafb",muted:"#6b7280"},dark:{primary:"#6366f1",secondary:"#8b5cf6",accent:"#06b6d4",background:"#0f172a",surface:"#1e293b",text:"#f8fafc",muted:"#64748b"},light:{primary:"#6366f1",secondary:"#8b5cf6",accent:"#06b6d4",background:"#ffffff",surface:"#f8fafc",text:"#1e293b",muted:"#64748b"}},currentTheme:"default",setTheme(n){this.themes[n]&&(this.currentTheme=n,this.applyTheme(this.themes[n]))},applyTheme(n){const s=document.documentElement;Object.entries(n).forEach(([e,t])=>{s.style.setProperty(`--color-${e}`,t)})},getCurrentTheme(){return this.themes[this.currentTheme]},customizeTheme(n){return{...this.getCurrentTheme(),...n}}},G={alerts:[],show(n,s="info",e=5e3){const t={id:Date.now().toString(),message:n,type:s,duration:e};return this.alerts.push(t),this.renderAlert(t),e>0&&setTimeout(()=>{this.remove(t.id)},e),t.id},success(n,s){return this.show(n,"success",s)},error(n,s){return this.show(n,"error",s)},warning(n,s){return this.show(n,"warning",s)},info(n,s){return this.show(n,"info",s)},remove(n){this.alerts=this.alerts.filter(e=>e.id!==n);const s=document.querySelector(`[data-alert-id="${n}"]`);s&&s.remove()},clear(){this.alerts.forEach(n=>this.remove(n.id))},renderAlert(n){const s=this.getContainer(),e=document.createElement("div");e.className=`alert alert-${n.type} fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm`,e.setAttribute("data-alert-id",n.id);const t={success:"bg-green-500 text-white",error:"bg-red-500 text-white",warning:"bg-yellow-500 text-black",info:"bg-blue-500 text-white"};e.classList.add(...t[n.type].split(" ")),e.innerHTML=`
      <div class="flex items-center justify-between">
        <span>${n.message}</span>
        <button class="ml-4 text-current hover:opacity-75" onclick="alertService.remove('${n.id}')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `,s.appendChild(e),setTimeout(()=>{e.style.transform="translateX(0)",e.style.opacity="1"},10)},getContainer(){let n=document.getElementById("alert-container");return n||(n=document.createElement("div"),n.id="alert-container",n.className="fixed top-4 right-4 z-50 space-y-2",document.body.appendChild(n)),n}};window.alertService=G;class N{constructor(s,e={}){this.container=s,this.options={theme:"dark",...e},this.components=new Map,this.initialize()}initialize(){this.container.innerHTML=`
      <div class="remix-go-app w-full h-screen bg-gray-900 flex flex-col">
        <div id="app-header" class="flex-shrink-0"></div>
        <div id="app-main" class="flex-1 flex overflow-hidden">
          <div id="app-sidebar" class="flex-shrink-0"></div>
          <div id="app-content" class="flex-1 overflow-hidden"></div>
        </div>
        <div id="app-footer" class="flex-shrink-0"></div>
      </div>
    `,this.applyTheme()}applyTheme(){document.documentElement.classList.toggle("dark",this.options.theme==="dark")}mount(s,e,t="#app-content"){const r=this.container.querySelector(t);r&&(r.innerHTML="",r.appendChild(e),this.components.set(s,e))}getComponent(s){return this.components.get(s)}showModal(s){var r;const e=document.createElement("div");e.className="fixed inset-0 z-50 flex items-center justify-center",e.appendChild(s),document.body.appendChild(e);const t=(r=s.api)==null?void 0:r.close;t&&(s.api.close=()=>{t(),document.body.removeChild(e)})}destroy(){this.components.forEach(s=>{var e;(e=s.api)!=null&&e.destroy&&s.api.destroy()}),this.components.clear()}}function K(n,s={}){return new N(n,s)}const Ye={RemixGoVanilla:N,createRemixGoApp:K};class V{constructor(s={}){this.options={width:1920,height:1080,fps:30,bitrate:"8000k",format:"mp4",...s},this.canvas=null,this.ctx=null,this.mediaRecorder=null,this.recordedChunks=[],this.isRecording=!1,this.currentFrame=0,this.totalFrames=0,this.onProgress=s.onProgress||(()=>{}),this.onComplete=s.onComplete||(()=>{}),this.onError=s.onError||(()=>{})}init(){this.canvas=new OffscreenCanvas(this.options.width,this.options.height),this.ctx=this.canvas.getContext("2d",{alpha:!1,desynchronized:!0,willReadFrequently:!1}),this.ctx.imageSmoothingEnabled=!0,this.ctx.imageSmoothingQuality="high"}async renderVideo(s,e=[],t=null){(!this.canvas||!this.ctx)&&this.init();try{const r=t||s.duration;this.totalFrames=Math.ceil(r*this.options.fps),this.setupMediaRecorder(),this.startRecording();for(let d=0;d<this.totalFrames;d++)await this.renderFrame(s,e,d/this.options.fps),this.onProgress(d/this.totalFrames);this.stopRecording()}catch(r){throw this.onError(r),r}}async renderFrame(s,e,t){s.currentTime=t,await this.waitForVideoSeek(s),this.ctx.fillStyle="#000000",this.ctx.fillRect(0,0,this.options.width,this.options.height),this.ctx.drawImage(s,0,0,this.options.width,this.options.height),this.renderOverlays(e,t);const r=await this.canvas.convertToBlob({type:"image/png"});this.recordedChunks.push(r)}renderOverlays(s,e){s.forEach(t=>{this.isOverlayVisible(t,e)&&this.renderOverlay(t,e)})}isOverlayVisible(s,e){const t=s.startTime||0,r=s.endTime||1/0;return e>=t&&e<=r}renderOverlay(s,e){if(!this.ctx){console.warn("Canvas context not initialized");return}const{type:t,content:r,position:d,size:l,style:a,animation:u}=s,i=u?this.calculateAnimationProgress(s,e):1;this.ctx.save();const o=d.x*this.options.width,p=d.y*this.options.height,c=l.width*this.options.width,m=l.height*this.options.height;switch(u&&this.applyAnimationTransform(u,i,o,p,c,m),t){case"text":this.renderTextOverlay(r,o,p,c,m,a);break;case"image":this.renderImageOverlay(r,o,p,c,m,a);break;case"shape":this.renderShapeOverlay(r,o,p,c,m,a);break;default:console.warn(`Unknown overlay type: ${t}`)}this.ctx.restore()}renderTextOverlay(s,e,t,r,d,l={}){this.ctx.font=`${l.fontSize||48}px ${l.fontFamily||"Arial"}`,this.ctx.fillStyle=l.color||"#ffffff",this.ctx.textAlign=l.textAlign||"center",this.ctx.textBaseline="middle",l.strokeColor&&(this.ctx.strokeStyle=l.strokeColor,this.ctx.lineWidth=l.strokeWidth||2,this.ctx.strokeText(s,e+r/2,t+d/2)),l.shadowColor&&(this.ctx.shadowColor=l.shadowColor,this.ctx.shadowBlur=l.shadowBlur||4,this.ctx.shadowOffsetX=l.shadowOffsetX||2,this.ctx.shadowOffsetY=l.shadowOffsetY||2),this.ctx.fillText(s,e+r/2,t+d/2)}renderImageOverlay(s,e,t,r,d,l={}){const a=new Image;return a.crossOrigin="anonymous",new Promise((u,i)=>{a.onload=()=>{l.filters&&this.applyImageFilters(l.filters),this.ctx.drawImage(a,e,t,r,d),u()},a.onerror=i,a.src=s})}renderShapeOverlay(s,e,t,r,d,l={}){switch(this.ctx.fillStyle=l.fillColor||"#ffffff",this.ctx.strokeStyle=l.strokeColor||"#000000",this.ctx.lineWidth=l.strokeWidth||1,s.type){case"rectangle":l.fillColor&&this.ctx.fillRect(e,t,r,d),l.strokeColor&&this.ctx.strokeRect(e,t,r,d);break;case"circle":const a=Math.min(r,d)/2,u=e+r/2,i=t+d/2;this.ctx.beginPath(),this.ctx.arc(u,i,a,0,2*Math.PI),l.fillColor&&this.ctx.fill(),l.strokeColor&&this.ctx.stroke();break}}calculateAnimationProgress(s,e){const t=s.startTime||0,r=s.endTime||s.startTime+s.duration||1,d=e-t,l=r-t;return Math.max(0,Math.min(1,d/l))}applyAnimationTransform(s,e,t,r,d,l){const a=t+d/2,u=r+l/2,i=this.applyEasing(s.easing||"linear",e);if(s.translateX){const o=s.translateX*i;this.ctx.translate(o,0)}if(s.translateY){const o=s.translateY*i;this.ctx.translate(0,o)}if(s.scale){const o=1+(s.scale-1)*i;this.ctx.translate(a,u),this.ctx.scale(o,o),this.ctx.translate(-a,-u)}if(s.rotate){const o=s.rotate*i*Math.PI/180;this.ctx.translate(a,u),this.ctx.rotate(o),this.ctx.translate(-a,-u)}s.opacity&&(this.ctx.globalAlpha=s.opacity*i)}applyEasing(s,e){switch(s){case"ease-in":return e*e;case"ease-out":return e*(2-e);case"ease-in-out":return e<.5?2*e*e:-1+(4-2*e)*e;default:return e}}applyImageFilters(s){let e="";s.brightness&&(e+=`brightness(${s.brightness}) `),s.contrast&&(e+=`contrast(${s.contrast}) `),s.saturate&&(e+=`saturate(${s.saturate}) `),s.blur&&(e+=`blur(${s.blur}px) `),e&&(this.ctx.filter=e.trim())}setupMediaRecorder(){const s=this.canvas.captureStream(this.options.fps);this.mediaRecorder=new MediaRecorder(s,{mimeType:"video/webm;codecs=vp9",videoBitsPerSecond:parseInt(this.options.bitrate)}),this.recordedChunks=[],this.mediaRecorder.ondataavailable=e=>{e.data.size>0&&this.recordedChunks.push(e.data)},this.mediaRecorder.onstop=()=>{this.finalizeVideo()},this.mediaRecorder.onerror=e=>{this.onError(new Error(`MediaRecorder error: ${e.message}`))}}startRecording(){this.mediaRecorder&&!this.isRecording&&(this.mediaRecorder.start(),this.isRecording=!0)}stopRecording(){this.mediaRecorder&&this.isRecording&&(this.mediaRecorder.stop(),this.isRecording=!1)}finalizeVideo(){try{const s=new Blob(this.recordedChunks,{type:"video/webm"}),e=URL.createObjectURL(s);this.onComplete({blob:s,url:e,size:s.size,duration:this.totalFrames/this.options.fps})}catch(s){this.onError(new Error(`Failed to finalize video: ${s.message}`))}}waitForVideoSeek(s){return new Promise(e=>{const t=()=>{Math.abs(s.currentTime-s.seekedTime)<.1?e():requestAnimationFrame(t)};s.seekedTime=s.currentTime,requestAnimationFrame(t)})}exportVideo(s={}){const e={...this.options,...s};return new V(e)}isSerializable(s){try{return JSON.stringify(s),!0}catch{return!1}}dispose(){this.mediaRecorder&&this.isRecording&&(this.mediaRecorder.stop(),this.isRecording=!1),this.canvas&&(this.canvas=null,this.ctx=null),this.recordedChunks=[],this.isRecording=!1}}const Ze=new V;function Qe({project:n,onExportComplete:s,onExportError:e}){const t=document.createElement("div");t.className="video-export";let r=!1,d="ready";t.innerHTML=`
    <div class="export-container bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Export Video</h3>
        <div id="export-status" class="text-sm text-gray-400">${l()}</div>
      </div>

      <div class="export-options mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="option-group">
            <label class="block text-sm font-medium text-gray-300 mb-2">Resolution</label>
            <select id="resolution-select" class="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
              <option value="720p">720p HD (1280x720)</option>
              <option value="1080p" selected>1080p Full HD (1920x1080)</option>
              <option value="4k">4K Ultra HD (3840x2160)</option>
            </select>
          </div>

          <div class="option-group">
            <label class="block text-sm font-medium text-gray-300 mb-2">Format</label>
            <select id="format-select" class="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
              <option value="webm" selected>WebM (Universal)</option>
              <option value="mp4">MP4 (H.264)</option>
            </select>
          </div>

          <div class="option-group">
            <label class="block text-sm font-medium text-gray-300 mb-2">Quality</label>
            <select id="quality-select" class="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
              <option value="low">Low (Fast)</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High (Slow)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="export-progress mb-6" id="progress-container" style="display: none;">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-300">Exporting video...</span>
          <span id="progress-text" class="text-sm text-white">0%</span>
        </div>
        <div class="w-full bg-white/20 rounded-full h-2">
          <div id="progress-bar" class="bg-violet-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <div class="text-xs text-gray-400 mt-1">
          <span id="progress-details">Preparing export...</span>
        </div>
      </div>

      <div class="export-actions flex gap-3">
        <button id="export-btn" class="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export Video
          </span>
        </button>

        <button id="preview-btn" class="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        </button>
      </div>

      <div id="export-result" class="mt-4" style="display: none;">
        <div class="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div class="flex items-center gap-2 text-green-400 mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span class="font-medium">Export Complete!</span>
          </div>
          <p class="text-sm text-green-300 mb-3">Your video has been exported successfully.</p>
          <div class="flex gap-2">
            <button id="download-btn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
              Download Video
            </button>
            <button id="share-btn" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm">
              Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  `;function l(){switch(d){case"ready":return"Ready to export";case"exporting":return"Exporting...";case"complete":return"Export complete";case"error":return"Export failed";default:return"Unknown status"}}function a(m){d=m;const v=t.querySelector("#export-status");v&&(v.textContent=l(),v.className=`text-sm ${m==="error"?"text-red-400":m==="complete"?"text-green-400":"text-gray-400"}`)}function u(m,v=""){const g=t.querySelector("#progress-bar"),f=t.querySelector("#progress-text"),h=t.querySelector("#progress-details");g&&(g.style.width=`${m*100}%`),f&&(f.textContent=`${Math.round(m*100)}%`),h&&(h.textContent=v)}function i(m=!0){const v=t.querySelector("#progress-container");v&&(v.style.display=m?"block":"none")}function o(m=!0,v=null){const g=t.querySelector("#export-result");if(g&&(g.style.display=m?"block":"none",v&&m)){const f=t.querySelector("#download-btn"),h=t.querySelector("#share-btn");f&&(f.onclick=()=>{const b=document.createElement("a");b.href=v.url,b.download=`remix-go-export-${Date.now()}.webm`,document.body.appendChild(b),b.click(),document.body.removeChild(b)}),h&&(h.onclick=()=>{var b;(b=navigator.share)==null||b.call(navigator,{title:"Remix Go Video",url:v.url})})}}const p=t.querySelector("#export-btn"),c=t.querySelector("#preview-btn");return p&&p.addEventListener("click",async()=>{if(!r)try{r=!0,a("exporting"),i(!0),o(!1),p.disabled=!0,p.innerHTML=`
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </span>
        `;const m=t.querySelector("#resolution-select").value,v=t.querySelector("#format-select").value,g=t.querySelector("#quality-select").value;let f,h;switch(m){case"720p":f=1280,h=720;break;case"4k":f=3840,h=2160;break;default:f=1920,h=1080}let b;switch(g){case"low":b="2000k";break;case"high":b="12000k";break;default:b="8000k"}const w=document.querySelector("video");if(!w)throw new Error("No video element found to export");await Ze.exportVideo({width:f,height:h,fps:30,bitrate:b,format:v,onProgress:L=>{u(L,`Rendering frame ${Math.round(L*100)}%`)},onComplete:L=>{a("complete"),i(!1),o(!0,L),p.disabled=!1,p.innerHTML=`
              <span class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export Complete
              </span>
            `,r=!1,s&&s(L)},onError:L=>{a("error"),i(!1),p.disabled=!1,p.innerHTML=`
              <span class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Export Failed
              </span>
            `,r=!1,e&&e(L)}}).renderVideo(w,(n==null?void 0:n.overlays)||[])}catch(m){console.error("Export failed:",m),a("error"),i(!1),p.disabled=!1,p.innerHTML=`
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Try Again
          </span>
        `,r=!1,e&&e(m)}}),c&&c.addEventListener("click",()=>{alert("Preview functionality coming soon!")}),t}const Je=Object.freeze(Object.defineProperty({__proto__:null,default:Qe},Symbol.toStringTag,{value:"Module"}));y.AIContentGenerator=oe,y.AIGeneratePanel=Te,y.AlertModal=ce,y.AudioSelectionWorkspace=te,y.AvatarGenerator=Me,y.BatchGenerator=qe,y.BehavioralAnalytics=re,y.BrandHeader=Ie,y.CTABuilder=se,y.Checkpoint=X,y.CheckpointsList=_,y.CommandPalette=ie,y.ConfirmationModal=ue,y.ConstructionScene=J,y.ConstructionWorkspace=Q,y.EnhancedVideoEditor=Z,y.FilePickerModal=pe,y.FormBuilder=de,y.HelpModal=he,y.KeyboardShortcutsModal=fe,y.NavigationBuilder=le,y.OnboardingModal=be,y.PreviewModal=xe,y.ProgressModal=$e,y.RemixGoVanilla=N,y.ScriptWriter=je,y.SettingsModal=Ee,y.Sidebar=ze,y.TemplateSystem=ne,y.ThemeCustomizer=ae,y.VideoEditor=F,y.VideoSelectionWorkspace=ee,y.VoiceClone=Ae,y.WizardStepper=Pe,y.alertService=G,y.capitalizeFirst=We,y.createRemixGoApp=K,y.debounce=Oe,y.deepClone=Ve,y.default=Ye,y.editorStateManager=Be,y.formatDuration=Re,y.formatFileSize=He,y.generateId=Ne,y.isValidEmail=Ue,y.projectUtils=Fe,y.throttle=De,y.truncateText=Ge,y.whiteLabelSystem=Ke,Object.defineProperties(y,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
