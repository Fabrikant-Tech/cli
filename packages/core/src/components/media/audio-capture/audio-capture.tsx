import { EventEmitter, Host, Method } from '@stencil/core';
import { Component, h, State, Element, Prop, Event } from '@stencil/core';
import { DebugMode } from '../../debug/types/utils';

// TODO  React to device changes and merge chunks
/**
 * The Audio Capture component enables recording audio from the microphone.
 * @category Media
 * @slot play - Passes a play icon to the component.
 * @slot pause - Passes a pause icon to the component.
 */
@Component({
  tag: 'br-audio-capture',
  styleUrl: './css/audio-capture.css',
  formAssociated: true,
  shadow: true,
})
export class AudioCaptureElement {
  /**
   * A reference to the Media recorder.
   */
  private mediaRecorder: MediaRecorder;
  /**
   * A refernece to the audio stream.
   */
  private microphone: MediaStreamAudioSourceNode;
  /**
   * Audio chunks to be recorded.
   */
  private audioChunks: Blob[] = [];
  /**
   * The audio blob to be recorded.
   */
  private audioBlob: Blob | undefined;
  /**
   * The audio url to be recorded.
   */
  private audioUrl: string;
  /**
   * A reference to the form internals.
   */
  private internals: ElementInternals | null;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrAudioCaptureElement;
  /**
   * The recording state of the audio.
   */
  @State() recording: boolean = false;
  /**
   * The paused state of the audio.
   */
  @State() paused: boolean = false;
  /**
   * The recorded audio.
   */
  @State() recordedAudio: string = '';
  /**
   * The name attribute ensures this component behaves like an input in a form.
   * @category Data
   * @visibility persistent
   */
  @Prop() name?: string;
  /**
   * An id for the audio capture device.
   */
  @Prop() audioInputId?: string;
  /**
   * An event that emits when the amp of the recording changes.
   */
  @Event() volumeChanged: EventEmitter<{ value: number }>;
  /**
   * An event that emits when the recording is resumed.
   */
  @Event() recordingResumed: EventEmitter<void>;
  /**
   * An event that emits when the recording is paused.
   */
  @Event() recordingPaused: EventEmitter<void>;
  /**
   * An event that emits when the recording starts.
   */
  @Event() recordingStarted: EventEmitter<void>;
  /**
   * An event that emits when the audio is recorded.
   */
  @Event() recordingStopped: EventEmitter<{ audio: Blob; audioFile: File }>;
  /**
   * An event that emits when the audio is recorded.
   */
  @Event() change: EventEmitter<{ audio: Blob; audioFile: File }>;
  /**
   * An event that emits when the audio is recorded.
   */
  @Event() valueChange: EventEmitter<{ audio: Blob; audioFile: File }>;
  /**
   * A method to start recording.
   */
  @Method()
  async startRecording() {
    this.record();
  }
  /**
   * A method to stop recording.
   */
  @Method()
  async stopRecording() {
    this.stop();
  }
  /**
   * A method to stop recording.
   */
  @Method()
  async pauseRecording() {
    this.pause();
  }
  /**
   * A method to resume recording.
   */
  @Method()
  async resumeRecording() {
    this.resume();
  }

  connectedCallback() {
    if (this.name && !this.internals) {
      this.internals = this.elm.attachInternals();
    }
  }

  formResetCallback() {
    this.recording = false;
    this.recordedAudio = '';
    this.audioBlob = undefined;
    this.audioUrl = '';
    this.internals?.setFormValue(null);
  }

  private async record() {
    let animationFrame: number;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: this.audioInputId ? { deviceId: this.audioInputId } : true,
      });

      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        this.microphone.disconnect();
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        this.recordedAudio = this.audioUrl;
        this.audioChunks = [];

        const file = new File([this.audioBlob], 'recording.webm', { type: 'audio/webm' });

        this.recordingStopped.emit({ audio: this.audioBlob, audioFile: file });
        this.change.emit({ audio: this.audioBlob, audioFile: file });
        this.valueChange.emit({ audio: this.audioBlob, audioFile: file });

        if (!(file && this.name)) {
          return;
        }
        const formData = new FormData();
        formData.append(this.name, file);
        this.internals?.setFormValue(formData);
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };

      this.mediaRecorder.start();
      this.recordingStarted.emit();
      this.recording = true;

      const audioContext = new window.AudioContext();

      this.microphone = audioContext.createMediaStreamSource(this.mediaRecorder.stream);
      const analyser = new AnalyserNode(audioContext);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.fftSize = 256;
      this.microphone.connect(analyser);
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        this.volumeChanged.emit({ value: (avg / 255) * 100 });
        animationFrame = requestAnimationFrame(updateVolume);
      };
      if (this.recording && !this.paused) {
        updateVolume();
      }
    } catch (error) {
      if (DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
        console.error('Error accessing microphone:', error);
      }
    }
  }

  private stop() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.recording = false;
      this.paused = false;
    }
  }

  private pause() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.recordingPaused.emit();
      this.paused = true;
    }
  }

  private resume() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.recordingResumed.emit();
      this.paused = false;
    }
  }

  render() {
    return (
      <Host>
        <div
          class="br-audio-capture-target"
          onClick={() => (this.recording ? this.stop() : this.record())}
        >
          <slot name="play"></slot>
        </div>
        <div
          class="br-audio-capture-target"
          onClick={() => (this.recording && !this.paused ? this.pause() : this.resume())}
        >
          <slot name="pause"></slot>
        </div>
      </Host>
    );
  }
}
