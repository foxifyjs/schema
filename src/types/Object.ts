import AnyType from "./Any";
import SchemaError, { ErrorDetails } from "../Error";

export default class ObjectType<
  T extends Record<string, unknown>
> extends AnyType<T> {
  public length(length: number): this {
    return this.pipe((value) => {
      if (Object.keys(value).length === length) return value;

      const label = this._label;

      this.fail<string>(
        label == null
          ? `Expected to contain exactly ${length} key(s)`
          : `Expected ${label} to contain exactly ${length} key(s)`,
      );
    });
  }

  public max(max: number): this {
    return this.pipe((value) => {
      if (Object.keys(value).length <= max) return value;

      const label = this._label;

      this.fail<string>(
        label == null
          ? `Expected to contain at most ${max} key(s)`
          : `Expected ${label} to contain at most ${max} key(s)`,
      );
    });
  }

  public min(min: number): this {
    return this.pipe((value) => {
      if (Object.keys(value).length >= min) return value;

      const label = this._label;

      this.fail<string>(
        label == null
          ? `Expected to contain at least ${min} key(s)`
          : `Expected ${label} to contain at least ${min} key(s)`,
      );
    });
  }

  public keys<K extends KeysType<T>>(type: K): KeysResult<T, K> {
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

    const label = this._label;

    this.fail<string>(
      label == null
        ? "Expected to be an object"
        : `Expected ${label} to be an object`,
    );
  }
}

export type Keys<T extends Record<string, unknown>> = {
  [K in keyof T]: AnyType<T[K]>;
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
  K extends Keys<Record<string, any>>
> = T extends Record<string, unknown>
  ? Record<string, unknown> extends T
    ? K extends Keys<infer U>
      ? ObjectType<U>
      : ObjectType<T>
    : ObjectType<T>
  : ObjectType<T>;
