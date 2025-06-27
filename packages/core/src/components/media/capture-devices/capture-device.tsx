import { Element, EventEmitter, Host, State, h } from '@stencil/core';
import { Component, Prop, Event } from '@stencil/core';
import { ThemeDefault } from '../../../generated/types/variables';
import { ColorType, FillStyle, Shape, Size, Theme } from '../../../generated/types/types';
import {
  BaseColorType,
  BaseComponentIdType,
  BaseSize,
  BaseSizes,
} from '../../../reserved/editor-types';
import { DebugMode } from '../../debug/types/utils';

/**
 * The Capture Device component allows the user to select a media device.
 * @category Media
 */
@Component({
  tag: 'br-capture-device',
  shadow: true,
})
export class CaptureDevice {
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrCaptureDeviceElement;
  /**
   * The list of cameras available.
   */
  @State() cameras: MediaDeviceInfo[];
  /**
   * The selected camera id.
   */
  @State() selectedCameraId: string | undefined = undefined;
  /**
   * The list of audio inputs available.
   */
  @State() audioInputs: MediaDeviceInfo[];
  /**
   * The selected audio input id.
   */
  @State() selectedAudioInputId: string | undefined = undefined;
  /**
   * The list of audio outputs available.
   */
  @State() audioOutputs: MediaDeviceInfo[];
  /**
   * The selected audio output id.
   */
  @State() selectedAudioOutputId: string | undefined = undefined;
  /**
   * The selected device.
   */
  @Prop() value: string | undefined = undefined;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Defines the semantic color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 4
   */
  @Prop({ reflect: true }) colorType: BaseColorType<ColorType> = 'Neutral';
  /**
   * Defines the fill style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 3
   */
  @Prop({ reflect: true }) fillStyle: FillStyle = 'Ghost';
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
   * Determines if the component displays an ellipsis when the text does not fit the wrapper.
   * @category Appearance
   */
  @Prop({ reflect: true }) ellipsis?: boolean = false;
  /**
   * What type of devices to capture
   * @category Behavior
   */
  @Prop() type: 'audio' | 'video' | 'audio-output' = 'audio';
  /**
   * Render as list or select.
   */
  @Prop() renderAs: 'list' | 'select' = 'list';
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The capture element that the device selection is attached to.
   */
  @Prop() captureElement?: BaseComponentIdType<
    HTMLBrVideoCaptureElement | HTMLBrVideoCaptureViewElement | HTMLBrAudioCaptureElement,
    string
  >;
  /**
   * A event that emits when the selection is completed.
   */
  @Event() deviceSelected: EventEmitter<MediaDeviceInfo>;

  private async getCameraList() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      this.cameras = videoDevices;
    } catch (error) {
      if (DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
        console.error('Error fetching camera list:', error);
      }
    }
  }

  private async getAudioList() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputDevices = devices.filter((device) => device.kind === 'audioinput');
      this.audioInputs = audioInputDevices;
    } catch (error) {
      if (DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
        console.error('Error fetching camera list:', error);
      }
    }
  }

  private async getAudioOutputList() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputDevices = devices.filter((device) => device.kind === 'audiooutput');
      this.audioOutputs = audioOutputDevices;
    } catch (error) {
      if (DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
        console.error('Error fetching camera list:', error);
      }
    }
  }

  private async getDevices() {
    if (this.type === 'audio') {
      await this.getAudioList();
    }
    if (this.type === 'video') {
      await this.getCameraList();
    }
    if (this.type === 'audio-output') {
      await this.getAudioOutputList();
    }
  }

  componentWillLoad() {
    this.getDevices();
  }

  render() {
    const items = this.audioInputs || this.cameras || this.audioOutputs;
    const defaultItem = items ? [items[0].deviceId] : undefined;

    if (!items) {
      return;
    }
    if (this.renderAs === 'list') {
      return (
        <Host>
          <br-select-list
            multiple={false}
            defaultValue={defaultItem}
            fullWidth={this.fullWidth}
            width={this.width}
            selectingSameValueDeselects={false}
            value={this.value ? [this.value] : undefined}
            onValueChange={(event) => {
              if (!event.detail.value) {
                return;
              }
              this.value = event.detail.value[0] as string;
              const deviceToSet = items?.find((item) => item.deviceId === event.detail.value![0]);
              this.deviceSelected.emit(deviceToSet);
              if (this.captureElement) {
                const element =
                  typeof this.captureElement === 'string'
                    ? document.getElementById(this.captureElement)
                    : this.captureElement;
                const elementSupportsVideo = element?.tagName.toLowerCase().includes('video');
                const elementSupportsAudioOutput = element?.tagName
                  .toLowerCase()
                  .includes('capture-view');
                if (element) {
                  if (this.type === 'audio') {
                    (element as HTMLBrAudioCaptureElement).audioInputId = this.value;
                  }
                  if (this.type === 'video' && elementSupportsVideo) {
                    (element as HTMLBrVideoCaptureElement).videoInputId = this.value;
                  }
                  if (this.type === 'audio-output' && elementSupportsAudioOutput) {
                    (element as HTMLBrVideoCaptureViewElement).audioOutputId = this.value;
                  }
                }
              }
            }}
          >
            {items?.map((item) => {
              return (
                <br-select-list-item
                  fullWidth={true}
                  key={item.deviceId}
                  label={item.label}
                  value={item.deviceId}
                >
                  <span>{item.label}</span>
                </br-select-list-item>
              );
            })}
          </br-select-list>
        </Host>
      );
    }
    return (
      <Host>
        <br-single-select
          fullWidth={this.fullWidth}
          width={this.width}
          selectingSameValueDeselects={false}
          theme={this.theme}
          defaultValue={defaultItem}
          value={this.value ? [this.value] : undefined}
          onValueChange={(event) => {
            if (!event.detail.value) {
              return;
            }
            this.value = event.detail.value[0] as string;
            const deviceToSet = items?.find((item) => item.deviceId === event.detail.value![0]);
            this.deviceSelected.emit(deviceToSet);
          }}
        >
          <br-popover theme={this.theme}>
            <br-button
              size={this.size}
              ellipsis={this.ellipsis}
              shape={this.shape}
              fillStyle={this.fillStyle}
              colorType={this.colorType}
              alignContentToMargins={true}
              fullWidth={this.fullWidth}
              slot="target"
              theme={this.theme}
            >
              <br-icon
                slot="left-icon"
                iconName={
                  (this.type === 'audio' && 'Microphone') ||
                  (this.type === 'video' && 'DeviceVideoCamera') ||
                  'Volume'
                }
              />
              <br-single-select-value />
              <br-single-select-indicator />
            </br-button>
            <br-popover-content theme={this.theme}>
              <br-select-list fullWidth={true} theme={this.theme}>
                {items?.map((item) => {
                  return (
                    <br-select-list-item
                      fullWidth={true}
                      key={item.deviceId}
                      label={item.label}
                      value={item.deviceId}
                    >
                      <span>{item.label}</span>
                    </br-select-list-item>
                  );
                })}
              </br-select-list>
            </br-popover-content>
          </br-popover>
        </br-single-select>
      </Host>
    );
  }
}
