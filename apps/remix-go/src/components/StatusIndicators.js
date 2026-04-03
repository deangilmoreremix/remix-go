export default function StatusIndicators() {
  this.indicators = {};

  // Save status indicator
  this.saveStatus = {
    create: (container, options = {}) => {
      const indicator = document.createElement('div');
      indicator.className = 'inline-flex items-center gap-2 text-sm';

      const { showText = true, autoHide = true, hideDelay = 3000 } = options;

      const updateStatus = (status, message) => {
        const statusConfig = {
          saved: { icon: '💾', text: 'Saved', color: 'text-green-400' },
          saving: { icon: '⏳', text: 'Saving...', color: 'text-yellow-400' },
          error: { icon: '❌', text: 'Save failed', color: 'text-red-400' },
          offline: { icon: '📴', text: 'Offline', color: 'text-gray-400' },
        };

        const config = statusConfig[status] || statusConfig.saved;

        indicator.innerHTML = `
          <span class="${config.color}">${config.icon}</span>
          ${showText ? `<span class="${config.color}">${message || config.text}</span>` : ''}
        `;

        // Auto-hide success messages
        if (autoHide && status === 'saved') {
          setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
              if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
              }
            }, 300);
          }, hideDelay);
        }
      };

      indicator.updateStatus = updateStatus;
      indicator.saved = () => updateStatus('saved');
      indicator.saving = () => updateStatus('saving');
      indicator.error = (message) => updateStatus('error', message);
      indicator.offline = () => updateStatus('offline');

      if (container) {
        container.appendChild(indicator);
      }

      return indicator;
    },
  };

  // Sync status indicator
  this.syncStatus = {
    create: (container, options = {}) => {
      const indicator = document.createElement('div');
      indicator.className = 'inline-flex items-center gap-2 text-sm';

      const updateStatus = (status) => {
        const statusConfig = {
          synced: { icon: '☁️', text: 'Synced', color: 'text-green-400' },
          syncing: { icon: '🔄', text: 'Syncing...', color: 'text-blue-400', animate: true },
          offline: { icon: '📴', text: 'Offline', color: 'text-gray-400' },
          conflict: { icon: '⚠️', text: 'Sync conflict', color: 'text-yellow-400' },
          error: { icon: '❌', text: 'Sync failed', color: 'text-red-400' },
        };

        const config = statusConfig[status] || statusConfig.synced;

        indicator.innerHTML = `
          <span class="${config.color} ${config.animate ? 'animate-spin' : ''}">${config.icon}</span>
          <span class="${config.color}">${config.text}</span>
        `;
      };

      indicator.updateStatus = updateStatus;
      indicator.synced = () => updateStatus('synced');
      indicator.syncing = () => updateStatus('syncing');
      indicator.offline = () => updateStatus('offline');
      indicator.conflict = () => updateStatus('conflict');
      indicator.error = () => updateStatus('error');

      if (container) {
        container.appendChild(indicator);
      }

      return indicator;
    },
  };

  // Validation feedback
  this.validation = {
    create: (container, fieldName, options = {}) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'relative';

      const field = container.querySelector(`[name="${fieldName}"]`) ||
                   container.querySelector(`#${fieldName}`) ||
                   container;

      if (field !== container) {
        field.parentNode.insertBefore(wrapper, field);
        wrapper.appendChild(field);
      } else {
        container.appendChild(wrapper);
      }

      const indicator = document.createElement('div');
      indicator.className = 'absolute right-2 top-2 text-sm transition-opacity duration-200 opacity-0';

      wrapper.appendChild(indicator);

      const feedback = document.createElement('div');
      feedback.className = 'text-xs mt-1 transition-all duration-200 max-h-0 overflow-hidden';
      wrapper.appendChild(feedback);

      const showFeedback = (type, message) => {
        const configs = {
          valid: { icon: '✅', color: 'text-green-400', bg: 'bg-green-600/10' },
          invalid: { icon: '❌', color: 'text-red-400', bg: 'bg-red-600/10' },
          warning: { icon: '⚠️', color: 'text-yellow-400', bg: 'bg-yellow-600/10' },
          info: { icon: 'ℹ️', color: 'text-blue-400', bg: 'bg-blue-600/10' },
        };

        const config = configs[type] || configs.info;

        indicator.innerHTML = `<span class="${config.color}">${config.icon}</span>`;
        indicator.style.opacity = '1';

        feedback.innerHTML = `<div class="${config.bg} ${config.color} p-2 rounded">${message}</div>`;
        feedback.style.maxHeight = '100px';

        // Auto-hide after delay for success
        if (type === 'valid') {
          setTimeout(() => {
            indicator.style.opacity = '0';
            feedback.style.maxHeight = '0';
          }, 3000);
        }
      };

      const hideFeedback = () => {
        indicator.style.opacity = '0';
        feedback.style.maxHeight = '0';
      };

      wrapper.showValid = (message) => showFeedback('valid', message);
      wrapper.showInvalid = (message) => showFeedback('invalid', message);
      wrapper.showWarning = (message) => showFeedback('warning', message);
      wrapper.showInfo = (message) => showFeedback('info', message);
      wrapper.hideFeedback = hideFeedback;

      return wrapper;
    },

    // Form validation helper
    validateField: (field, rules) => {
      const value = field.value;
      let isValid = true;
      let message = '';

      for (const rule of rules) {
        if (rule.required && !value.trim()) {
          isValid = false;
          message = rule.message || 'This field is required';
          break;
        }

        if (rule.minLength && value.length < rule.minLength) {
          isValid = false;
          message = rule.message || `Minimum ${rule.minLength} characters`;
          break;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          isValid = false;
          message = rule.message || `Maximum ${rule.maxLength} characters`;
          break;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          isValid = false;
          message = rule.message || 'Invalid format';
          break;
        }

        if (rule.custom && !rule.custom(value)) {
          isValid = false;
          message = rule.message || 'Validation failed';
          break;
        }
      }

      return { isValid, message };
    },

    // Batch validation for forms
    validateForm: (form, rules) => {
      const results = {};
      let allValid = true;

      for (const [fieldName, fieldRules] of Object.entries(rules)) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) continue;

        const result = this.validateField(field, fieldRules);
        results[fieldName] = result;

        if (!result.isValid) {
          allValid = false;
        }
      }

      return { allValid, results };
    },
  };

  // Connection status
  this.connection = {
    create: (container, options = {}) => {
      const indicator = document.createElement('div');
      indicator.className = 'inline-flex items-center gap-2 text-sm';

      const updateStatus = (status) => {
        const statusConfig = {
          online: { icon: '🟢', text: 'Online', color: 'text-green-400' },
          offline: { icon: '🔴', text: 'Offline', color: 'text-red-400' },
          reconnecting: { icon: '🟡', text: 'Reconnecting...', color: 'text-yellow-400', animate: true },
          slow: { icon: '🟠', text: 'Slow connection', color: 'text-yellow-400' },
        };

        const config = statusConfig[status] || statusConfig.online;

        indicator.innerHTML = `
          <span class="${config.color} ${config.animate ? 'animate-pulse' : ''}">${config.icon}</span>
          <span class="${config.color}">${config.text}</span>
        `;
      };

      indicator.updateStatus = updateStatus;
      indicator.online = () => updateStatus('online');
      indicator.offline = () => updateStatus('offline');
      indicator.reconnecting = () => updateStatus('reconnecting');
      indicator.slow = () => updateStatus('slow');

      // Auto-detect connection status
      const updateConnectionStatus = () => {
        if (navigator.onLine) {
          // Check actual connectivity
          fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' })
            .then(() => indicator.online())
            .catch(() => indicator.offline());
        } else {
          indicator.offline();
        }
      };

      window.addEventListener('online', updateConnectionStatus);
      window.addEventListener('offline', () => indicator.offline());

      // Initial check
      updateConnectionStatus();

      if (container) {
        container.appendChild(indicator);
      }

      return indicator;
    },
  };

  // Activity indicator
  this.activity = {
    create: (container, options = {}) => {
      const indicator = document.createElement('div');
      indicator.className = 'inline-flex items-center gap-2 text-sm text-gray-400';

      const { showText = true } = options;

      const activities = [];
      let currentActivity = null;

      const showActivity = (activity) => {
        currentActivity = activity;
        indicator.innerHTML = `
          <span class="animate-pulse">${activity.icon || '⏳'}</span>
          ${showText ? `<span>${activity.text || 'Working...'}</span>` : ''}
        `;
      };

      const hideActivity = () => {
        currentActivity = null;
        indicator.innerHTML = '';
      };

      const addActivity = (activity) => {
        activities.push(activity);
        if (!currentActivity) {
          showActivity(activity);
        }
      };

      const removeActivity = (activity) => {
        const index = activities.indexOf(activity);
        if (index > -1) {
          activities.splice(index, 1);
        }

        if (currentActivity === activity) {
          if (activities.length > 0) {
            showActivity(activities[0]);
          } else {
            hideActivity();
          }
        }
      };

      indicator.showActivity = showActivity;
      indicator.hideActivity = hideActivity;
      indicator.addActivity = addActivity;
      indicator.removeActivity = removeActivity;

      if (container) {
        container.appendChild(indicator);
      }

      return indicator;
    },
  };

  // Progress with steps
  this.stepProgress = {
    create: (container, steps, options = {}) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'step-progress';

      const { currentStep = 0, showLabels = true } = options;

      const render = () => {
        wrapper.innerHTML = '';

        steps.forEach((step, index) => {
          const stepEl = document.createElement('div');
          stepEl.className = 'flex items-center gap-2';

          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          const statusClasses = {
            completed: 'bg-green-500 text-white',
            current: 'bg-violet-500 text-white',
            pending: 'bg-white/20 text-gray-400',
          };

          const status = isCompleted ? 'completed' : isCurrent ? 'current' : 'pending';

          stepEl.innerHTML = `
            <div class="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${statusClasses[status]}">
              ${isCompleted ? '✓' : index + 1}
            </div>
            ${showLabels ? `<span class="text-sm ${isPending ? 'text-gray-400' : 'text-white'}">${step.label}</span>` : ''}
          `;

          if (index < steps.length - 1) {
            const connector = document.createElement('div');
            connector.className = `flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-white/20'}`;
            stepEl.appendChild(connector);
          }

          wrapper.appendChild(stepEl);
        });
      };

      wrapper.setStep = (step) => {
        options.currentStep = step;
        render();
      };

      wrapper.next = () => {
        if (options.currentStep < steps.length - 1) {
          wrapper.setStep(options.currentStep + 1);
        }
      };

      wrapper.previous = () => {
        if (options.currentStep > 0) {
          wrapper.setStep(options.currentStep - 1);
        }
      };

      render();

      if (container) {
        container.appendChild(wrapper);
      }

      return wrapper;
    },
  };

  return this;
}

// Export singleton instance
const statusIndicators = new StatusIndicators();
export default statusIndicators;

// Convenience exports
export const createSaveStatus = statusIndicators.saveStatus.create.bind(statusIndicators.saveStatus);
export const createSyncStatus = statusIndicators.syncStatus.create.bind(statusIndicators.syncStatus);
export const createValidation = statusIndicators.validation.create.bind(statusIndicators.validation);
export const createConnectionStatus = statusIndicators.connection.create.bind(statusIndicators.connection);
export const createActivityIndicator = statusIndicators.activity.create.bind(statusIndicators.activity);
export const createStepProgress = statusIndicators.stepProgress.create.bind(statusIndicators.stepProgress);
