import { h, Component, Prop, State, Element } from '@stencil/core';
import { Size, Theme } from '../../../generated/types/types';
import { ThemeDefault } from '../../../generated/types/variables';
import { BaseComponentIdType } from '../../../reserved/editor-types';

/**
 * The field label is used to display the label in the field element.
 * @unreleased
 * @category Inputs & Forms
 * @slot - A slot to pass the label content to the field label element.
 * @slot decorator - A slot to pass custom content after the label.
 * @slot required-decorator - A slot to pass custom content to the required decorator.
 */
@Component({
  tag: 'br-field-label',
  styleUrl: './css/field-label.css',
  shadow: true,
})
export class FieldLabel {
  /**
   * A reference to the input that is associated with the label.
   */
  private inputRef:
    | HTMLBrButtonElement
    | HTMLBrCheckboxElement
    | HTMLBrColorInputElement
    | HTMLBrComboSelectElement
    | HTMLBrDateInputElement
    | HTMLBrDatePickerElement
    | HTMLBrFileInputElement
    | HTMLBrFileUploadElement
    | HTMLBrInputElement
    | HTMLBrMultiSelectElement
    | HTMLBrNumericInputElement
    | HTMLBrRadioElement
    | HTMLBrSelectListElement
    | HTMLBrSingleSelectElement
    | HTMLBrSliderElement
    | HTMLBrSwitchElement
    | HTMLBrTagInputElement
    | HTMLTextAreaElement
    | HTMLBrTimeInputElement
    | HTMLBrTimePickerElement
    | HTMLBrTreeElement
    | null;
  /**
   * An observer that tracks changes to the associated input attributes.
   */
  private mutationObserver: MutationObserver;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrFieldLabelElement;
  /**
   * Show required display.
   */
  @State() showRequiredDisplay: boolean | undefined;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines the id of the input that the component is associated with.
   * @category Data
   */
  @Prop() associatedInputId: BaseComponentIdType<
    | HTMLBrInputElement
    | HTMLBrButtonElement
    | HTMLBrCheckboxElement
    | HTMLBrColorInputElement
    | HTMLBrComboSelectElement
    | HTMLBrDateInputElement
    | HTMLBrDatePickerElement
    | HTMLBrFileInputElement
    | HTMLBrFileUploadElement
    | HTMLBrInputElement
    | HTMLBrMultiSelectElement
    | HTMLBrNumericInputElement
    | HTMLBrRadioElement
    | HTMLBrSelectListElement
    | HTMLBrSingleSelectElement
    | HTMLBrSliderElement
    | HTMLBrSwitchElement
    | HTMLBrTagInputElement
    | HTMLTextAreaElement
    | HTMLBrTimeInputElement
    | HTMLBrTimePickerElement
    | HTMLBrTreeElement,
    string
  >;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Exclude<Size, 'Xsmall'> = 'Normal';
  /**
   * Defines if the required affordance is displayed and if yes how.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) requiredDisplay: 'required' | 'optional' | false = 'required';

  componentWillLoad() {
    this.mutationObserver = new MutationObserver(this.resolveObservers);
    const parentField = this.elm?.closest('br-field');
    const alternativeElement = parentField?.querySelector('*:not(br-field-label)');
    const associatedId = this.associatedInputId;
    const associatedIdToUse = typeof associatedId === 'string' ? associatedId : associatedId?.id;
    this.inputRef = this.associatedInputId
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document.body.querySelector(`*[id="${associatedIdToUse}"]`) as any)
      : alternativeElement;
    this.resolveObservers();
  }

  componentDidLoad() {
    if (this.inputRef) {
      this.mutationObserver.observe(this.inputRef, { childList: true, attributes: true });
    }
  }

  disconnectedCallback() {
    this.mutationObserver?.disconnect();
  }

  private resolveObservers = () => {
    if (this.inputRef) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input = this.inputRef as any;
      this.showRequiredDisplay =
        this.requiredDisplay === 'required'
          ? input.required
          : !input.required && this.requiredDisplay !== false;
    }
  };

  private renderRequiredOrOptionalSymbol = () => {
    return (
      <div class="br-required-display">
        <slot name="required-decorator">
          {this.requiredDisplay === 'optional' && (
            <br-tag theme={this.theme} fillStyle="Ghost" color-type="Neutral" size="Small">
              <span>optional</span>
            </br-tag>
          )}
          {this.requiredDisplay === 'required' && (
            <br-icon class="br-required-display-asterisk" iconName="Asterisk" color="Destructive" />
          )}
        </slot>
      </div>
    );
  };

  render() {
    const associatedId = this.associatedInputId;
    const associatedIdToUse = typeof associatedId === 'string' ? associatedId : associatedId?.id;
    return (
      <label
        onClick={() => {
          const input = this.inputRef;
          if (input) {
            const castInput = input as globalThis.HTMLElement;
            const isFile = castInput.tagName.includes('FILE');
            const isCheckable =
              castInput.tagName.includes('CHECKBOX') ||
              castInput.tagName.includes('RADIO') ||
              castInput.tagName.includes('SWITCH');
            if (isFile) {
              return castInput.click();
            }
            if (isCheckable) {
              castInput.shadowRoot?.querySelector('input')?.click();
              return castInput.shadowRoot?.querySelector('input')?.focus({ preventScroll: true });
            }
            return castInput.focus({ preventScroll: true });
          }
        }}
        htmlFor={associatedIdToUse}
      >
        <slot></slot>
        {this.showRequiredDisplay && this.renderRequiredOrOptionalSymbol()}
        <slot name="decorator"></slot>
      </label>
    );
  }
}
