export default class TooltipSystem {
  constructor() {
    this.tooltips = new Map();
    this.activeTooltip = null;
    this.init();
  }

  init() {
    // Global event listeners
    document.addEventListener('mouseover', this.handleMouseOver.bind(this));
    document.addEventListener('mouseout', this.handleMouseOut.bind(this));
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Add global styles
    this.addStyles();
  }

  addStyles() {
    if (document.getElementById('tooltip-styles')) return;

    const style = document.createElement('style');
    style.id = 'tooltip-styles';
    style.textContent = `
      .tooltip {
        position: fixed;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.2s ease-out;
        max-width: 300px;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      .tooltip.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .tooltip-content {
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 8px 12px;
        color: white;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        white-space: pre-line;
      }

      .tooltip-arrow {
        position: absolute;
        width: 8px;
        height: 8px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transform: rotate(45deg);
      }

      .tooltip[data-placement="top"] .tooltip-arrow {
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
      }

      .tooltip[data-placement="bottom"] .tooltip-arrow {
        top: -5px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
      }

      .tooltip[data-placement="left"] .tooltip-arrow {
        right: -5px;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
      }

      .tooltip[data-placement="right"] .tooltip-arrow {
        left: -5px;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
      }

      .tooltip-trigger {
        cursor: help;
      }

      .tooltip-trigger:focus {
        outline: 2px solid rgba(139, 92, 246, 0.5);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  create(element, content, options = {}) {
    const {
      placement = 'top',
      trigger = 'hover',
      delay = 300,
      hideDelay = 100,
      interactive = false,
      maxWidth = 300,
    } = options;

    // Remove existing tooltip for this element
    this.remove(element);

    const tooltipId = `tooltip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // Add trigger class
    element.classList.add('tooltip-trigger');
    element.setAttribute('aria-describedby', tooltipId);

    const tooltip = {
      id: tooltipId,
      element,
      content,
      placement,
      trigger,
      delay,
      hideDelay,
      interactive,
      maxWidth,
      showTimeout: null,
      hideTimeout: null,
      visible: false,
    };

    this.tooltips.set(element, tooltip);

    return tooltip;
  }

  show(element) {
    const tooltip = this.tooltips.get(element);
    if (!tooltip) return;

    // Hide any active tooltip
    if (this.activeTooltip) {
      this.hide(this.activeTooltip.element);
    }

    // Clear any pending timeouts
    clearTimeout(tooltip.showTimeout);
    clearTimeout(tooltip.hideTimeout);

    tooltip.showTimeout = setTimeout(() => {
      this.renderTooltip(tooltip);
      this.activeTooltip = tooltip;
    }, tooltip.delay);
  }

  hide(element) {
    const tooltip = this.tooltips.get(element);
    if (!tooltip) return;

    clearTimeout(tooltip.showTimeout);

    tooltip.hideTimeout = setTimeout(() => {
      this.destroyTooltip(tooltip);
      if (this.activeTooltip === tooltip) {
        this.activeTooltip = null;
      }
    }, tooltip.hideDelay);
  }

  renderTooltip(tooltip) {
    const { element, content, placement, maxWidth, interactive } = tooltip;

    // Create tooltip element
    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'tooltip';
    tooltipEl.id = tooltip.id;
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.setAttribute('data-placement', placement);

    tooltipEl.innerHTML = `
      <div class="tooltip-arrow"></div>
      <div class="tooltip-content" style="max-width: ${maxWidth}px;">
        ${content}
      </div>
    `;

    document.body.appendChild(tooltipEl);
    tooltip.element = tooltipEl;

    // Position the tooltip
    this.positionTooltip(tooltipEl, element, placement);

    // Add visible class after positioning
    requestAnimationFrame(() => {
      tooltipEl.classList.add('visible');
    });

    // Handle interactive tooltips
    if (interactive) {
      tooltipEl.addEventListener('mouseenter', () => {
        clearTimeout(tooltip.hideTimeout);
      });

      tooltipEl.addEventListener('mouseleave', () => {
        this.hide(element);
      });
    }

    tooltip.visible = true;
  }

  destroyTooltip(tooltip) {
    if (tooltip.element && tooltip.element.parentNode) {
      tooltip.element.parentNode.removeChild(tooltip.element);
    }
    tooltip.visible = false;
    tooltip.element = tooltip.element; // Restore original element reference
  }

  positionTooltip(tooltipEl, triggerEl, placement) {
    const triggerRect = triggerEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const arrowEl = tooltipEl.querySelector('.tooltip-arrow');

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    let top, left;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerCenterX - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerCenterX - tooltipRect.width / 2;
        break;
      case 'left':
        top = triggerCenterY - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerCenterY - tooltipRect.height / 2;
        left = triggerRect.right + 8;
        break;
      default:
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerCenterX - tooltipRect.width / 2;
    }

    // Keep tooltip within viewport
    const margin = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < margin) left = margin;
    if (left + tooltipRect.width > viewportWidth - margin) {
      left = viewportWidth - tooltipRect.width - margin;
    }
    if (top < margin) top = margin;
    if (top + tooltipRect.height > viewportHeight - margin) {
      top = viewportHeight - tooltipRect.height - margin;
    }

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;
  }

  handleMouseOver(e) {
    const tooltip = this.findTooltipTarget(e.target);
    if (tooltip && tooltip.trigger === 'hover') {
      this.show(tooltip.element);
    }
  }

  handleMouseOut(e) {
    const tooltip = this.findTooltipTarget(e.target);
    if (tooltip && tooltip.trigger === 'hover') {
      this.hide(tooltip.element);
    }
  }

  handleFocusIn(e) {
    const tooltip = this.findTooltipTarget(e.target);
    if (tooltip && tooltip.trigger === 'focus') {
      this.show(tooltip.element);
    }
  }

  handleFocusOut(e) {
    const tooltip = this.findTooltipTarget(e.target);
    if (tooltip && tooltip.trigger === 'focus') {
      this.hide(tooltip.element);
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Escape' && this.activeTooltip) {
      this.hide(this.activeTooltip.element);
    }
  }

  findTooltipTarget(element) {
    let current = element;
    while (current && current !== document.body) {
      if (this.tooltips.has(current)) {
        return this.tooltips.get(current);
      }
      current = current.parentElement;
    }
    return null;
  }

  remove(element) {
    const tooltip = this.tooltips.get(element);
    if (tooltip) {
      this.destroyTooltip(tooltip);
      this.tooltips.delete(element);
      element.classList.remove('tooltip-trigger');
      element.removeAttribute('aria-describedby');
    }
  }

  updateContent(element, content) {
    const tooltip = this.tooltips.get(element);
    if (tooltip) {
      tooltip.content = content;
      if (tooltip.visible) {
        this.renderTooltip(tooltip);
      }
    }
  }

  destroy() {
    // Clean up all tooltips
    this.tooltips.forEach((tooltip, element) => {
      this.remove(element);
    });

    // Remove global event listeners
    document.removeEventListener('mouseover', this.handleMouseOver);
    document.removeEventListener('mouseout', this.handleMouseOut);
    document.removeEventListener('focusin', this.handleFocusIn);
    document.removeEventListener('focusout', this.handleFocusOut);
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}

// Global tooltip system instance
let tooltipSystem = null;

export function getTooltipSystem() {
  if (!tooltipSystem) {
    tooltipSystem = new TooltipSystem();
  }
  return tooltipSystem;
}

// Convenience functions
export function addTooltip(element, content, options = {}) {
  const system = getTooltipSystem();
  return system.create(element, content, options);
}

export function removeTooltip(element) {
  const system = getTooltipSystem();
  system.remove(element);
}

export function updateTooltip(element, content) {
  const system = getTooltipSystem();
  system.updateContent(element, content);
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    getTooltipSystem();
  });
}

export default TooltipSystem;
