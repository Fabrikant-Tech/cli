import { Component, h, Host, Method, Prop, Watch } from '@stencil/core';
import { ColorType, Theme } from '../../../../generated/types/types';
import { ThemeDefault } from '../../../../generated/types/variables';
import {
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorObjectType,
  BaseColorShadeType,
  BaseColorType,
  BaseGradientModel,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseRgbaColor,
  BaseRgbColor,
  BaseSize,
  BaseSizes,
} from '../../../../reserved/editor-types';
import { ColorName, ColorShadeName } from '../../../../global/types/roll-ups';
import { Element } from '@stencil/core';
/**
 * The video capture view component is a wrapper for the video element that allows you to display a video stream.
 * @category Media
 * @slot recording - Passes an indicator when the video is recording.
 * @slot not-playing - Passes an indicator when the video is not playing.
 */
@Component({
  tag: 'br-video-capture-view',
  styleUrl: './css/video-capture-view.css',
  formAssociated: true,
  shadow: true,
})
export class VideoCaptureViewElement {
  /**
   * A reference to the video element.
   */
  private videoRef: HTMLVideoElement | undefined;
  /**
   * A reference to the internal stream to use.
   */
  private internalStreamRef: MediaStream | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrVideoCaptureViewElement;
  /**
   * The stream to display.
   */
  @Prop() stream: MediaStream | 'camera' | undefined;
  @Watch('stream')
  async streamChanged() {
    this.handleStreamChange();
  }
  /**
   * An id for the video capture device.
   */
  @Prop() videoInputId?: string;
  @Watch('videoInputId')
  async videoInputIdChanged() {
    this.handleStreamChange();
  }
  /**
   * An id for the audio capture device.
   */
  @Prop() audioInputId?: string;
  @Watch('audioInputId')
  async audioInputIdChanged() {
    this.handleStreamChange();
  }
  /**
   * An id for the audio output.
   */
  @Prop() audioOutputId?: string;
  @Watch('audioOutputId')
  async audioOutputIdChanged() {
    const audioOutput = this.audioOutputId ? this.audioOutputId : undefined;
    if (audioOutput && this.videoRef) {
      this.videoRef.setSinkId(audioOutput);
    }
  }
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
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
   * The min width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) minWidth?: BaseSize<BaseSizes>;
  /**
   * The min height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) minHeight?: BaseSize<BaseSizes>;
  /**
   * The max width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) maxWidth?: BaseSize<BaseSizes>;
  /**
   * The max height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) maxHeight?: BaseSize<BaseSizes>;
  /**
   * Defines the background color applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop() backgroundColor: BaseColorObjectType<
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >;
  /**
   * Defines the background gradient applied to the component.
   * @category Appearance
   * @order 2
   */
  @Prop() backgroundGradient?: BaseGradientModel<
    | BaseHexColor
    | BaseRgbColor
    | BaseRgbaColor
    | BaseHSLColor
    | BaseHSLAColor
    | BaseColorNameType<ColorName>
    | BaseColorType<ColorType>
    | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
    | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
  >;
  /**
   * Whether the video is recording.
   */
  @Prop() recording: boolean;
  /**
   * Get the internal video element.
   */
  @Method()
  async getVideoElement() {
    return this.videoRef;
  }

  private internalGetBoundingClientRect() {
    return this.elm.shadowRoot?.querySelector('br-container')?.getBoundingClientRect();
  }

  componentWillLoad() {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
  }

  async componentDidLoad() {
    if (this.stream === 'camera') {
      this.connectToCamera();
    }
  }

  private connectToCamera = async () => {
    const audio = this.audioInputId ? { deviceId: this.audioInputId } : false;
    const video = this.videoInputId ? { deviceId: this.videoInputId } : true;
    const audioOutput = this.audioOutputId ? this.audioOutputId : undefined;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: video,
      audio: audio,
    });
    this.internalStreamRef = stream;
    if (this.videoRef) {
      this.videoRef.srcObject = this.internalStreamRef;
      this.videoRef.play();
      if (audioOutput) {
        this.videoRef.setSinkId(audioOutput);
      }
    }
  };

  private handleStreamChange = async () => {
    if (this.videoRef) {
      this.internalStreamRef = undefined;
      this.videoRef.srcObject = null;

      if (this.stream === 'camera') {
        this.connectToCamera();
      } else {
        this.internalStreamRef = this.stream;
        this.videoRef.srcObject = this.internalStreamRef || null;
        this.videoRef.play();
      }
      const audioOutput = this.audioOutputId ? this.audioOutputId : undefined;
      if (audioOutput) {
        this.videoRef.setSinkId(audioOutput);
      }
    }
  };

  render() {
    return (
      <Host>
        <br-container
          backgroundColor={this.backgroundColor}
          backgroundGradient={this.backgroundGradient}
          theme={this.theme}
          fullWidth={this.fullWidth}
          fullHeight={this.fullHeight}
          width={this.width}
          height={this.height}
          minWidth={this.minWidth}
          minHeight={this.minHeight}
          maxWidth={this.maxWidth}
          maxHeight={this.maxHeight}
        >
          <br-container class="br-video-capture-view-recording">
            <slot name="recording">
              <br-container
                backgroundColor={{
                  color: 'Destructive',
                  opacity: '1',
                }}
                opacity={this.recording ? '1' : '0'}
                padding={{
                  left: 'calc(var(--size-unit) * 3)',
                  right: 'calc(var(--size-unit) * 3)',
                  top: 'calc(var(--size-unit) * 3)',
                  bottom: 'calc(var(--size-unit) * 3)',
                }}
                borderRadius={{
                  bottomLeft: 'var(--actionable-element-border-radius-normal)',
                  bottomRight: 'var(--actionable-element-border-radius-normal)',
                  topLeft: 'var(--actionable-element-border-radius-normal)',
                  topRight: 'var(--actionable-element-border-radius-normal)',
                }}
                directionAlignment="center"
                secondaryAlignment="center"
                direction="row"
                horizontalGap="calc(var(--size-unit))"
                textColor={{
                  color: 'White',
                }}
              >
                <br-container
                  overflow="visible"
                  width="calc(var(--size-unit) * 4)"
                  height="calc(var(--size-unit) * 4)"
                  directionAlignment="center"
                  secondaryAlignment="center"
                >
                  <br-icon size="calc(var(--size-unit) * 6)" color="White" iconName="LargeDot" />
                </br-container>
                <span style={{ fontSize: 'calc(var(--size-unit) * 3)' }}>Recording</span>
              </br-container>
            </slot>
          </br-container>
          <br-container
            class="br-video-capture-view-not-playing"
            opacity={this.stream ? '0' : '1'}
            fullWidth={true}
            fullHeight={true}
            shrink={true}
            direction="column"
            directionAlignment="center"
            secondaryAlignment="center"
          >
            <slot name="not-playing"></slot>
          </br-container>
          <video
            width="100%"
            height="100%"
            ref={(ref) => (this.videoRef = ref)}
            autoplay
            playsinline
          />
        </br-container>
      </Host>
    );
  }
}
