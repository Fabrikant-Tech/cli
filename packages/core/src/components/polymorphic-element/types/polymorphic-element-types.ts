export type ContainerStyles = Partial<CSSStyleDeclaration>;
export type ContainerStateStyles = { default: ContainerStyles } & Partial<
  Record<ContainerInnerElementPseudoSelectors, ContainerStyles>
>;
export type ContainerInnerElementType =
  | 'div'
  | 'span'
  | 'p'
  | 'a'
  | 'input'
  | 'textarea'
  | 'button'
  | 'select'
  | 'label';
export type ContainerInnerElementPseudoSelectors =
  | 'default'
  | 'hover'
  | 'active'
  | 'focusVisible'
  | 'disabled'
  | 'focus'
  | 'readOnly';
