import { Placement } from '@floating-ui/dom';

export function isElementVisible(element: globalThis.Element | undefined) {
  if (!element || !(element instanceof Element)) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  // Check if the element is within the viewport
  const isInViewport =
    rect.top <= windowHeight && rect.left <= windowWidth && rect.bottom >= 0 && rect.right >= 0;

  if (!isInViewport) {
    return false;
  }

  // Check for parents with overflow: hidden or positioning
  let parent = element.parentElement;
  while (parent) {
    const parentStyle = window.getComputedStyle(parent);
    const parentRect = parent.getBoundingClientRect();

    // Check if parent has overflow: hidden
    if (parentStyle.overflow === 'hidden') {
      if (
        rect.top < parentRect.top ||
        rect.left < parentRect.left ||
        rect.bottom > parentRect.bottom ||
        rect.right > parentRect.right
      ) {
        return false;
      }
    }

    // Check for fixed or absolute positioning
    const position = parentStyle.position;
    if (position === 'fixed' || position === 'absolute') {
      if (
        rect.top < Math.max(parentRect.top, 0) ||
        rect.left < Math.max(parentRect.left, 0) ||
        rect.bottom > Math.min(parentRect.bottom, windowHeight) ||
        rect.right > Math.min(parentRect.right, windowWidth)
      ) {
        return false;
      }
    }

    parent = parent.parentElement;
  }

  return true;
}

type Point = {
  x: number;
  y: number;
};

export const focusableNativeElements =
  'button, [href], input, select, textarea, [tabindex], [tabindex]:not([tabindex="-1"])';
export const focusableCustomElements =
  'br-banner, br-button, br-single-select, br-select-list, br-select-list-item, br-input, br-tag-input, br-time-input, br-numeric-input, br-text-area, br-checkbox, br-radio, br-switch, br-dialog, br-dialog-header, br-dialog-footer, br-confirmation, br-confirmation-header, br-confirmation-footer, br-drawer, br-drawer-header, br-drawer-footer, br-toast, br-toast-provider, br-progress, br-color-picker, br-color-input, br-menu-item, br-color-eye-dropper, br-menu, br-popover-content, br-tab-item, br-tab-panel, br-tree, br-tree-item, br-link, br-container-resize-handle';
export const allCustomElements = [
  'br-banner',
  'br-button',
  'br-checkbox',
  'br-combo-select',
  'br-container',
  'br-control-group',
  'br-date-input',
  'br-date-picker',
  'br-drawer',
  'br-drawer-content',
  'br-drawer-header',
  'br-drawer-footer',
  'br-dialog',
  'br-dialog-content',
  'br-dialog-header',
  'br-dialog-footer',
  'br-confirmation',
  'br-confirmation-content',
  'br-confirmation-header',
  'br-confirmation-footer',
  'br-field',
  'br-field-label',
  'br-file-input',
  'br-file-upload',
  'br-icon',
  'br-input',
  'br-input-error-display',
  'br-multi-select',
  'br-numeric-input',
  'br-popover',
  'br-popover-content',
  'br-radio',
  'br-scroll-area',
  'br-scroll-bar',
  'br-select-list',
  'br-select-list-item',
  'br-single-select',
  'br-slider',
  'br-slider-thumb',
  'br-slider-track',
  'br-switch',
  'br-tag',
  'br-tag-input',
  'br-text-area',
  'br-theme-context',
  'br-time-input',
  'br-time-picker',
  'br-tooltip',
  'br-tooltip-content',
  'br-toast',
  'br-toast-provider',
  'br-progress',
  'br-color-picker',
  'br-separator',
  'br-color-input',
  'br-color-preview',
  'br-color-eye-dropper',
  'br-menu-item',
  'br-menu',
  'br-popover-content',
  'br-table',
  'br-table-header',
  'br-table-row',
  'br-table-cell',
  'br-table-footer',
  'br-pagination',
  'br-tab-list',
  'br-tab-item',
  'br-tab-content',
  'br-tab-panel',
  'br-tree',
  'br-tree-item',
  'br-info-display',
  'br-link',
  'br-container',
  'br-container-resize-group',
  'br-container-resize-handle',
  'br-timeline',
  'br-timeline-item',
  'br-infinite-canvas',
  'br-wizard',
  'br-wizard-item',
  'br-text',
  'br-form',
  'br-keyboard-shortcut',
  'br-key',
  'br-chart',
  'br-chart-tooltip-legend',
  'br-simple-chart',
  'br-sidebar',
  'br-sidebar-item',
  'br-header',
  'br-sparkline',
  'br-table-row-selection-checkbox',
  'br-code-editor',
  'br-code-editor-search',
];

export const deepQuerySelectorAll = (selector: string, r?: HTMLElement | ShadowRoot) => {
  let elements = [];
  const root = r || document;

  // Query the elements in the current root (document or shadow root)
  elements = [...Array.from(root.querySelectorAll(selector))];

  // Find all elements that have a shadow root
  const shadowHosts = root.querySelectorAll('*');

  shadowHosts.forEach((el) => {
    if (el.shadowRoot) {
      // Recursively query inside shadow roots
      elements.push(...deepQuerySelectorAll(selector, el.shadowRoot));
    }
  });

  return elements;
};

export const trapFocus = (container: globalThis.Element, e: globalThis.KeyboardEvent) => {
  const allFocusableElements = focusableNativeElements + ',' + focusableCustomElements;
  const focusableRootElements = Array.from(container.querySelectorAll(allFocusableElements)).filter(
    (t: globalThis.HTMLElement) => t.offsetParent,
  );

  const focusableElements = [...focusableRootElements];

  const firstFocusableElement = focusableElements[0] as globalThis.HTMLElement;
  const focusableContent = focusableElements.length - 1;
  const lastFocusableElement = focusableElements[focusableContent] as globalThis.HTMLElement;

  const isTabPressed = e.key === 'Tab';

  if (!isTabPressed) {
    return;
  }

  const preventDefaultAndPropagation = () => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  };

  if (e.shiftKey) {
    if (document.activeElement === firstFocusableElement) {
      preventDefaultAndPropagation();
      lastFocusableElement.focus({ preventScroll: true });
    }
  } else {
    if (document.activeElement === lastFocusableElement) {
      preventDefaultAndPropagation();
      firstFocusableElement.focus({ preventScroll: true });
    }
  }
};

export const getAllFocusableElements = (container: globalThis.Element) => {
  const allFocusableElements = focusableNativeElements + ',' + focusableCustomElements;
  const focusableElements = Array.from(container.querySelectorAll(allFocusableElements));
  return focusableElements;
};

export const focusFirstFocusableElement = (
  container: globalThis.Element,
  options?: FocusOptions,
) => {
  const allFocusableElements = focusableNativeElements + ',' + focusableCustomElements;
  const focusableElements = Array.from(container.querySelectorAll(allFocusableElements));

  const firstFocusableElement = focusableElements[0] as globalThis.HTMLElement;

  if (firstFocusableElement) {
    firstFocusableElement.focus({ preventScroll: true, ...(options || {}) });
  }
};

export const getSafeAreaTriangle = (
  placement: Placement,
  popover: globalThis.Element,
  mouseX: number,
  mouseY: number,
) => {
  const points: {
    A: Point;
    B: Point;
    C: Point;
  } = {
    A: {
      x: 0,
      y: 0,
    },
    B: {
      x: 0,
      y: 0,
    },
    C: {
      x: 0,
      y: 0,
    },
  };
  const popoverRect = popover.getBoundingClientRect();

  // Point C is the current mouse position
  points.C = { x: mouseX, y: mouseY };

  switch (placement) {
    case 'top':
    case 'top-start':
    case 'top-end':
      points.A = { x: popoverRect.left, y: popoverRect.bottom };
      points.B = { x: popoverRect.right, y: popoverRect.bottom };
      break;

    case 'bottom':
    case 'bottom-start':
    case 'bottom-end':
      points.A = { x: popoverRect.left, y: popoverRect.top };
      points.B = { x: popoverRect.right, y: popoverRect.top };
      break;

    case 'left':
    case 'left-start':
    case 'left-end':
      points.A = { x: popoverRect.right, y: popoverRect.top };
      points.B = { x: popoverRect.right, y: popoverRect.bottom };
      break;

    case 'right':
    case 'right-start':
    case 'right-end':
      points.A = { x: popoverRect.left, y: popoverRect.top };
      points.B = { x: popoverRect.left, y: popoverRect.bottom };
      break;

    default:
      points.A = { x: popoverRect.left, y: popoverRect.bottom };
      points.B = { x: popoverRect.right, y: popoverRect.bottom };
      break;
  }

  return [points.A, points.B, points.C];
};

export const isElementContained = (
  element: globalThis.Element | null | undefined,
  container: globalThis.Element | null | undefined,
) => {
  const isInPopover = element?.closest('br-popover-content');
  if (isInPopover) {
    return true;
  }
  if (!element || !container) {
    return false;
  }

  return (
    (container.shadowRoot && container.shadowRoot.contains(element)) || container.contains(element)
  );
};
