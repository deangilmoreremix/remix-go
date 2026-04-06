export default function FormBuilder({ onSave, onExport }) {
  const state = {
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        validation: { minLength: 2, maxLength: 100 }
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'you@example.com',
        required: true,
        validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Enter your message...',
        required: true,
        validation: { minLength: 10, maxLength: 1000 }
      }
    ],
    settings: {
      title: 'Contact Form',
      description: 'Get in touch with us',
      submitText: 'Submit',
      successMessage: 'Thank you for your submission!',
      method: 'POST',
      action: '/api/submit',
      styling: {
        theme: 'default',
        layout: 'vertical',
        labelPosition: 'above',
        showPlaceholders: true,
        showRequiredIndicator: true
      }
    },
    draggingField: null,
    selectedField: null
  };

  const fieldTypes = [
    { id: 'text', name: 'Text Input', icon: 'fa-font' },
    { id: 'email', name: 'Email', icon: 'fa-envelope' },
    { id: 'number', name: 'Number', icon: 'fa-hashtag' },
    { id: 'tel', name: 'Phone', icon: 'fa-phone' },
    { id: 'url', name: 'Website URL', icon: 'fa-link' },
    { id: 'textarea', name: 'Long Text', icon: 'fa-align-left' },
    { id: 'select', name: 'Dropdown', icon: 'fa-chevron-down' },
    { id: 'radio', name: 'Radio Buttons', icon: 'fa-circle' },
    { id: 'checkbox', name: 'Checkbox', icon: 'fa-check-square' },
    { id: 'multiselect', name: 'Multi Select', icon: 'fa-tasks' },
    { id: 'date', name: 'Date Picker', icon: 'fa-calendar' },
    { id: 'file', name: 'File Upload', icon: 'fa-upload' }
  ];

  const container = document.createElement('div');
  container.className = 'form-builder flex flex-col h-full bg-gray-900';

  function generateHTML() {
    const formId = `form-${Date.now()}`;
    let html = `<form id="${formId}" method="${state.settings.method}" action="${state.settings.action}" class="form-container">`;
    html += `<h2 class="form-title">${state.settings.title}</h2>`;
    if (state.settings.description) {
      html += `<p class="form-description">${state.settings.description}</p>`;
    }

    state.fields.forEach(field => {
      const requiredAttr = field.required ? ' required' : '';
      const placeholder = field.placeholder ? ` placeholder="${field.placeholder}"` : '';

      html += `<div class="form-field">`;
      html += `<label for="${field.id}">${field.label}${field.required && state.settings.styling.showRequiredIndicator ? ' *' : ''}</label>`;

      if (field.type === 'textarea') {
        html += `<textarea id="${field.id}" name="${field.id}"${placeholder}${requiredAttr}></textarea>`;
      } else if (field.type === 'select') {
        html += `<select id="${field.id}" name="${field.id}"${requiredAttr}>`;
        html += `<option value="">Select an option</option>`;
        (field.options || []).forEach(opt => {
          html += `<option value="${opt.value}">${opt.label}</option>`;
        });
        html += `</select>`;
      } else {
        html += `<input type="${field.type}" id="${field.id}" name="${field.id}"${placeholder}${requiredAttr}>`;
      }
      html += `</div>`;
    });

    html += `<button type="submit" class="submit-btn">${state.settings.submitText}</button>`;
    html += `</form>`;
    return html;
  }

  function render() {
    container.innerHTML = `
      <div class="form-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <i class="fa fa-wpforms text-white"></i>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Form Builder</h2>
            <p class="text-xs text-gray-400">Create custom forms</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button id="export-html" class="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors">
            <i class="fa fa-code mr-2"></i>Export HTML
          </button>
          <button id="save-form" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors">
            <i class="fa fa-save mr-2"></i>Save Form
          </button>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <div class="w-64 border-r border-gray-800 p-4">
          <h3 class="text-sm font-semibold text-white mb-3">Field Types</h3>
          <div class="grid grid-cols-2 gap-2">
            ${fieldTypes.map(type => `
              <button class="add-field-btn p-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-violet-500 transition-colors text-center"
                      data-field-type="${type.id}">
                <i class="fa ${type.icon} text-gray-400 text-lg mb-1"></i>
                <p class="text-xs text-gray-300">${type.name}</p>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="flex-1 p-6 overflow-y-auto">
          <div class="max-w-2xl mx-auto bg-gray-800/30 rounded-2xl border border-gray-800 p-6">
            <div class="mb-6">
              <input id="form-title" type="text" value="${state.settings.title}"
                class="w-full text-xl font-semibold bg-transparent border-none text-white focus:outline-none focus:border-b focus:border-violet-500 placeholder-gray-500"
                placeholder="Form Title">
              <textarea id="form-description" rows="2"
                class="w-full mt-2 text-sm bg-transparent border-none text-gray-400 focus:outline-none resize-none"
                placeholder="Add a form description...">${state.settings.description}</textarea>
            </div>

            <div class="form-fields space-y-4">
              ${state.fields.map((field, index) => `
                <div class="field-card group p-4 rounded-xl bg-gray-800 border border-gray-700 ${state.selectedField?.id === field.id ? 'border-violet-500 ring-1 ring-violet-500/20' : 'hover:border-gray-600'} transition-all cursor-pointer"
                     data-field-id="${field.id}">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-sm font-medium text-white">${field.label}</span>
                        ${field.required ? '<span class="text-red-400">*</span>' : ''}
                        <span class="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400">${fieldTypes.find(t => t.id === field.type)?.name || field.type}</span>
                      </div>
                      ${field.type === 'textarea' ? `
                        <textarea disabled class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500 text-sm resize-none" placeholder="${field.placeholder || ''}" rows="3"></textarea>
                      ` : field.type === 'select' ? `
                        <select disabled class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500 text-sm">
                          <option>${field.placeholder || 'Select an option'}</option>
                        </select>
                      ` : `
                        <input disabled type="text" class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500 text-sm" placeholder="${field.placeholder || ''}">
                      `}
                    </div>
                    <div class="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button class="move-up-btn w-8 h-8 rounded hover:bg-gray-700 text-gray-400 hover:text-white ${index === 0 ? 'opacity-50' : ''}"
                              data-index="${index}">
                        <i class="fa fa-arrow-up text-xs"></i>
                      </button>
                      <button class="move-down-btn w-8 h-8 rounded hover:bg-gray-700 text-gray-400 hover:text-white ${index === state.fields.length - 1 ? 'opacity-50' : ''}"
                              data-index="${index}">
                        <i class="fa fa-arrow-down text-xs"></i>
                      </button>
                      <button class="delete-field-btn w-8 h-8 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                              data-field-id="${field.id}">
                        <i class="fa fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="mt-6 pt-6 border-t border-gray-700">
              <button id="submit-text" class="text-sm text-gray-400 hover:text-white">
                Submit button: <span class="text-white">${state.settings.submitText}</span>
              </button>
            </div>
          </div>
        </div>

        ${state.selectedField ? `
          <div class="w-72 border-l border-gray-800 p-4 bg-gray-800/30 overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold text-white">Field Settings</h3>
              <button id="close-settings" class="text-gray-400 hover:text-white">
                <i class="fa fa-times"></i>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Label</label>
                <input id="field-label" type="text" value="${state.selectedField.label}"
                  class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Placeholder</label>
                <input id="field-placeholder" type="text" value="${state.selectedField.placeholder || ''}"
                  class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div class="flex items-center gap-3">
                <input type="checkbox" id="field-required" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${state.selectedField.required ? 'checked' : ''}>
                <label for="field-required" class="text-sm text-gray-300">Required field</label>
              </div>

              ${state.selectedField.type === 'text' || state.selectedField.type === 'textarea' ? `
                <div class="space-y-3 pt-3 border-t border-gray-700">
                  <h4 class="text-xs font-semibold text-gray-400">Validation</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Min Length</label>
                      <input id="field-min" type="number" value="${state.selectedField.validation?.minLength || ''}"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Max Length</label>
                      <input id="field-max" type="number" value="${state.selectedField.validation?.maxLength || ''}"
                        class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                    </div>
                  </div>
                </div>
              ` : ''}

              ${['select', 'radio', 'checkbox', 'multiselect'].includes(state.selectedField.type) ? `
                <div class="space-y-3 pt-3 border-t border-gray-700">
                  <h4 class="text-xs font-semibold text-gray-400">Options</h4>
                  <div class="space-y-2" id="field-options">
                    ${(state.selectedField.options || [{ value: 'option1', label: 'Option 1' }]).map((opt, i) => `
                      <div class="flex gap-2">
                        <input type="text" value="${opt.label}" class="option-label flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white text-sm" data-index="${i}">
                        <input type="text" value="${opt.value}" class="option-value w-20 p-2 rounded bg-gray-800 border border-gray-700 text-white text-sm" data-index="${i}">
                        <button class="remove-option p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                ${(state.selectedField.options?.length || 1) <= 1 ? 'disabled' : ''}>
                          <i class="fa fa-times"></i>
                        </button>
                      </div>
                    `).join('')}
                  </div>
                  <button id="add-option" class="w-full py-2 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-violet-500 hover:text-violet-400 text-sm">
                    + Add Option
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    attachEventListeners();
  }

  function attachEventListeners() {
    const formTitle = container.querySelector('#form-title');
    if (formTitle) {
      formTitle.addEventListener('input', (e) => {
        state.settings.title = e.target.value;
      });
    }

    const formDesc = container.querySelector('#form-description');
    if (formDesc) {
      formDesc.addEventListener('input', (e) => {
        state.settings.description = e.target.value;
      });
    }

    container.querySelectorAll('.add-field-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fieldType = btn.dataset.fieldType;
        const newField = {
          id: `field-${Date.now()}`,
          type: fieldType,
          label: `New ${fieldTypes.find(t => t.id === fieldType)?.name || 'Field'}`,
          placeholder: '',
          required: false,
          validation: {}
        };

        if (['select', 'radio', 'checkbox', 'multiselect'].includes(fieldType)) {
          newField.options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
          ];
        }

        state.fields.push(newField);
        state.selectedField = newField;
        render();
      });
    });

    container.querySelectorAll('.field-card').forEach(card => {
      card.addEventListener('click', () => {
        const field = state.fields.find(f => f.id === card.dataset.fieldId);
        if (field) {
          state.selectedField = field;
          render();
        }
      });
    });

    container.querySelectorAll('.delete-field-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.fields = state.fields.filter(f => f.id !== btn.dataset.fieldId);
        if (state.selectedField?.id === btn.dataset.fieldId) {
          state.selectedField = null;
        }
        render();
      });
    });

    container.querySelectorAll('.move-up-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        if (index > 0) {
          [state.fields[index], state.fields[index - 1]] = [state.fields[index - 1], state.fields[index]];
          render();
        }
      });
    });

    container.querySelectorAll('.move-down-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        if (index < state.fields.length - 1) {
          [state.fields[index], state.fields[index + 1]] = [state.fields[index + 1], state.fields[index]];
          render();
        }
      });
    });

    const closeSettings = container.querySelector('#close-settings');
    if (closeSettings) {
      closeSettings.addEventListener('click', () => {
        state.selectedField = null;
        render();
      });
    }

    const fieldLabel = container.querySelector('#field-label');
    if (fieldLabel) {
      fieldLabel.addEventListener('input', (e) => {
        if (state.selectedField) {
          state.selectedField.label = e.target.value;
          render();
        }
      });
    }

    const fieldPlaceholder = container.querySelector('#field-placeholder');
    if (fieldPlaceholder) {
      fieldPlaceholder.addEventListener('input', (e) => {
        if (state.selectedField) {
          state.selectedField.placeholder = e.target.value;
          render();
        }
      });
    }

    const fieldRequired = container.querySelector('#field-required');
    if (fieldRequired) {
      fieldRequired.addEventListener('change', (e) => {
        if (state.selectedField) {
          state.selectedField.required = e.target.checked;
          render();
        }
      });
    }

    const saveForm = container.querySelector('#save-form');
    if (saveForm) {
      saveForm.addEventListener('click', () => {
        if (onSave) {
          onSave(state.fields, state.settings);
        }
      });
    }

    const exportHtml = container.querySelector('#export-html');
    if (exportHtml) {
      exportHtml.addEventListener('click', () => {
        const html = generateHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'form.html';
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  render();

  container.api = {
    getFields: () => state.fields,
    getSettings: () => state.settings,
    generateHTML
  };

  return container;
}
