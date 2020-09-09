import AnyType from "./Any";
import SchemaError, { ErrorDetails } from "../Error";

export default class ArrayType<T> extends AnyType<T[]> {
  public length(length: number): this {
    return this.pipe((value) => {
      if (value.length === length) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to contain exactly ${length} item(s)`
          : `Expected ${label} to contain exactly ${length} item(s)`,
      );
    });
  }

  public max(max: number): this {
    return this.pipe((value) => {
      if (value.length <= max) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to contain at most ${max} item(s)`
          : `Expected ${label} to contain at most ${max} item(s)`,
      );
    });
  }

  public min(min: number): this {
    return this.pipe((value) => {
      if (value.length >= min) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to contain at least ${min} item(s)`
          : `Expected ${label} to contain at least ${min} item(s)`,
      );
    });
  }

  public items<A extends ItemsType<T>>(type: A): ItemsResult<T, A> {
    return this.pipe((value) => {
      const label = this._label;
      const errors: ErrorDetails<T[]> = {};

      const result = value.reduce<T[]>((prev, cur, index) => {
        let ret = cur;

        if (label != null) type.label(`${label}[${index}]`);

        try {
          ret = (type as AnyType<T>).validate(cur) as T;
        } catch (error) {
          if (error instanceof SchemaError) {
            errors[index] = error.details as ErrorDetails<T>;
          } else throw error;
        }

        return prev.concat(ret);
      }, []);

      if (Object.keys(errors).length > 0) this.fail(errors);

      return result;
    }) as never;
  }

  protected initialValidator(value: unknown): T[] {
    if (Array.isArray(value)) return value;

    const label = this._label;

    this.fail(
      label == null
        ? "Expected to be an array"
        : `Expected ${label} to be an array`,
    );
  }
}

export type ItemsType<T> = T extends unknown
  ? unknown extends T
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AnyType<any>
    : AnyType<T>
  : AnyType<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ItemsResult<T, A extends AnyType<any>> = T extends unknown
  ? unknown extends T
    ? A extends AnyType<infer U>
      ? ArrayType<U>
      : ArrayType<T>
    : ArrayType<T>
  : ArrayType<T>;
