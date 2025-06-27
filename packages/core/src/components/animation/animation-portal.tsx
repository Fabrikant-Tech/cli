import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Prop,
  State,
} from '@stencil/core';
import {
  deepCloneElement,
  DefaultAppearAnimations,
  DefaultDisappearAnimations,
} from './utils/utils';
import { CSSKeyframe } from './types/animation-portal-types';

let portalId = 0;
const appearClass = 'br-animation-portal-internal-appear';
const preventAnimationClass = 'br-animation-portal-internal-prevent-appear';

/**
 * The Animation Portal is a utility component for animating elements as they are added or removed from the DOM.
 * @category Utils
 * @visibility hidden
 */
@Component({
  tag: 'br-animation-portal',
  styleUrl: './css/animation-portal.css',
})
export class AnimationPortal implements ComponentInterface {
  private mutationObserver: MutationObserver;
  @State() addedNodes: Node[] = [];
  @State() removedNodes: Node[] = [];
  @Element() elm!: HTMLBrAnimationPortalElement;

  /**
   * The unique internal ID of the component.
   * @category Data
   * @visibility hidden
   */
  @Prop({ reflect: true }) readonly internalId: string = `br-animation-portal-${portalId++}`;
  /**
   * The css class applied to the appearing component.
   * @category Data
   */
  @Prop() appearAnimationClass: string = 'br-animation-portal-appear';
  /**
   * The duration of the appear animation in milliseconds.
   * @category Behavior
   */
  @Prop() appearAnimationDuration: number = 300;
  /**
   * Determines the appear animation.
   * @category Behavior
   */
  @Prop() appearAnimation?: CSSKeyframe[];
  /**
   * The css class applied to the disappearing component.
   * @category Data
   */
  @Prop() disappearAnimationClass: string = 'br-animation-portal-disappear';
  /**
   * Determines the disappear animation.
   * @category Behavior
   */
  @Prop() disappearAnimation?: CSSKeyframe[];
  /**
   * The duration of the disappear animation in milliseconds.
   * @category Behavior
   */
  @Prop() disappearAnimationDuration: number = 300;
  /**
   * Determines if the component animates in after it loads.
   * @category Behavior
   */
  @Prop({ reflect: true }) animateIn: boolean | 'immediate' = true;
  /**
   * Determines the easing function for appearing animations.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() appearAnimationEasing:
    | 'ease-in-out'
    | 'ease-in'
    | 'ease-out'
    | 'linear'
    | `cubic-bezier(${number},${number},${number},${number})` = 'ease-in-out';
  /**
   * Determines the easing function for disappearing animations.
   * @category Behavior
   * @visibility persistent
   */
  @Prop() disappearAnimationEasing:
    | 'ease-in-out'
    | 'ease-in'
    | 'ease-out'
    | 'linear'
    | `cubic-bezier(${number},${number},${number},${number})` = 'ease-in-out';
  /**
   * Determines whether opacity animations should be cancelled.
   * @category Behavior
   */
  @Prop() cancelOpacity?: boolean;
  /**
   * Determines if the element to be removed is animated out.
   * @category Behavior
   */
  @Prop() animateOut?: boolean = false;
  /**
   * Emits when the appear animation ends.
   * This event is triggered after the appear animation has completed for an element.
   * It can be used to perform actions that should occur after the element has fully appeared.
   */
  @Event() animationAppearEnd: EventEmitter<void>;
  /**
   * Emits when the disappear animation ends.
   * This event is triggered after the disappear animation has completed for an element.
   * It is useful for performing actions after an element has been fully removed from view.
   */
  @Event() animationDisappearEnd: EventEmitter<void>;

  private internalGetBoundingClientRect() {
    return this.elm?.firstElementChild?.getBoundingClientRect();
  }
  private generateKeyframesFromProp = (keyframes: CSSKeyframe[], name: 'appear' | 'disappear') => {
    let styleKeys: string[] = [];

    const keyframe = keyframes.reduce((acc, kf) => {
      let style = '';
      Object.entries(kf.style).map((en) => {
        if ((this.cancelOpacity && en[0] !== 'opacity') || !this.cancelOpacity) {
          styleKeys = [...styleKeys, en[0]];
          style = style + `${en[0]}:${en[1]};`;
        }
      });
      return `${acc}${kf.position}{${style}}`;
    }, '');
    const style = document.createElement('style');
    style.id = `animation-${name}-${this.internalId}`;
    style.innerHTML = `@keyframes animation-${name}-${this.internalId} {${keyframe}}`;
    if (this.elm?.querySelector(`#${style.id}`)) {
      this.elm?.querySelector(`#${style.id}`)?.remove();
    }

    const uniqueStyleKeys = [...new Set(styleKeys)];
    this.elm.style.setProperty(`--animation-${name}-will-change`, `${uniqueStyleKeys.join(' ')}`);
    this.elm?.appendChild(style);
  };

  private addAnimationDurationVariables = () => {
    this.elm.style.setProperty(
      '--animation-portal-disappear-duration',
      `${this.disappearAnimationDuration || 300}ms`,
    );
    this.elm.style.setProperty(
      '--animation-portal-appear-duration',
      `${this.appearAnimationDuration || 300}ms`,
    );
    this.elm.style.setProperty('--animation-portal-appear-easing', this.appearAnimationEasing);
    this.elm.style.setProperty(
      '--animation-portal-disappear-easing',
      this.disappearAnimationEasing,
    );
    this.elm.style.setProperty('--animation-name-appear', `animation-appear-${this.internalId}`);
    this.elm.style.setProperty(
      '--animation-name-disappear',
      `animation-disappear-${this.internalId}`,
    );

    this.generateKeyframesFromProp(this.appearAnimation || DefaultAppearAnimations.Basic, 'appear');
    this.generateKeyframesFromProp(
      this.disappearAnimation || DefaultDisappearAnimations.Basic,
      'disappear',
    );
  };

  componentWillLoad(): void {
    this.elm.getBoundingClientRect = this.internalGetBoundingClientRect.bind(this);
    this.mutationObserver = new MutationObserver(this.resolveObservers);
    this.addedNodes = Array.from(this.elm.childNodes);
    this.addAnimationDurationVariables();
    this.addedNodes.forEach((ad) => {
      if (ad instanceof HTMLElement) {
        if (this.animateIn === false) {
          ad.classList.add(preventAnimationClass);
        }
        if (this.animateIn === 'immediate') {
          ad.classList.add(appearClass);
        }
        setTimeout(() => {
          ad.classList.add(this.appearAnimationClass);
        }, 0);
      }
    });
  }

  private resolveObservers = (mutations: MutationRecord[]) => {
    const currentMutationAddedNodes: Node[] = [];
    const currentMutationRemovedNodes: Node[] = [];

    const animateAddedNode = (ad: HTMLElement) => {
      setTimeout(
        () => {
          ad.classList.add(this.appearAnimationClass);
          const emitAppear = () => {
            this.animationAppearEnd.emit();
            ad.removeEventListener('animationend', emitAppear);
          };
          ad.addEventListener('animationend', emitAppear);
        },
        this.animateOut ? this.disappearAnimationDuration : 0,
      );
    };

    const animateRemovedNode = (rd: HTMLElement) => {
      if (!this.animateOut) {
        return;
      }
      const clonedRemoved = deepCloneElement(rd);
      clonedRemoved.dataset.clonedAnimation = 'true';
      rd.classList.remove(this.appearAnimationClass);
      clonedRemoved.classList.add(this.disappearAnimationClass);
      this.elm.appendChild(clonedRemoved);
      const emitDisappear = () => {
        this.animationDisappearEnd.emit();
        clonedRemoved.remove();
        clonedRemoved.removeEventListener('animationend', emitDisappear);
      };
      clonedRemoved.addEventListener('animationend', emitDisappear);
    };

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((ad) => {
        if (ad instanceof HTMLElement && !ad.dataset.clonedAnimation) {
          animateAddedNode(ad);
          currentMutationAddedNodes.push(ad);
        }
      });

      mutation.removedNodes.forEach((rd) => {
        if (rd instanceof HTMLElement && !rd.dataset.clonedAnimation) {
          rd.classList.remove(this.appearAnimationClass);
          animateRemovedNode(rd);
          currentMutationRemovedNodes.push(rd);
        }
      });
    });

    this.addedNodes = currentMutationAddedNodes;
    this.removedNodes = currentMutationRemovedNodes;
  };

  componentDidLoad(): void {
    this.mutationObserver.observe(this.elm, { childList: true });
  }

  disconnectedCallback(): void {
    this.mutationObserver.disconnect();
  }
}
