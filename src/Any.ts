import assert from "assert";
import { func, object, string, TYPE } from "./utils";

const { isFunction } = func;
const { forEach } = object;
const { isString } = string;

namespace Type {
  export type PipelineItem<T> = (
    value: T,
    path: string,
  ) => { value: T; errors: string | { [key: string]: string } };

  export interface Options<T> {
    def: () => T | null;
    required: boolean;
  }
}

abstract class Type<T = any> {
  public static isType = (value: any): value is Type => value instanceof Type;

  protected static type: string = TYPE.ANY;

  protected _options: Type.Options<T> = {
    def: () => null,
    required: false,
  };

  protected _pipeline: Array<Type.PipelineItem<T>> = [];

  public default(value: T | (() => T)) {
    if (isFunction(value)) {
      this._options.def = value;

      return this;
    }

    assert(
      !this._base(value),
      `The given value must be of "${
        (this.constructor as typeof Type).type
      }" type`,
    );

    this._options.def = () => value;

    return this;
  }

  public required(required = true) {
    this._options.required = required;

    return this;
  }

  protected _pipe(...items: Array<Type.PipelineItem<T>>) {
    this._pipeline = this._pipeline.concat(items);

    return this;
  }

  protected _validate(
    path: string,
    value: any,
  ): { value: T; errors: { [key: string]: string[] } } {
    const { def, required } = this._options;

    if (value == null) {
      value = def();

      if (value == null) {
        if (required) {
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

  protected abstract _base(value: any): string | null;
}

export default Type;
