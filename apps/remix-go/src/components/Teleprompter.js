export default function Teleprompter({ text, speed, onStart, onStop }) {
  let scrollInterval = null;
  let isScrolling = false;
  let currentSpeed = speed || 2;

  const container = document.createElement('div');
  container.className = 'teleprompter fixed inset-0 bg-black z-50 flex flex-col';

  container.innerHTML = `
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
          <input id="tp-speed" type="range" min="0.5" max="8" step="0.5" value="${currentSpeed}"
            class="w-24 accent-violet-500">
          <span id="tp-speed-label" class="text-xs text-gray-400 w-6">${currentSpeed}</span>
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
          ${(text || 'Enter your script here...').replace(/\n/g, '<br>')}
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
  `;

  const textEl = container.querySelector('#tp-text');
  const scrollArea = container.querySelector('#tp-scroll-area');
  const playBtn = container.querySelector('#tp-play');
  const speedSlider = container.querySelector('#tp-speed');
  const speedLabel = container.querySelector('#tp-speed-label');
  const mirrorCheckbox = container.querySelector('#tp-mirror-mode');
  const fontSizeSelect = container.querySelector('#tp-fontsize');
  const backBtn = container.querySelector('#tp-back');

  speedSlider.addEventListener('input', () => {
    currentSpeed = parseFloat(speedSlider.value);
    speedLabel.textContent = currentSpeed;
  });

  fontSizeSelect.addEventListener('change', () => {
    textEl.style.fontSize = fontSizeSelect.value + 'px';
  });

  mirrorCheckbox.addEventListener('change', () => {
    textEl.style.transform = mirrorCheckbox.checked ? 'scaleX(-1)' : '';
  });

  playBtn.addEventListener('click', () => {
    if (isScrolling) {
      clearInterval(scrollInterval);
      isScrolling = false;
      playBtn.textContent = '▶ Start';
      if (onStop) onStop();
    } else {
      isScrolling = true;
      playBtn.textContent = '⏸ Pause';
      if (onStart) onStart();

      scrollInterval = setInterval(() => {
        scrollArea.scrollTop += currentSpeed;
        if (scrollArea.scrollTop >= scrollArea.scrollHeight - scrollArea.clientHeight) {
          clearInterval(scrollInterval);
          isScrolling = false;
          playBtn.textContent = '▶ Start';
          if (onStop) onStop();
        }
      }, 16);
    }
  });

  backBtn.addEventListener('click', () => {
    if (scrollInterval) clearInterval(scrollInterval);
    container.remove();
  });

  container.setText = (newText) => {
    textEl.innerHTML = newText.replace(/\n/g, '<br>');
  };

  container.hide = () => {
    if (scrollInterval) clearInterval(scrollInterval);
    container.remove();
  };

  return container;
}
