import type { AnyType } from "./types";

/* ------------------------- Any ------------------------- */

export type Validator<T> = (value: T) => T;

export type DefaultType<T> = () => T | null;

export type DefaultValue<
  A extends AnyType<any, any>
> = A["getDefault"] extends () => infer R ? R : never;

export type WithDefault<
  A extends AnyType<any, any>,
  V extends DefaultType<any>
> = A & {
  getDefault: V;
};

export type WithRequired<A extends AnyType<any, any>, R extends boolean> = A & {
  isRequired: R;
};

export type SchemaType<T extends AnyType<any, any>> = WithDefault<
  T,
  () => null
>;

export type Result<
  T,
  I,
  A extends AnyType<T, I>,
  V
> = A["isRequired"] extends true
  ? ResultRequired<T, I, A, V>
  : V extends I
  ? T
  : V extends null | undefined
  ? null
  : never;

export type ResultRequired<T, I, A extends AnyType<T, I>, V> = DefaultValue<
  A
> extends I
  ? T
  : V extends null | undefined
  ? never
  : V extends I
  ? T
  : never;
