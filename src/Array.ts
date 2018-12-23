import * as assert from "assert";
import { compact, deepFlatten } from "prototyped.js/es6/array/methods";
import { isNumber } from "prototyped.js/es6/number/methods";
import AnyType from "./Any";

class ArrayType<T = any> extends AnyType<T[]> {
  protected static type = "Array";

  protected _base(value: any) {
    if (Array.isArray(value)) return null;

    return "Must be an array";
  }

  public min(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._test(value => value.length < num ? `Must be at least ${num} items` : null);
  }

  public max(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._test(value => value.length > num ? `Must be at most ${num} items` : null);
  }

  public length(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._test(value => value.length !== num ? `Must be exactly ${num} items` : null);
  }

  public of(type: AnyType) {
    assert(
      this.constructor.isType(type),
      `Expected 'type' to be a 'TypeAny' instance, got '${typeof type}' insted`,
    );

    return this
      ._cast(value => value.map(item => type.validate(item).value))
      ._test(value => deepFlatten(
        compact(
          value.map(item => type.validate(item).errors),
        ),
      )[0]);
  }
}

export default ArrayType;
