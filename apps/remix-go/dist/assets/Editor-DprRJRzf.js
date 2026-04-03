import{f as g,g as m}from"./tokenExtractor-CIPbNj6B.js";function h({src:d,onOverlayAdd:l,onTimeUpdate:e}){const t=document.createElement("div");t.className="video-editor";let r=null,a=null;t.innerHTML=`
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
  `,r=t.querySelector("#editor-video"),a=t.querySelector("#overlay-container");const s=t.querySelector("#play-pause-btn"),i=t.querySelector("#timeline-slider"),n=t.querySelector("#current-time"),o=t.querySelector("#total-time"),c=t.querySelector("#timeline-overlays");d&&(r.src=d);function p(u){const v=Math.floor(u/60),x=Math.floor(u%60);return`${v}:${String(x).padStart(2,"0")}`}r.addEventListener("loadedmetadata",()=>{o.textContent=p(r.duration),i.max=r.duration}),r.addEventListener("timeupdate",()=>{n.textContent=p(r.currentTime),i.value=r.currentTime,e&&e(r.currentTime)});let b=!1;return s.addEventListener("click",()=>{b?(r.pause(),s.innerHTML='<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'):(r.play(),s.innerHTML='<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'),b=!b}),i.addEventListener("input",()=>{r.currentTime=parseFloat(i.value)}),t.setSource=u=>{r.src=u},t.addOverlayElement=u=>{const v=document.createElement("div");v.className="overlay-element absolute pointer-events-auto",v.style.top=u.top||"10%",v.style.left=u.left||"10%",v.style.width=u.width||"80%",v.dataset.overlayId=u.id,u.type==="text"?v.innerHTML=`<p class="text-white text-lg font-bold" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8)">${u.text||"Text"}</p>`:u.type==="image"?v.innerHTML=`<img src="${u.src}" class="w-full rounded" alt="overlay">`:u.type==="cta"&&(v.innerHTML=`<a href="${u.href||"#"}" class="inline-block px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-500">${u.text||"Click Here"}</a>`),a.appendChild(v);const x=document.createElement("div");x.className="h-full rounded bg-violet-500/50 text-white text-xs flex items-center px-1 truncate",x.style.minWidth="40px",x.style.flex="1",x.textContent=u.type||"overlay",x.dataset.overlayId=u.id,c.appendChild(x)},t.getVideo=()=>r,t.getOverlayContainer=()=>a,t}function w({onGenerate:d}){const l=document.createElement("div");l.className="ai-generate-panel p-4 space-y-4",l.innerHTML=`
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
  `;const e=l.querySelector("#ai-generate-btn"),t=l.querySelector("#ai-i2v-btn"),r=l.querySelector("#ai-music-btn"),a=l.querySelector("#i2v-upload-zone"),s=l.querySelector("#i2v-file");return a.addEventListener("click",()=>s.click()),a.addEventListener("dragover",i=>{i.preventDefault(),a.classList.add("border-violet-500")}),a.addEventListener("dragleave",()=>{a.classList.remove("border-violet-500")}),a.addEventListener("drop",i=>{i.preventDefault(),a.classList.remove("border-violet-500"),i.dataTransfer.files.length&&(s.files=i.dataTransfer.files,a.querySelector("p").textContent=i.dataTransfer.files[0].name)}),e.addEventListener("click",()=>{d&&d({type:"text-to-video",prompt:l.querySelector("#ai-prompt").value,negativePrompt:l.querySelector("#ai-negative").value,model:l.querySelector("#ai-model").value,duration:parseInt(l.querySelector("#ai-duration").value,10),aspectRatio:l.querySelector("#ai-aspect").value,quality:l.querySelector("#ai-quality").value})}),t.addEventListener("click",()=>{d&&d({type:"image-to-video",file:s.files[0]||null,prompt:l.querySelector("#ai-prompt").value,model:l.querySelector("#ai-model").value,duration:parseInt(l.querySelector("#ai-duration").value,10)})}),r.addEventListener("click",()=>{d&&d({type:"music",prompt:l.querySelector("#ai-music-prompt").value})}),l}function y({onUpload:d,accept:l}){const e=document.createElement("div");e.className="video-upload",e.innerHTML=`
    <div id="upload-zone"
      class="p-8 rounded-xl border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 transition-all">
      <svg class="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
      <p class="text-gray-400 text-sm mb-1">Drop video file here or click to browse</p>
      <p class="text-gray-600 text-xs">MP4, WebM, MOV up to 500MB</p>
      <input type="file" id="video-file" accept="${l||"video/*"}" class="hidden">
    </div>
    <div id="url-input" class="mt-4">
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-2">Or paste URL</label>
      <div class="flex gap-2">
        <input type="url" id="video-url" placeholder="https://example.com/video.mp4"
          class="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        <button id="load-url-btn"
          class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors">
          Load
        </button>
      </div>
    </div>
    <div id="preview-area" class="mt-4 hidden">
      <div class="flex items-center gap-3 p-3 rounded-lg bg-white/5">
        <div id="video-thumb" class="w-24 h-14 rounded bg-black/50 flex items-center justify-center overflow-hidden">
          <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <p id="video-name" class="text-sm text-white truncate">filename.mp4</p>
          <p id="video-info" class="text-xs text-gray-500">--</p>
        </div>
        <button id="remove-video" class="p-1 text-gray-500 hover:text-red-400 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  `;const t=e.querySelector("#upload-zone"),r=e.querySelector("#video-file"),a=e.querySelector("#video-url"),s=e.querySelector("#load-url-btn"),i=e.querySelector("#preview-area"),n=e.querySelector("#video-name"),o=e.querySelector("#video-info"),c=e.querySelector("#remove-video");function p(u,v,x){i.classList.remove("hidden"),n.textContent=u,o.textContent=v,d&&d({type:"url",url:x,name:u})}t.addEventListener("click",()=>r.click()),t.addEventListener("dragover",u=>{u.preventDefault(),t.classList.add("border-violet-500","bg-violet-500/5")}),t.addEventListener("dragleave",()=>{t.classList.remove("border-violet-500","bg-violet-500/5")}),t.addEventListener("drop",u=>{u.preventDefault(),t.classList.remove("border-violet-500","bg-violet-500/5"),u.dataTransfer.files.length&&b(u.dataTransfer.files[0])}),r.addEventListener("change",()=>{r.files.length&&b(r.files[0])});function b(u){const v=URL.createObjectURL(u),x=(u.size/(1024*1024)).toFixed(1);p(u.name,`${x} MB`,v)}return s.addEventListener("click",()=>{const u=a.value.trim();if(u){const v=u.split("/").pop().split("?")[0];p(v,"URL",u)}}),c.addEventListener("click",()=>{i.classList.add("hidden"),r.value="",a.value=""}),e.getValue=()=>r.files.length?URL.createObjectURL(r.files[0]):a.value.trim()||null,e}function k({steps:d,currentStep:l,onStepChange:e}){const r=d||[{id:"source",label:"Source",description:"Upload or generate video"},{id:"edit",label:"Edit",description:"Add overlays and effects"},{id:"personalize",label:"Personalize",description:"Add tokens and campaigns"},{id:"publish",label:"Publish",description:"Share your video"}],a=l||0,s=document.createElement("div");return s.className="wizard-stepper flex items-center justify-center gap-2 p-4",r.forEach((i,n)=>{const o=n===a,c=n<a,p=document.createElement("div");p.className="flex items-center";const b=document.createElement("button");b.className=`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${o?"bg-violet-600 text-white":c?"bg-green-600 text-white":"bg-white/10 text-gray-500"}`,b.innerHTML=c?'<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>':String(n+1),b.title=i.label,b.addEventListener("click",()=>{e&&e(n,i)});const u=document.createElement("span");if(u.className=`ml-2 text-xs hidden sm:inline ${o?"text-violet-300":c?"text-gray-400":"text-gray-600"}`,u.textContent=i.label,p.appendChild(b),p.appendChild(u),n<r.length-1){const v=document.createElement("div");v.className=`w-8 sm:w-16 h-0.5 mx-2 ${c?"bg-green-600":"bg-white/10"}`,p.appendChild(v)}s.appendChild(p)}),s}function S({data:d,onSave:l}){var r,a;const e=d||{text:"Your text here",fontSize:24,fontColor:"#ffffff",top:"10%",left:"10%",width:"80%",start:0,end:5},t=document.createElement("div");return t.className="text-overlay-editor p-4 rounded-xl glass",t.innerHTML=`
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Text Overlay</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Text</label>
        <textarea id="toe-text" rows="2"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500">${e.text}</textarea>
        <button id="toe-insert-token" class="mt-1 text-xs text-violet-400 hover:text-violet-300">+ Insert Token</button>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Font Size</label>
          <input id="toe-size" type="number" value="${e.fontSize}" min="8" max="120"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Color</label>
          <input id="toe-color" type="color" value="${e.fontColor}"
            class="w-full h-9 rounded cursor-pointer">
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Font</label>
          <select id="toe-font"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Courier New">Courier New</option>
            <option value="Impact">Impact</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Weight</label>
          <select id="toe-weight"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </select>
        </div>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Animation</label>
        <select id="toe-animation"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="slide-down">Slide Down</option>
          <option value="typewriter">Typewriter</option>
          <option value="pop">Pop</option>
        </select>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Start (seconds)</label>
          <input id="toe-start" type="number" value="${e.start}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">End (seconds)</label>
          <input id="toe-end" type="number" value="${e.end}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <button id="toe-save"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
        Save Overlay
      </button>
    </div>
  `,(r=t.querySelector("#toe-insert-token"))==null||r.addEventListener("click",()=>{const s=t.querySelector("#toe-text"),i=prompt("Enter token name (e.g., FIRSTNAME):");i&&(s.value+=`{{${i.toUpperCase()}}}`)}),(a=t.querySelector("#toe-save"))==null||a.addEventListener("click",()=>{const s={type:"text",text:t.querySelector("#toe-text").value,fontSize:parseInt(t.querySelector("#toe-size").value,10),fontColor:t.querySelector("#toe-color").value,fontFamily:t.querySelector("#toe-font").value,fontWeight:t.querySelector("#toe-weight").value,animation:t.querySelector("#toe-animation").value,start:parseFloat(t.querySelector("#toe-start").value),end:parseFloat(t.querySelector("#toe-end").value),top:e.top,left:e.left,width:e.width};l&&l(s)}),t}function L({data:d,onSave:l}){var r;const e=d||{text:"Book a Meeting",href:"#",backgroundColor:"#7c3aed",textColor:"#ffffff",fontSize:16,borderRadius:8,padding:"12px 24px",start:0,end:999},t=document.createElement("div");return t.className="cta-editor p-4 rounded-xl glass",t.innerHTML=`
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">CTA Button</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Button Text</label>
        <input id="cta-text" type="text" value="${e.text}"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Link URL</label>
        <input id="cta-href" type="url" value="${e.href}"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          placeholder="https://calendly.com/you">
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Background</label>
          <input id="cta-bg" type="color" value="${e.backgroundColor}" class="w-full h-9 rounded cursor-pointer">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Text Color</label>
          <input id="cta-color" type="color" value="${e.textColor}" class="w-full h-9 rounded cursor-pointer">
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Font Size</label>
          <input id="cta-size" type="number" value="${e.fontSize}" min="10" max="48"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Border Radius</label>
          <input id="cta-radius" type="number" value="${e.borderRadius}" min="0" max="50"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Start (seconds)</label>
          <input id="cta-start" type="number" value="${e.start}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">End (seconds)</label>
          <input id="cta-end" type="number" value="${e.end}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <div class="p-3 rounded-lg bg-black/30 text-center">
        <a href="#" style="display:inline-block;padding:${e.padding};background:${e.backgroundColor};color:${e.textColor};font-size:${e.fontSize}px;border-radius:${e.borderRadius}px;text-decoration:none;font-weight:bold;">
          ${e.text}
        </a>
      </div>
      
      <button id="cta-save"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
        Save CTA
      </button>
    </div>
  `,(r=t.querySelector("#cta-save"))==null||r.addEventListener("click",()=>{const a={type:"cta",text:t.querySelector("#cta-text").value,href:t.querySelector("#cta-href").value,backgroundColor:t.querySelector("#cta-bg").value,textColor:t.querySelector("#cta-color").value,fontSize:parseInt(t.querySelector("#cta-size").value,10),borderRadius:parseInt(t.querySelector("#cta-radius").value,10),start:parseFloat(t.querySelector("#cta-start").value),end:parseFloat(t.querySelector("#cta-end").value)};l&&l(a)}),t}function q({data:d,onSave:l}){var r;const e=d||{title:"Special Offer!",message:"Don't miss this opportunity to transform your business.",buttonText:"Learn More",buttonHref:"#",start:5,end:10},t=document.createElement("div");return t.className="popup-editor p-4 rounded-xl glass",t.innerHTML=`
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Popup Overlay</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Title</label>
        <input id="pop-title" type="text" value="${e.title}"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Message</label>
        <textarea id="pop-message" rows="3"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500">${e.message}</textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Button Text</label>
          <input id="pop-btn-text" type="text" value="${e.buttonText}"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Button Link</label>
          <input id="pop-btn-href" type="url" value="${e.buttonHref}"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Type</label>
          <select id="pop-type"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="offer">Special Offer</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Position</label>
          <select id="pop-position"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Start (seconds)</label>
          <input id="pop-start" type="number" value="${e.start}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">End (seconds)</label>
          <input id="pop-end" type="number" value="${e.end}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <button id="pop-save"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
        Save Popup
      </button>
    </div>
  `,(r=t.querySelector("#pop-save"))==null||r.addEventListener("click",()=>{const a={type:"popup",title:t.querySelector("#pop-title").value,message:t.querySelector("#pop-message").value,buttonText:t.querySelector("#pop-btn-text").value,buttonHref:t.querySelector("#pop-btn-href").value,popupType:t.querySelector("#pop-type").value,position:t.querySelector("#pop-position").value,start:parseFloat(t.querySelector("#pop-start").value),end:parseFloat(t.querySelector("#pop-end").value)};l&&l(a)}),t}function E({onSave:d,initialData:l}){const e=l||{caption:"Enter your details to continue",elements:[{type:"email",label:"Email",token:"EMAIL"},{type:"singleline",label:"Name",token:"NAME"}],btnText:"Submit",fontFamily:"Arial",fontColor:"#ffffff",backgroundColor:"#000000",buttonBackground:"#7c3aed",buttonFontColor:"#ffffff",buttonBorderRadius:4,webhook:"",webhookEnabled:!1,privacyDisclaimer:"By submitting you agree to our privacy policy."},t=document.createElement("div");t.className="lead-form-editor p-4 rounded-xl glass";function r(){var a,s,i;t.innerHTML=`
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Lead Form Editor</h3>
      
      <div class="space-y-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Caption</label>
          <input id="lf-caption" type="text" value="${e.caption}"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        
        <div>
          <label class="block text-xs text-gray-500 mb-1">Fields</label>
          <div id="lf-fields" class="space-y-1">
            ${e.elements.map((n,o)=>`
              <div class="flex gap-2 items-center" data-field-index="${o}">
                <select data-field-type="${o}"
                  class="flex-1 p-1.5 rounded bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500">
                  <option value="singleline" ${n.type==="singleline"?"selected":""}>Text</option>
                  <option value="email" ${n.type==="email"?"selected":""}>Email</option>
                  <option value="number" ${n.type==="number"?"selected":""}>Number</option>
                  <option value="multiline" ${n.type==="multiline"?"selected":""}>Textarea</option>
                </select>
                <input type="text" data-field-label="${o}" value="${n.label}"
                  class="flex-1 p-1.5 rounded bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                  placeholder="Label">
                <button data-remove-field="${o}" class="text-red-400 hover:text-red-300 text-xs px-1">&times;</button>
              </div>
            `).join("")}
          </div>
          <button id="lf-add-field" class="mt-1 text-xs text-violet-400 hover:text-violet-300">+ Add Field</button>
        </div>
        
        <div>
          <label class="block text-xs text-gray-500 mb-1">Button Text</label>
          <input id="lf-btn-text" type="text" value="${e.btnText}"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Background</label>
            <input id="lf-bg-color" type="color" value="${e.backgroundColor}"
              class="w-full h-8 rounded cursor-pointer">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Button Color</label>
            <input id="lf-btn-color" type="color" value="${e.buttonBackground}"
              class="w-full h-8 rounded cursor-pointer">
          </div>
        </div>
        
        <div>
          <label class="block text-xs text-gray-500 mb-1">Font</label>
          <select id="lf-font"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="Arial" ${e.fontFamily==="Arial"?"selected":""}>Arial</option>
            <option value="Helvetica" ${e.fontFamily==="Helvetica"?"selected":""}>Helvetica</option>
            <option value="Georgia" ${e.fontFamily==="Georgia"?"selected":""}>Georgia</option>
            <option value="Verdana" ${e.fontFamily==="Verdana"?"selected":""}>Verdana</option>
            <option value="Anton" ${e.fontFamily==="Anton"?"selected":""}>Anton</option>
          </select>
        </div>
        
        <div>
          <label class="flex items-center gap-2 text-xs text-gray-500">
            <input type="checkbox" id="lf-webhook-enabled" ${e.webhookEnabled?"checked":""} class="accent-violet-500">
            Enable Webhook
          </label>
          <input id="lf-webhook" type="url" value="${e.webhook}" placeholder="https://your-webhook.com/endpoint"
            class="w-full mt-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 ${e.webhookEnabled?"":"hidden"}">
        </div>
        
        <div>
          <label class="block text-xs text-gray-500 mb-1">Privacy Disclaimer</label>
          <textarea id="lf-privacy" rows="2"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500">${e.privacyDisclaimer}</textarea>
        </div>
        
        <button id="lf-save"
          class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
          Save Form
        </button>
      </div>
    `,t.querySelectorAll("[data-remove-field]").forEach(n=>{n.addEventListener("click",()=>{const o=parseInt(n.dataset.removeField,10);e.elements.splice(o,1),r()})}),(a=t.querySelector("#lf-add-field"))==null||a.addEventListener("click",()=>{e.elements.push({type:"singleline",label:"New Field",token:"NEW_FIELD"}),r()}),(s=t.querySelector("#lf-webhook-enabled"))==null||s.addEventListener("change",n=>{e.webhookEnabled=n.target.checked,t.querySelector("#lf-webhook").classList.toggle("hidden",!n.target.checked)}),(i=t.querySelector("#lf-save"))==null||i.addEventListener("click",()=>{e.caption=t.querySelector("#lf-caption").value,e.btnText=t.querySelector("#lf-btn-text").value,e.backgroundColor=t.querySelector("#lf-bg-color").value,e.buttonBackground=t.querySelector("#lf-btn-color").value,e.fontFamily=t.querySelector("#lf-font").value,e.webhook=t.querySelector("#lf-webhook").value,e.privacyDisclaimer=t.querySelector("#lf-privacy").value,e.elements.forEach((n,o)=>{const c=t.querySelector(`[data-field-type="${o}"]`),p=t.querySelector(`[data-field-label="${o}"]`);c&&(n.type=c.value),p&&(n.label=p.value,n.token=p.value.trim().toUpperCase().replace(/\s+/g,"_"))}),d&&d(e)})}return r(),t}function T({data:d,onSave:l}){var s;const e=d||{src:"",width:"100%",start:0,end:5},t=document.createElement("div");t.className="image-overlay-editor p-4 rounded-xl glass",t.innerHTML=`
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Image Overlay</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Image URL</label>
        <input id="ioe-src" type="url" value="${e.src}"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          placeholder="https://example.com/image.png">
      </div>
      
      <div id="ioe-upload" class="p-4 rounded-lg border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 transition-colors">
        <p class="text-gray-500 text-xs">Or drop image here</p>
        <input type="file" id="ioe-file" accept="image/*" class="hidden">
      </div>
      
      ${e.src?`
        <div class="rounded-lg overflow-hidden border border-white/10">
          <img src="${e.src}" class="w-full max-h-32 object-contain bg-black/30" alt="preview">
        </div>
      `:""}
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Width</label>
          <input id="ioe-width" type="text" value="${e.width}"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
            placeholder="100% or 200px">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Position</label>
          <select id="ioe-position"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="top-left">Top Left</option>
            <option value="top-center">Top Center</option>
            <option value="center">Center</option>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Start (seconds)</label>
          <input id="ioe-start" type="number" value="${e.start}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">End (seconds)</label>
          <input id="ioe-end" type="number" value="${e.end}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Click Action</label>
        <select id="ioe-click"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
          <option value="none">None</option>
          <option value="link">Open Link</option>
          <option value="pause">Pause Video</option>
        </select>
      </div>
      
      <button id="ioe-save"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
        Save Image Overlay
      </button>
    </div>
  `;const r=t.querySelector("#ioe-upload"),a=t.querySelector("#ioe-file");return r.addEventListener("click",()=>a.click()),r.addEventListener("drop",i=>{i.preventDefault(),i.dataTransfer.files.length&&(t.querySelector("#ioe-src").value=URL.createObjectURL(i.dataTransfer.files[0]))}),r.addEventListener("dragover",i=>i.preventDefault()),(s=t.querySelector("#ioe-save"))==null||s.addEventListener("click",()=>{const i={type:"image",src:t.querySelector("#ioe-src").value,width:t.querySelector("#ioe-width").value,start:parseFloat(t.querySelector("#ioe-start").value),end:parseFloat(t.querySelector("#ioe-end").value),clickAction:t.querySelector("#ioe-click").value};l&&l(i)}),t}function C({onTokenChosen:d}){const l=m(),e=[{id:"plain",label:"Plain",description:"{{TOKEN}}"},{id:"uppercase",label:"Uppercase",description:"{{up TOKEN}}"},{id:"fallback",label:"Fallback",description:'{{d TOKEN "default"}}'}];let t=l[0].key,r="plain",a="";const s=document.createElement("div");s.className="personalizer p-4 rounded-xl glass max-w-md";function i(){s.innerHTML=`
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Insert Token</h3>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-500 mb-2">Select Token</label>
          <div class="space-y-1 max-h-48 overflow-y-auto">
            ${l.map(o=>`
              <button data-token="${o.key}"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${t===o.key?"bg-violet-600/30 text-violet-300 border border-violet-500/50":"text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}">
                <span class="font-medium">${o.label}</span>
                ${o.example?`<span class="text-xs text-gray-600 ml-1">(${o.example})</span>`:""}
              </button>
            `).join("")}
          </div>
        </div>
        
        <div>
          <label class="block text-xs text-gray-500 mb-2">Mode</label>
          <div class="space-y-1">
            ${e.map(o=>`
              <button data-mode="${o.id}"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${r===o.id?"bg-violet-600/30 text-violet-300 border border-violet-500/50":"text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}">
                <span class="font-medium">${o.label}</span>
                <span class="block text-xs text-gray-600">${o.description}</span>
              </button>
            `).join("")}
          </div>
          
          ${r==="fallback"?`
            <div class="mt-3">
              <label class="block text-xs text-gray-500 mb-1">Default Value</label>
              <input type="text" id="fallback-input" value="${a}"
                class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                placeholder="Friend">
            </div>
          `:""}
        </div>
      </div>
      
      <div class="mt-4 p-3 rounded-lg bg-black/30 text-center">
        <code class="text-violet-400 text-sm">${g(t,r,a)}</code>
      </div>
      
      <button id="add-token-btn"
        class="mt-3 w-full p-2.5 rounded-lg bg-violet-600 text-white font-semibold text-sm hover:bg-violet-500 transition-colors">
        Add Token
      </button>
    `,s.querySelectorAll("[data-token]").forEach(o=>{o.addEventListener("click",()=>{t=o.dataset.token,i()})}),s.querySelectorAll("[data-mode]").forEach(o=>{o.addEventListener("click",()=>{r=o.dataset.mode,i()})});const n=s.querySelector("#fallback-input");n&&n.addEventListener("input",o=>{a=o.target.value}),s.querySelector("#add-token-btn").addEventListener("click",()=>{const o=g(t,r,a);d&&d(o,t,r)})}return i(),s}function M({onVoiceGenerated:d}){var c;let l=null;const e=document.createElement("div");e.className="voice-clone p-4 rounded-xl glass",e.innerHTML=`
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
  `;const t=e.querySelector("#voice-upload-zone"),r=e.querySelector("#voice-file"),a=e.querySelector("#voice-file-name"),s=e.querySelector("#generate-voice-btn"),i=e.querySelector("#voice-result"),n=e.querySelector("#voice-audio");t.addEventListener("click",()=>r.click()),t.addEventListener("dragover",p=>{p.preventDefault(),t.classList.add("border-violet-500")}),t.addEventListener("dragleave",()=>{t.classList.remove("border-violet-500")}),t.addEventListener("drop",p=>{p.preventDefault(),t.classList.remove("border-violet-500"),p.dataTransfer.files.length&&o(p.dataTransfer.files[0])}),r.addEventListener("change",()=>{r.files.length&&o(r.files[0])});function o(p){l=URL.createObjectURL(p),a.textContent=p.name,a.classList.remove("hidden")}return s.addEventListener("click",()=>{e.querySelector("#voice-text").value.trim()&&(s.disabled=!0,s.textContent="Generating...",setTimeout(()=>{i.classList.remove("hidden"),s.disabled=!1,s.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Cloned Voice'},2e3))}),(c=e.querySelector("#voice-use"))==null||c.addEventListener("click",()=>{d&&d({audioUrl:n.src,text:e.querySelector("#voice-text").value,sampleUrl:l})}),e}function $({onAvatarReady:d}){var u;const l=document.createElement("div");l.className="avatar-generator p-4 rounded-xl glass",l.innerHTML=`
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
  `;const e=l.querySelector("#avatar-upload-zone"),t=l.querySelector("#avatar-file"),r=l.querySelector("#avatar-preview"),a=l.querySelector("#avatar-preview-img"),s=l.querySelector("#avatar-audio-file"),i=l.querySelector("#avatar-audio-url"),n=l.querySelector("#avatar-upload-audio"),o=l.querySelector("#generate-avatar-btn"),c=l.querySelector("#avatar-result"),p=l.querySelector("#avatar-video");e.addEventListener("click",()=>t.click()),e.addEventListener("dragover",v=>v.preventDefault()),e.addEventListener("drop",v=>{v.preventDefault(),v.dataTransfer.files.length&&b(v.dataTransfer.files[0])}),t.addEventListener("change",()=>{t.files.length&&b(t.files[0])});function b(v){a.src=URL.createObjectURL(v),r.classList.remove("hidden")}return n.addEventListener("click",()=>s.click()),s.addEventListener("change",()=>{s.files.length&&(i.value=URL.createObjectURL(s.files[0]))}),o.addEventListener("click",()=>{o.disabled=!0,o.textContent="Generating...",setTimeout(()=>{c.classList.remove("hidden"),o.disabled=!1,o.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Talking Avatar'},3e3)}),(u=l.querySelector("#avatar-use"))==null||u.addEventListener("click",()=>{d&&d({videoUrl:p.src,photoUrl:a.src,audioUrl:i.value,text:l.querySelector("#avatar-text").value})}),l}function z({onScriptGenerated:d}){var s,i;let l="";const e=document.createElement("div");e.className="script-writer p-4 rounded-xl glass",e.innerHTML=`
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
  `;const t=e.querySelector("#generate-script-btn"),r=e.querySelector("#script-result"),a=e.querySelector("#script-output");return t.addEventListener("click",()=>{const n=e.querySelector("#script-topic").value,o=e.querySelector("#script-tone").value;e.querySelector("#script-length").value;const c=e.querySelector("#script-include").value;n.trim()&&(t.disabled=!0,t.innerHTML='<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...',setTimeout(()=>{const p={professional:`Hi {{FIRSTNAME}}, I hope this message finds you well. I wanted to reach out because ${n}. I'd love to show you how this could benefit your team. ${c||"Would you be open to a quick call this week?"}`,friendly:`Hey {{FIRSTNAME}}! I came across your profile and thought of you right away. ${n} I think you'd really love what we're building. ${c||"Want to check it out?"}`,casual:`Hey {{FIRSTNAME}}, quick question — ${n}? I built something that makes this super easy. ${c||"Happy to show you a quick demo if you're interested."}`,enthusiastic:`{{FIRSTNAME}}, this is exciting! ${n} and the results have been incredible. ${c||"I'd love for you to see it in action. Are you free for a quick chat?"}`,authoritative:`{{FIRSTNAME}}, after working with hundreds of teams, we've found that ${n}. ${c||"I'd like to share our findings with you. When would be a good time to connect?"}`};l=p[o]||p.professional,a.textContent=l,r.classList.remove("hidden"),t.disabled=!1,t.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Script'},1500))}),(s=e.querySelector("#copy-script"))==null||s.addEventListener("click",()=>{navigator.clipboard.writeText(l),e.querySelector("#copy-script").textContent="Copied!",setTimeout(()=>e.querySelector("#copy-script").textContent="Copy",2e3)}),(i=e.querySelector("#use-script"))==null||i.addEventListener("click",()=>{d&&d(l)}),e.getScript=()=>l,e}const A="https://pageshot.site/v1";async function B(d,l={}){return(await(await fetch(`${A}/screenshot`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:d,width:l.width||1920,height:l.height||1080,format:"png",full_page:!1,block_ads:!0,hide_banners:!0,delay:2e3,response:"json",...l})})).json()).data.image}function I({onBackgroundReady:d}){var n,o;let l=null;const e=document.createElement("div");e.className="dynamic-background p-4 rounded-xl glass",e.innerHTML=`
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Dynamic Background</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Prospect's Website URL</label>
        <input id="bg-url" type="url"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          placeholder="https://prospect-company.com">
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Width</label>
          <select id="bg-width"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="1920" selected>1920px</option>
            <option value="1280">1280px</option>
            <option value="1080">1080px</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Height</label>
          <select id="bg-height"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="1080" selected>1080px</option>
            <option value="720">720px</option>
            <option value="627">627px (OG)</option>
          </select>
        </div>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Effect</label>
        <select id="bg-effect"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
          <option value="blur">Blur (8px)</option>
          <option value="blur-heavy">Heavy Blur (16px)</option>
          <option value="darken">Darken (60%)</option>
          <option value="blur-darken">Blur + Darken</option>
          <option value="none">None (raw)</option>
        </select>
      </div>
      
      <button id="capture-btn"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Screenshot Website
      </button>
    </div>
    
    <div id="bg-preview" class="mt-4 hidden">
      <label class="block text-xs text-gray-500 mb-2">Preview</label>
      <div class="relative rounded-lg overflow-hidden border border-white/10">
        <img id="bg-preview-img" class="w-full" alt="Background preview">
        <div id="bg-effect-overlay" class="absolute inset-0 pointer-events-none"></div>
      </div>
      <div class="flex gap-2 mt-3">
        <button id="bg-download" class="flex-1 px-3 py-2 rounded-lg bg-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Download</button>
        <button id="bg-use" class="flex-1 px-3 py-2 rounded-lg bg-violet-600 text-sm text-white font-semibold hover:bg-violet-500 transition-colors">Use as Background</button>
      </div>
    </div>
  `;const t=e.querySelector("#capture-btn"),r=e.querySelector("#bg-preview"),a=e.querySelector("#bg-preview-img"),s=e.querySelector("#bg-effect-overlay");function i(c){switch(s.style.cssText="",c){case"blur":a.style.filter="blur(8px)";break;case"blur-heavy":a.style.filter="blur(16px)";break;case"darken":s.style.background="rgba(0,0,0,0.6)",a.style.filter="";break;case"blur-darken":a.style.filter="blur(8px)",s.style.background="rgba(0,0,0,0.4)";break;default:a.style.filter=""}}return e.querySelector("#bg-effect").addEventListener("change",c=>{i(c.target.value)}),t.addEventListener("click",async()=>{const c=e.querySelector("#bg-url").value.trim();if(c){t.disabled=!0,t.textContent="Capturing...";try{l=await B(c,{width:parseInt(e.querySelector("#bg-width").value,10),height:parseInt(e.querySelector("#bg-height").value,10)}),a.src=l,r.classList.remove("hidden"),i(e.querySelector("#bg-effect").value)}catch(p){console.error("Screenshot failed:",p),a.src="",r.classList.add("hidden")}t.disabled=!1,t.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg> Screenshot Website'}}),(n=e.querySelector("#bg-download"))==null||n.addEventListener("click",()=>{if(!l)return;const c=document.createElement("a");c.href=l,c.download="background.png",c.click()}),(o=e.querySelector("#bg-use"))==null||o.addEventListener("click",()=>{d&&l&&d({data:l,effect:e.querySelector("#bg-effect").value,url:e.querySelector("#bg-url").value})}),e}function H({text:d,speed:l,onStart:e,onStop:t}){let r=null,a=!1,s=l||2;const i=document.createElement("div");i.className="teleprompter fixed inset-0 bg-black z-50 flex flex-col",i.innerHTML=`
    <div class="flex items-center justify-between p-4 bg-black/80 border-b border-white/10">
      <div class="flex items-center gap-4">
        <button id="tp-back" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <span class="text-white font-semibold">Teleprompter</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">Speed</span>
          <input id="tp-speed" type="range" min="0.5" max="8" step="0.5" value="${s}"
            class="w-24 accent-violet-500">
          <span id="tp-speed-label" class="text-xs text-gray-400 w-6">${s}</span>
        </div>
        <button id="tp-play" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors">
          ▶ Start
        </button>
      </div>
    </div>
    
    <div class="flex-1 overflow-hidden relative">
      <div id="tp-mirror" class="absolute top-1/2 left-0 right-0 h-1 bg-violet-500/30 z-10" style="transform: translateY(-50%);"></div>
      <div id="tp-scroll-area" class="h-full overflow-hidden flex items-center">
        <div id="tp-text" class="w-full px-16 py-[200vh] text-white text-4xl leading-relaxed text-center font-medium">
          ${d.replace(/\n/g,"<br>")}
        </div>
      </div>
    </div>
    
    <div class="flex items-center justify-center gap-4 p-3 bg-black/80 border-t border-white/10">
      <label class="flex items-center gap-2 text-xs text-gray-400">
        <input type="checkbox" id="tp-mirror-mode" class="accent-violet-500">
        Mirror Mode
      </label>
      <label class="flex items-center gap-2 text-xs text-gray-400">
        Font Size:
        <select id="tp-fontsize" class="bg-white/10 text-white text-xs rounded px-2 py-1">
          <option value="32">32px</option>
          <option value="40" selected>40px</option>
          <option value="48">48px</option>
          <option value="56">56px</option>
          <option value="64">64px</option>
        </select>
      </label>
    </div>
  `;const n=i.querySelector("#tp-text"),o=i.querySelector("#tp-scroll-area"),c=i.querySelector("#tp-play"),p=i.querySelector("#tp-speed"),b=i.querySelector("#tp-speed-label"),u=i.querySelector("#tp-mirror-mode"),v=i.querySelector("#tp-fontsize"),x=i.querySelector("#tp-back");return p.addEventListener("input",()=>{s=parseFloat(p.value),b.textContent=s}),v.addEventListener("change",()=>{n.style.fontSize=v.value+"px"}),u.addEventListener("change",()=>{n.style.transform=u.checked?"scaleX(-1)":""}),c.addEventListener("click",()=>{a?(clearInterval(r),a=!1,c.textContent="▶ Start",t&&t()):(a=!0,c.textContent="⏸ Pause",e&&e(),r=setInterval(()=>{o.scrollTop+=s,o.scrollTop>=o.scrollHeight-o.clientHeight&&(clearInterval(r),a=!1,c.textContent="▶ Start",t&&t())},16))}),x.addEventListener("click",()=>{r&&clearInterval(r),i.remove()}),i.setText=f=>{n.innerHTML=f.replace(/\n/g,"<br>")},i.hide=()=>{r&&clearInterval(r),i.remove()},i}function V(){const d=window.location.hash,e=new URLSearchParams(d.includes("?")?d.split("?")[1]:"").get("mode")||"ai",t=document.createElement("div");t.className="editor-container";function r(){t.innerHTML=`
      <div class="editor-sidebar p-4">
        <div id="sidebar-wizard"></div>
        <hr class="my-3 border-white/10">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Stages</h2>
        <ul class="space-y-1 text-sm" id="stage-list">
          <li data-stage="video" class="stage-item p-2 rounded cursor-pointer bg-violet-600/20 text-violet-300">Video</li>
          <li data-stage="audio" class="stage-item p-2 rounded cursor-pointer text-gray-400 hover:bg-white/5 hover:text-white">Audio</li>
          <li data-stage="captions" class="stage-item p-2 rounded cursor-pointer text-gray-400 hover:bg-white/5 hover:text-white">Captions</li>
        </ul>
        <hr class="my-3 border-white/10">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Input</h2>
        <div id="sidebar-input"></div>
      </div>
      
      <div class="editor-stage">
        <div id="wizard-steps"></div>
        <div id="video-area" class="w-full flex flex-col items-center mt-4">
          <div class="video-player-container flex items-center justify-center text-gray-500" id="player-wrapper">
            <div class="text-center">
              <p class="text-lg">Video player will appear here</p>
              <p class="text-sm mt-2 text-gray-600">Start by generating or uploading a video</p>
            </div>
          </div>
          <div class="timeline w-full max-w-[800px] mt-3" id="timeline-area"></div>
        </div>
      </div>
      
      <div class="editor-actions">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Overlays</h2>
        <div class="space-y-1 mb-4" id="overlay-actions">
          <button data-panel="text" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Add Text
          </button>
          <button data-panel="image" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Add Image
          </button>
          <button data-panel="leadform" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Lead Form
          </button>
          <button data-panel="cta" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
            CTA Button
          </button>
          <button data-panel="popup" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
            Popup
          </button>
          <button data-panel="personalizer" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Personalizer
          </button>
        </div>
        
        <hr class="my-3 border-white/10">
        
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Tools</h2>
        <div class="space-y-1 mb-4" id="ai-actions">
          <button data-panel="scriptwriter" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            Script Writer
          </button>
          <button data-panel="voiceclone" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            Voice Clone
          </button>
          <button data-panel="avatar" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Talking Avatar
          </button>
          <button data-panel="background" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg>
            Dynamic BG
          </button>
          <button data-panel="teleprompter" class="overlay-btn w-full p-2.5 rounded-lg glass text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            Teleprompter
          </button>
        </div>
        
        <hr class="my-3 border-white/10">
        <div id="right-panel"></div>
      </div>
    `,t.querySelector("#wizard-steps").appendChild(k({steps:[{id:"source",label:"Source"},{id:"edit",label:"Edit"},{id:"personalize",label:"Personalize"},{id:"publish",label:"Publish"}],currentStep:e==="ai"||e==="upload"?0:1}));const i=t.querySelector("#sidebar-input");e==="ai"||e==="clone"?i.appendChild(w({onGenerate:c=>{console.log("AI Generate:",c)}})):i.appendChild(y({onUpload:c=>{const p=t.querySelector("#player-wrapper");if(p){p.innerHTML="";const b=h({src:c.url});p.appendChild(b)}}}));const n=t.querySelector("#player-wrapper"),o=h({});n.innerHTML="",n.appendChild(o),t.querySelectorAll("[data-panel]").forEach(c=>{c.addEventListener("click",()=>{const p=c.dataset.panel;a(p)})})}function a(s){const i=t.querySelector("#right-panel");i.innerHTML="";const n={text:()=>S({onSave:o=>{console.log("Text overlay:",o)}}),image:()=>T({onSave:o=>{console.log("Image overlay:",o)}}),leadform:()=>E({onSave:o=>{console.log("Lead form:",o)}}),cta:()=>L({onSave:o=>{console.log("CTA:",o)}}),popup:()=>q({onSave:o=>{console.log("Popup:",o)}}),personalizer:()=>C({onTokenChosen:o=>{console.log("Token:",o)}}),scriptwriter:()=>z({onScriptGenerated:o=>{console.log("Script:",o)}}),voiceclone:()=>M({onVoiceGenerated:o=>{console.log("Voice:",o)}}),avatar:()=>$({onAvatarReady:o=>{console.log("Avatar:",o)}}),background:()=>I({onBackgroundReady:o=>{console.log("Background:",o)}}),teleprompter:()=>{const o=H({text:"Enter your script here and press Start."});return document.body.appendChild(o),document.createElement("div")}};n[s]&&i.appendChild(n[s]())}return r(),t}export{V as default};
