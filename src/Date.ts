import * as assert from "assert";
import { prepend } from "prototyped.js/es6/array/methods";
import { isDate } from "prototyped.js/es6/date/methods";
import { isNumber } from "prototyped.js/es6/number/methods";
import { isString } from "prototyped.js/es6/string/methods";
import AnyType from "./Any";

class DateType extends AnyType<Date> {
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

    if (isDate(date)) {
      assert(date.toString() !== "Invalid Date");

      date = () => date as Date;
    }

    return this._test(value => value < (date as (() => Date))()
      ? `Must be at least ${date}`
      : null);
  }

  public max(date: Date | number | string | (() => (Date | number | string))) {
    if (isString(date) || isNumber(date)) date = new Date(date);

    if (isDate(date)) {
      assert(date.toString() !== "Invalid Date");

      date = () => date as Date;
    }

    return this._test(value => value > (date as (() => Date))()
      ? `Must be at most ${date}`
      : null);
  }
}

export default DateType;
