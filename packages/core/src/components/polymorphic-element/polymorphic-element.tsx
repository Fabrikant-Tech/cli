import { h, Component, ComponentInterface, Prop, Host } from '@stencil/core';
import {
  ContainerInnerElementType,
  ContainerStyles,
  ContainerStateStyles,
} from './types/polymorphic-element-types';
import { Theme } from '../../generated/types/types';
import { ThemeDefault } from '../../generated/types/variables';

/**
 * The container is a polymorphic component that exposes an API that can easily consume tokens.
 * @category Layout
 * @slot - Passes the content to the container.
 * @slot highlight - Passes a highlight element to the container that follows the mouse on the container.
 */
@Component({
  tag: 'br-polymorphic-element',
  styleUrl: './css/polymorphic-element.css',
  shadow: { delegatesFocus: true },
})
export class PolymorphicElement implements ComponentInterface {
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  /**
   * Determines the type of tag the inner element is rendered as.
   * @category Appearance
   */
  @Prop() wrappedElement: ContainerInnerElementType = 'div';
  /**
   * Defines the attributes to pass to the inner element.
   * @category Appearance
   */
  @Prop() attr: { [key: string]: string };
  /**
   * Defines the styles to pass to the inner element.
   * @category Appearance
   */
  @Prop() styles:
    | ContainerStyles
    | ContainerStateStyles
    | {
        themes: Partial<Record<Theme, ContainerStateStyles>>;
      };
  /**
   * Defines the class names to pass to the inner element.
   * @category Appearance
   */
  @Prop() classes: string[];

  render() {
    const InternalPolymorphicElement = this.wrappedElement;

    const styleObjectToCssString = (styleObj: ContainerStyles) => {
      return Object.entries(styleObj)
        .map(([key, value]) => {
          const cssKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
          return `${cssKey}: ${value};`;
        })
        .join('; ');
    };

    const whichStyles =
      this.styles && 'themes' in this.styles ? this.styles.themes[this.theme] : this.styles;
    const hasStates = whichStyles && 'default' in whichStyles && whichStyles.default;
    const generateStyle = hasStates
      ? Object.entries(whichStyles!)
          .map((s) => {
            const stateName =
              s[0] !== 'default'
                ? s[0].replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
                : undefined;
            return `${stateName ? `&:${stateName} {` : ''} ${styleObjectToCssString(s[1])} ${stateName ? '} ' : ' '}`;
          })
          .join(' ')
      : `${styleObjectToCssString(this.styles)}`;

    return (
      <Host>
        <style>{`:host { ${this.wrappedElement} { ${generateStyle} }}`}</style>
        <InternalPolymorphicElement
          class={this.classes ? this.classes.map((c) => c).join(' ') : undefined}
          part="inner-element"
          {...(this.attr || {})}
        >
          <slot></slot>
        </InternalPolymorphicElement>
      </Host>
    );
  }
}
