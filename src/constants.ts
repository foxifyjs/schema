import type {
  AnyType,
  ArrayType,
  BooleanType,
  DateType,
  NumberType,
  ObjectType,
  StringType,
} from "./types";

/* ------------------------- Messages ------------------------- */

export interface MessageTemplate {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: (params: any) => string;
}

export type Messages<MT extends MessageTemplate> = {
  [Key in keyof MT]: string;
} & {
  required: string;
};

export type MessageArgs<
  T extends (params: Record<string, unknown>) => string
> = T extends (params: infer U) => string ? U : never;

/* ------------------------- Any ------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Validator<Type> = (value: Type) => Type;

export type DefaultType<Type> = () => Type | null;

export type DefaultValue<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SchemaT extends AnyType<any, any, any>
> = SchemaT["getDefault"] extends () => infer ReturnT ? ReturnT : never;

export type WithDefault<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SchemaT extends AnyType<any, any, any>,
  Default
> = SchemaT & { getDefault: () => Default };

export type WithRequired<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SchemaT extends AnyType<any, any, any>,
  Required extends boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = SchemaT & { isRequired: Required extends false ? any : true };

export type Result<
  Type,
  InputT,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SchemaT extends AnyType<Type, InputT, any>,
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

/* ------------------------- Schema ------------------------- */

export interface Schema {
  array<T = unknown>(): SchemaType<ArrayType<T>>;

  boolean(): SchemaType<BooleanType>;

  date(): SchemaType<DateType>;

  number(): SchemaType<NumberType>;

  object<
    T extends Record<string, unknown> = Record<string, unknown>
  >(): SchemaType<ObjectType<T>>;

  string(): SchemaType<StringType>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extend<Name extends string, Type extends () => AnyType<any, any, any>>(
    name: Name,
    type: Type,
  ): this & { [Key in Name]: () => SchemaType<SchemaReturn<Type>> };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaType<SchemaT extends AnyType<any, any, any>> = WithDefault<
  SchemaT,
  null
>;

export type SchemaReturn<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Fn extends () => AnyType<any, any, any>
> = Fn extends () => infer Type ? Type : never;
