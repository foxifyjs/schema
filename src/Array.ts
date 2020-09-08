import assert from "assert";
import Base, { ValidationResult } from "./Any";
import { mergeErrors, NULL, number, TYPE } from "./utils";

const { isNumber } = number;

class Type<T = any, P extends Base = Base> extends Base<T[], { items?: P }> {
  protected static type = TYPE.ARRAY;

  public min(num: number) {
    assert(isNumber(num) && num >= 0, "Expected num to be a positive number");

    return this._pipe((value) => ({
      value,
      errors:
        value.length < num
          ? `Expected to contain at least ${num} item(s)`
          : NULL,
    }));
  }

  public max(num: number) {
    assert(isNumber(num) && num >= 0, "Expected num to be a positive number");

    return this._pipe((value) => ({
      value,
      errors:
        value.length > num
          ? `Expected to contain at most ${num} item(s)`
          : NULL,
    }));
  }

  public length(num: number) {
    assert(isNumber(num) && num >= 0, "Expected num to be a positive number");

    return this._pipe((value) => ({
      value,
      errors:
        value.length !== num
          ? `Expected to contain exactly ${num} item(s)`
          : NULL,
    }));
  }

  public items(type: P) {
    assert(
      Base.isType(type),
      `Expected type to be a valid schema type, got ${typeof type}`,
    );

    this.details.items = type;

    return this._pipe((value) =>
      value.reduce(
        (prev, item, index) => {
          const result = type.validate(item);

          prev.value.push(result.value);

          prev.errors = mergeErrors<T[]>(prev.errors, {
            [`[${index}]`]: result.errors,
          } as any);

          return prev;
        },
        {
          value: [] as any[],
          errors: NULL as ValidationResult<T[]>["errors"],
        },
      ),
    );
  }

  protected _base(value: any) {
    if (Array.isArray(value)) return NULL;

    return "Expected to be an array";
  }
}

export default Type;
