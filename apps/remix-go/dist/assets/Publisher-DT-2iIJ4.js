import{e as f}from"./tokenExtractor-CIPbNj6B.js";function E({projectURL:e,width:n,height:p}){const o=e||"https://video.example.com/watch",s=n||640,r=p||360,t=document.createElement("div");t.className="embed-code-generator p-4 rounded-xl glass";const i=`<iframe
  src="${o}"
  width="${s}"
  height="${r}"
  frameborder="0"
  allowfullscreen
  style="border-radius:8px;">
</iframe>`,m=`<iframe id="vr-player" src="${o}" width="${s}" height="${r}" frameborder="0" allowfullscreen></iframe>
<script>
  var params = window.location.search.substring(1);
  if (params) {
    document.getElementById('vr-player').src += '&' + params;
  }
<\/script>`,c=`<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
  <iframe
    src="${o}"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
    allowfullscreen>
  </iframe>
</div>`;t.innerHTML=`
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Embed Code</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-xs text-gray-500 mb-2">Basic Embed</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-green-400 overflow-x-auto font-mono whitespace-pre-wrap">${i.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>
        <button data-copy="basic" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-2">With URL Parameter Passing (for personalization)</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-green-400 overflow-x-auto font-mono whitespace-pre-wrap">${m.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>
        <button data-copy="params" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-2">Responsive (16:9)</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-green-400 overflow-x-auto font-mono whitespace-pre-wrap">${c.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>
        <button data-copy="responsive" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
    </div>
  `;const x={basic:i,params:m,responsive:c};return t.querySelectorAll("[data-copy]").forEach(a=>{a.addEventListener("click",()=>{const b=x[a.dataset.copy];navigator.clipboard.writeText(b),a.textContent="Copied!",setTimeout(()=>{a.textContent="Copy"},2e3)})}),t}function h(e,n={}){const p=new URL(e);return Object.entries(n).forEach(([o,s])=>{s&&p.searchParams.set(o,s)}),p.toString()}const y={mailchimp:e=>`*|${e.toUpperCase()}|*`,aweber:e=>`{!${e.toLowerCase()}}`,interspire:e=>`%%${e.replace(/_/g," ").replace(/\b\w/g,n=>n.toUpperCase())}%%`,getresponse:e=>`[[${e.toLowerCase()}]]`,infusionsoft:e=>`~Contact.${e.replace(/_/g," ").replace(/\b\w/g,n=>n.toUpperCase())}~`,sendlane:e=>`VAR_${e.toUpperCase()}`,constantcontact:e=>`{!$Subscriber.${e.replace(/_/g," ").replace(/\b\w/g,n=>n.toUpperCase())}}`,sendreach:e=>`[${e.toUpperCase()}]`,custom:e=>`${e.toLowerCase()}_token`};function k(e,n,p){const o=y[p]||y.custom,s={};return n.forEach(r=>{s[r]=o(r)}),h(e,s)}function S({projectData:e,baseURL:n}){const p=[{id:"mailchimp",name:"MailChimp",mergeTag:"*|FNAME|*"},{id:"aweber",name:"AWeber",mergeTag:"{!firstname}"},{id:"interspire",name:"Interspire",mergeTag:"%%First Name%%"},{id:"getresponse",name:"GetResponse",mergeTag:"[[firstname]]"},{id:"infusionsoft",name:"Infusionsoft",mergeTag:"~Contact.FirstName~"},{id:"sendlane",name:"Sendlane",mergeTag:"VAR_FIRST_NAME"},{id:"constantcontact",name:"Constant Contact",mergeTag:"{!$Subscriber.Firstname}"},{id:"sendreach",name:"SendReach",mergeTag:"[FNAME]"},{id:"custom",name:"Custom",mergeTag:"firstname_token"}];let o="mailprovider";const s=f(e||{}),r=n||"https://video.example.com/watch",t=document.createElement("div");t.className="email-campaign p-4 rounded-xl glass";function i(){var x,a,b;const m=p.find(d=>d.id===o)||p[0],c=k(r,s,o);t.innerHTML=`
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Email Campaign</h3>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Select Email Provider</label>
        <select id="provider-select"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
          ${p.map(d=>`
            <option value="${d.id}" ${o===d.id?"selected":""}>${d.name}</option>
          `).join("")}
        </select>
      </div>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Available Tokens</label>
        ${s.length>0?`
          <div class="flex flex-wrap gap-1 mb-2">
            ${s.map(d=>`<span class="px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 text-xs font-mono">{{${d}}}</span>`).join("")}
          </div>
          <p class="text-xs text-gray-600">
            In ${m.name}, use merge tag: <code class="text-violet-400">${m.mergeTag}</code>
          </p>
        `:`
          <p class="text-xs text-gray-600">No personalization tokens found in this project. Add tokens like {{FIRSTNAME}} in the editor.</p>
        `}
      </div>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Generated URL</label>
        <div class="p-3 rounded-lg bg-black/30 text-xs text-green-400 break-all font-mono">${c}</div>
        <button id="copy-url" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy URL</button>
      </div>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Email Body Snippet</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-blue-400 overflow-x-auto font-mono">Hi ${m.mergeTag},

I created this personalized video just for you:

${c}

Click the link above to watch!</pre>
        <button id="copy-snippet" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy Snippet</button>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-2">Embed Code for Email</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-yellow-400 overflow-x-auto font-mono">&lt;a href="${c}"&gt;
  &lt;img src="VIDEO_THUMBNAIL_URL" alt="Watch Video" style="max-width:100%;border-radius:8px;"&gt;
&lt;/a&gt;</pre>
        <button id="copy-embed" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy Embed</button>
      </div>
    `,t.querySelector("#provider-select").addEventListener("change",d=>{o=d.target.value,i()}),(x=t.querySelector("#copy-url"))==null||x.addEventListener("click",()=>{navigator.clipboard.writeText(c),t.querySelector("#copy-url").textContent="Copied!",setTimeout(()=>t.querySelector("#copy-url").textContent="Copy URL",2e3)}),(a=t.querySelector("#copy-snippet"))==null||a.addEventListener("click",()=>{const d=`Hi ${m.mergeTag},

I created this personalized video just for you:

${c}

Click the link above to watch!`;navigator.clipboard.writeText(d),t.querySelector("#copy-snippet").textContent="Copied!",setTimeout(()=>t.querySelector("#copy-snippet").textContent="Copy Snippet",2e3)}),(b=t.querySelector("#copy-embed"))==null||b.addEventListener("click",()=>{const d=`<a href="${c}">
  <img src="VIDEO_THUMBNAIL_URL" alt="Watch Video" style="max-width:100%;border-radius:8px;">
</a>`;navigator.clipboard.writeText(d),t.querySelector("#copy-embed").textContent="Copied!",setTimeout(()=>t.querySelector("#copy-embed").textContent="Copy Embed",2e3)})}return i(),t}function L({projectData:e,baseURL:n}){const p=[{id:"mailchimp",name:"MailChimp",icon:"📧"},{id:"aweber",name:"AWeber",icon:"📧"},{id:"interspire",name:"Interspire",icon:"📧"},{id:"getresponse",name:"GetResponse",icon:"📧"},{id:"infusionsoft",name:"Infusionsoft",icon:"📧"},{id:"sendlane",name:"Sendlane",icon:"📧"},{id:"constantcontact",name:"Constant Contact",icon:"📧"},{id:"sendreach",name:"SendReach",icon:"📧"},{id:"custom",name:"Custom",icon:"⚙️"}];let o="mailchimp",s={};const r=f(e||{}),t=n||"https://video.example.com/watch",i=document.createElement("div");i.className="personalized-link-generator p-4 rounded-xl glass";function m(){var a,b,d;const c=k(t,r,o),x=h(t,s);i.innerHTML=`
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Personalized Links</h3>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Email Provider</label>
        <div class="grid grid-cols-3 gap-1">
          ${p.map(l=>`
            <button data-provider="${l.id}"
              class="px-2 py-1.5 rounded text-xs transition-colors ${o===l.id?"bg-violet-600/30 text-violet-300 border border-violet-500/50":"text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}">
              ${l.name}
            </button>
          `).join("")}
        </div>
      </div>
      
      ${r.length>0?`
        <div class="mb-4">
          <label class="block text-xs text-gray-500 mb-2">Detected Tokens</label>
          <div class="flex flex-wrap gap-1">
            ${r.map(l=>`<span class="px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 text-xs">${l}</span>`).join("")}
          </div>
        </div>
      `:""}
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Provider Link (merge tags)</label>
        <div class="p-3 rounded-lg bg-black/30 text-xs text-green-400 break-all font-mono">${c}</div>
        <button id="copy-provider" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Direct Link (manual values)</label>
        <div class="space-y-2">
          ${r.map(l=>`
            <div class="flex gap-2 items-center">
              <span class="text-xs text-gray-500 w-20">${l}</span>
              <input type="text" data-token="${l}" value="${s[l]||""}" placeholder="Enter ${l.toLowerCase()}"
                class="flex-1 p-1.5 rounded bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500">
            </div>
          `).join("")}
        </div>
        <div class="p-3 rounded-lg bg-black/30 text-xs text-blue-400 break-all font-mono mt-2">${x}</div>
        <button id="copy-direct" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-2">Embed Script</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-yellow-400 overflow-x-auto font-mono">&lt;iframe id='vr-player' src='${t}'&gt;&lt;/iframe&gt;
&lt;script&gt;
  var params = window.location.search.substring(1);
  document.getElementById('vr-player').src += '&amp;' + params;
&lt;/script&gt;</pre>
        <button id="copy-embed" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
    `,i.querySelectorAll("[data-provider]").forEach(l=>{l.addEventListener("click",()=>{o=l.dataset.provider,m()})}),i.querySelectorAll("[data-token]").forEach(l=>{l.addEventListener("input",g=>{s[g.target.dataset.token]=g.target.value;const u=i.querySelector(".mb-4:nth-child(4) .bg-black\\/30");u&&(u.textContent=h(t,s))})}),(a=i.querySelector("#copy-provider"))==null||a.addEventListener("click",()=>{navigator.clipboard.writeText(c)}),(b=i.querySelector("#copy-direct"))==null||b.addEventListener("click",()=>{navigator.clipboard.writeText(x)}),(d=i.querySelector("#copy-embed"))==null||d.addEventListener("click",()=>{const l=`<iframe id='vr-player' src='${t}'></iframe>
<script>
  var params = window.location.search.substring(1);
  document.getElementById('vr-player').src += '&' + params;
<\/script>`;navigator.clipboard.writeText(l)})}return m(),i}function T({contacts:e,onGenerate:n,onComplete:p}){let o=e||[],s=!1,r={current:0,total:0,results:[]};const t=document.createElement("div");t.className="batch-generator p-4 rounded-xl glass";function i(){t.innerHTML=`
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Batch Video Generator</h3>
      
      <div class="space-y-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Contacts (CSV or paste)</label>
          <textarea id="batch-contacts" rows="4"
            class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500 font-mono"
            placeholder="FIRSTNAME,EMAIL,COMPANY
John,john@acme.com,Acme Inc
Jane,jane@widget.co,Widget Co">${o.map(a=>Object.values(a).join(",")).join(`
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
          ${o.length===0?"disabled":""}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Generate ${o.length} Videos
        </button>
      </div>
      
      ${s||r.results.length>0?`
        <div class="mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-500">Progress</span>
            <span class="text-xs text-gray-400">${r.current}/${r.total}</span>
          </div>
          <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-violet-500 rounded-full transition-all" style="width: ${r.total?r.current/r.total*100:0}%"></div>
          </div>
          
          ${r.results.length>0?`
            <div class="mt-3 max-h-40 overflow-y-auto space-y-1">
              ${r.results.map(a=>`
                <div class="flex items-center justify-between p-2 rounded bg-white/5 text-xs">
                  <span class="text-gray-400">${a.name}</span>
                  <span class="${a.success?"text-green-400":"text-red-400"}">${a.success?"✓ Generated":"✗ Failed"}</span>
                </div>
              `).join("")}
            </div>
          `:""}
        </div>
      `:""}
    `;const m=t.querySelector("#parse-contacts-btn"),c=t.querySelector("#batch-start-btn"),x=t.querySelector("#batch-contacts");m==null||m.addEventListener("click",()=>{const a=x.value.trim().split(`
`).filter(u=>u.trim());if(a.length<2)return;const b=a[0].split(",").map(u=>u.trim().toUpperCase());o=a.slice(1).map(u=>{const C=u.split(",").map(v=>v.trim()),w={};return b.forEach((v,$)=>{w[v]=C[$]||""}),w});const d=t.querySelector("#batch-parsed"),l=t.querySelector("#batch-count"),g=t.querySelector("#batch-preview");d.classList.remove("hidden"),l.textContent=`${o.length} contacts`,g.innerHTML=o.slice(0,5).map(u=>`<div class="text-xs text-gray-500 p-1 rounded bg-white/5">${u.FIRSTNAME||u.NAME||Object.values(u)[0]} - ${u.EMAIL||""}</div>`).join(""),c.disabled=!1,c.innerHTML=`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate ${o.length} Videos`}),c==null||c.addEventListener("click",async()=>{if(!(!o.length||s)){s=!0,r={current:0,total:o.length,results:[]},i();for(let a=0;a<o.length;a++){const b=o[a];try{n&&await n(b,a),r.results.push({name:b.FIRSTNAME||b.NAME||`Contact ${a+1}`,success:!0})}catch{r.results.push({name:b.FIRSTNAME||b.NAME||`Contact ${a+1}`,success:!1})}r.current=a+1,i()}s=!1,p&&p(r.results),i()}})}return i(),t}function M(){const e=document.createElement("div");e.className="min-h-screen bg-app-bg";const n=window.location.hash,o=new URLSearchParams(n.includes("?")?n.split("?")[1]:"").get("id")||"demo";e.innerHTML=`
    <div class="max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-white mb-2">Publish & Share</h1>
      <p class="text-gray-400 mb-8">Share your video with the world</p>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="pub-embed"></div>
        <div id="pub-email"></div>
      </div>
      
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="pub-links"></div>
        <div id="pub-batch"></div>
      </div>
      
      <div class="mt-6">
        <a href="#getting-started"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Home
        </a>
      </div>
    </div>
  `;const s=`${window.location.origin}${window.location.pathname}#watch?id=${o}`;return e.querySelector("#pub-embed").appendChild(E({projectURL:s})),e.querySelector("#pub-email").appendChild(S({projectData:{},baseURL:s})),e.querySelector("#pub-links").appendChild(L({projectData:{},baseURL:s})),e.querySelector("#pub-batch").appendChild(T({contacts:[{FIRSTNAME:"John",EMAIL:"john@example.com",COMPANY:"Acme Inc"},{FIRSTNAME:"Jane",EMAIL:"jane@example.com",COMPANY:"Widget Co"}],onGenerate:async(r,t)=>{await new Promise(i=>setTimeout(i,500))}})),e}export{M as default};
