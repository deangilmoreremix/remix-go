import VideoEditor from '../components/VideoEditor.js';
import AIGeneratePanel from '../components/AIGeneratePanel.js';
import ModelSelector from '../components/ModelSelector.js';
import VideoUpload from '../components/VideoUpload.js';
import WizardStepper from '../components/WizardStepper.js';
import TextOverlayEditor from '../components/TextOverlayEditor.js';
import CTAEditor from '../components/CTAEditor.js';
import PopupEditor from '../components/PopupEditor.js';
import LeadFormEditor from '../components/LeadFormEditor.js';
import ImageOverlayEditor from '../components/ImageOverlayEditor.js';
import Personalizer from '../components/Personalizer.js';
import VoiceClone from '../components/VoiceClone.js';
import AvatarGenerator from '../components/AvatarGenerator.js';
import ScriptWriter from '../components/ScriptWriter.js';
import DynamicBackground from '../components/DynamicBackground.js';
import Teleprompter from '../components/Teleprompter.js';

export default function Editor() {
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  const mode = params.get('mode') || 'ai';

  const container = document.createElement('div');
  container.className = 'editor-container';

  let currentPanel = 'ai';

  function render() {
    container.innerHTML = `
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
    `;

    // Wizard
    const wizardEl = container.querySelector('#wizard-steps');
    wizardEl.appendChild(WizardStepper({
      steps: [
        { id: 'source', label: 'Source' },
        { id: 'edit', label: 'Edit' },
        { id: 'personalize', label: 'Personalize' },
        { id: 'publish', label: 'Publish' },
      ],
      currentStep: mode === 'ai' ? 0 : mode === 'upload' ? 0 : 1,
    }));

    // Input area based on mode
    const inputArea = container.querySelector('#sidebar-input');
    if (mode === 'ai' || mode === 'clone') {
      inputArea.appendChild(AIGeneratePanel({
        onGenerate: (config) => {
          console.log('AI Generate:', config);
        },
      }));
    } else {
      inputArea.appendChild(VideoUpload({
        onUpload: (data) => {
          const wrapper = container.querySelector('#player-wrapper');
          if (wrapper) {
            wrapper.innerHTML = '';
            const editor = VideoEditor({ src: data.url });
            wrapper.appendChild(editor);
          }
        },
      }));
    }

    // Video area
    const playerWrapper = container.querySelector('#player-wrapper');
    const videoEditor = VideoEditor({});
    playerWrapper.innerHTML = '';
    playerWrapper.appendChild(videoEditor);

    // Overlay action buttons
    container.querySelectorAll('[data-panel]').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.dataset.panel;
        showRightPanel(panel);
      });
    });
  }

  function showRightPanel(panel) {
    const rightPanel = container.querySelector('#right-panel');
    rightPanel.innerHTML = '';

    const panelMap = {
      text: () => TextOverlayEditor({ onSave: (data) => { console.log('Text overlay:', data); } }),
      image: () => ImageOverlayEditor({ onSave: (data) => { console.log('Image overlay:', data); } }),
      leadform: () => LeadFormEditor({ onSave: (data) => { console.log('Lead form:', data); } }),
      cta: () => CTAEditor({ onSave: (data) => { console.log('CTA:', data); } }),
      popup: () => PopupEditor({ onSave: (data) => { console.log('Popup:', data); } }),
      personalizer: () => Personalizer({ onTokenChosen: (token) => { console.log('Token:', token); } }),
      scriptwriter: () => ScriptWriter({ onScriptGenerated: (script) => { console.log('Script:', script); } }),
      voiceclone: () => VoiceClone({ onVoiceGenerated: (data) => { console.log('Voice:', data); } }),
      avatar: () => AvatarGenerator({ onAvatarReady: (data) => { console.log('Avatar:', data); } }),
      background: () => DynamicBackground({ onBackgroundReady: (data) => { console.log('Background:', data); } }),
      teleprompter: () => {
        const tp = Teleprompter({ text: 'Enter your script here and press Start.' });
        document.body.appendChild(tp);
        return document.createElement('div');
      },
    };

    if (panelMap[panel]) {
      rightPanel.appendChild(panelMap[panel]());
    }
  }

  render();
  return container;
}
