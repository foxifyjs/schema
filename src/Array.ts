import assert from "assert";
import Base from "./Any";
import { number, TYPE } from "./utils";

const { isNumber } = number;

class Type<T = any> extends Base<T[]> {
  protected static type = TYPE.ARRAY;

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

  public items(type: Base) {
    assert(
      Base.isType(type),
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

export default Type;
