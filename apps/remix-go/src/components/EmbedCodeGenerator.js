export default function EmbedCodeGenerator({ projectURL, width, height }) {
  const url = projectURL || 'https://video.example.com/watch';
  const w = width || 640;
  const h = height || 360;

  const container = document.createElement('div');
  container.className = 'embed-code-generator p-4 rounded-xl glass';

  const embedCode = `<iframe
  src="${url}"
  width="${w}"
  height="${h}"
  frameborder="0"
  allowfullscreen
  style="border-radius:8px;">
</iframe>`;

  const paramPassingCode = `<iframe id="vr-player" src="${url}" width="${w}" height="${h}" frameborder="0" allowfullscreen></iframe>
<script>
  var params = window.location.search.substring(1);
  if (params) {
    document.getElementById('vr-player').src += '&' + params;
  }
</script>`;

  const responsiveCode = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
  <iframe
    src="${url}"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
    allowfullscreen>
  </iframe>
</div>`;

  container.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Embed Code</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-xs text-gray-500 mb-2">Basic Embed</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-green-400 overflow-x-auto font-mono whitespace-pre-wrap">${embedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        <button data-copy="basic" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-2">With URL Parameter Passing (for personalization)</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-green-400 overflow-x-auto font-mono whitespace-pre-wrap">${paramPassingCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        <button data-copy="params" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-2">Responsive (16:9)</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-green-400 overflow-x-auto font-mono whitespace-pre-wrap">${responsiveCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        <button data-copy="responsive" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
    </div>
  `;

  const codes = { basic: embedCode, params: paramPassingCode, responsive: responsiveCode };

  container.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = codes[btn.dataset.copy];
      navigator.clipboard.writeText(code);
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
  });

  return container;
}
