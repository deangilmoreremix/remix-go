export default function CropModal({ imageData, resolution, onImageCropped, onClose }) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">Please select image area to use in project</h3>
        <button id="crop-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="crop-container bg-black/20 rounded-lg p-4">
        <div id="crop-area" class="relative bg-black/40 rounded border-2 border-dashed border-violet-400 min-h-[300px] flex items-center justify-center">
          <div class="text-white/60 text-center">
            <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p>Image cropping functionality would be implemented here</p>
            <p class="text-sm mt-2">Resolution: ${resolution ? `${resolution.width}x${resolution.height}` : 'Auto'}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button id="crop-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors">
          Cancel
        </button>
        <button id="crop-apply" class="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors">
          Apply Crop
        </button>
      </div>
    </div>
  `;

  // Event listeners
  modal.querySelector('#crop-close').addEventListener('click', () => {
    modal.remove();
    onClose?.();
  });

  modal.querySelector('#crop-cancel').addEventListener('click', () => {
    modal.remove();
    onClose?.();
  });

  modal.querySelector('#crop-apply').addEventListener('click', () => {
    // Simulate cropped image data
    const croppedData = {
      ...imageData,
      cropped: true,
      cropArea: { x: 0, y: 0, width: resolution?.width || 800, height: resolution?.height || 600 }
    };
    onImageCropped?.(croppedData);
    modal.remove();
  });

  return modal;
}