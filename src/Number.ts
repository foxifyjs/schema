import * as assert from "assert";
import { isNumber } from "prototyped.js/es6/number/methods";
import AnyType from "./Any";

class NumberType extends AnyType<number> {
  protected static type = "Number";

  protected _base(value: any) {
    if (isNumber(value)) return null;

    return "Must be a number";
  }

  get integer() {
    return this._test(value => !Number.isInteger(value) ? `Must be an integer` : null);
  }

  get positive() {
    return this._test(value => value < 0 ? `Must be a positive number` : null);
  }

  get negative() {
    return this._test(value => value > 0 ? `Must be a negative number` : null);
  }

  public min(num: number) {
    assert(isNumber(num), "'num' must be a number");

    return this._test(value => value < num ? `Must be at least ${num}` : null);
  }

  public max(num: number) {
    assert(isNumber(num), "'num' must be a number");

    return this._test(value => value > num ? `Must be at most ${num}` : null);
  }

  public precision(num: number) {
    assert(isNumber(num), "'num' must be a number");

    return this._test(value => (`${value}`.split(".")[1] || "").length < num ?
      `Must be have at most ${num} decimal places` : null);
  }

  public multipliedBy(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._test(value => value % num !== 0 ? `Must be a multiple of ${num}` : null);
  }
}

export default NumberType;
