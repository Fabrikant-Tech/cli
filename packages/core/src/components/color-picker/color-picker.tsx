import {
  Component,
  Host,
  h,
  ComponentInterface,
  Prop,
  Element,
  Watch,
  State,
  Event,
  EventEmitter,
  Fragment,
} from '@stencil/core';
import { isEqual } from 'lodash-es';
import chroma from 'chroma-js';
import { ColorChangeContent } from './types/color-picker-types';
import {
  incrementHex,
  determineColorSpace,
  emitChange,
  getRoundedHSL,
  getValueBasedOnColorSpace,
} from './utils/utils';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
import {
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseOpacityModel,
  BaseRgbaColor,
  BaseRgbColor,
  BaseSize,
  BaseSizes,
} from '../../reserved/editor-types';

/**
 * The Color Picker is an interactive component that enables users to select a color from a gradient panel.
 * @category Inputs & Forms
 */
@Component({
  tag: 'br-color-picker',
  styleUrl: './css/color-picker.css',
  shadow: true,
})
export class ColorPicker implements ComponentInterface {
  /**
   * A resize observer
   */
  private resizeObserver: ResizeObserver;
  /**
   * A reference to the canvas element that render the colors.
   */
  private colorPickerCanvas: HTMLCanvasElement | null;
  /**
   * A reference to the canvas context for the color selection.
   */
  private colorPickerContext: CanvasRenderingContext2D | null;
  /**
   * A reference to the canvas element that render the color shade.
   */
  private colorShadeCanvas: HTMLCanvasElement | null;
  /**
   * A reference to the canvas context for the color selection.
   */
  private colorShadeContext: CanvasRenderingContext2D | null;
  /**
   * A reference to the div element that renders the color opacity.
   */
  private colorOpacityCanvas: HTMLDivElement | null;
  /**
   * A reference to the shade gradient.
   */
  private horizontalGradient: CanvasGradient;
  /**
   * A reference to the element.
   */
  @Element() elm: HTMLBrColorPickerElement;
  /**
   * Tracks the currently selected hue.
   */
  @State() shadeColor: [number, number, number];
  /**
   * Tracks the x position of the slider for the color.
   */
  @State() pickerX: number = 0;
  /**
   * Tracks the y position of the slider for the color.
   */
  @State() pickerY: number = 0;
  /**
   * Tracks the shade selector position.
   */
  @State() shadeY: number = 0;
  /**
   * Tracks if the picker is being clicked.
   */
  @State() pickerDown: boolean;
  /**
   * Tracks if the shade is being clicked.
   */
  @State() shadeDown: boolean;
  /**
   * Tracks if the opacity is being clicked.
   */
  @State() opacityDown: boolean;
  /**
   * Tracks if the picker is focused and a key is down.
   */
  @State() pickerKeyDown: boolean;
  /**
   * Tracks if the shade is focused and a key is down.
   */
  @State() shadeKeyDown: boolean;
  /**
   * What color type to show the inputs for.
   */
  @State() activeColorSpace?: 'hex' | 'rgb' | 'hsl';
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the value of the component.
   * @category Data
   * @visibility persistent
   * @order 0
   */
  @Prop({ mutable: true, reflect: true }) value?:
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor;
  @Watch('value')
  valueChanged(
    newValue: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor,
    oldValue: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor,
  ) {
    if (!isEqual(newValue, oldValue)) {
      const isInternal =
        this.pickerDown || this.shadeDown || this.pickerKeyDown || this.shadeKeyDown;
      if (!isInternal) {
        this.initFromValue();
      }
      if (newValue) {
        const alpha = chroma(newValue).alpha();
        if (alpha !== 1) {
          this.opacity = alpha.toFixed(2).toString() as BaseOpacityModel;
        }
        this.activeColorSpace = determineColorSpace(newValue);
      } else {
        this.clearValue();
      }
    }
  }
  /**
   * Determines whether the component shows the opacity affordance.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) showOpacityAffordance: boolean = true;
  /**
   * Defines the opacity of the color.
   * @category Data
   */
  @Prop({ reflect: true }) opacity: BaseOpacityModel = '1';
  @Watch('opacity')
  opacityChanged(newValue: number, oldValue: number) {
    if (newValue !== oldValue) {
      emitChange(this.value, this);
    }
  }
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
  /**
   * Defines a list of preset colors to display below the component.
   * @category Data
   */
  @Prop() presets?: {
    value: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor;
    opacity?: BaseOpacityModel;
  }[];
  /**
   * Determines whether the component shows a preset with an undefined value.
   * @category Data
   * @visibility persistent
   */
  @Prop() showEmptyPreset?: boolean = false;
  /**
   * Determines whether the component shows inputs to select specific color values.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showInputAffordances?: boolean = true;
  /**
   * Defines the color spaces the component allows users to select.
   * @category Data
   * @visibility persistent
   */
  @Prop() allowedColorSpaces?: ('hex' | 'rgb' | 'hsl')[] = ['hex', 'rgb', 'hsl'];
  /**
   * Defines the default color space the component uses.
   * @category Data
   * @visibility persistent
   */
  @Prop() defaultColorSpace?: 'hex' | 'rgb' | 'hsl' = this.allowedColorSpaces
    ? this.allowedColorSpaces[0]
    : 'hex';
  /**
   * Determines whether the component shows the eye dropper and if yes where.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showEyeDropperAffordance?: boolean = true;
  /**
   * Determines whether the component shows the currently selected color preview and if yes where.
   * @category Appearance
   * @visibility persistent
   */
  @Prop() showColorPreview?: boolean = true;
  /**
   * Emits when the hex and RGB color code change.
   */
  @Event() valueChange: EventEmitter<ColorChangeContent>;

  componentWillLoad() {
    if (this.value) {
      const isValid = chroma.valid(this.value);
      if (!this.defaultColorSpace) {
        this.defaultColorSpace = determineColorSpace(this.value);
      }
      this.activeColorSpace = determineColorSpace(this.value);
      const alpha = chroma(this.value).alpha();
      if (alpha !== 1) {
        this.opacity = alpha.toFixed(2).toString() as BaseOpacityModel;
      }
      if (!isValid) {
        this.value = undefined;
      }
    }
    if (this.defaultColorSpace && !this.activeColorSpace) {
      this.activeColorSpace = this.defaultColorSpace;
    }

    setTimeout(() => {
      this.initCanvas();
      this.initFromValue();
    }, 0);
    this.resizeObserver = new ResizeObserver(this.resolveObservers);
  }

  componentDidLoad() {
    this.resizeObserver.observe(this.elm);
  }

  private resolveObservers = () => {
    this.initCanvas();
    this.initFromValue();
  };

  private selectOpacity = (position: number, rect: DOMRect) => {
    const startingLimit = rect.left;
    const endingLimit = rect.left + rect.width;
    const maxValue = rect.width;
    const negativeY = position - startingLimit < 0 ? 0 : maxValue;
    const y =
      position - startingLimit >= 0 && position <= endingLimit
        ? position - startingLimit
        : negativeY;
    this.opacity = Number((y / maxValue).toFixed(2)).toString() as BaseOpacityModel;
  };

  private selectShade = (position: number, rect: DOMRect) => {
    const startingLimit = rect.left;
    const endingLimit = rect.left + rect.width;
    const maxValue = rect.width;
    const negativeY = position - startingLimit < 0 ? 0 : maxValue;
    const y =
      position - startingLimit >= 0 && position <= endingLimit
        ? position - startingLimit
        : negativeY;
    this.shadeY = y;
    const hue: { h: number; s: number; l: number } = {
      h: Math.ceil(this.shadeY / (maxValue / 359)),
      s: 1,
      l: 0.5,
    };
    const hsl = chroma.hsl(hue.h, hue.s, hue.l).hsl();
    const newH = Math.min(359, parseInt(Math.ceil(hsl[0]).toString()));
    this.shadeColor = [newH, hsl[1], hsl[2]];
    this.createOrUpdateHorizontalGradient(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chroma.hsl(...[newH, hsl[1], hsl[2]]) as any,
    );
  };

  private initFromValue = () => {
    if (this.value) {
      const hslValue = this.value && this.value.includes('hsl(');
      const hslValueRaw = hslValue
        ? this.value
            ?.replace('hsl(', '')
            .replace(')', '')
            .replace('%', '')
            .replace('%', '')
            .split(',')
        : undefined;
      const colorFromValue = chroma(this.value).hsl();
      const backupH = colorFromValue[0] > 359 ? 359 : colorFromValue[0];

      const hToApply =
        hslValueRaw && hslValueRaw[0] !== undefined ? Number(hslValueRaw[0]) : backupH;
      const h = !isNaN(hToApply) ? hToApply : 0;

      const s = hslValueRaw ? Number(hslValueRaw[1]) / 100 : colorFromValue[1];
      const l = hslValueRaw ? Number(hslValueRaw[2]) / 100 : colorFromValue[2];

      const activeColorSpace = determineColorSpace(this.value);

      if (!this.colorPickerCanvas || !this.colorShadeCanvas) {
        return;
      }
      const rect2 = this.colorPickerCanvas.getBoundingClientRect();
      const rect = this.colorShadeCanvas.getBoundingClientRect();

      if (activeColorSpace === 'hsl') {
        this.pickerX = (rect2.width * s * 100) / 100;
        this.pickerY = (1 - (l * 100) / 100) * rect2.height;
      } else {
        const getRGBGradientCoordinates = () => {
          const newValue = chroma(`hsl(${h}, ${s * 100}%, ${l * 100}%)`).hsv();

          return { x: rect2.width * newValue[1], y: rect2.height - rect2.height * newValue[2] };
        };
        const { x, y } = getRGBGradientCoordinates();
        this.pickerX = x;
        this.pickerY = y;
      }

      const total = rect.width;
      this.shadeY = (total / 359) * h;

      const limit = rect.left;
      this.selectShade(this.shadeY + limit, rect);
    }
  };

  private initCanvas = () => {
    if (!this.elm.shadowRoot) {
      return;
    }
    this.colorPickerCanvas = this.elm.shadowRoot!.querySelector('.br-color-picker-canvas');
    const gradientContainer = this.elm.shadowRoot!.querySelector(
      '.br-color-picker-gradient',
    ) as HTMLElement;
    if (!this.colorPickerCanvas) {
      return;
    }
    this.colorPickerCanvas.width = gradientContainer.offsetWidth;
    this.colorPickerCanvas.height = gradientContainer.offsetHeight;
    this.colorPickerContext = this.colorPickerCanvas.getContext('2d');

    if (!this.colorPickerContext) {
      return;
    }
    this.createOrUpdateHorizontalGradient();
    this.colorShadeCanvas = this.elm.shadowRoot.querySelector('.br-color-picker-shade-canvas');
    const shadeContainer = this.elm.shadowRoot.querySelector(
      '.br-color-picker-shade',
    ) as HTMLElement;
    if (!this.colorShadeCanvas) {
      return;
    }
    this.colorShadeCanvas.width = shadeContainer.offsetWidth;
    this.colorShadeCanvas.height = shadeContainer.offsetHeight;
    this.colorShadeContext = this.colorShadeCanvas.getContext('2d');
    if (!this.colorShadeContext) {
      return;
    }
    const linearGradientSpecs = { x0: 0, y0: 0, x1: this.colorShadeContext.canvas.width, y1: 0 };
    const colorGradient = this.colorShadeContext.createLinearGradient(
      linearGradientSpecs.x0,
      linearGradientSpecs.y0,
      linearGradientSpecs.x1,
      linearGradientSpecs.y1,
    );
    colorGradient.addColorStop(0, '#ff0000');
    colorGradient.addColorStop(0.15, '#ffff00');
    colorGradient.addColorStop(0.33, '#00ff00');
    colorGradient.addColorStop(0.49, '#00ffff');
    colorGradient.addColorStop(0.67, '#0000ff');
    colorGradient.addColorStop(0.84, '#ff00ff');
    colorGradient.addColorStop(1, '#ff0004');
    this.colorShadeContext.fillStyle = colorGradient;
    this.colorShadeContext.fillRect(
      0,
      0,
      this.colorShadeContext.canvas.width,
      this.colorShadeContext.canvas.height,
    );
    this.colorOpacityCanvas = this.elm.shadowRoot?.querySelector('.br-color-picker-shade-opacity');
  };

  private createOrUpdateHorizontalGradient = (color?: string) => {
    if (!this.colorPickerContext) {
      return;
    }
    const colorToApply = color ? color : '#FF0004';
    const width = this.colorPickerContext.canvas.width;
    const height = this.colorPickerContext.canvas.height;
    if (this.activeColorSpace !== 'hsl') {
      this.horizontalGradient = this.colorPickerContext.createLinearGradient(0, 0, width, 0);
      this.horizontalGradient.addColorStop(0, '#fff');
      this.horizontalGradient.addColorStop(1, colorToApply);
      this.colorPickerContext.fillStyle = this.horizontalGradient;
      this.colorPickerContext.fillRect(0, 0, width, height);

      const verticalGradient = this.colorPickerContext.createLinearGradient(0, 0, 0, height);
      verticalGradient.addColorStop(0, 'rgba(0,0,0,0)');
      verticalGradient.addColorStop(1, 'rgba(0,0,0,1)');
      this.colorPickerContext.fillStyle = verticalGradient;
      this.colorPickerContext.fillRect(0, 0, width, height);
    }
    if (this.activeColorSpace === 'hsl') {
      const selectedHue = chroma(colorToApply).hsl()[0];

      for (let x = 0; x < width; x++) {
        const saturation = (x / width) * 100;
        for (let y = 0; y < height; y++) {
          const lightness = 100 - (y / height) * 100;
          this.colorPickerContext.fillStyle = `hsl(${selectedHue}, ${saturation}%, ${lightness}%)`;
          this.colorPickerContext.fillRect(x, y, 1, 1);
        }
      }
    }
  };

  private setValue = () => {
    if (!this.colorShadeCanvas || !this.colorPickerCanvas) {
      return;
    }
    const context = this.colorPickerCanvas.getContext('2d');
    if (!context) {
      return;
    }
    const xCoordinate = Math.max(0, Math.min(this.pickerX, this.colorPickerCanvas.width - 1));
    const yCoordinate = Math.max(0, Math.min(this.pickerY, this.colorPickerCanvas.height - 1));
    const pixelData = context.getImageData(xCoordinate, yCoordinate, 1, 1).data;
    const red = pixelData[0];
    const green = pixelData[1];
    const blue = pixelData[2];

    const rect2 = this.colorPickerCanvas.getBoundingClientRect();
    const s = Math.round((this.pickerX / rect2.width) * 100);
    const l = Math.round(((rect2.height - this.pickerY) / rect2.height) * 100);
    const hslColor = `hsl(${this.shadeColor ? this.shadeColor[0] : 0}, ${s}%, ${l}%)`;

    this.value =
      this.activeColorSpace !== 'hsl'
        ? (getValueBasedOnColorSpace(
            `rgb(${red}, ${green}, ${blue})`,
            undefined,
            this,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ) as any)
        : (hslColor as `hsl(${string}, ${string}%, ${string}%)`);

    emitChange(this.value, this);
  };

  private handleOpacityClick = (e: MouseEvent | number, detectValueChange?: boolean) => {
    if (detectValueChange === false && detectValueChange !== undefined) {
      this.opacityDown = true;
    }

    if (!this.colorOpacityCanvas) {
      return;
    }
    const rect = this.colorOpacityCanvas.getBoundingClientRect();
    const clientX = typeof e === 'number' ? e : e.clientX;
    const position = clientX;
    this.selectOpacity(position, rect);

    if (detectValueChange === false && detectValueChange !== undefined) {
      this.opacityDown = false;
    }
  };

  private handleShadeClick = (e: MouseEvent | number, detectValueChange?: boolean) => {
    if (detectValueChange === false && detectValueChange !== undefined) {
      this.shadeDown = true;
    }

    if (!this.colorShadeCanvas) {
      return;
    }
    const rect = this.colorShadeCanvas.getBoundingClientRect();
    const clientX = typeof e === 'number' ? e : e.clientX;
    const position = clientX;
    this.selectShade(position, rect);

    this.setValue();

    if (detectValueChange === false && detectValueChange !== undefined) {
      this.shadeDown = false;
    }
  };

  private handleCanvasClick = (e: MouseEvent | [number, number], detectValueChange?: boolean) => {
    if (detectValueChange === false && detectValueChange !== undefined) {
      this.pickerDown = true;
    }
    if (!this.colorPickerCanvas) {
      return;
    }
    const rect = this.colorPickerCanvas.getBoundingClientRect();
    const clientX = Array.isArray(e) ? e[0] : e.clientX;
    const clientY = Array.isArray(e) ? e[1] : e.clientY;
    const negativeX = clientX - rect.left < 0 ? 0 : rect.width;
    const x =
      clientX - rect.left >= 0 && clientX <= rect.left + rect.width
        ? clientX - rect.left
        : negativeX;
    const negativeY = clientY - rect.top < 0 ? 0 : rect.height;
    const y =
      clientY - rect.top >= 0 && clientY <= rect.top + rect.height ? clientY - rect.top : negativeY;

    this.pickerX = x;
    this.pickerY = y;

    this.setValue();
    if (detectValueChange === false && detectValueChange !== undefined) {
      this.pickerDown = false;
    }
  };

  private handleOpacityDown = () => {
    this.opacityDown = true;
    document.body.style.userSelect = 'none';
    window.addEventListener('mouseup', this.handleOpacityUp);
    document.body.addEventListener('mousemove', this.handleOpacityMouseMove);
  };

  private handleOpacityUp = () => {
    this.opacityDown = false;
    document.body.style.removeProperty('user-select');
    window.removeEventListener('mouseup', this.handleOpacityUp);
    document.body.removeEventListener('mousemove', this.handleOpacityMouseMove);
    this.focusOpacitySelector();
  };

  private handleOpacityMouseMove = (e: MouseEvent) => {
    if (this.opacityDown) {
      this.handleOpacityClick(e);
    }
  };

  private handleShadeDown = () => {
    this.shadeDown = true;
    document.body.style.userSelect = 'none';
    window.addEventListener('mouseup', this.handleShadeUp);
    document.body.addEventListener('mousemove', this.handleShadeMouseMove);
  };

  private handleShadeUp = () => {
    this.shadeDown = false;
    document.body.style.removeProperty('user-select');
    window.removeEventListener('mouseup', this.handleShadeUp);
    document.body.removeEventListener('mousemove', this.handleShadeMouseMove);
    this.focusShadeSelector();
  };

  private handleShadeMouseMove = (e: MouseEvent) => {
    if (this.shadeDown) {
      this.handleShadeClick(e);
    }
  };

  private handleMouseDown = () => {
    this.pickerDown = true;
    document.body.style.userSelect = 'none';
    window.addEventListener('mouseup', this.handleMouseUp);
    document.body.addEventListener('mousemove', this.handleMouseMove);
  };

  private handleMouseUp = () => {
    this.pickerDown = false;
    document.body.style.removeProperty('user-select');
    window.removeEventListener('mouseup', this.handleMouseUp);
    document.body.removeEventListener('mousemove', this.handleMouseMove);
    this.focusPickerSelector();
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.pickerDown) {
      this.handleCanvasClick(e);
    }
  };

  private focusPickerSelector = () => {
    const pickerSelector = this.elm.shadowRoot?.querySelector(
      '.br-color-picker-selector',
    ) as HTMLElement;
    pickerSelector.focus();
  };

  private focusShadeSelector = () => {
    const shadeSelector = this.elm.shadowRoot?.querySelector(
      '.br-color-picker-shade-selector',
    ) as HTMLElement;
    shadeSelector.focus();
  };

  private focusOpacitySelector = () => {
    const shadeSelector = this.elm.shadowRoot?.querySelector(
      '.br-color-picker-shade-opacity-selector',
    ) as HTMLElement;
    shadeSelector.focus();
  };

  private handlePickerSelectorKeyDown = (e: KeyboardEvent) => {
    if (!this.colorPickerCanvas) {
      return;
    }
    const rect = this.colorPickerCanvas.getBoundingClientRect();
    const incrementX = (direction: number) => {
      this.handleCanvasClick([this.pickerX + direction + rect.left, this.pickerY + rect.top]);
    };
    const incrementY = (direction: number) => {
      this.handleCanvasClick([this.pickerX + rect.left, this.pickerY + direction + rect.top]);
    };
    const key = e.key;

    this.pickerKeyDown =
      key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight';

    if (key === 'ArrowUp') {
      e.preventDefault();
      incrementY(-1 * (e.shiftKey ? 10 : 1));
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      incrementY(1 * (e.shiftKey ? 10 : 1));
    } else if (key === 'ArrowLeft') {
      e.preventDefault();
      incrementX(-1 * (e.shiftKey ? 10 : 1));
    } else if (key === 'ArrowRight') {
      e.preventDefault();
      incrementX(1 * (e.shiftKey ? 10 : 1));
    }
  };

  private handleShadeSelectorKeyDown = (e: KeyboardEvent) => {
    const key = e.key;
    if (!this.colorShadeCanvas) {
      return;
    }
    const rect = this.colorShadeCanvas.getBoundingClientRect();
    const offset = rect.left;
    const incrementY = (direction: number) => {
      this.handleShadeClick(this.shadeY + direction + offset);
    };
    this.shadeKeyDown = key === 'ArrowLeft' || key === 'ArrowRight';

    if (key === 'ArrowLeft') {
      e.preventDefault();
      incrementY(-1 * (e.shiftKey ? 10 : 1));
    } else if (key === 'ArrowRight') {
      e.preventDefault();
      incrementY(1 * (e.shiftKey ? 10 : 1));
    }
  };

  private handleOpacitySelectorKeyDown = (e: KeyboardEvent) => {
    const key = e.key;
    const incrementY = (direction: number) => {
      this.opacity = Math.max(0, Math.min(Number(this.opacity) + direction, 1))
        .toFixed(2)
        .toString() as BaseOpacityModel;
    };
    this.opacityDown = key === 'ArrowLeft' || key === 'ArrowRight';

    if (key === 'ArrowLeft') {
      e.preventDefault();
      incrementY(-1 * (e.shiftKey ? 0.1 : 0.01));
    } else if (key === 'ArrowRight') {
      e.preventDefault();
      incrementY(1 * (e.shiftKey ? 0.1 : 0.01));
    }
  };

  private handlePickerKeyUp = (e: KeyboardEvent) => {
    const key = e.key;
    this.pickerKeyDown = !(
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight'
    );
  };

  private handleOpacityKeyUp = (e: KeyboardEvent) => {
    const key = e.key;
    this.opacityDown = !(
      key === 'ArrowDown' ||
      key === 'ArrowUp' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight'
    );
  };

  private handleShadeKeyUp = (e: KeyboardEvent) => {
    const key = e.key;
    this.shadeKeyDown = !(
      key === 'ArrowDown' ||
      key === 'ArrowUp' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight'
    );
  };

  private handleHexKeyDown = (e: KeyboardEvent) => {
    const key = e.key;

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      e.preventDefault();
      const modifier = e.shiftKey ? 10 : 1;
      const newValue = incrementHex(
        (this.value as string) || `#000000`,
        key === 'ArrowDown' ? -1 * modifier : 1 * modifier,
      ) as `#${string}`;
      this.value = newValue;
      emitChange(newValue, this);
    }
  };

  private preventBubbling = (e: globalThis.Event) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
  };

  private clearValue = () => {
    this.value = undefined;
    this.shadeY = 0;
    this.pickerY = 0;
    this.pickerX = 0;
    this.shadeColor = [0, 1, 0.5];
    this.opacity = '1';
    this.valueChange.emit({
      value: undefined,
      hex: undefined,
      rgb: undefined,
      hsl: undefined,
      opacity: '1',
      hexa: undefined,
      rgba: undefined,
      hsla: undefined,
    });
    this.initFromValue();
    this.initCanvas();
  };

  render() {
    const rect = this.colorShadeCanvas ? this.colorShadeCanvas.getBoundingClientRect() : undefined;
    const handleSize = `calc(var(--color-picker-thumb-size))`;
    const shadeColor = this.shadeColor ? chroma.hsl(...this.shadeColor).hex() : '#FF0000';
    const opacityColor = this.value ? this.value : '#FFFFFF';
    const shadeStyle = {
      left: `max(${handleSize}, min(${this.shadeY}px, calc(100% - ${handleSize}))`,
      backgroundColor: `${shadeColor}`,
    };
    const opacityStyle = {
      left: `max(${handleSize}, min(${Number(this.opacity) * 100}%, calc(100% - ${handleSize})))`,
    };
    const whichSize = rect && rect.width;
    const maxValue = whichSize || 359;

    const renderHSLControls = () => {
      const hslValue = this.value && this.value.includes('hsl(');
      const hslValueRaw = hslValue
        ? this.value
            ?.replace('hsl(', '')
            .replace(')', '')
            .replace('%', '')
            .replace('%', '')
            .split(',')
        : undefined;
      const hslRaw = this.value ? getRoundedHSL(chroma(this.value).hsl(), this) : [0, 0, 0];
      const hslRawValue = !isNaN(hslRaw[0]) ? hslRaw[0] : 0;

      const hCalculatedValue = this.value && (hslValueRaw ? Number(hslValueRaw[0]) : hslRawValue);
      const sCalculatedValue = this.value && (hslValueRaw ? Number(hslValueRaw[1]) : hslRaw[1]);
      const lCalcualtedValue = this.value && (hslValueRaw ? Number(hslValueRaw[2]) : hslRaw[2]);

      const hValue = hCalculatedValue === undefined ? undefined : hCalculatedValue;
      const sValue = sCalculatedValue === undefined ? undefined : sCalculatedValue;
      const lValue = lCalcualtedValue === undefined ? undefined : lCalcualtedValue;

      return (
        <Fragment>
          <br-numeric-input
            key="input-h"
            theme={this.theme}
            placeholder="H"
            min={0}
            max={359}
            step={1}
            largeStep={10}
            fullWidth={true}
            size="Small"
            fillStyle="Ghost"
            showClearButton={false}
            showIncrementButtons={false}
            value={hValue}
            onValueChange={(e) => {
              this.preventBubbling(e);
              const isFocused =
                document.activeElement === e.target ||
                this.elm.shadowRoot?.activeElement === e.target;
              if (!isFocused) {
                return;
              }
              const h = e.detail.value ? e.detail.value : 0;
              const s = sValue || 0;
              const l = lValue || 0;
              const hslString = `${h}, ${s}%, ${l}%`;
              this.value = `hsl(${hslString})` as BaseHSLColor;
              const rgbString = `${chroma(this.value).rgb().join(', ')}`;
              this.valueChange.emit({
                value: this.value,
                hex: chroma(this.value).hex() as BaseHexColor,
                rgb: `rgb(${rgbString})` as BaseRgbColor,
                hsl: `hsl(${hslString})` as BaseHSLColor,
                opacity: this.opacity, // Update this back
                hexa: chroma(this.value).alpha(Number(this.opacity)).hex() as BaseHexColor,
                rgba: `rgba(${rgbString}, ${this.opacity})` as BaseRgbaColor,
                hsla: `hsla(${hslString}, ${this.opacity})` as BaseHSLAColor,
              });
            }}
            onChange={this.preventBubbling}
          />
          <br-numeric-input
            key="input-s"
            theme={this.theme}
            placeholder="S"
            min={0}
            max={100}
            step={1}
            largeStep={10}
            fullWidth={true}
            size="Small"
            fillStyle="Ghost"
            showClearButton={false}
            showIncrementButtons={false}
            value={sValue}
            onValueChange={(e) => {
              this.preventBubbling(e);
              const isFocused =
                document.activeElement === e.target ||
                this.elm.shadowRoot?.activeElement === e.target;
              if (!isFocused) {
                return;
              }
              const h = hValue || 0;
              const s = e.detail.value ? e.detail.value : 0;
              const l = lValue || 0;
              const hslString = `${h}, ${s}%, ${l}%`;
              this.value = `hsl(${hslString})` as BaseHSLColor;
              const rgbString = `${chroma(this.value).rgb().join(', ')}`;
              this.valueChange.emit({
                value: this.value,
                hex: chroma(this.value).hex() as BaseHexColor,
                rgb: `rgb(${rgbString})` as BaseRgbColor,
                hsl: `hsl(${hslString})` as BaseHSLColor,
                opacity: this.opacity,
                hexa: chroma(this.value).alpha(Number(this.opacity)).hex() as BaseHexColor,
                rgba: `rgba(${rgbString}, ${this.opacity})` as BaseRgbaColor,
                hsla: `hsla(${hslString}, ${this.opacity})` as BaseHSLAColor,
              });
            }}
            onChange={this.preventBubbling}
          />
          <br-numeric-input
            key="input-l"
            theme={this.theme}
            placeholder="L"
            min={0}
            max={100}
            step={1}
            largeStep={10}
            fullWidth={true}
            size="Small"
            fillStyle="Ghost"
            showClearButton={false}
            showIncrementButtons={false}
            value={lValue}
            onValueChange={(e) => {
              this.preventBubbling(e);
              const isFocused =
                document.activeElement === e.target ||
                this.elm.shadowRoot?.activeElement === e.target;
              if (!isFocused) {
                return;
              }
              const h = hValue || 0;
              const s = sValue || 0;
              const l = e.detail.value ? e.detail.value : 0;
              const hslString = `${h}, ${s}%, ${l}%`;
              this.value = `hsl(${hslString})` as BaseHSLColor;
              const rgbString = `${chroma(this.value).rgb().join(', ')}`;
              this.valueChange.emit({
                value: this.value,
                hex: chroma(this.value).hex() as BaseHexColor,
                rgb: `rgb(${rgbString})` as BaseRgbColor,
                hsl: `hsl(${hslString})` as BaseHSLColor,
                opacity: this.opacity,
                hexa: chroma(this.value).alpha(Number(this.opacity)).hex() as BaseHexColor,
                rgba: `rgba(${rgbString}, ${this.opacity})` as BaseRgbaColor,
                hsla: `hsla(${hslString}, ${this.opacity})` as BaseHSLAColor,
              });
            }}
            onChange={this.preventBubbling}
          />
        </Fragment>
      );
    };

    const renderRGBControls = () => {
      return (
        <Fragment>
          <br-numeric-input
            key="input-r"
            theme={this.theme}
            min={0}
            max={255}
            step={1}
            largeStep={10}
            placeholder="R"
            fullWidth={true}
            size="Small"
            fillStyle="Ghost"
            showClearButton={false}
            showIncrementButtons={false}
            value={this.value ? chroma(this.value).rgb()[0] : undefined}
            onValueChange={(e) => {
              this.preventBubbling(e);
              const r = e.detail.value ? e.detail.value : 0;
              const g = this.value ? chroma(this.value).rgb()[1] : 0;
              const b = this.value ? chroma(this.value).rgb()[2] : 0;
              const isFocused =
                document.activeElement === e.target ||
                this.elm.shadowRoot?.activeElement === e.target;
              if (!isFocused) {
                return;
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const newValue = `rgb(${r}, ${g}, ${b})` as any;
              this.value = newValue;
              emitChange(newValue, this);
            }}
            onChange={this.preventBubbling}
          />
          <br-numeric-input
            key="input-g"
            theme={this.theme}
            placeholder="G"
            min={0}
            max={255}
            step={1}
            largeStep={10}
            fullWidth={true}
            size="Small"
            fillStyle="Ghost"
            showClearButton={false}
            showIncrementButtons={false}
            value={this.value ? chroma(this.value).rgb()[1] : undefined}
            onValueChange={(e) => {
              this.preventBubbling(e);
              const r = this.value ? chroma(this.value).rgb()[0] : 0;
              const g = e.detail.value ? e.detail.value : 0;
              const b = this.value ? chroma(this.value).rgb()[2] : 0;
              const isFocused =
                document.activeElement === e.target ||
                this.elm.shadowRoot?.activeElement === e.target;
              if (!isFocused) {
                return;
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const newValue = `rgb(${r}, ${g}, ${b})` as any;
              this.value = newValue;
              emitChange(newValue, this);
            }}
            onChange={this.preventBubbling}
          />
          <br-numeric-input
            key="input-b"
            theme={this.theme}
            min={0}
            max={255}
            placeholder="B"
            step={1}
            largeStep={10}
            fullWidth={true}
            size="Small"
            fillStyle="Ghost"
            showClearButton={false}
            showIncrementButtons={false}
            value={this.value ? chroma(this.value).rgb()[2] : undefined}
            onPaste={(e) => {
              const data = e.clipboardData?.getData('text');
              const isColorValid = chroma.valid(data, 'hex');
              if (!isColorValid) {
                e.preventDefault();
              }
            }}
            onValueChange={(e) => {
              this.preventBubbling(e);
              const r = this.value ? chroma(this.value).rgb()[0] : 0;
              const g = this.value ? chroma(this.value).rgb()[1] : 0;
              const b = e.detail.value ? e.detail.value : 0;
              const isFocused =
                document.activeElement === e.target ||
                this.elm.shadowRoot?.activeElement === e.target;
              if (!isFocused) {
                return;
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const newValue = `rgb(${r}, ${g}, ${b})` as any;
              this.value = newValue;
              emitChange(newValue, this);
            }}
            onChange={this.preventBubbling}
          />
        </Fragment>
      );
    };

    const renderHexControls = () => {
      return (
        <br-input
          key="input-hex"
          fullWidth={true}
          size="Small"
          fillStyle="Ghost"
          theme={this.theme}
          showClearButton={false}
          onKeyDown={this.handleHexKeyDown}
          value={this.value ? chroma(this.value).hex() : ''}
          placeholder="#FFFFFF"
          onChange={this.preventBubbling}
          onPaste={(e) => {
            const data = e.clipboardData?.getData('text');
            const isColorValid = chroma.valid(data, 'hex');
            if (!isColorValid) {
              e.preventDefault();
            }
          }}
          onBlur={(e) => {
            const target = e.target as globalThis.HTMLBrInputElement;
            const isColorValid = chroma.valid(target.value, 'hex');
            if (isColorValid) {
              return;
            }
            const newValue = getValueBasedOnColorSpace(
              target.value as
                | BaseHexColor
                | BaseRgbColor
                | BaseRgbaColor
                | BaseHSLColor
                | BaseHSLAColor,
              undefined,
              this,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any;
            target.value = newValue;
          }}
          onValueChange={(e) => {
            this.preventBubbling(e);
            const target = e.target as globalThis.HTMLBrInputElement;
            const isValidColor = target ? chroma.valid(target.value, 'hex') : false;
            const isFocused =
              document.activeElement === e.target ||
              this.elm.shadowRoot?.activeElement === e.target;
            if (!isFocused) {
              return;
            }
            if (isValidColor && target.value !== '') {
              const newValue = getValueBasedOnColorSpace(
                target.value as
                  | BaseHexColor
                  | BaseRgbColor
                  | BaseRgbaColor
                  | BaseHSLColor
                  | BaseHSLAColor,
                undefined,
                this,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ) as any;
              this.value = newValue;
              emitChange(newValue, this);
            }
          }}
        />
      );
    };

    const eyeDropperSupported =
      typeof window !== 'undefined' &&
      !navigator.userAgent.includes('OPR') &&
      'EyeDropper' in window;
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
        class={{
          'br-color-picker-shows-eye-dropper':
            eyeDropperSupported && this.showEyeDropperAffordance === true,
          'br-color-picker-shows-color-preview': this.showColorPreview === true,
        }}
      >
        <div class="br-color-picker-gradient">
          <div
            tabIndex={0}
            class="br-color-picker-selector"
            onKeyDown={this.handlePickerSelectorKeyDown}
            onKeyUp={this.handlePickerKeyUp}
            style={{
              left: `max(${handleSize}, min(${this.pickerX}px, calc(100% - ${handleSize}))`,
              top: `max(${handleSize}, min(${this.pickerY}px, calc(100% - ${handleSize}))`,
              backgroundColor: `${opacityColor}`,
              opacity: this.value ? '1' : '0',
            }}
          />
          <canvas
            class="br-color-picker-canvas"
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onClick={(e) => this.handleCanvasClick(e, false)}
          />
        </div>
        <div class="br-color-picker-eye-dropper-and-bars-wrapper">
          {this.showEyeDropperAffordance && eyeDropperSupported && (
            <br-color-eye-dropper
              size="Small"
              theme={this.theme}
              fillStyle="Ghost"
              colorType="Neutral"
              onPick={(e) => {
                this.value = getValueBasedOnColorSpace(
                  e.detail.sRGBHex as `#${string}`,
                  undefined,
                  this,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ) as any;
                emitChange(this.value, this);
              }}
            />
          )}
          <div class="br-color-picker-bars-wrapper">
            <div class="br-color-picker-shade">
              <div
                role="slider"
                aria-valuemin="0"
                aria-valuemax="359"
                aria-valuenow={`${this.shadeY / (maxValue / 359)}`}
                tabIndex={0}
                class="br-color-picker-shade-selector"
                onKeyDown={this.handleShadeSelectorKeyDown}
                onKeyUp={this.handleShadeKeyUp}
                style={shadeStyle}
              />
              <canvas
                class="br-color-picker-shade-canvas"
                onMouseDown={this.handleShadeDown}
                onMouseUp={this.handleShadeUp}
                onClick={(e) => this.handleShadeClick(e, false)}
              />
            </div>
            {this.showOpacityAffordance && (
              <div
                class="br-color-picker-shade-opacity br-color-picker-checkered-background"
                onMouseDown={this.handleOpacityDown}
                onMouseUp={this.handleOpacityUp}
                onClick={(e) => this.handleOpacityClick(e, false)}
              >
                <div
                  class="br-color-picker-shade-gradient"
                  style={{
                    backgroundImage: opacityColor
                      ? `linear-gradient(${90}deg, ${chroma(opacityColor).alpha(0).hex()}, ${chroma(opacityColor).alpha(1).hex()})`
                      : undefined,
                  }}
                />
                <div
                  role="slider"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={`${Number(this.opacity) * 100}`}
                  tabIndex={0}
                  class="br-color-picker-shade-opacity-selector"
                  onKeyDown={this.handleOpacitySelectorKeyDown}
                  onKeyUp={this.handleOpacityKeyUp}
                  style={opacityStyle}
                />
              </div>
            )}
          </div>
          {this.showColorPreview && (
            <br-color-preview
              height={`calc(var(--actionable-element-height-small))`}
              width={`calc(var(--actionable-element-height-small))`}
              theme={this.theme}
              value={this.value}
              opacity={this.opacity}
            />
          )}
        </div>
        {this.showInputAffordances && (
          <div class="br-color-picker-input-wrapper">
            <br-single-select
              theme={this.theme}
              value={[this.activeColorSpace || this.defaultColorSpace]}
              onValueChange={(e) => {
                this.preventBubbling(e);
                this.activeColorSpace = e.detail.value
                  ? (e.detail.value[0] as 'hex' | 'rgb' | 'hsl')
                  : 'hex';
                this.initCanvas();
                this.initFromValue();
                if (this.value) {
                  const currentValue = getValueBasedOnColorSpace(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.value as any,
                    this.activeColorSpace,
                    this,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ) as any;
                  this.value = currentValue;
                  emitChange(currentValue, this);
                }
              }}
              onChange={this.preventBubbling}
            >
              <br-popover
                theme={this.theme}
                constrainToTargetWidth={false}
                onClose={(e) => {
                  e.stopImmediatePropagation();
                  e.stopPropagation();
                }}
              >
                <br-button
                  disabled={this.allowedColorSpaces && this.allowedColorSpaces?.length === 1}
                  size="Small"
                  fillStyle="Ghost"
                  colorType="Neutral"
                  slot="target"
                  theme={this.theme}
                >
                  <br-single-select-value />
                  <br-single-select-indicator />
                </br-button>
                <br-popover-content
                  theme={this.theme}
                  onClick={(e) => {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                  }}
                >
                  <br-select-list fullWidth={true} theme={this.theme}>
                    {['hex', 'rgb', 'hsl']
                      .filter((cs: 'hex' | 'rgb' | 'hsl') => this.allowedColorSpaces?.includes(cs))
                      .map((d) => {
                        return (
                          <br-select-list-item
                            size="Small"
                            key={d}
                            fullWidth={true}
                            theme={this.theme}
                            value={d}
                          >
                            <span>{d}</span>
                          </br-select-list-item>
                        );
                      })}
                  </br-select-list>
                </br-popover-content>
              </br-popover>
            </br-single-select>
            <br-control-group fullWidth={true}>
              {this.activeColorSpace === 'hex' && renderHexControls()}
              {this.activeColorSpace === 'rgb' && renderRGBControls()}
              {this.activeColorSpace === 'hsl' && renderHSLControls()}
              {this.showOpacityAffordance && (
                <br-numeric-input
                  theme={this.theme}
                  min={0}
                  max={100}
                  step={1}
                  width="calc(4.75ch + var(--actionable-element-icon-margin-x-small) + var(--actionable-element-icon-size-small))"
                  largeStep={10}
                  size="Small"
                  dragToChangeValue={'horizontal'}
                  dragToChangeValueStep={1}
                  fillStyle="Ghost"
                  showClearButton={false}
                  showIncrementButtons={false}
                  value={this.opacity ? Number(this.opacity) * 100 : 0}
                  onBlur={(e) => {
                    const target = e.target as globalThis.HTMLBrNumericInputElement;
                    if (target) {
                      target.value = this.opacity ? Number(this.opacity) * 100 : 0;
                    }
                  }}
                  onValueChange={(e) => {
                    this.preventBubbling(e);
                    const isFocused =
                      document.activeElement === e.target ||
                      this.elm.shadowRoot?.activeElement === e.target;
                    if (!isFocused) {
                      return;
                    }
                    if (!this.value) {
                      this.value = getValueBasedOnColorSpace(
                        '#FFFFFF',
                        this.activeColorSpace,
                        this,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ) as any;
                    }

                    const val = e.detail.value ? e.detail.value : 0;
                    const constrained = val && val !== 100 ? Number(val.toFixed(2)) : val;

                    const newValue = e.detail.value
                      ? ((constrained / 100).toFixed(4) as BaseOpacityModel)
                      : '0';
                    this.opacity = newValue;

                    emitChange(this.value, this);
                  }}
                  onChange={this.preventBubbling}
                >
                  <br-icon slot="right-icon" iconName="Percentage"></br-icon>
                </br-numeric-input>
              )}
            </br-control-group>
          </div>
        )}
        {this.presets && (
          <Fragment>
            <br-separator
              theme={this.theme}
              margin={{
                top: `calc(var(--color-picker-bar-size) * 1)`,
              }}
            />
            <div class="br-color-picker-preset-wrapper">
              {this.presets.map(
                (preset: {
                  value: BaseHexColor | BaseRgbColor | BaseRgbaColor | BaseHSLColor | BaseHSLAColor;
                  opacity?: BaseOpacityModel;
                }) => {
                  const backgroundColor = `color-mix(in srgb, ${chroma(preset.value).hex()} ${(preset.opacity !== undefined ? Number(preset.opacity) : 1) * 100}%, transparent)`;
                  return (
                    <div
                      class="br-color-picker-preset"
                      key={preset.value}
                      tabIndex={0}
                      style={{
                        backgroundColor: backgroundColor,
                      }}
                      onClick={() => {
                        this.value = getValueBasedOnColorSpace(preset.value, undefined, this);
                        this.opacity = preset.opacity || '1';
                        emitChange(this.value, this);
                      }}
                    />
                  );
                },
              )}
              <div tabIndex={0} class="br-color-picker-preset" onClick={this.clearValue}>
                <div class="br-color-picker-preset br-color-preset-empty"></div>
              </div>
            </div>
          </Fragment>
        )}
      </Host>
    );
  }
}
