import { EventEmitter, Host, Method, Watch } from '@stencil/core';
import { Component, h, State, Element, Prop, Event } from '@stencil/core';
import { DebugMode } from '../../debug/types/utils';
import { BaseComponentIdType } from '../../../reserved/editor-types';

/**
 * The Video Capture component enables recording video from the camera.
 * @category Media
 * @slot play - Passes a play affordance to the component.
 * @slot pause - Passes a pause record affordance to the component.
 * @slot record - Passes a record afordance to the component.
 * @slot stop - Passes a stop affordance to the component.
 */
@Component({
  tag: 'br-video-capture',
  styleUrl: './css/video-capture.css',
  formAssociated: true,
  shadow: true,
})
export class VideoCaptureElement {
  /**
   * A reference to the Media recorder.
   */
  private mediaRecorder: MediaRecorder | undefined;
  /**
   * A reference to the animation frame.
   */
  private animationFrame: number;
  /**
   * A refernece to the audio stream.
   */
  private microphone: MediaStreamAudioSourceNode | undefined;
  /**
   * A reference to the video stream.
   */
  private videoStream: MediaStream | undefined;
  /**
   * Video chunks to be recorded.
   */
  private videoChunks: Blob[] = [];
  /**
   * The video blob to be recorded.
   */
  private videoBlob: Blob | undefined;
  /**
   * The video url to be recorded.
   */
  private videoUrl: string;
  /**
   * A reference to the form internals.
   */
  private internals: ElementInternals | null;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrVideoCaptureElement;
  /**
   * The recording state of the video.
   */
  @State() recording: boolean = false;
  /**
   * The playing state of the video.
   */
  @State() playing: boolean = false;
  /**
   * The paused state of the video.
   */
  @State() paused: boolean = false;
  /**
   * The recorded video.
   */
  @State() recordedVideo: string = '';
  /**
   * The name attribute ensures this component behaves like an input in a form.
   * @category Data
   * @visibility persistent
   */
  @Prop() name?: string;
  /**
   * An id for the video capture device.
   */
  @Prop() videoInputId?: string;
  @Watch('videoInputId')
  async videoInputIdChanged() {
    if (this.recording) {
      this.stop();
      this.record();
    }
    if (this.playing) {
      this.stopPlaying();
      this.play();
    }
  }
  /**
   * An id for the audio capture device.
   */
  @Prop() audioInputId?: string;
  @Watch('audioInputId')
  async audioInputIdChanged() {
    if (this.recording) {
      this.stop();
      this.record();
    }
    if (this.playing) {
      this.stopPlaying();
      this.play();
    }
  }
  /**
   * Play on render.
   */
  @Prop() playOnRender: boolean = false;
  /**
   * Determines whether to record audio.
   */
  @Prop() recordAudio: boolean = true;
  /**
   * Whether recording should be cleared on stop.
   */
  @Prop() clearOnStop: boolean = false;
  /**
   * A way to connect the video to a video preview.
   */
  @Prop() connectedVideoCaptureView?: BaseComponentIdType<HTMLBrVideoCaptureViewElement, string>;
  /**
   * A way to connect the video to a volume preview.
   */
  @Prop() connectedVolumePreview?: BaseComponentIdType<HTMLBrVolumePreviewElement, string>;
  /**
   * An event that emits when the amp of the recording changes.
   */
  @Event() volumeChanged: EventEmitter<{ value: number }>;
  /**
   * An event that emits when the playing starts.
   */
  @Event() playingStarted: EventEmitter<void>;
  /**
   * An event that emits when the playing is paused.
   */
  @Event() playingStopped: EventEmitter<void>;
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
   * An event that emits when the video is recorded.
   */
  @Event() recordingStopped: EventEmitter<{ video: Blob; videoFile: File }>;
  /**
   * An event that emits when the video is recorded.
   */
  @Event() change: EventEmitter<{ video: Blob; videoFile: File }>;
  /**
   * An event that emits when the video is recorded.
   */
  @Event() valueChange: EventEmitter<{ video: Blob; videoFile: File }>;
  /**
   * An event that emits the video stream.
   */
  @Event() streamAvailable: EventEmitter<MediaStream>;
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
  /**
   * A method to play the video.
   */
  @Method()
  async playVideo() {
    this.play();
  }
  /**
   * A method to stop playing the video.
   */
  @Method()
  async stopVideo() {
    this.stopPlaying();
  }
  /**
   * A method to clear the recording.
   */
  @Method()
  async clearRecording() {
    this.stopRecording();
    this.videoChunks = [];
    this.videoBlob = undefined;
    this.videoUrl = '';
    this.recordedVideo = '';
  }

  connectedCallback() {
    if (this.name && !this.internals) {
      this.internals = this.elm.attachInternals();
    }
  }

  componentDidLoad() {
    if (this.playOnRender) {
      this.play();
    }
  }

  formResetCallback() {
    this.recording = false;
    this.recordedVideo = '';
    this.videoBlob = undefined;
    this.videoUrl = '';
    this.internals?.setFormValue(null);
  }

  private async record(playOnly?: boolean) {
    this.videoStream?.getTracks().forEach((track) => track.stop());
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.videoStream = undefined;
    this.microphone = undefined;
    this.mediaRecorder = undefined;
    this.playing = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: this.videoInputId ? { deviceId: this.videoInputId } : true,
        audio:
          this.audioInputId && this.recordAudio
            ? { deviceId: this.audioInputId }
            : this.recordAudio,
      });

      if (this.connectedVideoCaptureView) {
        const id =
          typeof this.connectedVideoCaptureView === 'string'
            ? this.connectedVideoCaptureView
            : this.connectedVideoCaptureView.id;
        const element = document.getElementById(id);
        if (element) {
          (element as HTMLBrVideoCaptureViewElement).stream = undefined;
          (element as HTMLBrVideoCaptureViewElement).stream = stream;
        }
      }

      this.videoStream = stream;
      if (stream) {
        this.streamAvailable.emit(stream);
      }
      if (playOnly) {
        this.playing = true;
      }
      if (!playOnly) {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          this.videoChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          this.videoBlob = new Blob(this.videoChunks, { type: 'video/webm' });
          this.videoUrl = URL.createObjectURL(this.videoBlob);
          this.recordedVideo = this.videoUrl;
          if (this.clearOnStop) {
            this.videoChunks = [];
          }

          const file = new File([this.videoBlob], 'recording.webm', { type: 'video/webm' });

          this.recordingStopped.emit({ video: this.videoBlob, videoFile: file });
          this.change.emit({ video: this.videoBlob, videoFile: file });
          this.valueChange.emit({ video: this.videoBlob, videoFile: file });

          if (!(file && this.name)) {
            return;
          }
          const formData = new FormData();
          formData.append(this.name, file);
          this.internals?.setFormValue(formData);
          if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
          }
        };

        this.mediaRecorder.start();
        this.recordingStarted.emit();
        this.recording = true;
      }
      if (this.recordAudio) {
        const audioContext = new window.AudioContext();

        this.microphone = audioContext.createMediaStreamSource(this.videoStream);
        const analyser = new AnalyserNode(audioContext);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.fftSize = 256;
        this.microphone.connect(analyser);
        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
          const valueToSet = (avg / 255) * 100;
          if (this.connectedVolumePreview) {
            const id =
              typeof this.connectedVolumePreview === 'string'
                ? this.connectedVolumePreview
                : this.connectedVolumePreview.id;
            const element = document.getElementById(id);
            if (element) {
              console.error('element', element, valueToSet);
              (element as HTMLBrVolumePreviewElement).volume = valueToSet;
            }
          }
          this.volumeChanged.emit({ value: valueToSet });
          this.animationFrame = requestAnimationFrame(updateVolume);
        };
        if ((this.recording && !this.paused) || (this.playing && !this.paused)) {
          updateVolume();
        }
      }
    } catch (error) {
      if (DebugMode.currentDebug && this.elm.closest('br-debug-wrapper')) {
        console.error('Error accessing camera:', error);
      }
    }
  }

  private stop() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.videoStream?.getTracks().forEach((track) => track.stop());
      this.recording = false;
      this.paused = false;
    }
  }

  private play() {
    this.playing = true;
    this.paused = false;
    this.record(true);
  }

  private stopPlaying() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
      this.videoStream = undefined;
      this.streamAvailable.emit(undefined);
      this.playing = false;
      this.paused = false;
      if (this.connectedVideoCaptureView) {
        const id =
          typeof this.connectedVideoCaptureView === 'string'
            ? this.connectedVideoCaptureView
            : this.connectedVideoCaptureView.id;
        const element = document.getElementById(id);
        if (element) {
          (element as HTMLBrVideoCaptureViewElement).stream = undefined;
        }
      }
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

  private handlePlay = () => {
    if (this.playing) {
      this.stopPlaying();
    } else {
      this.play();
    }
  };

  private handleRecord = () => {
    if (this.recording) {
      this.stop();
    } else {
      this.record();
    }
  };

  private handleRecordPause = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (this.paused) {
      this.resume();
    } else {
      this.pause();
    }
  };

  render() {
    return (
      <Host>
        <div class="br-video-capture-target-slot" onClick={this.handlePlay}>
          {!this.playing && <slot name="play"></slot>}
          {this.playing && <slot name="stop"></slot>}
        </div>
        <div class="br-video-capture-target-slot" onClick={this.handleRecord}>
          {!this.recording && <slot name="record"></slot>}
          {this.recording && <slot name="stop"></slot>}
          {this.recording && (
            <div class="br-video-capture-target-slot" onClick={this.handleRecordPause}>
              <slot name="pause"></slot>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
