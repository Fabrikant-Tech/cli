import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  h,
} from '@stencil/core';
import { ColorType, FillStyle, Shape, Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import { BaseColorNameType } from '../../reserved/editor-types';
/**
 * The Color Eye Dropper component allows the user to select a color from the screen using the browser's native eye dropper tool.
 * @category Display
 */
@Component({
  tag: 'br-color-eye-dropper',
  styleUrl: 'css/color-eye-dropper.css',
  shadow: true,
})
export class ColorEyeDropper implements ComponentInterface {
  /**
   * A reference to the element and host.
   */
  @Element() elm: HTMLBrColorEyeDropperElement;
  /**
   * Tracks whether the browser supports picking.
   */
  @State() supported: boolean = false;
  /**
   * The avatar content as a first last name, url or single string.
   */
  @Prop() content?: `${string} ${string}` | `url(${string})`;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Defines the shape style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 2
   */
  @Prop({ reflect: true }) shape: Exclude<Shape, 'Circular'> = 'Rectangular';
  /**
   * Defines the semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 4
   */
  @Prop({ reflect: true }) colorType: BaseColorNameType<ColorType, 'Black' | 'White'> = 'Primary';
  /**
   * Defines the fill style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) fillStyle: FillStyle = 'Solid';
  /**
   * Determines if the component is displayed in its disabled state.
   * @category State
   */
  @Prop() disabled?: boolean;
  /**
   * Emits when the hex and RGB color code change.
   */
  @Event() pick: EventEmitter<{ sRGBHex: string }>;

  componentWillLoad(): Promise<void> | void {
    const supported =
      typeof window !== 'undefined' &&
      !navigator.userAgent.includes('OPR') &&
      'EyeDropper' in window;
    this.supported = supported;
  }

  private handleClick = () => {
    if (this.supported) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eyeDropper = new (window as any).EyeDropper();
      return (
        eyeDropper
          .open()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((payload: any) => {
            this.pick.emit(payload);
          })
          .catch(() => {})
      );
    }
  };
  render() {
    if (!this.supported) {
      return null;
    }
    return (
      <Host>
        <br-button
          theme={this.theme}
          disabled={this.disabled}
          size={this.size}
          shape={this.shape}
          fillStyle={this.fillStyle}
          colorType={this.colorType}
          onClick={this.handleClick}
        >
          <br-icon iconName="ColorPicker" slot="left-icon"></br-icon>
        </br-button>
      </Host>
    );
  }
}
