import assert from "assert";
import { func, mergeErrors, NULL, TYPE } from "./utils";

const { isFunction } = func;

namespace Type {
  export type Error<T> =
    | string[]
    | string
    | null
    | (T extends object
        ? { [key in string | number]: string[] }
        : T extends any[]
        ? { [key: string]: string[] }
        : null);

  export type PipelineItem<T> = (value: T) => { value: T; errors: Error<T> };

  export interface ValidationResult<T> {
    value: T;
    errors: Error<T>;
  }

  export interface Options<T> {
    def: () => T | undefined;
    required: boolean;
  }
}

abstract class Type<T = any, O extends object = {}> {
  public static isType = (value: any): value is Type => value instanceof Type;

  protected static type: string = TYPE.ANY;

  public details: Type.Options<T> & O = {
    def: () => undefined,
    required: false,
  } as Type.Options<T> & O;

  protected _pipeline: Array<Type.PipelineItem<T>> = [];

  public default(value: T | (() => T)) {
    if (isFunction(value)) {
      this.details.def = value;

      return this;
    }

    assert(
      !this._base(value),
      `Expected value to be ${(this.constructor as typeof Type).type}`,
    );

    this.details.def = () => value;

    return this;
  }

  public required(required = true) {
    this.details.required = required;

    return this;
  }

  public validate(value: any): Type.ValidationResult<T> {
    const { def, required } = this.details;

    if (value == null) {
      value = def();

      if (value == null) {
        if (required) {
          return {
            value,
            errors: ["Expected to be provided"],
          };
        }

        return { value, errors: NULL };
      }
    }

    const baseError = this._base(value);
    if (baseError) return { value, errors: [baseError] };

    return this._pipeline.reduce(
      (prev, tester) => {
        const result = tester(prev.value);

        prev.value = result.value;

        prev.errors = mergeErrors<T>(prev.errors, result.errors);

        return prev;
      },
      { value, errors: NULL as Type.ValidationResult<T>["errors"] },
    );
  }

  protected _pipe(...items: Array<Type.PipelineItem<T>>) {
    this._pipeline = this._pipeline.concat(items);

    return this;
  }

  protected abstract _base(value: any): string | null;
}

export default Type;
