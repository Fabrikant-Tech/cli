import { Component, ComponentInterface, Element, Prop, State, Watch } from '@stencil/core';
import { ModifierKey } from './types/keyboard-shortcut-types';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';

// This id increments for all buttons on the page
let keyboardShortcutId = 0;

/**
 * A listener that captures Keyboard Shortcuts if any wrapped element is focused.
 * @category Utils
 * @visibility hidden
 */
@Component({
  tag: 'br-keyboard-shortcut',
})
export class KeyboardShortcut implements ComponentInterface {
  /**
   * A reference to the host and component
   */
  @Element() elm: HTMLBrKeyboardShortcutElement;
  /**
   * Stores the pressed modifiers.
   */
  @State() pressedModifiers: {
    meta: boolean;
    shift: boolean;
    control: boolean;
    alt: boolean;
    character: string | undefined;
  } = {
    meta: false,
    shift: false,
    control: false,
    alt: false,
    character: undefined,
  };
  @Watch('pressedModifiers')
  handlePressedModifiersChanged(newValue: {
    meta: boolean;
    shift: boolean;
    control: boolean;
    alt: boolean;
    character: string | undefined;
  }) {
    if (this.highlightTargets) {
      const isMetaSelected =
        !this.highlightShortcut.modifierKey ||
        (this.highlightShortcut.modifierKey
          ? this.highlightShortcut.modifierKey.map((k) => newValue[k]).length ===
            this.highlightShortcut.modifierKey.length
          : false);
      const isKeySelected =
        !this.highlightShortcut.key ||
        (this.highlightShortcut.key ? this.highlightShortcut.key === newValue.character : false);
      if (isMetaSelected && isKeySelected) {
        this.createTagsForElements();
      } else {
        const items = document.querySelectorAll(`.br-keyboard-shortcut-tag-${this.internalId}`);
        items.forEach((item) => {
          item.remove();
        });
      }
    }
  }
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string =
    `br-keyboard-shortcut-${keyboardShortcutId++}`;
  /**
   * The keyboard shortcuts to listen to.
   */
  @Prop() keyboardShortcuts: {
    key: string;
    description: string;
    onTrigger: () => void;
    preventDefault?: boolean;
    modifierKey?: ModifierKey[];
    target?: globalThis.Element | HTMLElement | string | undefined | null;
  }[];
  /**
   * Determines where the shortcuts are listened to. Self listens to the component itself, window listens to the window.
   * @category Behavior
   */
  @Prop() listenTarget: 'window' | 'self' = 'self';
  /**
   * Determines what shortcut is used to highlight the targets.
   * @category Behavior
   */
  @Prop() highlightShortcut: { key?: string; modifierKey?: ModifierKey[] } = {
    key: '/',
  };
  /**
   * Determines whether the targets of the shortcuts are highlighted.
   * @category Behavior
   */
  @Prop() highlightTargets: boolean = true;
  /**
   * Determines where the highlight is positioned relative to the target.
   * @category Appearance
   */
  @Prop() highlightPosition: ['top' | 'bottom' | undefined, 'left' | 'right' | undefined] = [
    'bottom',
    'right',
  ];
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  @Watch('theme')
  themeChanged() {
    const items = document.querySelectorAll(`.br-keyboard-shortcut-tag-${this.internalId}`);
    items.forEach((item) => {
      item.querySelectorAll('br-key').forEach((key) => {
        key.theme = this.theme;
      });
    });
  }

  componentWillLoad() {
    if (this.listenTarget === 'self') {
      this.elm.addEventListener('keydown', this.listenToKeyboardDown, { passive: false });
      this.elm.addEventListener('keyup', this.listenToKeyboardUp, { passive: false });
    } else {
      window.addEventListener('keydown', this.listenToKeyboardDown, { passive: false });
      window.addEventListener('keyup', this.listenToKeyboardUp, { passive: false });
    }
  }

  disconnectedCallback() {
    if (this.listenTarget === 'self') {
      if (this.elm) {
        this.elm.removeEventListener('keyup', this.listenToKeyboardUp);
        this.elm.removeEventListener('keydown', this.listenToKeyboardDown);
      }
    } else {
      window.removeEventListener('keyup', this.listenToKeyboardUp);
      window.removeEventListener('keydown', this.listenToKeyboardDown);
    }
  }

  private createTagsForElements = () => {
    const relevantShortcuts = this.keyboardShortcuts.filter((shortcut) => shortcut.target);
    relevantShortcuts.forEach((shortcut) => {
      const target =
        typeof shortcut.target === 'string'
          ? document.querySelector(shortcut.target)
          : shortcut.target;
      if (target) {
        this.createTagForElement({
          ...shortcut,
          target: target,
        });
      }
    });
  };

  private getSymbolForModifierKey = (key: ModifierKey) => {
    const isWindows = navigator.platform.indexOf('Win') > -1;
    switch (key) {
      case 'meta':
        return '⌘';
      case 'shift':
        return '⇧';
      case 'control':
        return isWindows ? 'ctrl' : '⌃';
      case 'alt':
        return isWindows ? 'alt' : '⌥';
    }
  };

  private createTagForElement = (shortcut: {
    key: string;
    description: string;
    onTrigger: () => void;
    preventDefault?: boolean;
    modifierKey?: ModifierKey[];
    target?: globalThis.Element | HTMLElement | undefined | null;
  }) => {
    if (shortcut.target) {
      const targetBox = shortcut.target.getBoundingClientRect();
      const left = targetBox.left;
      const right = targetBox.right;
      const top = targetBox.top;
      const bottom = targetBox.bottom;
      const width = targetBox.width;
      const height = targetBox.height;

      const tag = document.createElement('div');
      tag.id = `${shortcut.modifierKey ? shortcut.modifierKey.map((k) => this.getSymbolForModifierKey(k)).join(' + ') + ' + ' : ''}${shortcut.key}`;

      tag.classList.add(`br-keyboard-shortcut-tag-${this.internalId}`);
      tag.style.position = 'fixed';
      if (this.highlightPosition[0] === 'top') {
        tag.style.top = `${top}px`;
      } else if (this.highlightPosition[0] === 'bottom') {
        tag.style.top = `${bottom}px`;
      } else {
        tag.style.top = `${top + height / 2}px`;
      }
      if (this.highlightPosition[1] === 'left') {
        tag.style.left = `${left}px`;
      } else if (this.highlightPosition[1] === 'right') {
        tag.style.left = `${right}px`;
      } else {
        tag.style.left = `${left + width / 2}px`;
      }
      const xTransform = '-50%';
      const yTransform = '-50%';
      tag.style.transform = `translate(${xTransform}, ${yTransform})`;
      tag.style.display = 'flex';
      tag.style.flexDirection = 'row';
      tag.style.gap = 'calc(var(--size-unit))';
      tag.style.zIndex = `var(--z-index-popover)`;

      if (shortcut.modifierKey) {
        shortcut.modifierKey
          .map((k) => this.getSymbolForModifierKey(k))
          .forEach((symbol) => {
            const key = document.createElement('br-key');
            const span = document.createElement('span');
            span.textContent = symbol;
            key.classList.add('br-display-appear');
            key.theme = this.theme;
            key.textContent = symbol;
            tag.appendChild(key);
          });
      }
      if (shortcut.key) {
        const key = document.createElement('br-key');
        const span = document.createElement('span');
        span.textContent = shortcut.key;
        key.classList.add('br-display-appear');
        key.theme = this.theme;
        key.textContent = shortcut.key;
        tag.appendChild(key);
      }

      const tagExists = document.getElementById(tag.id);
      if (tagExists) {
        return;
      }
      document.body.appendChild(tag);
    }
  };

  private setKeysPressed = (event: KeyboardEvent) => {
    this.pressedModifiers = {
      meta: event.metaKey,
      shift: event.shiftKey,
      control: event.ctrlKey,
      alt: event.altKey,
      character: event.key.toLowerCase(),
    };
  };

  private listenToKeyboardUp = (event: KeyboardEvent) => {
    this.pressedModifiers = {
      meta: event.metaKey,
      shift: event.shiftKey,
      control: event.ctrlKey,
      alt: event.altKey,
      character:
        event.key.toLowerCase() === this.pressedModifiers.character
          ? undefined
          : event.key.toLowerCase(),
    };
  };

  private listenToKeyboardDown = (e: KeyboardEvent) => {
    let matchedSomething = false;
    this.setKeysPressed(e);

    [...this.keyboardShortcuts].forEach((shortcut) => {
      const modifier = shortcut.modifierKey;
      if (modifier && !matchedSomething) {
        const pressedModifierArray = Object.entries(this.pressedModifiers)
          .filter((entry) => {
            return entry[1];
          })
          .map((entry) => entry[0]);

        if (Array.isArray(modifier)) {
          if (
            modifier.filter((m) => !pressedModifierArray.includes(m.toLowerCase())).length === 0 &&
            e.key.toLowerCase() === shortcut.key
          ) {
            if (shortcut.preventDefault) {
              e.preventDefault();
            }
            shortcut.onTrigger();
            matchedSomething = true;
          }
        } else {
          if (e.key.toLowerCase() === shortcut.key && !matchedSomething) {
            if (shortcut.preventDefault) {
              e.preventDefault();
            }
            shortcut.onTrigger();
            matchedSomething = true;
          }
        }
      }
    });
  };
}
