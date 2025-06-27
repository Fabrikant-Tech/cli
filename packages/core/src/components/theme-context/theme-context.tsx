import { debounce, isEqual } from 'lodash-es';
import {
  Component,
  ComponentInterface,
  Element,
  Prop,
  Event,
  EventEmitter,
  State,
  Watch,
} from '@stencil/core';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { allCustomElements } from '../../utils/utils';

/**
 * The Theme Context component applies a light or dark mode theme to all child elements.
 * @category Layout
 * @slot - Passes the child elements that the theme applies to.
 */
@Component({
  tag: 'br-theme-context',
  styleUrl: './css/theme-context.css',
})
export class ThemeContext implements ComponentInterface {
  private childrenMutationObserver: MutationObserver;

  @Element() elm: HTMLBrThemeContextElement;

  @State() mutationCount: number;
  @Watch('mutationCount')
  emitStartMaybe(_newValue: number, oldValue: number) {
    if (oldValue === undefined) {
      this.themeChangeStart.emit();
    }
  }
  @State() currentMutationCount: number | undefined;
  @Watch('currentMutationCount')
  emitEndedMaybe() {
    this.checkMutations();
  }
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  @Watch('theme')
  apply(newValue: Theme) {
    this.currentMutationCount = undefined;
    this.applyThemeToChildren();
    this.applyClassToContext(newValue);
  }
  /**
   * Determines whether the component displays a background.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) showBackground: boolean = true;
  /**
   * Emits when elements have started to take the theme.
   */
  @Event() themeChangeStart: EventEmitter<void>;
  /**
   * Emits when all elements have taken the theme. Can be used to support loading screens.
   */
  @Event() themeChange: EventEmitter<void>;

  connectedCallback(): void | Promise<void> {
    this.childrenMutationObserver = new MutationObserver(this.applyTheme);
    this.childrenMutationObserver.observe(this.elm, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    this.applyClassToContext(this.theme);
    this.applyThemeToChildren();
    if (
      this.elm.parentElement?.nodeName.toLowerCase() === 'br-theme-context' ||
      this.elm.parentElement?.closest('br-theme-context')
    ) {
      this.elm.classList.add('br-theme-nested');
    }
  }

  private checkMutations = debounce(() => {
    if (this.currentMutationCount === this.mutationCount) {
      this.themeChange.emit();
    }
  }, 300);

  private applyClassToContext = (theme: string) => {
    const updatedThemeClassName = `br-theme-${theme}`.toLowerCase();
    const existingThemeClassNames = Array.from(this.elm.classList).filter(
      (className) => className.startsWith('br-theme-') && className !== updatedThemeClassName,
    );

    existingThemeClassNames.forEach((className) => {
      this.elm.classList.remove(className);
    });
    this.elm.classList.add(updatedThemeClassName);
  };

  private applyThemeToChildren = () => {
    const children: HTMLElement[] = Array.from(
      this.elm.querySelectorAll(
        allCustomElements.filter((s) => s !== 'br-theme-context').join(','),
      ),
    );
    children.forEach((elm) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const element = elm as any;
      const checkIfSameContext = elm.closest('br-theme-context');
      if (isEqual(checkIfSameContext, this.elm)) {
        element.theme = this.theme;
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyTheme = (mutations: any) => {
    const children: HTMLElement[] = Array.from(
      this.elm.querySelectorAll(
        allCustomElements.filter((s) => s !== 'br-theme-context').join(','),
      ),
    );
    this.mutationCount = mutations.length;
    children.forEach((elm, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const element = elm as any;
      const checkIfSameContext = elm.closest('br-theme-context');
      if (isEqual(checkIfSameContext, this.elm)) {
        if (this.theme !== ThemeDefault && element.theme !== this.theme) {
          element.theme = this.theme;
        }
        if (i === children.length - 1) {
          this.currentMutationCount = mutations.length;
        }
      }
    });
  };

  render() {
    this.applyClassToContext(this.theme);
  }
}
