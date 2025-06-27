import { Component, Prop, Host, h, State, Watch, Fragment, Element } from '@stencil/core';
import { isEqual } from 'lodash-es';
import { Size, Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';
/**
 * The File Preview component enables previewing a file to display in t.
 * @category Inputs & Forms
 * @slot icon - Passes an icon to the component.
 * @slot inline-error - Passes a custom error display inline.
 * @slot tooltip-error - Passes a custom error display as a tooltip.
 * @slot error-message - Enables passing a error message to the internal display.
 * @slot {{file-name}}-file-item-content - Dynamic slot name that allows passing custom rendered content to each file element.
 * @slot {{file-name}}-file-item-preview - Dynamic slot name that allows passing a custom preview to each file.
 * @slot browse-button
 * @slot browse-button-label
 */
@Component({
  tag: 'br-file-preview',
  styleUrl: './css/file-preview.css',
  shadow: true,
})
export class FilePreview {
  /**
   * A reference to the preview render.
   */
  private previewRenderRef:
    | globalThis.HTMLAudioElement
    | globalThis.HTMLVideoElement
    | globalThis.HTMLIFrameElement
    | undefined;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrFilePreviewElement;
  /**
   * Stores the loading state.
   */
  @State() loading: boolean = true;
  /**
   * Stores the preview of the file.
   */
  @State() preview: string | undefined;
  /**
   * Whether the preview is active.
   */
  @State() active: boolean;
  /**
   * Whether the preview is hovered.
   */
  @State() hovered: boolean;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines the file to be previewed.
   * @category Data
   */
  @Prop() file: File | undefined;
  @Watch('file')
  handleFileChange(newValue: File | undefined, oldValue: File | undefined) {
    if (!isEqual(newValue, oldValue)) {
      this.loadFileDetails(newValue);
    }
  }
  /**
   * Defines the size style applied to the component.
   * @category Appearance
   * @visibility persistent
   * @order 1
   */
  @Prop({ reflect: true }) size: Size = 'Normal';
  /**
   * Determines the preview duration for playable media.
   * @category Appearance
   */
  @Prop() previewDuration: number = 5000;

  componentWillLoad() {
    this.loadFileDetails(this.file);
  }

  private loadFileDetails = (file: File | undefined) => {
    const reader = new FileReader();
    reader.onloadstart = () => {
      this.loading = true;
    };
    reader.onloadend = () => {
      this.loading = false;
    };
    reader.onload = (e) => {
      this.preview = e.target?.result as string | undefined;
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.preview = undefined;
    }
  };

  private handleMediaEnd = () => {
    this.active = false;
  };

  private handleMediaTimeExpiration = () => {
    const currentTime = (
      this.previewRenderRef as globalThis.HTMLAudioElement | globalThis.HTMLVideoElement
    )?.currentTime;

    if (currentTime && currentTime >= this.previewDuration / 1000) {
      this.active = false;
      if (this.previewRenderRef && this.previewRenderRef.tagName !== 'IFRAME') {
        (
          this.previewRenderRef as globalThis.HTMLAudioElement | globalThis.HTMLVideoElement
        ).pause();
        (
          this.previewRenderRef as globalThis.HTMLAudioElement | globalThis.HTMLVideoElement
        ).currentTime = 0;
      }
    }
  };

  render() {
    const isImage = this.file?.type.includes('image/') && this.preview;
    const isSvg = this.file?.type.includes('image/svg') && this.preview;
    const isVideo = this.file?.type.includes('video/') && this.preview;
    const isPdf = this.file?.type.includes('application/pdf') && this.preview;
    const isAudio = this.file?.type.includes('audio/') && this.preview;

    const toggleVideoAndAudio = () => {
      if (this.active) {
        this.active = false;
        if (this.previewRenderRef && this.previewRenderRef.tagName !== 'IFRAME') {
          (
            this.previewRenderRef as globalThis.HTMLAudioElement | globalThis.HTMLVideoElement
          ).pause();
          (
            this.previewRenderRef as globalThis.HTMLAudioElement | globalThis.HTMLVideoElement
          ).currentTime = 0;
        }
      } else {
        this.active = true;
        (
          this.previewRenderRef as globalThis.HTMLAudioElement | globalThis.HTMLVideoElement
        )?.play();
      }
    };

    const renderPlayStopControl = () => {
      return (
        <div class="br-file-preview-control-container">
          <div class="br-file-preview-control-icon-wrapper">
            <br-icon
              size={16}
              focusable={true}
              color="White"
              iconName={this.active ? 'StopSymbol' : 'PlaySymbol'}
              onClick={toggleVideoAndAudio}
            />
          </div>
        </div>
      );
    };

    const backgroundVar =
      this.theme === 'Light' ? 'var(--color-background)' : 'var(--color-popover-background)';
    return (
      <Host
        style={{
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: isImage ? `url(${this.preview})` : undefined,
          backgroundColor: isSvg ? backgroundVar : undefined,
        }}
      >
        {!isImage && (
          <div
            class="br-file-upload-item-preview"
            onMouseOver={() => (this.hovered = true)}
            onMouseOut={() => (this.hovered = false)}
          >
            {isPdf && (
              <iframe
                tabindex={-1}
                inert
                ref={(ref) => (this.previewRenderRef = ref)}
                src={this.preview}
              />
            )}
            {isVideo && (
              <Fragment>
                <video
                  ref={(ref) => (this.previewRenderRef = ref)}
                  class={{ 'br-file-upload-preview-is-hovered': this.active }}
                  src={this.preview}
                  onEnded={this.handleMediaEnd}
                  onTimeUpdate={this.handleMediaTimeExpiration}
                />
                {this.hovered && renderPlayStopControl()}
              </Fragment>
            )}
            {isAudio && (
              <Fragment>
                <audio
                  ref={(ref) => (this.previewRenderRef = ref)}
                  src={this.preview}
                  onEnded={this.handleMediaEnd}
                  onTimeUpdate={this.handleMediaTimeExpiration}
                />
                {this.hovered && renderPlayStopControl()}
                {!this.hovered && <br-icon class="br-file-upload-preview-icon" iconName="Volume" />}
              </Fragment>
            )}
            <slot>
              {((!isImage && !isVideo && !isPdf && !isAudio) || this.loading) && (
                <br-icon class="br-file-upload-preview-icon" iconName="Paperclip" />
              )}
            </slot>
            <slot name="custom-preview"></slot>
          </div>
        )}
        {(isAudio || isVideo) && this.active && (
          <div class="br-file-preview-control-container-progress" />
        )}
      </Host>
    );
  }
}
