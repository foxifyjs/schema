import * as assert from "assert";
import { compact } from "prototyped.js/es6/array/methods";
import { isFunction } from "prototyped.js/es6/function/methods";

interface AnyType {
  constructor: typeof AnyType;
}

abstract class AnyType<T = any> {
  protected static type = "Any";

  public static isType = (value: any): value is AnyType => value instanceof AnyType;

  protected _required = false;

  protected _casters: Array<(value: T) => T> = [];

  protected _testers: Array<(value: T) => string | null> = [];

  protected _default: () => T | undefined = () => undefined;

  protected abstract _base(value: any): string | null;

  protected _cast(caster: (value: T) => T) {
    this._casters.push(caster);

    return this;
  }

  protected _test(tester: (value: T) => string | null) {
    this._testers.push(tester);

    return this;
  }

  public get required() {
    this._required = true;

    return this;
  }

  public default(value: T | (() => T)) {
    if ((isFunction(value))) {
      this._default = value;

      return this;
    }

    assert(
      !this._base(value),
      `The given value must be of "${this.constructor.type}" type`,
    );

    this._default = () => value;

    return this;
  }

  public validate(value: any): { value: T, errors: string[] | null } {
    if (value === undefined || value === null) {
      value = this._default();

      if (value === undefined || value === null) {
        if (this._required) return { value, errors: ["Must be provided"] };

        return { value, errors: null };
      }
    }

    const baseError = this._base(value);
    if (baseError) return { value, errors: [baseError] };

    this._casters.forEach(caster => value = caster(value));

    const errors: string[] = compact(
      this._testers.map(tester => tester(value)),
    ) as any;

    if (errors.length === 0) return { value, errors: null };

    return {
      errors,
      value,
    };
  }
}

export default AnyType;
