import {
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  forwardRef,
} from 'react';

// Box — polymorphic div-like primitive with forwardRef support for the default 'div' case
type BoxOwnProps<T extends ElementType = 'div'> = {
  as?: T;
  children?: ReactNode;
};

type BoxProps<T extends ElementType = 'div'> = BoxOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof BoxOwnProps<T>>;

// Typed overload for the default 'div' case (supports ref)
export const Box = forwardRef<HTMLDivElement, BoxProps<'div'>>(
  ({ as, ...props }, ref) => {
    const C = (as ?? 'div') as ElementType;
    return <C ref={ref} {...props} />;
  }
) as (<T extends ElementType = 'div'>(
  props: BoxProps<T> & { ref?: React.Ref<unknown> }
) => React.ReactElement | null) & { displayName?: string };

Box.displayName = 'Box';

// Text — polymorphic span-like primitive
type TextOwnProps<T extends ElementType = 'span'> = {
  as?: T;
  children?: ReactNode;
};

type TextProps<T extends ElementType = 'span'> = TextOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof TextOwnProps<T>>;

export const Text = forwardRef<HTMLSpanElement, TextProps<'span'>>(
  ({ as, ...props }, ref) => {
    const C = (as ?? 'span') as ElementType;
    return <C ref={ref} {...props} />;
  }
) as (<T extends ElementType = 'span'>(
  props: TextProps<T> & { ref?: React.Ref<unknown> }
) => React.ReactElement | null) & { displayName?: string };

Text.displayName = 'Text';

export const Btn = (props: ComponentPropsWithRef<'button'>) => (
  <button type="button" {...props} />
);

export const Inp = forwardRef<HTMLInputElement, ComponentPropsWithRef<'input'>>(
  (props, ref) => <input ref={ref} {...props} />
);
Inp.displayName = 'Inp';

export const Img = (props: ComponentPropsWithRef<'img'>) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img alt="" {...props} />
);

export const Anchor = (props: ComponentPropsWithRef<'a'>) => <a {...props} />;

export const Label = (props: ComponentPropsWithRef<'label'>) => (
  <label {...props} />
);

export const Select = (props: ComponentPropsWithRef<'select'>) => (
  <select {...props} />
);
