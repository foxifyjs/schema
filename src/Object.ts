import assert from "assert";
import Base from "./Any";
import { number, object, string, TYPE } from "./utils";

const { isNumber } = number;
const { isObject, keys, mapValues, reduce } = object;
const { isEmpty } = string;

class Type<T extends object = object> extends Base<T> {
  protected static type = TYPE.OBJECT;

  constructor(obj?: T) {
    super();

    if (obj == null) return this;

    assert(isObject(obj), "Expected obj to be an object");

    obj = mapValues(obj, (value: any) => {
      if (Base.isType(value)) return value;

      assert(
        isObject(value),
        "Expected obj's values to be object or an schema type",
      );

      return new Type(value);
    }) as any;

    return this._pipe((value, path) =>
      reduce(
        obj as T,
        (prev, type: any, key) => {
          const result = type._validate(
            isEmpty(path) ? key : `${path}.${key}`,
            value[key],
          );

          prev.errors = Object.assign({}, prev.errors, result.errors);

          if (result.value !== undefined) prev.value[key] = result.value;

          return prev;
        },
        { value: {} as any, errors: {} as any },
      ),
    );
  }

  public min(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");
    assert(Number.isInteger(num), "'num' must be an integer");

    return this._pipe(value => ({
      value,
      errors:
        keys(value).length < num ? `Must have at least ${num} key(s)` : {},
    }));
  }

  public max(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");
    assert(Number.isInteger(num), "'num' must be an integer");

    return this._pipe(value => ({
      value,
      errors: keys(value).length > num ? `Must have at most ${num} key(s)` : {},
    }));
  }

  public length(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");
    assert(Number.isInteger(num), "'num' must be an integer");

    return this._pipe(value => ({
      value,
      errors:
        keys(value).length !== num ? `Must have exactly ${num} key(s)` : {},
    }));
  }

  protected _base(value: any) {
    if (isObject(value)) return null;

    return "Must be an object";
  }
}

export default Type;
