export default function WizardStepper({ steps, currentStep, onStepChange }) {
  const defaultSteps = [
    { id: 'source', label: 'Source', description: 'Upload or generate video' },
    { id: 'edit', label: 'Edit', description: 'Add overlays and effects' },
    { id: 'personalize', label: 'Personalize', description: 'Add tokens and campaigns' },
    { id: 'publish', label: 'Publish', description: 'Share your video' },
  ];

  const stepList = steps || defaultSteps;
  const active = currentStep || 0;

  const container = document.createElement('div');
  container.className = 'wizard-stepper flex items-center justify-center gap-2 p-4';

  stepList.forEach((step, i) => {
    const isActive = i === active;
    const isCompleted = i < active;

    const stepEl = document.createElement('div');
    stepEl.className = 'flex items-center';

    const dot = document.createElement('button');
    dot.className = `flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-violet-600 text-white'
        : isCompleted
          ? 'bg-green-600 text-white'
          : 'bg-white/10 text-gray-500'
    }`;
    dot.innerHTML = isCompleted
      ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
      : String(i + 1);
    dot.title = step.label;

    dot.addEventListener('click', () => {
      if (onStepChange) onStepChange(i, step);
    });

    const label = document.createElement('span');
    label.className = `ml-2 text-xs hidden sm:inline ${isActive ? 'text-violet-300' : isCompleted ? 'text-gray-400' : 'text-gray-600'}`;
    label.textContent = step.label;

    stepEl.appendChild(dot);
    stepEl.appendChild(label);

    if (i < stepList.length - 1) {
      const line = document.createElement('div');
      line.className = `w-8 sm:w-16 h-0.5 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-white/10'}`;
      stepEl.appendChild(line);
    }

    container.appendChild(stepEl);
  });

  return container;
}
