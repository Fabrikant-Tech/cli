import { CSSKeyframe } from '../types/animation-portal-types';

export function deepCloneElement(original: HTMLElement): HTMLElement {
  const newNode = document.createElement(original.tagName.toLowerCase());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const propDescriptors = Object.getOwnPropertyDescriptors((original as any).__proto__);
  Object.keys(propDescriptors).forEach((propName) => {
    const descriptor = propDescriptors[propName];
    if (descriptor && descriptor.get) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (original as any)[propName];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newNode as any)[propName] = value;
      } catch (e) {
        console.warn(`Could not clone property ${propName}:`, e);
      }
    }
  });

  if (original.slot) {
    newNode.slot = original.slot;
  }

  if (original.style) {
    let styleObject = {};
    const styles = original.style.cssText.split(';');
    styles.forEach((css) => {
      const [key, value] = css.split(':');
      styleObject = { ...styleObject, [key.replace(' ', '')]: value };
    });
    Object.assign(newNode.style, styleObject);
  }

  for (const child of Array.from(original.childNodes)) {
    if (child instanceof HTMLElement) {
      const clonedChild = deepCloneElement(child as HTMLElement);
      newNode.appendChild(clonedChild);
    } else if (child instanceof Text) {
      const clonedText = document.createTextNode(child.textContent || '');
      newNode.appendChild(clonedText);
    }
  }

  return newNode;
}

export type AnimationNames = 'Basic' | 'Thud' | 'Boing' | 'Plop' | 'Rattle' | 'Wibble';

export const DefaultAnimationDurations: Record<AnimationNames, number> = {
  Basic: 300,
  Thud: 300,
  Boing: 400,
  Plop: 300,
  Rattle: 300,
  Wibble: 800,
};

export const DefaultAnimationsEasing: Record<
  AnimationNames,
  | 'ease-in-out'
  | 'ease-in'
  | 'ease-out'
  | 'linear'
  | `cubic-bezier(${number},${number},${number},${number})`
> = {
  Basic: 'ease-in-out',
  Thud: 'ease-in-out',
  Wibble: 'ease-in-out',
  Boing: 'cubic-bezier(0, 1.68, 1, 0.97)',
  Plop: 'linear',
  Rattle: 'cubic-bezier(0, 1.68, 1, 0.97)',
};

export const DefaultAppearAnimations: Record<AnimationNames, CSSKeyframe[]> = {
  Basic: [
    {
      position: '0%',
      style: {
        transform: 'translateY(50%)',
        opacity: '0',
      },
    },
    {
      position: '100%',
      style: {
        transform: 'translateY(0%)',
        opacity: '1',
      },
    },
  ],
  Wibble: [
    {
      position: '0%',
      style: {
        transform: 'rotate(-2.5deg)',
        scale: '1',
        opacity: '0',
      },
    },
    {
      position: '12.5%',
      style: {
        transform: 'rotate(2.5deg)',
        scale: '1.05',
        opacity: '0.5',
      },
    },
    {
      position: '25%',
      style: {
        transform: 'rotate(-2.5deg)',
        scale: '1.05',
        opacity: '1',
      },
    },
    {
      position: '37.5%',
      style: {
        transform: 'rotate(2.5deg)',
        scale: '1.05',
        opacity: '1',
      },
    },
    {
      position: '50%',
      style: {
        transform: 'rotate(-2.5deg)',
        scale: '1.05',
        opacity: '1',
      },
    },
    {
      position: '62.5%',
      style: {
        transform: 'rotate(2.5deg)',
        scale: '1.05',
        opacity: '1',
      },
    },
    {
      position: '75%',
      style: {
        transform: 'rotate(-2.5deg)',
        scale: '1.05',
        opacity: '1',
      },
    },
    {
      position: '87.5%',
      style: {
        transform: 'rotate(2.5deg)',
        scale: '1.05',
        opacity: '1',
      },
    },
    {
      position: '100%',
      style: {
        transform: 'rotate(0deg)',
        scale: '1',
        opacity: '1',
      },
    },
  ],
  Rattle: [
    {
      position: '0%',
      style: {
        transform: 'translateX(5%)',
        opacity: '0',
      },
    },
    {
      position: '25%',
      style: {
        transform: 'translateX(-5%)',
        opacity: '0.25',
      },
    },
    {
      position: '50%',
      style: {
        transform: 'translateX(5%)',
        opacity: '0.5',
      },
    },
    {
      position: '75%',
      style: {
        transform: 'translateX(-5%)',
        opacity: '0.75',
      },
    },
    {
      position: '100%',
      style: {
        transform: 'translateX(0%)',
        opacity: '1',
      },
    },
  ],
  Thud: [
    {
      position: '0%',
      style: {
        transform: 'translateY(5%) rotate(5deg)',
        opacity: '0',
      },
    },
    {
      position: '25%',
      style: {
        transform: 'translateY(-5%) rotate(0deg)',
        opacity: '0.25',
      },
    },
    {
      position: '50%',
      style: {
        transform: 'translateY(5%) rotate(-5deg)',
        opacity: '0.5',
      },
    },
    {
      position: '75%',
      style: {
        transform: 'translateY(-5%) rotate(0deg)',
        opacity: '0.75',
      },
    },
    {
      position: '100%',
      style: {
        transform: 'translateY(0%) rotate(0deg)',
        opacity: '1',
      },
    },
  ],
  Boing: [
    {
      position: '0%',
      style: {
        scale: '0.25',
        transform: 'translateY(50%) rotate(-15deg)',
        opacity: '0',
      },
    },
    {
      position: '50%',
      style: {
        scale: '1.25',
        transform: 'translateY(25%) rotate(5deg)',
        opacity: '1',
      },
    },
    {
      position: '100%',
      style: {
        scale: '1',
        transform: 'translateY(0%) rotate(0deg)',
        opacity: '1',
      },
    },
  ],
  Plop: [
    {
      position: '0%',
      style: {
        scale: '0.75 1',
        opacity: '0',
      },
    },
    {
      position: '25%',
      style: {
        scale: '1 0.75',
        opacity: '0.25',
      },
    },
    {
      position: '50%',
      style: {
        scale: '1 0.75',
        opacity: '0.5',
      },
    },
    {
      position: '75%',
      style: {
        scale: '0.75 1',
        opacity: '0.75',
      },
    },
    {
      position: '100%',
      style: {
        scale: '1 1',
        opacity: '1',
      },
    },
  ],
};

export const DefaultDisappearAnimations: Record<AnimationNames, CSSKeyframe[]> = {
  Basic: [
    {
      position: '0%',
      style: {
        transform: 'translateY(0%)',
        opacity: '1',
      },
    },
    {
      position: '100%',
      style: {
        transform: 'translateY(50%)',
        opacity: '0',
      },
    },
  ],
  Wibble: [
    {
      position: '0%',
      style: {
        transform: 'rotate(0deg)',
        scale: '1',
        opacity: '1',
      },
    },
    {
      position: '12.5%',
      style: {
        transform: 'rotate(5deg)',
        scale: '1',
        opacity: '1',
      },
    },
    {
      position: '25%',
      style: {
        transform: 'rotate(-5deg)',
        scale: '1',
        opacity: '1',
      },
    },
    {
      position: '37.5%',
      style: {
        transform: 'rotate(5deg)',
        scale: '1',
        opacity: '1',
      },
    },
    {
      position: '50%',
      style: {
        transform: 'rotate(-5deg)',
        scale: '1',
        opacity: '1',
      },
    },
    {
      position: '62.5%',
      style: {
        transform: 'rotate(5deg)',
        scale: '1',
        opacity: '1',
      },
    },
    {
      position: '75%',
      style: {
        transform: 'rotate(-5deg)',
        scale: '1',
        opacity: '1',
      },
    },
    {
      position: '87.5%',
      style: {
        transform: 'rotate(5deg)',
        scale: '1',
        opacity: '0.5',
      },
    },
    {
      position: '100%',
      style: {
        transform: 'rotate(-5deg)',
        scale: '1',
        opacity: '0',
      },
    },
  ],
  Rattle: [
    {
      position: '0%',
      style: {
        transform: 'translateX(0%)',
        opacity: '1',
      },
    },
    {
      position: '25%',
      style: {
        transform: 'translateX(-5%)',
        opacity: '0.75',
      },
    },
    {
      position: '50%',
      style: {
        transform: 'translateX(5%)',
        opacity: '0.5',
      },
    },
    {
      position: '75%',
      style: {
        transform: 'translateX(-5%)',
        opacity: '0.25',
      },
    },
    {
      position: '100%',
      style: {
        transform: 'translateX(5%)',
        opacity: '0',
      },
    },
  ],
  Thud: [
    {
      position: '0%',
      style: {
        transform: 'translateY(15%) rotate(0deg)',
        opacity: '1',
      },
    },
    {
      position: '25%',
      style: {
        transform: 'translateY(5%) rotate(5deg)',
        opacity: '0.75',
      },
    },
    {
      position: '50%',
      style: {
        transform: 'translateY(-5%) rotate(-5deg)',
        opacity: '0.5',
      },
    },
    {
      position: '75%',
      style: {
        transform: 'translateY(5%) rotate(0deg)',
        opacity: '0.25',
      },
    },
    {
      position: '100%',
      style: {
        transform: 'translateY(0%) rotate(0deg)',
        opacity: '0',
      },
    },
  ],
  Boing: [
    {
      position: '0%',
      style: {
        scale: '1',
        transform: 'translateY(0%) rotate(0deg)',
        opacity: '1',
      },
    },
    {
      position: '50%',
      style: {
        scale: '1.25',
        transform: 'translateY(-5%) rotate(-10deg)',
        opacity: '1',
      },
    },
    {
      position: '100%',
      style: {
        scale: '0.75',
        transform: 'translateY(15%) rotate(5deg)',
        opacity: '0',
      },
    },
  ],
  Plop: [
    {
      position: '0%',
      style: {
        scale: '1 1',
        opacity: '1',
      },
    },
    {
      position: '25%',
      style: {
        scale: '1 0.75',
        opacity: '0.75',
      },
    },
    {
      position: '50%',
      style: {
        scale: '1 0.75',
        opacity: '0.5',
      },
    },
    {
      position: '75%',
      style: {
        scale: '0.75 1',
        opacity: '0.25',
      },
    },
    {
      position: '100%',
      style: {
        scale: '1 0.75',
        opacity: '0',
      },
    },
  ],
};
