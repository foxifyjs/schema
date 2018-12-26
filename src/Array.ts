import * as assert from "assert";
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

    return this._test(value => value.length < num ? `Must be at least ${num} item(s)` : {});
  }

  public max(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._test(value => value.length > num ? `Must be at most ${num} item(s)` : {});
  }

  public length(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._test(value => value.length !== num ? `Must be exactly ${num} item(s)` : {});
  }

  public of(type: AnyType) {
    assert(
      AnyType.isType(type),
      `Expected 'type' to be a 'TypeAny' instance, got '${typeof type}' instead`,
    );

    return this
      ._cast(value => value.map(item => (type as any)._validate("", item).value))
      ._test((value, path) => value.reduce(
        (prev, item, index) => Object.assign(
          {},
          prev,
          (type as any)._validate(`${path}[${index}]`, item).errors,
        ),
        {},
      ));
  }
}

export default ArrayType;
