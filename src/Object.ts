import assert from "assert";
import { isNumber } from "prototyped.js/es6/number/methods";
import {
  isObject,
  keys,
  mapValues,
  reduce,
} from "prototyped.js/es6/object/methods";
import { isEmpty } from "prototyped.js/es6/string/methods";
import AnyType from "./Any";

class ObjectType<T extends object = object> extends AnyType<T> {
  protected static type = "Object";

  constructor(obj?: T) {
    super();

    if (obj == null) return this;

    assert(isObject(obj), "Expected obj to be an object");

    obj = mapValues(obj, (value: any) => {
      if (ObjectType.isType(value)) return value;

      assert(
        isObject(value),
        "Expected obj's values to be object or instance of AnyType",
      );

      return new ObjectType(value);
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

export default ObjectType;
