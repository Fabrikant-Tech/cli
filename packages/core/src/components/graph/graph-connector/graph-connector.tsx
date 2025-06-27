import { h, Component, ComponentInterface, Element, Host, Prop, Watch, State } from '@stencil/core';
import { isEqual } from 'lodash-es';
import {
  GraphConnectorCurve,
  GraphConnectorMultiStroke,
  GraphConnectorStroke,
} from './types/graph-connector-types';
import { toKebabCase } from '../../container/utils/utils';
import {
  ColorsWithNoShades,
  getAllUniqueShadeNames,
  ColorShadeNameDefault,
  ColorName,
  ColorShadeName,
} from '../../../global/types/roll-ups';
import { ColorType } from '../../../generated/types/types';
import {
  BaseComponentIdType,
  BaseColorNameShadeType,
  BaseColorNameType,
  BaseColorObjectType,
  BaseColorShadeType,
  BaseColorType,
  BaseHexColor,
  BaseHSLAColor,
  BaseHSLColor,
  BaseRgbaColor,
  BaseRgbColor,
} from '../../../reserved/editor-types';

let treeGraphConnectorId = 0;

/**
 * The Connector elements visually connects two elements.
 * @category Layout
 */
@Component({
  tag: 'br-graph-connector',
  styleUrl: './css/graph-connector.css',
  shadow: true,
})
export class GraphConnector implements ComponentInterface {
  private contentRef: HTMLDivElement | undefined;
  private startObserver: MutationObserver;
  private endObserver: MutationObserver;
  private startResizeObserver: ResizeObserver;
  private endResizeObserver: ResizeObserver;

  @Element() elm: HTMLBrGraphConnectorElement;

  @State() startXY: [number, number] = [0, 0];
  @State() endXY: [number, number] = [0, 0];
  @State() size: [number, number] = [0, 0];
  @State() precedence: [string, string] = ['', ''];
  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true })
  readonly internalId: string = `br-tree-graph-connector-${treeGraphConnectorId++}`;
  /**
   * The elements to which the component is connected. Accepts both queryselector strings as well as elements.
   * @category Data
   */
  @Prop() target: [
    BaseComponentIdType<HTMLElement, string>,
    BaseComponentIdType<HTMLElement, string>,
  ];
  /**
   * The root relative to which all elements are positioned.
   */
  @Prop() root?: HTMLElement | string;
  /**
   * A factor to adjust sizes based on a zoom.
   */
  @Prop() zoomFactor: number = 1;
  /**
   * A factor to adjust sizes based on a zoom.
   */
  @Prop() zIndex: number = 1;
  /**
   * Defines the width of the compoennt.
   * @category Appearance
   */
  @Prop() width: number = 2;
  @Watch('width')
  widthChanged(newValue: number, oldValue: number) {
    if (!isEqual(newValue, oldValue)) {
      this.connect(`start-${this.internalId}`, `end-${this.internalId}`);
    }
  }
  /**
   * Defines the curve of the component.
   * @category Appearance
   */
  @Prop() curve: GraphConnectorCurve = 'curved';
  @Watch('curve')
  curveChanged(newValue: GraphConnectorCurve, oldValue: GraphConnectorCurve) {
    if (!isEqual(newValue, oldValue)) {
      this.handleResize();
    }
  }
  /**
   * Defines the stroke of the component.
   * @category Appearance
   */
  @Prop() strokeColor:
    | BaseColorObjectType<
        | BaseHexColor
        | BaseRgbColor
        | BaseRgbaColor
        | BaseHSLColor
        | BaseHSLAColor
        | BaseColorNameType<ColorName>
        | BaseColorType<ColorType>
        | BaseColorShadeType<`${ColorType}-${ColorShadeName}`>
        | BaseColorNameShadeType<`${ColorName}-${ColorShadeName}`>
      >
    | GraphConnectorStroke = {
    color: 'Neutral',
    opacity: '0.25',
  };
  @Watch('strokeColor')
  colorChanged(newValue: GraphConnectorStroke, oldValue: GraphConnectorStroke) {
    if (!isEqual(newValue, oldValue)) {
      this.connect(`start-${this.internalId}`, `end-${this.internalId}`);
    }
  }
  /**
   * Defines the stroke linecap.
   * @category Appearance
   */
  @Prop({ reflect: true }) linecap: 'butt' | 'round' | 'square' = 'round';
  /**
   * Defines the offset of the component.
   * @category Appearance
   */
  @Prop() offset?: [number, number];
  /**
   * Hide the connector.
   */
  @Prop({ reflect: true }) hide?: boolean;
  /**
   * Whether the connector is static.
   */
  @Prop() static?: boolean;
  /**
   * Whether the end marker is shown
   */
  @Prop() endMarker?: boolean;
  /**
   * Marker offset.
   */
  @Prop() markerOffset?: number;
  /**
   * Marker size.
   */
  @Prop() markerSize?: number;
  /**
   * Stroke type.
   */
  @Prop() strokeType?: 'solid' | 'dashed' | 'dotted';

  // TODO Calculate gradient based on corners
  private createSvg(
    width: number,
    height: number,
    cornerDirection: [string, string],
    gradientTransform: string | undefined,
  ) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');

    gradient.setAttribute('id', `linear-${this.internalId}`);
    if (gradientTransform) {
      gradient.setAttribute('gradientTransform', gradientTransform);
    } else {
      gradient.removeAttribute('gradientTransform');
    }

    const shadeNames = getAllUniqueShadeNames();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const castStroke = this.strokeColor as any;
    const strokeToUse = castStroke.type
      ? (this.strokeColor as GraphConnectorStroke)
      : ({
          type: 'multi',
          steps: [
            {
              position: 0,
              color: castStroke.color,
              opacity: castStroke.opacity,
            },
            {
              position: 100,
              color: castStroke.color,
              opacity: castStroke.opacity,
            },
          ],
        } as GraphConnectorMultiStroke);
    if (strokeToUse.type === 'single') {
      const color = strokeToUse[`color`];
      const mightHaveShadeName = color && !ColorsWithNoShades.includes(color);
      const appliedShadeName = shadeNames.find((shade) => color?.includes(shade));
      const shadeName = mightHaveShadeName
        ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
        : '';

      const appliedColorName =
        appliedShadeName && color ? color.replace(`-${appliedShadeName}`, '') : color;
      const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

      const strokeColor = `var(--color-${colorName}${shadeName})`;

      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute(
        'stop-color',
        `color-mix(in srgb, ${strokeColor} ${strokeToUse[`opacity`] ? strokeToUse[`opacity`] * 100 : 100}%, transparent)`,
      );
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '100%');
      stop1.setAttribute(
        'stop-color',
        `color-mix(in srgb, ${strokeColor} ${strokeToUse[`opacity`] ? strokeToUse[`opacity`] * 100 : 100}%, transparent)`,
      );
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
    } else {
      strokeToUse[`steps`].map((step) => {
        const color = step[`color`];
        const mightHaveShadeName = color && !ColorsWithNoShades.includes(color);
        const appliedShadeName = shadeNames.find((shade) => color?.includes(shade));
        const shadeName = mightHaveShadeName
          ? `${appliedShadeName ? `-${appliedShadeName.toLowerCase()}` : `-${ColorShadeNameDefault.toLowerCase()}`}`
          : '';

        const appliedColorName =
          appliedShadeName && color ? color.replace(`-${appliedShadeName}`, '') : color;
        const colorName = `${toKebabCase(appliedColorName).toLowerCase()}`;

        const strokeColor = `var(--color-${colorName}${shadeName})`;

        const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop.setAttribute('offset', `${step.position}%`);
        stop.setAttribute(
          'stop-color',
          `color-mix(in srgb, ${strokeColor} ${step[`opacity`] ? step[`opacity`] * 100 : 100}%, transparent)`,
        );
        gradient.appendChild(stop);
      });
    }
    defs.appendChild(gradient);

    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', `arrow-${this.internalId}`);
    marker.setAttribute('markerWidth', this.markerSize ? this.markerSize.toString() : '10');
    marker.setAttribute('markerHeight', this.markerSize ? this.markerSize.toString() : '10');
    marker.setAttribute('refX', this.markerOffset ? this.markerOffset.toString() : '8');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 6 3, 0 6');
    marker.appendChild(polygon);
    polygon.setAttribute('fill', `url(#linear-${this.internalId})`);
    defs.appendChild(marker);

    svg.appendChild(defs);
    svg.style.display = 'block';
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.overflow = 'visible';
    svg.style.zIndex = this.zIndex.toString();
    svg.style.minHeight = `${this.width}px`;
    svg.style.minWidth = `${this.width}px`;
    svg.style.position = 'relative';

    svg.setAttribute('viewBox', `0 0 ${width !== 0 ? width : 1} ${height !== 0 ? height : 1}`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const x1 = cornerDirection[0].split('-')[0] === 'left' ? 0 : width;
    const y1 = cornerDirection[0].split('-')[1] === 'top' ? 0 : height;
    const x2 = cornerDirection[1].split('-')[0] === 'left' ? 0 : width;
    const y2 = cornerDirection[1].split('-')[1] === 'top' ? 0 : height;

    function getCurve(startX: number, startY: number, endX: number, endY: number) {
      const x1 = startX;
      const y1 = startY;
      const x2 = Math.abs(endX - startX) * 0.05 + startX;
      const y2 = startY;
      const x3 = (endX - startX) * 0.6 + startX;
      const y3 = startY;
      const x4 = (endX - startX) * 0.4 + startX;
      const y4 = endY;
      const x5 = -Math.abs(endX - startX) * 0.05 + endX;
      const y5 = endY;
      const x6 = endX;
      const y6 = endY;
      let curve = 'M' + x1 + ',' + y1;
      curve += ' L' + x2 + ',' + y2;
      curve += ' ' + 'C' + x3 + ',' + y3;
      curve += ' ' + x4 + ',' + y4;
      curve += ' ' + x5 + ',' + y5;
      curve += ' L' + x6 + ',' + y6;
      return curve;
    }

    function getDirect(startX: number, startY: number, endX: number, endY: number) {
      const x1 = startX;
      const y1 = startY;
      const x2 = endX;
      const y2 = endY;
      return `M ${x1} ${y1} ${x2} ${y2}`;
    }

    const directCurve =
      this.curve === 'direct' ? `${getDirect(x1, y1, x2, y2)}` : `${getCurve(x1, y1, x2, y2)}`;
    const curve = typeof this.curve === 'string' ? directCurve : this.curve(x1, y1, x2, y2);
    path.setAttribute('fill', 'none');
    path.setAttribute('d', curve);
    path.setAttribute('stroke-width', `${this.width}px`);
    if (this.strokeType) {
      path.setAttribute(
        'stroke-dasharray',
        (this.strokeType === 'dashed' && `${this.width * 5},${this.width * 5}`) ||
          (this.strokeType === 'dotted' && `${this.width * 2},${this.width * 2}`) ||
          '1,0',
      );
    }
    path.setAttribute('stroke', `url(#linear-${this.internalId})`);
    path.setAttribute('stroke-linecap', this.linecap);
    if (this.endMarker) {
      path.setAttribute('marker-end', `url(#arrow-${this.internalId})`);
    }
    svg.appendChild(path);
    return svg;
  }

  private getCoordinates(
    target: globalThis.Element | null,
    root?: globalThis.Element | null,
  ): [number, number] {
    if (!(target && root)) {
      return [0, 0];
    }
    const rootBox = root.getBoundingClientRect();
    const box = target.getBoundingClientRect();
    const width = box.width;
    const height = box.height;
    const xOffset = box.left - rootBox.left;
    const x = xOffset + width / 2;
    const yOffset = box.top - rootBox.top;
    const y = yOffset + height / 2;
    return [x * this.zoomFactor, y * this.zoomFactor];
  }
  private connect(start: string, end: string) {
    if (!this.target) {
      return;
    }
    const startItem =
      typeof this.target[0] === 'string' ? document.querySelector(this.target[0]) : this.target[0];
    const endItem =
      typeof this.target[1] === 'string' ? document.querySelector(this.target[1]) : this.target[1];
    const newDiv = document.querySelector(`[id='link-${start}-${end}']`)
      ? (document.querySelector(`[id='link-${start}-${end}']`) as HTMLElement)
      : document.createElement('div');
    const root = typeof this.root === 'string' ? document.querySelector(this.root) : this.root;
    newDiv.style.position = 'absolute';
    newDiv.style.zIndex = this.zIndex.toString();
    newDiv.style.minWidth = `${this.width}px`;
    newDiv.style.minHeight = `${this.width}px`;
    newDiv.id = `link-${start}-${end}`;
    const startCoordinate = this.getCoordinates(startItem, root);
    const endCoordinate = this.getCoordinates(endItem, root);
    const isStartFirst = startCoordinate[0] <= endCoordinate[0];
    const isStartAbove = startCoordinate[1] <= endCoordinate[1];

    const startEndLeftCoordinate =
      endCoordinate[0] === startCoordinate[0] ? startCoordinate[0] - 1 : startCoordinate[0];
    const endStartLeftCoordinate =
      endCoordinate[0] === startCoordinate[0] ? endCoordinate[0] - 1 : endCoordinate[0];
    const baseLeft = isStartFirst ? startEndLeftCoordinate : endStartLeftCoordinate;
    const left = baseLeft + (this.offset ? this.offset[0] : 0);

    const startEndTopCoordinate =
      startCoordinate[1] === endCoordinate[1] ? startCoordinate[1] - 1 : startCoordinate[1];
    const endStartTopCoordinate =
      startCoordinate[1] === endCoordinate[1] ? endCoordinate[1] - 1 : endCoordinate[1];
    const baseTop = isStartAbove ? startEndTopCoordinate : endStartTopCoordinate;
    const top = baseTop + (this.offset ? this.offset[1] : 0);

    const endStartHeightCoordinate =
      endCoordinate[1] === startCoordinate[1] ? 1 : endCoordinate[1] - startCoordinate[1];
    const startEndHeightCoordinate =
      startCoordinate[1] === endCoordinate[1] ? 1 : startCoordinate[1] - endCoordinate[1];
    const height = isStartAbove ? endStartHeightCoordinate : startEndHeightCoordinate;

    const endStartWidthCoordinate =
      endCoordinate[0] === startCoordinate[0] ? 1 : endCoordinate[0] - startCoordinate[0];
    const startEndWidthCoordinate =
      startCoordinate[0] === endCoordinate[0] ? 1 : startCoordinate[0] - endCoordinate[0];
    const width = isStartFirst ? endStartWidthCoordinate : startEndWidthCoordinate;

    newDiv.style.left = `${left}px`;
    newDiv.style.width = `${width}px`;
    newDiv.style.top = `${top}px`;
    newDiv.style.height = `${height}px`;

    if (this.contentRef) {
      this.contentRef.style.left = `${left}px`;
      this.contentRef.style.width = `${width}px`;
      this.contentRef.style.top = `${top}px`;
      this.contentRef.style.height = `${height}px`;
      this.contentRef.style.overflow = 'visible';
    }

    const startXCorner = isStartFirst ? 'left' : 'right';
    const startYCorner = isStartAbove ? 'top' : 'bottom';
    const endXCorner = isStartFirst ? 'right' : 'left';
    const endYCorner = isStartAbove ? 'bottom' : 'top';

    this.startXY = [left - this.width, top - this.width];
    this.size = [width + this.width, height + this.width];

    this.precedence = [isStartFirst ? 'isStartFirst' : 'no', isStartAbove ? 'isStartAbove' : 'no'];

    const angle = (() => {
      const xRatio = startCoordinate[0] / endCoordinate[0];
      const yRatio = startCoordinate[1] / endCoordinate[1];
      if (xRatio >= 0.8 && xRatio <= 1.1) return 90;
      if (xRatio >= 0.8 && xRatio <= 1.1 && !isStartAbove) return -90;
      if (yRatio >= 0.8 && yRatio <= 1.1 && !isStartFirst) return -180;
      if (yRatio >= 0.8 && yRatio <= 1.1) return 0;
      if (isStartFirst && isStartAbove) return 45;
      if (!isStartFirst && isStartAbove) return 135;
      if (isStartFirst && !isStartAbove) return -45;
      return -135;
    })();

    const gradientTransform: string = `rotate(${angle}, 0.5, 0.5)`;

    const svgToAdd = this.createSvg(
      Number(newDiv.style.width.replace('px', '')),
      Number(newDiv.style.height.replace('px', '')),
      [`${startXCorner}-${startYCorner}`, `${endXCorner}-${endYCorner}`],
      gradientTransform,
    );
    newDiv.dataset.debug = `${startCoordinate[0]} to ${endCoordinate[0]} / ${startCoordinate[1]} to ${endCoordinate[1]}`;
    newDiv.innerHTML = '';
    newDiv.appendChild(svgToAdd);
    this.elm.appendChild(newDiv);
  }

  private handleResize = () => {
    if (this.static) {
      return;
    }
    setTimeout(() => {
      this.connect(`start-${this.internalId}`, `end-${this.internalId}`);
    }, 0);
  };

  private internalGetBoundingClientRect() {
    return this.elm.shadowRoot?.querySelector('div')?.getBoundingClientRect();
  }

  connectedCallback(): void {
    this.startObserver = new MutationObserver(this.handleResize);
    this.endObserver = new MutationObserver(this.handleResize);
    this.startResizeObserver = new ResizeObserver(this.handleResize);
    this.endResizeObserver = new ResizeObserver(this.handleResize);
  }

  componentWillLoad(): void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentDidLoad(): void {
    setTimeout(() => {
      const startItem =
        typeof this.target[0] === 'string'
          ? document.querySelector(this.target[0])
          : this.target[0];
      const endItem =
        typeof this.target[1] === 'string'
          ? document.querySelector(this.target[1])
          : this.target[1];
      if (startItem) {
        this.startObserver.observe(startItem, { childList: true, subtree: true, attributes: true });
        this.startResizeObserver.observe(startItem);
        startItem.addEventListener('transitionend', this.handleResize);
      }
      if (endItem) {
        this.endObserver.observe(endItem, { childList: true, subtree: true, attributes: true });
        this.endResizeObserver.observe(endItem);
        endItem.addEventListener('transitionend', this.handleResize);
      }
    }, 0);
  }

  disconnectedCallback(): void {
    const startItem =
      typeof this.target[0] === 'string' ? document.querySelector(this.target[0]) : this.target[0];
    const endItem =
      typeof this.target[1] === 'string' ? document.querySelector(this.target[1]) : this.target[1];
    window.removeEventListener('resize', this.handleResize);
    if (startItem) {
      startItem.removeEventListener('transitionend', this.handleResize);
    }
    if (endItem) {
      endItem.removeEventListener('transitionend', this.handleResize);
    }
    this.startObserver.disconnect();
    this.endObserver.disconnect();
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <div
          ref={(ref) => (this.contentRef = ref)}
          style={{
            position: 'absolute',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <slot name="middle"></slot>
        </div>
      </Host>
    );
  }
}
