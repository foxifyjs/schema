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
  ? ResultRequired<Type, InputT, ParsedValue<Value, DefaultValue<SchemaT>>>
  : ResultOptional<Type, InputT, ParsedValue<Value, DefaultValue<SchemaT>>>;

export type ResultRequired<Type, InputT, Value> = Value extends InputT
  ? Type
  : never;

export type ResultOptional<Type, InputT, Value> = Value extends InputT
  ? Type
  : Value extends null | undefined
  ? null
  : never;

export type ParsedValue<Value, Default> = Value extends null | undefined
  ? Default
  : Value;
