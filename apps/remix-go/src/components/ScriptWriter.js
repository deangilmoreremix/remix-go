export default function ScriptWriter({ onScriptGenerated }) {
  let generatedScript = '';

  const container = document.createElement('div');
  container.className = 'script-writer p-4 rounded-xl glass';

  container.innerHTML = `
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

  const generateBtn = container.querySelector('#generate-script-btn');
  const resultDiv = container.querySelector('#script-result');
  const outputDiv = container.querySelector('#script-output');

  generateBtn.addEventListener('click', () => {
    const topic = container.querySelector('#script-topic').value;
    const tone = container.querySelector('#script-tone').value;
    const length = container.querySelector('#script-length').value;
    const include = container.querySelector('#script-include').value;

    if (!topic.trim()) return;

    generateBtn.disabled = true;
    generateBtn.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...';

    setTimeout(() => {
      const templates = {
        professional: `Hi {{FIRSTNAME}}, I hope this message finds you well. I wanted to reach out because ${topic}. I'd love to show you how this could benefit your team. ${include || 'Would you be open to a quick call this week?'}`,
        friendly: `Hey {{FIRSTNAME}}! I came across your profile and thought of you right away. ${topic} I think you'd really love what we're building. ${include || 'Want to check it out?'}`,
        casual: `Hey {{FIRSTNAME}}, quick question — ${topic}? I built something that makes this super easy. ${include || 'Happy to show you a quick demo if you\'re interested.'}`,
        enthusiastic: `{{FIRSTNAME}}, this is exciting! ${topic} and the results have been incredible. ${include || 'I\'d love for you to see it in action. Are you free for a quick chat?'}`,
        authoritative: `{{FIRSTNAME}}, after working with hundreds of teams, we've found that ${topic}. ${include || 'I\'d like to share our findings with you. When would be a good time to connect?'}`,
      };

      generatedScript = templates[tone] || templates.professional;
      outputDiv.textContent = generatedScript;
      resultDiv.classList.remove('hidden');

      generateBtn.disabled = false;
      generateBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Script';
    }, 1500);
  });

  container.querySelector('#copy-script')?.addEventListener('click', () => {
    navigator.clipboard.writeText(generatedScript);
    container.querySelector('#copy-script').textContent = 'Copied!';
    setTimeout(() => container.querySelector('#copy-script').textContent = 'Copy', 2000);
  });

  container.querySelector('#use-script')?.addEventListener('click', () => {
    if (onScriptGenerated) onScriptGenerated(generatedScript);
  });

  container.getScript = () => generatedScript;

  return container;
}
