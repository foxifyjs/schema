import assert from "assert";
import Base from "./Any";
import { NULL, number, TYPE } from "./utils";

const { isNumber } = number;

class Type extends Base<number> {
  protected static type = TYPE.NUMBER;

  public port() {
    return this._pipe((value) => ({
      value,
      errors:
        value < 0 || value > 65535
          ? "Expected to be a valid port (0 - 65535)"
          : NULL,
    }));
  }

  public integer() {
    return this._pipe((value) => ({
      value,
      errors: !Number.isInteger(value) ? "Expected to be an integer" : NULL,
    }));
  }

  public positive() {
    return this._pipe((value) => ({
      value,
      errors: value < 0 ? "Expected to be a positive number" : NULL,
    }));
  }

  public negative() {
    return this._pipe((value) => ({
      value,
      errors: value > 0 ? "Expected to be a negative number" : NULL,
    }));
  }

  public min(num: number) {
    assert(isNumber(num), "Expected num to be a number");

    return this._pipe((value) => ({
      value,
      errors: value < num ? `Expected to be at least ${num}` : NULL,
    }));
  }

  public max(num: number) {
    assert(isNumber(num), "Expected num to be a number");

    return this._pipe((value) => ({
      value,
      errors: value > num ? `Expected to be at most ${num}` : NULL,
    }));
  }

  public precision(num: number) {
    assert(isNumber(num), "Expected num to be a number");

    return this._pipe((value) => ({
      value,
      errors:
        (`${value}`.split(".")[1] || "").length > num
          ? `Expected to have at most ${num} decimal places`
          : NULL,
    }));
  }

  public multipliedBy(num: number) {
    assert(isNumber(num) && num >= 0, "Expected num to be a positive number");

    return this._pipe((value) => ({
      value,
      errors: value % num !== 0 ? `Expected to be a multiple of ${num}` : NULL,
    }));
  }

  protected _base(value: any) {
    if (isNumber(value)) return NULL;

    return "Expected to be a number";
  }
}

export default Type;
