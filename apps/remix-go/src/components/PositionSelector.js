export default function PositionSelector({ onSelect, selected }) {
  const positions = [
    { id: 'top-left', row: 0, col: 0, style: 'justify-start items-start' },
    { id: 'top-center', row: 0, col: 1, style: 'justify-center items-start' },
    { id: 'top-right', row: 0, col: 2, style: 'justify-end items-start' },
    { id: 'middle-left', row: 1, col: 0, style: 'justify-start items-center' },
    { id: 'middle-center', row: 1, col: 1, style: 'justify-center items-center' },
    { id: 'middle-right', row: 1, col: 2, style: 'justify-end items-center' },
    { id: 'bottom-left', row: 2, col: 0, style: 'justify-start items-end' },
    { id: 'bottom-center', row: 2, col: 1, style: 'justify-center items-end' },
    { id: 'bottom-right', row: 2, col: 2, style: 'justify-end items-end' },
  ];

  const container = document.createElement('div');
  container.className = 'position-selector';

  const label = document.createElement('label');
  label.className = 'block text-xs text-gray-500 uppercase tracking-wider mb-2';
  label.textContent = 'Position';
  container.appendChild(label);

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-3 gap-1 w-32';

  positions.forEach(pos => {
    const cell = document.createElement('button');
    const isActive = selected === pos.id;
    cell.className = `w-10 h-10 rounded flex items-center justify-center transition-colors ${
      isActive
        ? 'bg-violet-600 text-white'
        : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
    }`;
    cell.innerHTML = '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/></svg>';
    cell.title = pos.id.replace(/-/g, ' ');
    cell.dataset.position = pos.id;

    cell.addEventListener('click', () => {
      grid.querySelectorAll('button').forEach(b => {
        b.className = 'w-10 h-10 rounded flex items-center justify-center transition-colors bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white';
      });
      cell.className = 'w-10 h-10 rounded flex items-center justify-center transition-colors bg-violet-600 text-white';
      if (onSelect) onSelect(pos.id, pos);
    });

    grid.appendChild(cell);
  });

  container.appendChild(grid);

  container.getValue = () => {
    const active = grid.querySelector('.bg-violet-600');
    return active ? active.dataset.position : null;
  };

  return container;
}
