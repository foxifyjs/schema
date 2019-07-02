import assert from "assert";
import Base from "./Any";
import { NULL, number, string, TYPE } from "./utils";

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
        ? "Expected to only contain a-z, A-Z, 0-9, and underscore (_)"
        : NULL,
    }));
  }

  public alphanum() {
    return this._pipe(value => ({
      value,
      errors: !/^[a-zA-Z0-9]*$/.test(value)
        ? "Expected to only contain a-z, A-Z, 0-9"
        : NULL,
    }));
  }

  public numeral() {
    return this._pipe(value => ({
      value,
      errors: !/^[0-9]*$/.test(value)
        ? "Expected to only contain numbers"
        : NULL,
    }));
  }

  public ip(version?: 4 | 6) {
    if (version != null) {
      assert(version === 4 || version === 6, "Expected version to be 4 or 6");
    }

    let tester: (value: string) => false | string;
    if (version === 4) {
      tester = value =>
        !ipv4Regex.test(value) && "Expected to be a valid ipv4 address";
    } else if (version === 6) {
      tester = value =>
        !ipv6Regex.test(value) && "Expected to be a valid ipv6 address";
    } else {
      tester = value =>
        !(ipv4Regex.test(value) || ipv6Regex.test(value)) &&
        "Expected to be a valid ip address";
    }

    return this._pipe(value => ({ value, errors: tester(value) || NULL }));
  }

  public email() {
    return this._pipe(value => ({
      value,
      errors: !/^\w[\w\.]+@\w+?\.[a-zA-Z]{2,3}$/.test(value)
        ? "Expected to be a valid email address"
        : NULL,
    }));
  }

  public creditCard() {
    return this._pipe(value => ({
      value,
      errors: !verifyCreditCard(value)
        ? "Expected to be a valid credit-card"
        : NULL,
    }));
  }

  public min(num: number) {
    assert(
      isNumber(num) && Number.isInteger(num) && num >= 0,
      "Expected num to be a positive integer",
    );

    return this._pipe(value => ({
      value,
      errors:
        value.length < num
          ? `Expected to have at least ${num} character(s)`
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
        value.length > num
          ? `Expected to have at most ${num} character(s)`
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
        value.length !== num
          ? `Expected to have exactly ${num} character(s)`
          : NULL,
    }));
  }

  public regex(regex: RegExp) {
    assert(regex instanceof RegExp, "Expected regex to be a valid regex");

    return this._pipe(value => ({
      value,
      errors: !regex.test(value) ? `Expected to match ${regex}` : NULL,
    }));
  }

  public enum(enums: string[]) {
    enums.forEach(str =>
      assert(isString(str), "Expected enums to be an array of string"),
    );

    const TYPE = JSON.stringify(enums);

    return this._pipe(value => ({
      value,
      errors: !enums.includes(value) ? `Expected to be one of ${TYPE}` : NULL,
    }));
  }

  /******************** CASTS ********************/

  public truncate(length: number, truncateString?: string) {
    assert(
      isNumber(length) && Number.isInteger(length) && length >= 0,
      "Expected length to be a positive integer",
    );

    return this._pipe(value => ({
      value: truncate(value, length, truncateString),
      errors: NULL,
    }));
  }

  public replace(pattern: string | RegExp, replacement: string) {
    assert(
      isString(pattern) || pattern instanceof RegExp,
      "Expected to pattern to be string or regex",
    );
    assert(isString(replacement), "Expected replacement to be an string");

    return this._pipe(value => ({
      value: value.replace(pattern, replacement),
      errors: NULL,
    }));
  }

  /******************** BASE ********************/

  protected _base(value: any) {
    if (isString(value)) return NULL;

    return "Expected to be an string";
  }
}

export default Type;
