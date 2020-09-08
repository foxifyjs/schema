import assert from "assert";
import Base from "./Any";
import { mergeErrors, NULL, number, object, TYPE } from "./utils";

const { isNumber } = number;
const { isObject, keys, mapValues, reduce } = object;

class Type<
  T extends object = object,
  P extends { [key in string | number]: Base } = {}
> extends Base<T, { keys?: P; unknown: boolean }> {
  protected static type = TYPE.OBJECT;

  constructor(obj?: P) {
    super();

    this.details.unknown = false;

    if (obj == null) return this;

    assert(isObject(obj), "Expected obj to be an object");

    obj = mapValues(obj, (value: any) => {
      if (Base.isType(value)) return value;

      assert(
        isObject(value),
        "Expected obj's values to be object or valid schema type",
      );

      return new Type(value as any);
    }) as any;

    this.details.keys = obj;

    return this._pipe(value =>
      reduce(
        obj as P,
        (prev, type, key) => {
          const result = type.validate((value as any)[key]);

          if (result.value !== undefined) prev.value[key] = result.value;

          prev.errors = mergeErrors<T>(prev.errors, {
            [key]: result.errors,
          } as any);

          return prev;
        },
        {
          value: this.details.unknown ? value : ({} as any),
          errors: NULL as Base.ValidationResult<T>["errors"],
        },
      ),
    );
  }

  public unknown() {
    this.details.unknown = true;

    return this;
  }

  public min(num: number) {
    assert(
      isNumber(num) && Number.isInteger(num) && num >= 0,
      "Expected num to be a positive integer",
    );

    return this._pipe(value => ({
      value,
      errors:
        keys(value).length < num
          ? `Expected to have at least ${num} key(s)`
          : NULL,
    }));
  }

  public max(num: number) {
    assert(
      isNumber(num) && Number.isInteger(num) && num >= 0,
      "Expected num to be a positive integer",
    );

    return this._pipe(value => ({
      value,
      errors:
        keys(value).length > num
          ? `Expected to have at most ${num} key(s)`
          : NULL,
    }));
  }

  public length(num: number) {
    assert(
      isNumber(num) && Number.isInteger(num) && num >= 0,
      "Expected num to be a positive integer",
    );

    return this._pipe(value => ({
      value,
      errors:
        keys(value).length !== num
          ? `Expected to have exactly ${num} key(s)`
          : NULL,
    }));
  }

  protected _base(value: any) {
    if (isObject(value)) return NULL;

    return "Expected to be an object";
  }
}

export default Type;
