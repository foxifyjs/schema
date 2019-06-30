import assert from "assert";
import { isFunction } from "prototyped.js/es6/function/methods";
import { forEach } from "prototyped.js/es6/object/methods";
import { isString } from "prototyped.js/es6/string/methods";

namespace AnyType {
  export type PipelineItem<T> = (
    value: T,
    path: string,
  ) => { value: T; errors: string | { [key: string]: string } };

  export type Caster<T> = (value: T) => T;

  export type Tester<T> = (
    value: T,
    path: string,
  ) => string | { [key: string]: string };
}

abstract class AnyType<T = any> {
  public static isType = (value: any): value is AnyType =>
    value instanceof AnyType;

  protected static type = "Any";

  protected _required = false;

  protected _pipeline: Array<AnyType.PipelineItem<T>> = [];

  public default(value: T | (() => T)) {
    if (isFunction(value)) {
      this._default = value;

      return this;
    }

    assert(
      !this._base(value),
      `The given value must be of "${
        (this.constructor as typeof AnyType).type
      }" type`,
    );

    this._default = () => value;

    return this;
  }

  public required(required = true) {
    this._required = required;

    return this;
  }

  protected _pipe(...items: Array<AnyType.PipelineItem<T>>) {
    this._pipeline = this._pipeline.concat(items);

    return this;
  }

  protected _validate(
    path: string,
    value: any,
  ): { value: T; errors: { [key: string]: string[] } } {
    if (value == null) {
      value = this._default();

      if (value == null) {
        if (this._required) {
          return { value, errors: { [path]: ["Must be provided"] } };
        }

        return { value, errors: {} };
      }
    }

    const baseError = this._base(value);
    if (baseError) return { value, errors: { [path]: [baseError] } };

    const errors = this._pipeline.reduce(
      (prev, tester) => {
        const result = tester(value, path);

        value = result.value;

        let errs = result.errors;

        if (isString(errs)) errs = { [path]: errs };

        forEach(errs, (err: any, key) => {
          if (!Array.isArray(err)) err = [err];

          if (prev[key]) {
            prev[key] = prev[key].concat(err);

            return;
          }

          prev[key] = err;
        });

        return prev;
      },
      {} as { [key: string]: string[] },
    );

    return {
      errors,
      value,
    };
  }

  protected _default: () => T | undefined = () => undefined;

  protected abstract _base(value: any): string | null;
}

export default AnyType;
