import assert from "assert";
import Base from "./Any";
import { number, TYPE } from "./utils";

const { isNumber } = number;

class Type extends Base<number> {
  protected static type = TYPE.NUMBER;

  public port() {
    return this._pipe(value => ({
      value,
      errors:
        value < 0 || value > 65535 ? `Must be a valid port (0 - 65535)` : {},
    }));
  }

  public integer() {
    return this._pipe(value => ({
      value,
      errors: !Number.isInteger(value) ? `Must be an integer` : {},
    }));
  }

  public positive() {
    return this._pipe(value => ({
      value,
      errors: value < 0 ? `Must be a positive number` : {},
    }));
  }

  public negative() {
    return this._pipe(value => ({
      value,
      errors: value > 0 ? `Must be a negative number` : {},
    }));
  }

  public min(num: number) {
    assert(isNumber(num), "'num' must be a number");

    return this._pipe(value => ({
      value,
      errors: value < num ? `Must be at least ${num}` : {},
    }));
  }

  public max(num: number) {
    assert(isNumber(num), "'num' must be a number");

    return this._pipe(value => ({
      value,
      errors: value > num ? `Must be at most ${num}` : {},
    }));
  }

  public precision(num: number) {
    assert(isNumber(num), "'num' must be a number");

    return this._pipe(value => ({
      value,
      errors:
        (`${value}`.split(".")[1] || "").length > num
          ? `Must be have at most ${num} decimal places`
          : {},
    }));
  }

  public multipliedBy(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._pipe(value => ({
      value,
      errors: value % num !== 0 ? `Must be a multiple of ${num}` : {},
    }));
  }

  protected _base(value: any) {
    if (isNumber(value)) return null;

    return "Must be a number";
  }
}

export default Type;
