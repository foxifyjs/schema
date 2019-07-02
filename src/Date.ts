import assert from "assert";
import Base from "./Any";
import { array, date, NULL, number, string, TYPE } from "./utils";

const { prepend } = array;
const { isDate } = date;
const { isNumber } = number;
const { isString } = string;

class Type extends Base<Date | number | string> {
  protected static type = TYPE.DATE;

  public min(date: Date | number | string | (() => Date | number | string)) {
    if (isString(date) || isNumber(date)) date = new Date(date);

    let generator = date as () => Date | number | string;

    if (isDate(date)) {
      assert(date.toString() !== "Invalid Date");

      generator = () => date as Date;
    }

    return this._pipe(value => {
      const min = new Date(generator());

      return {
        value,
        errors: value < min ? `Expected to be at least ${min}` : NULL,
      };
    });
  }

  public max(date: Date | number | string | (() => Date | number | string)) {
    if (isString(date) || isNumber(date)) date = new Date(date);

    let generator = date as () => Date | number | string;

    if (isDate(date)) {
      assert(date.toString() !== "Invalid Date");

      generator = () => date as Date;
    }

    return this._pipe(value => {
      const max = new Date(generator());

      return {
        value,
        errors: value > max ? `Expected to be at most ${max}` : NULL,
      };
    });
  }

  protected _base(value: any) {
    if (isString(value) || isNumber(value)) {
      prepend(this._pipeline, (val: any) => ({
        value: new Date(val),
        errors: NULL,
      }));

      value = new Date(value);
    }

    if (isDate(value) && value.toString() !== "Invalid Date") return NULL;

    return "Expected to be a valid date";
  }
}

export default Type;
