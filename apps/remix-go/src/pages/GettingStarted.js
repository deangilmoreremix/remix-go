export default function GettingStarted() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-app-bg flex items-center justify-center';
  container.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-5xl w-full mx-4">
      <h1 class="text-3xl font-bold text-white mb-2">Create Your Video</h1>
      <p class="text-gray-400 mb-8">Choose how to start</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="#editor?mode=ai" class="block p-6 rounded-xl glass hover:shadow-glow transition-all group cursor-pointer">
          <div class="text-4xl mb-4">🤖</div>
          <h3 class="text-lg font-semibold text-white">Generate with AI</h3>
          <p class="text-gray-400 text-sm">Describe your video, AI creates it</p>
        </a>
        
        <a href="#editor?mode=upload" class="block p-6 rounded-xl glass hover:shadow-glow transition-all group cursor-pointer">
          <div class="text-4xl mb-4">📁</div>
          <h3 class="text-lg font-semibold text-white">Upload Your Video</h3>
          <p class="text-gray-400 text-sm">Upload MP4/WebM or paste URL</p>
        </a>
        
        <a href="#editor?mode=clone" class="block p-6 rounded-xl glass hover:shadow-glow transition-all group cursor-pointer">
          <div class="text-4xl mb-4">🎬</div>
          <h3 class="text-lg font-semibold text-white">Record & Clone</h3>
          <p class="text-gray-400 text-sm">Record once, generate 100+ personalized</p>
        </a>
      </div>
      
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="#landing-page" class="block p-6 rounded-xl glass hover:shadow-glow transition-all cursor-pointer">
          <div class="text-4xl mb-4">📄</div>
          <h3 class="text-lg font-semibold text-white">Landing Page Builder</h3>
          <p class="text-gray-400 text-sm">Build personalized landing pages with drag & drop</p>
        </a>
        
        <a href="#publisher" class="block p-6 rounded-xl glass hover:shadow-glow transition-all cursor-pointer">
          <div class="text-4xl mb-4">📤</div>
          <h3 class="text-lg font-semibold text-white">Publish & Share</h3>
          <p class="text-gray-400 text-sm">Generate embed codes and email campaigns</p>
        </a>
      </div>
    </div>
  `;
  return container;
}
