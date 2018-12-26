import * as assert from "assert";
import { isFunction } from "prototyped.js/es6/function/methods";
import { forEach } from "prototyped.js/es6/object/methods";
import { isString } from "prototyped.js/es6/string/methods";

namespace AnyType {
  export type Caster<T> = (value: T) => T;

  export type Tester<T> = (value: T, path: string) => string | { [key: string]: string };
}

abstract class AnyType<T = any> {
  protected static type = "Any";

  public static isType = (value: any): value is AnyType => value instanceof AnyType;

  protected _required = false;

  protected _casters: Array<AnyType.Caster<T>> = [];

  protected _testers: Array<AnyType.Tester<T>> = [];

  protected _default: () => T | undefined = () => undefined;

  protected abstract _base(value: any): string | null;

  protected _cast(caster: AnyType.Caster<T>) {
    this._casters.push(caster);

    return this;
  }

  protected _test(tester: AnyType.Tester<T>) {
    this._testers.push(tester);

    return this;
  }

  protected _validate(path: string, value: any): { value: T, errors: { [key: string]: string[] } } {
    if (value === undefined || value === null) {
      value = this._default();

      if (value === undefined || value === null) {
        if (this._required) return { value, errors: { [path]: ["Must be provided"] } };

        return { value, errors: {} };
      }
    }

    const baseError = this._base(value);
    if (baseError) return { value, errors: { [path]: [baseError] } };

    this._casters.forEach(caster => value = caster(value));

    const errors = this._testers.reduce(
      (prev, tester) => {
        let result = tester(value, path);

        if (isString(result)) result = { [path]: result };

        forEach(result, (err, key) => {
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

  public get required() {
    this._required = true;

    return this;
  }

  public default(value: T | (() => T)) {
    if (isFunction(value)) {
      this._default = value;

      return this;
    }

    assert(
      !this._base(value),
      `The given value must be of "${(this.constructor as typeof AnyType).type}" type`,
    );

    this._default = () => value;

    return this;
  }
}

export default AnyType;
