import assert from "assert";
import { isNumber } from "prototyped.js/es6/number/methods";
import AnyType from "./Any";

class ArrayType<T = any> extends AnyType<T[]> {
  protected static type = "Array";

  public min(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._pipe(value => ({
      value,
      errors: value.length < num ? `Must be at least ${num} item(s)` : {},
    }));
  }

  public max(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._pipe(value => ({
      value,
      errors: value.length > num ? `Must be at most ${num} item(s)` : {},
    }));
  }

  public length(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._pipe(value => ({
      value,
      errors: value.length !== num ? `Must be exactly ${num} item(s)` : {},
    }));
  }

  public items(type: AnyType) {
    assert(
      AnyType.isType(type),
      `Expected 'type' to be a 'TypeAny' instance, got '${typeof type}' instead`,
    );

    return this._pipe((value, path) =>
      value.reduce(
        (prev, item, index) => {
          const result = (type as any)._validate(`${path}[${index}]`, item);

          prev.value.push(result.value);

          prev.errors = Object.assign({}, prev.errors, result.errors);

          return prev;
        },
        { value: [] as any[], errors: {} },
      ),
    );
  }

  protected _base(value: any) {
    if (Array.isArray(value)) return null;

    return "Must be an array";
  }
}

export default ArrayType;
