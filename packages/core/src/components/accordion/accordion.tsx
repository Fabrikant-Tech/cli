import {
  Component,
  Host,
  h,
  Prop,
  ComponentInterface,
  Method,
  Element,
  Watch,
  Event,
  EventEmitter,
} from '@stencil/core';
import { BaseSize, BaseSizes } from '../../reserved/editor-types';

/**
 * The Accordion is an interactive component that enables a user to toggle between hiding and displaying a piece of short form content.
 * @category Layout
 * @slot - Passes content to the Accordion.
 */
@Component({
  tag: 'br-accordion',
  styleUrl: './css/accordion.css',
  shadow: true,
})
export class Accordion implements ComponentInterface {
  /**
   * A reference of the inner content wrapper.
   */
  private innerRef: HTMLDivElement | undefined;
  /**
   * A resize observer to watch for changes in the inner content.
   */
  private resizeObserver: ResizeObserver;
  /**
   * A mutation observer to watch for changes in the inner content.
   */
  private mutationObserver: MutationObserver;
  /**
   * An internal reference to the accordion.
   */
  @Element() elm: HTMLBrAccordionElement;
  /**
   * Determines if the component is open.
   * @category State
   * @visibility persistent
   */
  @Prop({ mutable: true, reflect: true }) isOpen: boolean = false;
  @Watch('isOpen')
  openStateChange(newValue: boolean, oldValue: boolean) {
    if (newValue !== oldValue) {
      return newValue ? this.openElement() : this.closeElement();
    }
  }
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes> = '100%';
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Whether the element should animate or not.
   * @category Appearance
   */
  @Prop({ reflect: true }) animated?: boolean = true;
  /**
   * Emits when the Accordion opens.
   */
  @Event() open: EventEmitter<void>;
  /**
   * Emits when the Accordion closes.
   */
  @Event() close: EventEmitter<void>;
  /**
   * Opens the Accordion.
   */
  @Method()
  async openElement(): Promise<void> {
    this.elm.style.removeProperty('overflow');
    if (this.innerRef) {
      this.innerRef.style.display = 'block';
    }
    return new Promise((resolve) => {
      this.setState(true, undefined);
      resolve();
    });
  }
  /**
   * Closes the Accordion.
   */
  @Method()
  async closeElement(): Promise<void> {
    this.elm.style.overflow = 'hidden';
    if (this.innerRef) {
      this.innerRef.style.display = 'block';
    }
    this.elm.style.height = (this.innerRef?.offsetHeight || 0) + 'px';

    return new Promise((resolve) => {
      this.setState(false, 0);
      resolve();
    });
  }
  /**
   * Toggles the Accordion open state.
   */
  @Method()
  async toggleElement(): Promise<void> {
    return !this.isOpen ? this.openElement() : this.closeElement();
  }

  componentWillLoad(): void | Promise<void> {
    this.resizeObserver = new ResizeObserver(this.resolveObservers);
    this.mutationObserver = new MutationObserver(this.resolveObservers);

    if (this.isOpen) {
      this.openElement();
    }
  }

  componentDidLoad(): void {
    if (!this.innerRef) {
      return;
    }

    this.resizeObserver.observe(this.innerRef);
    this.mutationObserver.observe(this.innerRef, { childList: true, subtree: true });
  }

  private resolveObservers = () => {
    if (this.isOpen) {
      this.setState(this.isOpen, undefined);
    }
  };

  private resolveContentTransition = (e: TransitionEvent) => {
    const target = e.target;
    const property = e.propertyName;
    if (target === this.elm && property === 'height') {
      this.innerRef?.style.removeProperty('height');

      if (!this.isOpen) {
        if (this.innerRef) {
          this.innerRef.style.display = 'none';
        }
        this.close.emit();
      } else {
        this.elm.style.overflow = 'visible';
        this.open.emit();
      }
    }
  };

  private setState = (isOpen: boolean, height?: number) => {
    this.isOpen = isOpen;
    const innerRefHeight = this.innerRef?.offsetHeight || 0;
    const heightToAdd = height !== undefined ? height : innerRefHeight;
    this.elm.style.height = heightToAdd + 'px';
  };

  render() {
    return (
      <Host
        onTransitionEnd={(e: TransitionEvent) => this.resolveContentTransition(e)}
        style={{
          width: this.width,
        }}
      >
        <div ref={(ref) => (this.innerRef = ref)} class="br-accordion-content">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
