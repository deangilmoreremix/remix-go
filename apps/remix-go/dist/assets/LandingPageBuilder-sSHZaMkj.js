function c(e){return window.grapesjs?window.grapesjs.init({container:e,height:"100vh",width:"auto",fromElement:!0,storageManager:{type:"local",autosave:!0,autoload:!0,stepsBeforeSave:1,id:"remix-go-"},deviceManager:{devices:[{name:"Desktop",width:""},{name:"Tablet",width:"768px"},{name:"Mobile",width:"375px"}]},panels:{defaults:[]},blockManager:{appendTo:"#blocks"},styleManager:{appendTo:"#styles",sectors:[{name:"Dimension",buildProps:["width","height","max-width","min-height"]},{name:"Typography",buildProps:["font-family","font-size","font-weight","color","text-align","line-height"]},{name:"Decorations",buildProps:["background-color","border-radius","border","box-shadow","background"]},{name:"Extra",buildProps:["opacity","cursor","overflow"]}]},layerManager:{appendTo:"#layers"},traitManager:{appendTo:"#traits"},selectorManager:{appendTo:"#selectors"}}):(console.warn("GrapesJS not loaded"),null)}function p(e){e.BlockManager.add("video-player",{label:"Video Player",content:`<div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;">
      <video data-gjs-type="video" controls style="position:absolute;top:0;left:0;width:100%;height:100%;"></video>
    </div>`,category:"Video",attributes:{class:"fa fa-play"}}),e.BlockManager.add("token-text",{label:"Personalized Text",content:`<h1 data-token="FIRSTNAME" data-default="there" style="font-size:2rem;font-weight:bold;color:#fff;">
      Hi {{FIRSTNAME}}!
    </h1>`,category:"Personalization",attributes:{class:"fa fa-font"}}),e.BlockManager.add("token-subtitle",{label:"Personalized Subtitle",content:`<p data-token="COMPANY" data-default="your company" style="font-size:1.1rem;color:#ccc;">
      I noticed {{COMPANY}} is doing great work...
    </p>`,category:"Personalization",attributes:{class:"fa fa-paragraph"}}),e.BlockManager.add("cta-button",{label:"CTA Button",content:`<a href="#" class="cta-btn" data-token="cta_url"
      style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
      Book a Demo
    </a>`,category:"Actions",attributes:{class:"fa fa-hand-pointer"}}),e.BlockManager.add("logo-header",{label:"Logo Header",content:`<header style="display:flex;align-items:center;padding:16px;">
      <img src="" alt="Logo" data-token="logo_url" style="max-height:48px;">
    </header>`,category:"Layout",attributes:{class:"fa fa-image"}}),e.BlockManager.add("dynamic-bg",{label:"Dynamic Background",content:`<div class="dynamic-bg" data-token="prospect_website"
      style="width:100%;height:300px;background-size:cover;background-position:center;filter:blur(8px);">
    </div>`,category:"Personalization",attributes:{class:"fa fa-globe"}}),e.BlockManager.add("lead-form",{label:"Lead Form",content:`<form class="lead-form" style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      <input type="text" placeholder="Your Name" data-token="NAME" style="padding:8px;border:1px solid #ccc;border-radius:4px;">
      <input type="email" placeholder="Your Email" data-token="EMAIL" style="padding:8px;border:1px solid #ccc;border-radius:4px;">
      <button type="submit" style="padding:12px;background:#7c3aed;color:#fff;border:none;border-radius:4px;cursor:pointer;">
        Submit
      </button>
    </form>`,category:"Actions",attributes:{class:"fa fa-envelope"}}),e.BlockManager.add("section-video",{label:"Video Section",content:`<section style="padding:40px 20px;text-align:center;max-width:800px;margin:0 auto;">
      <h1 data-token="FIRSTNAME" style="font-size:2.5rem;font-weight:bold;margin-bottom:16px;color:#fff;">
        Hi {{FIRSTNAME}}!
      </h1>
      <div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;">
        <video data-gjs-type="video" controls style="position:absolute;top:0;left:0;width:100%;height:100%;"></video>
      </div>
    </section>`,category:"Layout",attributes:{class:"fa fa-th-large"}}),e.BlockManager.add("spacer",{label:"Spacer",content:'<div style="height:40px;"></div>',category:"Layout",attributes:{class:"fa fa-arrows-v"}}),e.BlockManager.add("divider",{label:"Divider",content:'<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:20px 0;">',category:"Layout",attributes:{class:"fa fa-minus"}})}function g(e){e.Commands.add("insert-token",{run(o,a,r){const t=o.getSelected();if(t&&r&&r.token){const l=t.components(),n=l.length?l.models[0]:null,s=n?n.get("content"):"",i=`{{${r.token}}}`;n?n.set("content",s+i):t.append(i),t.addAttributes({"data-token":r.token})}}}),e.Panels.addButton("views",{id:"tokens",className:"fa fa-code",command:"open-token-panel",attributes:{title:"Insert Token"}}),e.Commands.add("open-token-panel",{run(o){const a=["FIRSTNAME","LASTNAME","NAME","EMAIL","GENDER","GEOCOUNTRY","GEOCITY","GEOSTATE","COMPANY"],r=document.getElementById("gjs-token-panel");if(r){r.remove();return}const t=document.createElement("div");t.id="gjs-token-panel",t.style.cssText="position:fixed;top:60px;right:20px;width:220px;background:#1a1a2e;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px;z-index:9999;box-shadow:0 8px 32px rgba(0,0,0,0.4);",t.innerHTML=`
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Insert Token</span>
          <button id="close-token-panel" style="color:#6b7280;cursor:pointer;background:none;border:none;font-size:16px;">&times;</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${a.map(l=>`
            <button data-token="${l}" style="padding:6px 10px;text-align:left;background:rgba(255,255,255,0.05);border:1px solid transparent;border-radius:4px;color:#d1d5db;font-size:13px;cursor:pointer;">
              {{${l}}}
            </button>
          `).join("")}
        </div>
      `,document.body.appendChild(t),t.querySelector("#close-token-panel").addEventListener("click",()=>t.remove()),t.querySelectorAll("[data-token]").forEach(l=>{l.addEventListener("click",()=>{o.runCommand("insert-token",{token:l.dataset.token}),t.remove()})})}})}function u(e){const o=e.getHtml(),a=e.getCss();return{html:(a?`<style>${a}</style>`:"")+o+`
    <script>
      (function() {
        var params = new URLSearchParams(window.location.search);
        document.querySelectorAll('[data-token]').forEach(function(el) {
          var token = el.getAttribute('data-token');
          var value = params.get(token) || el.getAttribute('data-default') || '';
          if (el.tagName === 'IMG') el.src = value;
          else if (el.tagName === 'A') el.href = value;
          else if (el.tagName === 'VIDEO') el.src = value;
          else {
            el.querySelectorAll('*').forEach(function(child) {
              if (child.children.length === 0) {
                child.textContent = child.textContent.replace('{{' + token + '}}', value);
              }
            });
            el.textContent = el.textContent.replace('{{' + token + '}}', value);
          }
        });
      })();
    <\/script>
  `,css:a}}function b(e){const o=e.getHtml();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <style>${e.getCss()}</style>
</head>
<body>
  ${o}
  <script>
    (function() {
      var params = new URLSearchParams(window.location.search);
      document.querySelectorAll('[data-token]').forEach(function(el) {
        var token = el.getAttribute('data-token');
        var value = params.get(token) || el.getAttribute('data-default') || '';
        if (el.tagName === 'IMG') el.src = value;
        else if (el.tagName === 'A') el.href = value;
        else el.textContent = el.textContent.replace('{{' + token + '}}', value);
      });
    })();
  <\/script>
</body>
</html>`}function x(){const e=document.createElement("div");return e.className="landing-page-builder min-h-screen bg-app-bg",e.innerHTML=`
    <div class="fixed top-0 left-56 right-0 h-12 bg-black/50 backdrop-blur border-b border-white/5 flex items-center px-4 z-30 gap-3">
      <a href="#getting-started" class="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back
      </a>
      <span class="text-white font-semibold">Landing Page Builder</span>
      <div class="flex-1"></div>
      <div id="gjs-devices" class="flex items-center gap-1"></div>
      <button id="gjs-export" class="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors">
        Export HTML
      </button>
      <button id="gjs-preview" class="px-3 py-1.5 rounded-lg bg-white/10 text-gray-400 text-sm hover:text-white hover:bg-white/20 transition-colors">
        Preview
      </button>
    </div>
    
    <div class="flex pt-12" style="height: 100vh;">
      <div id="blocks" class="w-56 overflow-y-auto border-r border-white/5 bg-black/20 p-2 flex-shrink-0"></div>
      
      <div class="flex-1 flex flex-col">
        <div id="gjs-editor" class="flex-1"></div>
      </div>
      
      <div class="w-64 flex flex-col border-l border-white/5 bg-black/20 flex-shrink-0">
        <div class="border-b border-white/5">
          <div class="flex">
            <button class="gjs-tab flex-1 px-3 py-2 text-xs text-gray-400 hover:text-white border-b-2 border-transparent" data-tab="styles">Styles</button>
            <button class="gjs-tab flex-1 px-3 py-2 text-xs text-gray-400 hover:text-white border-b-2 border-transparent" data-tab="traits">Traits</button>
            <button class="gjs-tab flex-1 px-3 py-2 text-xs text-gray-400 hover:text-white border-b-2 border-transparent" data-tab="layers">Layers</button>
          </div>
        </div>
        <div id="styles" class="flex-1 overflow-y-auto p-2"></div>
        <div id="traits" class="flex-1 overflow-y-auto p-2 hidden"></div>
        <div id="layers" class="flex-1 overflow-y-auto p-2 hidden"></div>
        <div id="selectors" class="p-2 border-t border-white/5"></div>
      </div>
    </div>
  `,e.querySelectorAll(".gjs-tab").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".gjs-tab").forEach(a=>{a.classList.remove("text-violet-300","border-violet-500"),a.classList.add("text-gray-400","border-transparent")}),o.classList.remove("text-gray-400","border-transparent"),o.classList.add("text-violet-300","border-violet-500"),["styles","traits","layers"].forEach(a=>{const r=e.querySelector(`#${a}`);r&&r.classList.toggle("hidden",a!==o.dataset.tab)})})}),requestAnimationFrame(()=>{var o,a,r;try{const t=c("#gjs-editor");if(!t){console.warn("GrapesJS not available, showing placeholder"),e.querySelector("#gjs-editor").innerHTML=`
          <div class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center">
              <p class="text-lg">GrapesJS Editor</p>
              <p class="text-sm mt-2">Install grapesjs: npm install grapesjs</p>
            </div>
          </div>
        `;return}p(t),t.use(g);const l=e.querySelector("#gjs-devices");["Desktop","Tablet","Mobile"].forEach(n=>{const s=document.createElement("button");s.className=`px-2 py-1 rounded text-xs ${n==="Desktop"?"bg-violet-600/30 text-violet-300":"text-gray-500 hover:text-white"}`,s.textContent=n,s.addEventListener("click",()=>{l.querySelectorAll("button").forEach(i=>{i.className="px-2 py-1 rounded text-xs text-gray-500 hover:text-white"}),s.className="px-2 py-1 rounded text-xs bg-violet-600/30 text-violet-300",t.setDevice(n)}),l.appendChild(s)}),(o=e.querySelector("#gjs-export"))==null||o.addEventListener("click",()=>{const n=b(t),s=new Blob([n],{type:"text/html"}),i=URL.createObjectURL(s),d=document.createElement("a");d.href=i,d.download="landing-page.html",d.click(),URL.revokeObjectURL(i)}),(a=e.querySelector("#gjs-preview"))==null||a.addEventListener("click",()=>{const{html:n,css:s}=u(t),i=window.open("","_blank");i.document.write(`<!DOCTYPE html><html><head><style>${s}</style></head><body>${n}</body></html>`),i.document.close()}),(r=e.querySelector(".gjs-tab"))==null||r.click()}catch(t){console.error("GrapesJS init error:",t)}}),e}export{x as default};
