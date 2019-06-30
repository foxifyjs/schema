import assert from "assert";
import Base from "./Any";
import { number, string, TYPE } from "./utils";

const { isNumber } = number;
const { isString, truncate } = string;

// tslint:disable-next-line:max-line-length
const ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
// tslint:disable-next-line:max-line-length
const ipv6Regex = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;

/**
 * using Luhn Algorithm
 */
function verifyCreditCard(code: string): boolean {
  code = code.replace(/\-/g, ""); // just in case

  const luhnArr = [
    [0, 2, 4, 6, 8, 1, 3, 5, 7, 9],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  ];

  const digits: number[] = code
    .split("") // spliting digits
    .map((digit: string) => +digit); // parsing digits into number type

  let sum: number = 0;

  digits.map((digit: number, index: number) => {
    // tslint:disable-next-line:no-bitwise
    sum += luhnArr[(digits.length - index) & 1][digit];
  });

  return sum % 10 === 0 && sum > 0;
}

class Type extends Base<string> {
  protected static type = TYPE.STRING;

  /******************** TESTS ********************/

  public token() {
    return this._pipe(value => ({
      value,
      errors: !/^[a-zA-Z0-9_]*$/.test(value)
        ? `Must only contain a-z, A-Z, 0-9, and underscore (_)`
        : {},
    }));
  }

  public alphanum() {
    return this._pipe(value => ({
      value,
      errors: !/^[a-zA-Z0-9]*$/.test(value)
        ? `Must only contain a-z, A-Z, 0-9`
        : {},
    }));
  }

  public numeral() {
    return this._pipe(value => ({
      value,
      errors: !/^[0-9]*$/.test(value) ? `Must only contain numbers` : {},
    }));
  }

  public ip() {
    return this._pipe(value => ({
      value,
      errors: !(ipv4Regex.test(value) || ipv6Regex.test(value))
        ? `Must be an ipv4 or ipv6`
        : {},
    }));
  }

  public ipv4() {
    return this._pipe(value => ({
      value,
      errors: !ipv4Regex.test(value) ? `Must be an ipv4` : {},
    }));
  }

  public ipv6() {
    return this._pipe(value => ({
      value,
      errors: !ipv6Regex.test(value) ? `Must be an ipv6` : {},
    }));
  }

  public email() {
    return this._pipe(value => ({
      value,
      errors: !/^\w[\w\.]+@\w+?\.[a-zA-Z]{2,3}$/.test(value)
        ? "Must be an email address"
        : {},
    }));
  }

  public creditCard() {
    return this._pipe(value => ({
      value,
      errors: !verifyCreditCard(value) ? "Must be a credit-card" : {},
    }));
  }

  public min(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._pipe(value => ({
      value,
      errors: value.length < num ? `Must be at least ${num} characters` : {},
    }));
  }

  public max(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._pipe(value => ({
      value,
      errors: value.length > num ? `Must be at most ${num} characters` : {},
    }));
  }

  public length(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._pipe(value => ({
      value,
      errors: value.length !== num ? `Must be exactly ${num} characters` : {},
    }));
  }

  public regex(regex: RegExp) {
    assert(regex instanceof RegExp, "'regex' must be a regex");

    return this._pipe(value => ({
      value,
      errors: !regex.test(value) ? `Must match ${regex}` : {},
    }));
  }

  public enum(enums: string[]) {
    enums.forEach(str =>
      assert(isString(str), "'enums' must be an string array"),
    );

    const TYPE = JSON.stringify(enums);

    return this._pipe(value => ({
      value,
      errors: !enums.includes(value) ? `Must be one of ${TYPE}` : {},
    }));
  }

  /******************** CASTS ********************/

  public truncate(length: number, truncateString?: string) {
    assert(isNumber(length), "'length' must be a number");
    assert(length >= 0, "'length' must be a positive number");

    return this._pipe(value => ({
      value: truncate(value, length, truncateString),
      errors: {},
    }));
  }

  public replace(pattern: string | RegExp, replacement: string) {
    assert(
      isString(pattern) || pattern instanceof RegExp,
      "'pattern' must be string or regex",
    );
    assert(isString(replacement), "'replacement' must be an string");

    return this._pipe(value => ({
      value: value.replace(pattern, replacement),
      errors: {},
    }));
  }

  /******************** BASE ********************/

  protected _base(value: any) {
    if (isString(value)) return null;

    return "Must be an string";
  }
}

export default Type;
