export default function Search({ onSearch, placeholder }) {
  const container = document.createElement('div');
  container.className = 'search-container relative';
  container.innerHTML = `
    <input type="text"
      class="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
      placeholder="${placeholder || 'Search...'}">
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
    </svg>
  `;

  const input = container.querySelector('input');
  let debounceTimer = null;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (onSearch) onSearch(input.value);
    }, 300);
  });

  container.getValue = () => input.value;
  container.setValue = (val) => { input.value = val; };
  container.focus = () => input.focus();

  return container;
}
