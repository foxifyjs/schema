import type { AnyType } from "./types";

/* ------------------------- Any ------------------------- */

export type Validator<Type> = (value: Type) => Type;

export type DefaultType<Type> = () => Type | null;

export type DefaultValue<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SchemaT extends AnyType<any, any>
> = SchemaT["getDefault"] extends () => infer ReturnT ? ReturnT : never;

export type WithDefault<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SchemaT extends AnyType<any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Default extends DefaultType<any>
> = SchemaT & {
  getDefault: Default;
};

export type WithRequired<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SchemaT extends AnyType<any, any>,
  Required extends boolean
> = SchemaT & {
  isRequired: Required;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaType<SchemaT extends AnyType<any, any>> = WithDefault<
  SchemaT,
  () => null
>;

export type Result<
  Type,
  InputT,
  SchemaT extends AnyType<Type, InputT>,
  Value
> = SchemaT["isRequired"] extends true
  ? ResultRequired<Type, InputT, SchemaT, Value>
  : Value extends InputT
  ? Type
  : Value extends null | undefined
  ? DefaultValue<SchemaT> extends InputT
    ? Type
    : null
  : never;

export type ResultRequired<
  Type,
  InputT,
  SchemaT extends AnyType<Type, InputT>,
  Value
> = Value extends InputT
  ? Type
  : Value extends null | undefined
  ? DefaultValue<SchemaT> extends InputT
    ? Type
    : never
  : never;
