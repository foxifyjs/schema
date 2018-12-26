import * as assert from "assert";
import { prepend } from "prototyped.js/es6/array/methods";
import { isDate } from "prototyped.js/es6/date/methods";
import { isNumber } from "prototyped.js/es6/number/methods";
import { isString } from "prototyped.js/es6/string/methods";
import AnyType from "./Any";

class DateType extends AnyType<Date | number | string> {
  protected static type = "Date";

  protected _base(value: any) {
    if (isString(value) || isNumber(value)) {
      prepend(this._casters, (val: any) => new Date(val));

      value = new Date(value);
    }

    if (isDate(value) && value.toString() !== "Invalid Date") return null;

    return "Must be a valid date";
  }

  public min(date: Date | number | string | (() => (Date | number | string))) {
    if (isString(date) || isNumber(date)) date = new Date(date);

    let generator = date as () => (Date | number | string);

    if (isDate(date)) {
      assert(date.toString() !== "Invalid Date");

      generator = () => date as Date;
    }

    return this._test((value) => {
      const min = new Date(generator());

      if (value < min) return `Must be at least ${min}`;

      return {};
    });
  }

  public max(date: Date | number | string | (() => (Date | number | string))) {
    if (isString(date) || isNumber(date)) date = new Date(date);

    let generator = date as () => (Date | number | string);

    if (isDate(date)) {
      assert(date.toString() !== "Invalid Date");

      generator = () => date as Date;
    }

    return this._test((value) => {
      const max = new Date(generator());

      if (value > max) return `Must be at most ${max}`;

      return {};
    });
  }
}

export default DateType;
