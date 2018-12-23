import * as assert from "assert";
import { isNumber } from "prototyped.js/es6/number/methods";
import { isString, truncate } from "prototyped.js/es6/string/methods";
import { CreditCard } from "verifications";
import AnyType from "./Any";

// tslint:disable-next-line:max-line-length
const ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
// tslint:disable-next-line:max-line-length
const ipv6Regex = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;

class StringType extends AnyType<string> {
  protected static type = "String";

  protected _base(value: any) {
    if (isString(value)) return null;

    return "Must be an string";
  }

  /******************** TESTS ********************/

  get token() {
    return this._test(value => !/^[a-zA-Z0-9_]*$/.test(value) ?
      `Must only contain a-z, A-Z, 0-9, and underscore (_)` : null);
  }

  get alphanum() {
    return this._test(value => !/^[a-zA-Z0-9]*$/.test(value) ?
      `Must only contain a-z, A-Z, 0-9` : null);
  }

  get numeral() {
    return this._test(value => !/^[0-9]*$/.test(value)
      ? `Must only contain numbers` : null);
  }

  get ip() {
    return this._test(value => !(ipv4Regex.test(value) || ipv6Regex.test(value)) ?
      `Must be an ipv4 or ipv6` : null);
  }

  get ipv4() {
    return this._test(value => !ipv4Regex.test(value) ? `Must be an ipv4` : null);
  }

  get ipv6() {
    return this._test(value => !ipv6Regex.test(value) ? `Must be an ipv6` : null);
  }

  get email() {
    return this._test(value => !/^\w[\w\.]+@\w+?\.[a-zA-Z]{2,3}$/.test(value)
      ? "Must be an email address" : null);
  }

  get creditCard() {
    return this._test(value => !CreditCard.verify(value)
      ? "Must be a credit-card" : null);
  }

  public min(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._test(value => value.length < num ? `Must be at least ${num} characters` : null);
  }

  public max(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._test(value => value.length > num ? `Must be at most ${num} characters` : null);
  }

  public length(num: number) {
    assert(isNumber(num), "'num' must be a number");
    assert(num >= 0, "'num' must be a positive number");

    return this._test(value => value.length !== num ? `Must be exactly ${num} characters` : null);
  }

  public regex(regex: RegExp) {
    assert(regex instanceof RegExp, "'regex' must be a regex");

    return this._test(value => !regex.test(value) ? `Must match ${regex}` : null);
  }

  public enum(enums: string[]) {
    enums.forEach(str => assert(isString(str), "'enums' must be an string array"));

    const TYPE = JSON.stringify(enums);

    return this._test(value => !enums.includes(value) ? `Must be one of ${TYPE}` : null);
  }

  /******************** CASTS ********************/

  public truncate(length: number) {
    assert(isNumber(length), "'length' must be a number");
    assert(length >= 0, "'length' must be a positive number");

    return this._cast(value => truncate(value, length));
  }

  public replace(pattern: string | RegExp, replacement: string) {
    assert(isString(pattern) || (pattern instanceof RegExp), "'pattern' must be string or regex");
    assert(isString(replacement), "'replacement' must be an string");

    return this._cast(value => value.replace(pattern, replacement));
  }
}

export default StringType;
