import { Event, EventEmitter, Method, Watch } from '@stencil/core';
import { Component, ComponentInterface, Prop, State } from '@stencil/core';
import { isEqual } from 'lodash-es';
import { BreakpointSensorStep } from './types/breakpoint-sensor-types';

/**
 * The Breakpoint Sensor helps manage different screen resolutions and devices.
 * @category Layout
 * @visibility hidden
 */
@Component({
  tag: 'br-breakpoint-sensor',
})
export class BreakpointSensor implements ComponentInterface {
  /**
   * List of breakpoints to check.
   */
  private matchMedias: MediaQueryList[] = [];
  /**
   * The current active breakpoint.
   */
  @State() activeBreakpointName: string;
  /**
   * Determines the list of breakpoints the component responds to.
   * @category Data
   */
  @Prop() breakpoints!: BreakpointSensorStep[];
  @Watch('breakpoints')
  breakpointsChanged(newValue: BreakpointSensorStep, oldValue: BreakpointSensorStep) {
    if (!isEqual(newValue, oldValue)) {
      this.clearMatches();
      this.handleBreakpointChange();
    }
  }
  /**
   * Emits when a breakpoint is matched.
   */
  @Event() breakpointMatched: EventEmitter<string>;
  /**
   * Method to get the active breakpoint.
   */
  @Method()
  async getActiveBreakPointName(): Promise<string> {
    return this.activeBreakpointName;
  }

  private composeQuery = (
    operator?: string,
    device?: string,
    maxWidth?: number,
    minWidth?: number,
  ) => {
    const hasAnd = maxWidth || minWidth ? ' and' : '';
    const deviceQuery = `${device}${hasAnd}`;
    const hasBoth = minWidth && maxWidth ? ' and' : '';
    const maxWidthQuery = maxWidth ? `(max-width: ${maxWidth}px)` : '';
    const minWidthQuery = minWidth ? `(min-width: ${minWidth}px)` : '';
    return `${operator ? operator : ''} ${
      device ? deviceQuery : ''
    } ${maxWidthQuery}${hasBoth} ${minWidthQuery}`;
  };

  private clearMatches = () => {
    this.matchMedias.forEach((match) => match.removeEventListener('change', this.breakpointChange));
    this.matchMedias = [];
  };

  private breakpointChange = (e: MediaQueryListEvent, breakpoint?: BreakpointSensorStep) => {
    if (e.matches && breakpoint) {
      this.activeBreakpointName = breakpoint.name;
      this.breakpointMatched.emit(breakpoint.name);
    }
  };

  private handleBreakpointChange() {
    if (this.breakpoints) {
      this.breakpoints.forEach((breakpoint) => {
        const query = this.composeQuery(
          breakpoint.operator,
          breakpoint.device,
          breakpoint.maxWidth,
          breakpoint.minWidth,
        );
        this.matchMedias = [...this.matchMedias, window.matchMedia(query)];
      });

      const checkMedia = () => {
        this.breakpoints.forEach((breakpoint, i) => {
          if (this.matchMedias[i].matches) {
            this.activeBreakpointName = breakpoint.name;
            this.breakpointMatched.emit(breakpoint.name);
          }
        });
      };

      this.breakpoints.forEach((breakpoint, i) => {
        this.matchMedias[i].addEventListener('change', (e) => this.breakpointChange(e, breakpoint));
      });

      checkMedia();
    }
  }

  componentWillLoad(): void {
    this.handleBreakpointChange();
  }
}
