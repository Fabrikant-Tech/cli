import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';

/**
 * The streaming text component streams text across the screen.
 * @category Display
 * @slot - The default slot for the text to display.
 */
@Component({
  tag: 'br-streaming-text',
  styleUrl: './css/streaming-text.css',
  shadow: true,
})
export class StreamingText {
  /**
   * The timer that controls the speed of the text display.
   */
  private timer: ReturnType<typeof setTimeout>;
  /**
   * The index of the current character being displayed.
   */
  private currentIndex: number = 0;
  /**
   * The index of the current string being displayed.
   */
  private currentStringIndex: number = 0;
  /**
   * The text that is currently being displayed.
   */
  @State() displayedText: string = '';
  /**
   * The text to display.
   */
  @Prop() text: string | string[] = '';
  /**
   * Clear on finish.
   */
  @Prop() clearOnFinish: boolean = false;
  /**
   * The speed at which to display the text.
   */
  @Prop() speed: number = 100; // Speed in ms
  /**
   * What pause to take after displaying the text.
   */
  @Prop() pause: number; // Pause in ms
  /**
   * Whether the streaming text should be repeated.
   */
  @Prop() repeat: boolean = true;
  /**
   * An event that emits when the text has finished streaming.
   */
  @Event() streamingStopped: EventEmitter<void>;
  /**
   * An event that emits when the text has started streaming.
   */
  @Event() streamingStarted: EventEmitter<void>;
  /**
   * An event that emits whenever the value changes.
   */
  @Event() streamChanged: EventEmitter<string>;

  componentDidLoad() {
    this.startStreaming();
  }

  disconnectedCallback() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  private startStreaming() {
    clearTimeout(this.timer);
    const textArray = Array.isArray(this.text) ? this.text : [this.text];
    const currentText = textArray[this.currentStringIndex];

    if (this.currentIndex < currentText.length) {
      if (this.currentIndex === 0) {
        this.streamingStarted.emit();
      }
      this.displayedText += currentText[this.currentIndex];
      this.streamChanged.emit(this.displayedText);
      this.currentIndex++;
      this.timer = setTimeout(() => this.startStreaming(), this.speed);
    } else {
      this.currentIndex = 0;
      this.currentStringIndex++;
      if (this.currentStringIndex >= textArray.length) {
        if (!this.repeat) {
          if (this.clearOnFinish) {
            this.displayedText = '';
          }
          this.streamingStopped.emit();
          return;
        }
        this.currentStringIndex = 0;
      }
      this.timer = setTimeout(
        () => {
          this.displayedText = '';
          this.startStreaming();
        },
        this.pause || this.speed * currentText.length,
      );
    }
  }

  render() {
    if (!this.displayedText) {
      return null;
    }
    return <span style={{ whiteSpace: 'normal' }}>{this.displayedText}</span>;
  }
}
