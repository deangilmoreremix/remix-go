// Alert service for notifications and messages
const alertService = {
  alerts: [],

  show(message, type = 'info', duration = 5000) {
    const alert = {
      id: Date.now().toString(),
      message,
      type,
      duration
    };

    this.alerts.push(alert);
    this.renderAlert(alert);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(alert.id);
      }, duration);
    }

    return alert.id;
  },

  success(message, duration) {
    return this.show(message, 'success', duration);
  },

  error(message, duration) {
    return this.show(message, 'error', duration);
  },

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  },

  info(message, duration) {
    return this.show(message, 'info', duration);
  },

  remove(id) {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    const alertElement = document.querySelector(`[data-alert-id="${id}"]`);
    if (alertElement) {
      alertElement.remove();
    }
  },

  clear() {
    this.alerts.forEach(alert => this.remove(alert.id));
  },

  renderAlert(alert) {
    const container = this.getContainer();

    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${alert.type} fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm`;
    alertElement.setAttribute('data-alert-id', alert.id);

    const colors = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-black',
      info: 'bg-blue-500 text-white'
    };

    alertElement.classList.add(...colors[alert.type].split(' '));

    alertElement.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${alert.message}</span>
        <button class="ml-4 text-current hover:opacity-75" onclick="alertService.remove('${alert.id}')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;

    container.appendChild(alertElement);

    // Animate in
    setTimeout(() => {
      alertElement.style.transform = 'translateX(0)';
      alertElement.style.opacity = '1';
    }, 10);
  },

  getContainer() {
    let container = document.getElementById('alert-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'alert-container';
      container.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(container);
    }
    return container;
  }
};

// Make globally available
window.alertService = alertService;

export default alertService;