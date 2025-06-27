import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { ShortAnimationDuration } from '../../global/types/roll-ups';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { focusFirstFocusableElement, trapFocus, deepQuerySelectorAll } from '../../utils/utils';
import { isEmpty } from 'lodash-es';
import { DebugMode } from '../debug/types/utils';

// This id increments for all buttons on the page
let dialogId = 0;

/**
 * The Dialog component displays content relative to a target when a particular action occurs.
 * @category Overlays & Modals
 * @slot - Passes content to the Dialog.
 * @slot target - Passes the target element of the Dialog.
 */
@Component({
  tag: 'br-dialog',
  styleUrl: './css/dialog.css',
  shadow: true,
})
export class Dialog {
  /**
   * An internal reference to the target.
   */
  private target: Element | null;
  /**
   * An internal reference to the content wrapper.
   */
  private contentWrapper: HTMLDivElement | undefined;
  /**
   * An internal reference to the dialog content component.
   */
  private content: Element | null;
  /**
   * An internal reference to whether the dialog is controlled.
   */
  private isControlled: boolean = false;
  /**
   * Stores whether the dialog is the root.
   */
  @State() isRootDialog: boolean;
  /**
   * Whether this popover has open popovers.
   */
  @State() hasDialogOpenImmediatelyInside: HTMLBrDialogElement | null;
  /**
   * Store the maximum of value of any dialog stack index on screen.
   */
  @State() maxDialogStackIndex: number | undefined;
  @Watch('maxDialogStackIndex')
  handleMaxDialogStackIndexChange() {
    const minStackindex = this.getMinDialogStackIndex();
    this.isRootDialog = minStackindex === Number(this.elm.dataset.stackIndex);
    if (this.content) {
      (this.content as HTMLBrDialogContentElement).root = this.isRootDialog;
    }
  }
  /**
   * State for the hover state.
   */
  @State() isHovered: boolean;
  /**
   * State for whether the dialog has already opened.
   */
  @State() hasOpened: boolean;
  @Watch('hasOpened')
  handleHasOpenedChange(newValue: boolean) {
    if (newValue) {
      document.body.addEventListener('click', this.handleBodyClick);
      document.body.addEventListener('keydown', this.handleBodyKeyDown);
      setTimeout(() => {
        if (this.contentWrapper && this.focusContentOnOpen) {
          focusFirstFocusableElement(this.contentWrapper);
        }
      }, ShortAnimationDuration);
    }
  }
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrDialogElement;
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-dialog-${dialogId++}`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines whether the component closes when a click happens outside of it.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() shouldCloseOnClickOutside: boolean = true;
  /**
   * Determines whether the component closes when ESC is pressed.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() shouldCloseOnESCKey: boolean = true;
  /**
   * Determines whether the component is open.
   * @category State
   * @visibility persistent
   */
  @Prop({ reflect: true, mutable: true }) isOpen?: boolean;
  @Watch('isOpen')
  handleIsOpenChange(newValue: boolean, oldValue: boolean) {
    if (newValue !== oldValue) {
      if (!this.isControlled) {
        if (newValue) {
          document.body.addEventListener('click', this.handleBodyClick);
          document.body.addEventListener('keydown', this.handleBodyKeyDown);
          setTimeout(() => {
            if (this.contentWrapper && this.focusContentOnOpen) {
              focusFirstFocusableElement(this.contentWrapper);
            }
          }, ShortAnimationDuration);
        }
      }
      if (!newValue) {
        document.body.removeEventListener('click', this.handleBodyClick);
        document.body.removeEventListener('keydown', this.handleBodyKeyDown);
      }
      if (this.isControlled) {
        this.setStackIndex();
        if (newValue) {
          this.openOrUpdateDialog();
        } else {
          this.closeDialog();
        }
      }
    }
  }
  /**
   * Determines where the component is rendered when opened.
   * @category Behavior
   */
  @Prop({ reflect: true }) portalDestination?: globalThis.Element | 'inline' | 'root' = 'root';
  /**
   * Determines the strategy for positioning the component.
   * @category Behavior
   */
  @Prop({ reflect: true }) strategy?: 'absolute' | 'fixed' = 'absolute';
  /**
   * Determines whether the component traps focus.
   * @category Behavior
   */
  @Prop() trapFocus?: boolean = true;
  /**
   * Determines whether the component focuses the target when it closes.
   * @category Behavior
   */
  @Prop() focusTargetOnClose?: boolean = true;
  /**
   * Determines whether the component focuses the content when it opens.
   * @category Behavior
   */
  @Prop() focusContentOnOpen?: boolean = true;
  /**
   * Defines a classname to be applied to the content.
   * @category Behavior
   */
  @Prop() contentClassname?: string;
  /**
   * Determines if other open components of the same type should close when this component closes.
   * @category Behavior
   */
  @Prop() closesOtherDialogs?: boolean;
  /**
   * Event that emits when the dialog opens.
   */
  @Event() open!: EventEmitter<void>;
  /**
   * Event that emits when the dialog closes.
   */
  @Event() close!: EventEmitter<void>;
  /**
   * A method to open the dialog.
   */
  @Method()
  async openElement(): Promise<void> {
    if (this.target) {
      return;
    }
    this.openOrUpdateDialog();
  }
  /**
   * A method to close the dialog.
   */
  @Method()
  async closeElement(): Promise<void> {
    this.closeDialog();
  }
  /**
   * A method to update the maxStackIndex externally.
   */
  @Method()
  async setInternalMaxDialogStackIndex(value: number | undefined): Promise<void> {
    this.maxDialogStackIndex = value;
  }

  private internalGetBoundingClientRect() {
    return this.contentWrapper?.getBoundingClientRect();
  }

  componentWillLoad() {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
    window.addEventListener('popstate', this.cleanupPopstate);
    this.isControlled = this.isOpen !== undefined;
    if (this.isControlled && DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
      console.error(`WARNING - This dialog is in controlled mode.`, this.elm);
    }
    this.updateTargetReference();
  }

  componentDidLoad() {
    if (this.isControlled && this.isOpen) {
      document.body.addEventListener('click', this.handleBodyClick);
      document.body.addEventListener('keydown', this.handleBodyKeyDown);
      this.setStackIndex();
      this.openOrUpdateDialog();
    }
  }

  disconnectedCallback() {
    if (this.isOpen) {
      this.cleanupPopstate();
    }
    if (this.target instanceof globalThis.Element) {
      this.target?.removeEventListener('click', () => this.handleTargetClick());
    }
  }

  private getMinDialogStackIndex = () => {
    const dialogStackIndexElement = deepQuerySelectorAll('br-dialog[data-stack-index]');
    const dialogElements = dialogStackIndexElement.length > 0 ? dialogStackIndexElement : undefined;
    const dialogIndexes = dialogElements
      ? dialogElements.map((e) => Number((e as HTMLElement).dataset.stackIndex))
      : [0];
    return Math.min(...dialogIndexes);
  };

  private setMaxDialogStackIndex = () => {
    const dialogStackIndexElement = deepQuerySelectorAll('br-dialog[data-stack-index]');
    const dialogElements = dialogStackIndexElement.length > 0 ? dialogStackIndexElement : undefined;
    const dialogIndexes = dialogElements
      ? dialogElements.map((e) => Number((e as HTMLElement).dataset.stackIndex))
      : [0];
    this.maxDialogStackIndex = Math.max(...dialogIndexes);
    dialogElements?.forEach((dialog) => {
      if (dialog !== this.elm) {
        (dialog as HTMLBrDialogElement).setInternalMaxDialogStackIndex(this.maxDialogStackIndex);
      }
    });
  };

  // A function that tracks the order in which the dialogs have opened to determine the closing order
  private setStackIndex = () => {
    const stackIndexElement = deepQuerySelectorAll('*[data-stack-index]');
    const elements = stackIndexElement.length > 0 ? stackIndexElement : undefined;
    const indexes = elements
      ? elements.map((e) => Number((e as HTMLElement).dataset.stackIndex))
      : [-1];

    const maxIndex = Math.max(...indexes);

    if (this.contentWrapper) {
      this.elm.dataset.stackIndex = (maxIndex + 1).toString();
    }
  };

  // A function that resets the dialog's stack index
  private resetStackIndex = () => {
    if (this.contentWrapper) {
      delete this.elm.dataset.stackIndex;
      this.setMaxDialogStackIndex();
    }
  };

  // Uses autoupdate to recalculate the position
  private autoUpdatePosition = () => {
    if (this.contentWrapper) {
      if (this.contentWrapper) {
        Object.assign(this.contentWrapper.style, {
          width: 'max-content',
          display: 'block',
        });
        // Do on next tick to avoid flicker
        setTimeout(() => {
          if (!this.hasOpened) {
            this.hasOpened = true;
            this.open.emit();
            this.setMaxDialogStackIndex();
          }
          Object.assign(this.contentWrapper!.style, {
            visibility: 'visible',
          });
        }, 0);
      }
    }
  };

  private closeOtherDialogs = () => {
    const dialogs = deepQuerySelectorAll('br-dialog');
    this.setMaxDialogStackIndex();
    dialogs.forEach((dialog: HTMLBrDialogElement) => {
      if (dialog.internalId !== this.elm.internalId) {
        dialog.closeElement();
      }
    });
  };

  // Handles moving the dialog content to the root or another specified portal destination
  private openOrUpdateDialog = () => {
    if (this.contentWrapper && this.content) {
      if (!this.isControlled || (this.isControlled && this.isOpen)) {
        if (this.portalDestination === 'inline') {
          this.content.classList.add('br-dialog-content-inline');
        }
        if (this.portalDestination && this.portalDestination !== 'inline') {
          const targetRoot =
            this.portalDestination === 'root' ? document.body : this.portalDestination;
          if (!targetRoot.contains(this.contentWrapper)) {
            targetRoot.append(this.contentWrapper);
            this.contentWrapper.append(this.content);
          }
        }
        this.autoUpdatePosition();
        if (!this.isOpen) {
          this.isOpen = true;
          this.setMaxDialogStackIndex();
          if (this.closesOtherDialogs) {
            this.closeOtherDialogs();
          }
        }
      }
      if (this.isControlled) {
        this.open.emit();
        this.setMaxDialogStackIndex();
        if (this.closesOtherDialogs) {
          this.closeOtherDialogs();
        }
      }
    }
  };

  // Moves the dialog content back to the original dialog root
  private closeDialog = () => {
    if (this.contentWrapper && this.content) {
      if (!this.isControlled || (this.isControlled && !this.isOpen)) {
        if (this.portalDestination !== 'inline') {
          if (!this.elm.shadowRoot?.contains(this.contentWrapper)) {
            this.elm.shadowRoot?.append(this.contentWrapper);
            this.elm.append(this.content);
          }
        }
        this.resetStackIndex();
        Object.assign(this.contentWrapper!.style, {
          display: 'none',
          visibility: 'hidden',
        });
        if (this.isOpen) {
          this.isOpen = false;
          this.close.emit();
          this.hasOpened = false;
          if (this.focusTargetOnClose && this.target instanceof globalThis.HTMLElement) {
            this.target.focus({ preventScroll: true });
          }
        }
      }
    }
    if (this.isControlled) {
      if (this.isOpen) {
        this.close.emit();
      }
      this.hasOpened = false;
      if (this.focusTargetOnClose && this.target instanceof globalThis.HTMLElement) {
        this.target.focus({ preventScroll: true });
      }
    }
  };

  // When the target is clicked update the stack index and open or close the dialog
  private handleTargetClick = () => {
    this.setStackIndex();

    if (!this.isOpen) {
      this.openOrUpdateDialog();
    } else {
      this.closeDialog();
    }
  };

  // Determines if the dialog should be closed after a certain interaction
  private maybeCloseDialog = (
    e: globalThis.KeyboardEvent | globalThis.MouseEvent,
    skipContainedFork?: boolean,
  ) => {
    const target = e.target;
    const currentTarget = e.currentTarget;
    const path = e.composedPath();
    const pathTarget = path.filter((n) => (n as globalThis.Element).slot === 'target');
    const isOverlay = (e.target as globalThis.Element)?.classList.contains('br-dialog-overlay');
    const isContained =
      (target && this.contentWrapper?.contains(target as globalThis.Element)) ||
      (currentTarget && this.contentWrapper?.contains(target as globalThis.Element)) ||
      (!isEmpty(pathTarget) && this.elm.contains(pathTarget[0] as globalThis.Element));

    if (
      !isOverlay &&
      ((isContained && !skipContainedFork) || this.hasDialogOpenImmediatelyInside)
    ) {
      return;
    }

    // Include dialog shadow root elements
    const stackIndexElement = deepQuerySelectorAll('*[data-stack-index]');
    const elements = stackIndexElement;
    const indexes = elements.map((e) => Number((e as HTMLElement).dataset.stackIndex));
    const maxIndex = Math.max(...indexes);

    if (maxIndex.toString() === this.elm.dataset.stackIndex) {
      this.closeDialog();
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
  };

  // Check if the dialog should be closed when ESC is pressed
  private handleBodyKeyDown = (e: globalThis.KeyboardEvent) => {
    if (this.shouldCloseOnESCKey) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.maybeCloseDialog(e, true);
      }
    }
  };

  // Check if the dialog should be closed when the body of the document is clicked
  private handleBodyClick = (e: globalThis.MouseEvent) => {
    if (
      this.shouldCloseOnClickOutside &&
      !this.elm.contains(e.target as globalThis.Element) &&
      (!this.target || (this.target && this.target !== e.target)) &&
      !this.content?.contains(e.target as globalThis.Element)
    ) {
      this.maybeCloseDialog(e);
    }
  };

  // Cleans up and closes the dialog when the popstate event fires
  private cleanupPopstate() {
    this.isControlled = false;
    this.isOpen = undefined;
    this.closeDialog();
  }

  // Updates the target reference when the target element changes and on load
  private updateTargetReference = (t?: globalThis.Element) => {
    const target = t || this.elm.querySelector(':scope > *[slot="target"]');
    this.target = target;
    const contents = this.elm.querySelector('br-dialog-content');
    this.content = contents;
    if (this.target instanceof globalThis.Element) {
      this.target.addEventListener('click', this.handleTargetClick);
    }
  };

  private getMaxIndexDialogHeight = () => {
    const index = this.maxDialogStackIndex;
    const element = document.querySelector(`br-dialog[data-stack-index="${index}"]`);
    const id = element?.getAttribute('internal-id');
    const dialogContent = document.querySelector(`*[data-parent-dialog-id="${id}"]`);
    const height = dialogContent?.clientHeight;
    return height;
  };

  private handleOverlayClick = (e: globalThis.MouseEvent) => {
    if (this.shouldCloseOnClickOutside) {
      this.maybeCloseDialog(e);
    }
  };

  render() {
    const isTopDialog =
      !this.maxDialogStackIndex ||
      (this.maxDialogStackIndex && Number(this.elm.dataset.stackIndex) >= this.maxDialogStackIndex);
    const calculatedModifier = (modifier: number) =>
      this.maxDialogStackIndex && Number(this.elm.dataset.stackIndex) < this.maxDialogStackIndex
        ? 1 - (this.maxDialogStackIndex - Number(this.elm.dataset.stackIndex)) * modifier
        : 1;
    const calculatedTransformModifier = (modifier: number) =>
      this.maxDialogStackIndex && Number(this.elm.dataset.stackIndex) < this.maxDialogStackIndex
        ? (this.maxDialogStackIndex - Number(this.elm.dataset.stackIndex)) * modifier
        : 1;
    return (
      <Host>
        <div
          data-parent-dialog-id={this.internalId}
          ref={(ref) => (this.contentWrapper = ref)}
          class={{
            'br-dialog-content-wrapper-open': this.isOpen === true,
            'br-dialog-content-wrapper': true,
            'br-theme-dark': this.theme === 'Dark',
            [`${this.contentClassname}`]: this.contentClassname !== undefined,
          }}
          onKeyDown={(e) => {
            if (this.contentWrapper && this.trapFocus && isTopDialog) {
              trapFocus(this.contentWrapper, e);
            }
          }}
          style={{
            position: this.strategy,
            width: 'max-content',
            pointerEvents: 'none',
            display: 'none',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%)`,
            visibility: 'hidden',
            zIndex: 'var(--z-index-modals)',
            transition: 'var(--transition-default)',
          }}
          {...{
            onMouseOver: () => {
              this.isHovered = true;
            },
            onMouseLeave: () => {
              this.isHovered = false;
            },
            onOpen: (e: CustomEvent) => {
              this.hasDialogOpenImmediatelyInside = e.target as HTMLBrDialogElement;
            },
            onClose: (e: CustomEvent) => {
              const target = e.target as HTMLBrDialogElement;
              if (this.elm !== target) {
                if (this.hasDialogOpenImmediatelyInside === target) {
                  this.hasDialogOpenImmediatelyInside = null;
                }
              }
            },
          }}
        >
          {!this.isOpen && (
            <style>{`*[data-parent-dialog-id="${this.internalId}"] > br-dialog-content { 
                opacity: 1;
                transform: translateY(5%);
            }`}</style>
          )}
          {!isTopDialog && this.isOpen && (
            <style>{`*[data-parent-dialog-id="${this.internalId}"] > br-dialog-content { 
                opacity: ${calculatedModifier(0.2)};
                scale: ${calculatedModifier(0.05)};
                filter: brightness(${calculatedModifier(0.1)});
                height: ${this.getMaxIndexDialogHeight()}px;
                transition: transform var(--transition-short-duration) linear, opacity var(--transition-short-duration) linear, scale var(--transition-short-duration) linear;
                transform: translateY(-${10 * calculatedTransformModifier(1) * (1 / calculatedModifier(0.05))}px);
            }`}</style>
          )}
          <slot></slot>
          {this.isRootDialog && (
            <div
              class="br-dialog-overlay"
              style={{
                width: '100vw',
                height: '100vh',
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                top: '50%',
                left: '50%',
                backgroundColor: 'color-mix(in srgb, var(--color-black) 90%, transparent)',
                pointerEvents: isTopDialog ? 'auto' : 'none',
                zIndex: '0',
              }}
              onClick={this.handleOverlayClick}
            />
          )}
        </div>
        <div class="br-dialog-target-wrapper">
          <slot onSlotchange={() => this.updateTargetReference()} name="target"></slot>
        </div>
      </Host>
    );
  }
}
