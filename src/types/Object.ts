import AnyType from "./Any";
import {
  Value,
  MessageTemplate,
  Messages,
  DefaultValue,
  WithDefault,
  WithRequired,
} from "../constants";
import SchemaError, { ErrorDetails } from "../Error";

export default class ObjectType<
  T extends Record<string, unknown> = Record<string, unknown>,
  I = T
> extends AnyType<T, I, Template> {
  public get messages(): Messages<Template> {
    return {
      ...super.messages,
      object: "Expected {{ label }} to be an object",
      length: "Expected {{ label }} to contain exactly {{ length }} key(s)",
      max: "Expected {{ label }} to contain at most {{ max }} key(s)",
      min: "Expected {{ label }} to contain at least {{ min }} key(s)",
    };
  }

  public length(length: number): this {
    return this.pipe((value) => {
      if (Object.keys(value).length === length) return value;

      this.fail<string>(this.render("length", { length }));
    });
  }

  public max(max: number): this {
    return this.pipe((value) => {
      if (Object.keys(value).length <= max) return value;

      this.fail<string>(this.render("max", { max }));
    });
  }

  public min(min: number): this {
    return this.pipe((value) => {
      if (Object.keys(value).length >= min) return value;

      this.fail<string>(this.render("min", { min }));
    });
  }

  public keys<K extends KeysType<Value<T>>>(type: K): KeysResult<Value<T>, K> {
    return this.pipe((value) => {
      const errors: Record<string, unknown> = {};

      const result = Object.keys(type).reduce<Record<string, unknown>>(
        (prev, key) => {
          let ret = value[key];

          try {
            ret = type[key].label(key).validate(ret);
          } catch (error) {
            if (error instanceof SchemaError) {
              errors[key] = error.details;
            } else throw error;
          }

          if (ret != null) prev[key] = ret;

          return prev;
        },
        {},
      );

      if (Object.keys(errors).length > 0) this.fail(errors as ErrorDetails<T>);

      return result as T;
    }) as never;
  }

  protected initialValidator(value: unknown): T {
    if (value instanceof Object) return value as T;

    this.fail<string>(this.render("object"));
  }
}

export interface Template extends MessageTemplate {
  object(): string;

  length(params: { length: number }): string;

  max(params: { max: number }): string;

  min(params: { min: number }): string;
}

export type KeyValue<V> = null extends V
  ? AnyType<NonNullable<V>>
  : WithDefault<AnyType<V>, V> | WithRequired<AnyType<V>, true>;

export type Keys<T extends Record<string, unknown>> = {
  [K in keyof T]: KeyValue<T[K]>;
};

export type KeysType<T extends Record<string, unknown>> = T extends Record<
  string,
  unknown
>
  ? Record<string, unknown> extends T
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Keys<any>
    : Keys<T>
  : Keys<T>;

export type KeysResult<
  T extends Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  K extends Keys<T>
> = T extends Record<string, unknown>
  ? Record<string, unknown> extends T
    ? K extends Keys<infer U>
      ? ObjectType<U, Input<U, K>>
      : ObjectType<T>
    : ObjectType<T>
  : ObjectType<T>;

type Input<
  Value extends Record<string, unknown>,
  Schema extends Keys<Value>
> = Partial<InputNullable<Value, Schema>> &
  Pick<
    InputNullable<Value, Schema>,
    {
      [Key in keyof Value]: DefaultValue<Schema[Key]> extends null
        ? Schema[Key]["isRequired"] extends true
          ? Key
          : never
        : never;
    }[keyof Value]
  >;

type InputNullable<
  Value extends Record<string, unknown>,
  Schema extends Keys<Value>
> = {
  [Key in keyof Value]: DefaultValue<Schema[Key]> extends null
    ? Schema[Key]["isRequired"] extends true
      ? Value[Key]
      : Value[Key] | null | undefined
    : Value[Key] | null | undefined;
};
