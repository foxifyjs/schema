import assert from "assert";
import { prepend } from "prototyped.js/es6/array/methods";
import { isDate } from "prototyped.js/es6/date/methods";
import { isNumber } from "prototyped.js/es6/number/methods";
import { isString } from "prototyped.js/es6/string/methods";
import AnyType from "./Any";

class DateType extends AnyType<Date | number | string> {
  protected static type = "Date";

  public min(date: Date | number | string | (() => Date | number | string)) {
    if (isString(date) || isNumber(date)) date = new Date(date);

    let generator = date as () => Date | number | string;

    if (isDate(date)) {
      assert(date.toString() !== "Invalid Date");

      generator = () => date as Date;
    }

    return this._pipe(value => {
      const min = new Date(generator());

      return { value, errors: value < min ? `Must be at least ${min}` : {} };
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
        errors: value > max ? `Must be at most ${max}` : {},
      };
    });
  }

  protected _base(value: any) {
    if (isString(value) || isNumber(value)) {
      prepend(this._pipeline, (val: any) => ({
        value: new Date(val),
        errors: {},
      }));

      value = new Date(value);
    }

    if (isDate(value) && value.toString() !== "Invalid Date") return null;

    return "Must be a valid date";
  }
}

export default DateType;
