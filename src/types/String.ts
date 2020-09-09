import AnyType from "./Any";

export default class StringType extends AnyType<string> {
  public alphanum(): this {
    return this.pipe((value) => {
      if (/^[a-zA-Z0-9]*$/.test(value)) return value;

      const label = this._label;

      this.fail(
        label == null
          ? "Expected to only contain a-z, A-Z, 0-9"
          : `Expected ${label} to only contain a-z, A-Z, 0-9`,
      );
    });
  }

  public creditCard(): this {
    return this.pipe((value) => {
      if (isCreditCard(value)) return value;

      const label = this._label;

      this.fail(
        label == null
          ? "Expected to be a valid credit-card"
          : `Expected ${label} to be a valid credit-card`,
      );
    });
  }

  public email(): this {
    return this.pipe((value) => {
      if (/^\w[\w.]+@\w+?\.[a-zA-Z]{2,3}$/.test(value)) return value;

      const label = this._label;

      this.fail(
        label == null
          ? "Expected to to be a valid email address"
          : `Expected ${label} to to be a valid email address`,
      );
    });
  }

  public enum(values: string[]): this {
    const type = JSON.stringify(values);

    return this.pipe((value) => {
      if (values.includes(value)) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to be one of ${type}`
          : `Expected ${label} to be one of ${type}`,
      );
    });
  }

  public ip(version?: 4 | 6): this {
    if (version === 4) {
      return this.pipe((value) => {
        if (ipv4Regex.test(value)) return value;

        const label = this._label;

        this.fail(
          label == null
            ? "Expected to be a valid ipv4 address"
            : `Expected ${label} to be a valid ipv4 address`,
        );
      });
    }

    if (version === 6) {
      return this.pipe((value) => {
        if (ipv6Regex.test(value)) return value;

        const label = this._label;

        this.fail(
          label == null
            ? "Expected to be a valid ipv6 address"
            : `Expected ${label} to be a valid ipv6 address`,
        );
      });
    }

    return this.pipe((value) => {
      if (ipv4Regex.test(value) || ipv6Regex.test(value)) return value;

      const label = this._label;

      this.fail(
        label == null
          ? "Expected to be a valid ip address"
          : `Expected ${label} to be a valid ip address`,
      );
    });
  }

  public length(length: number): this {
    return this.pipe((value) => {
      if (value.length === length) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to contain at most ${length} character(s)`
          : `Expected ${label} to contain at most ${length} character(s)`,
      );
    });
  }

  public max(max: number): this {
    return this.pipe((value) => {
      if (value.length <= max) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to contain exactly ${max} character(s)`
          : `Expected ${label} to contain exactly ${max} character(s)`,
      );
    });
  }

  public min(min: number): this {
    return this.pipe((value) => {
      if (value.length >= min) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to contain at least ${min} character(s)`
          : `Expected ${label} to contain at least ${min} character(s)`,
      );
    });
  }

  public numeral(): this {
    return this.pipe((value) => {
      if (/^\d$/.test(value)) return value;

      const label = this._label;

      this.fail(
        label == null
          ? "Expected to only contain numbers"
          : `Expected ${label} to only contain numbers`,
      );
    });
  }

  public regex(regex: RegExp): this {
    return this.pipe((value) => {
      if (regex.test(value)) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to match ${regex}`
          : `Expected ${label} to match ${regex}`,
      );
    });
  }

  public token(): this {
    return this.pipe((value) => {
      if (/^[a-zA-Z0-9_]*$/.test(value)) return value;

      const label = this._label;

      this.fail(
        label == null
          ? "Expected to only contain a-z, A-Z, 0-9, underline"
          : `Expected ${label} to only contain a-z, A-Z, 0-9, underline`,
      );
    });
  }

  protected initialValidator(value: unknown): string {
    if (typeof value === "string") return value;

    const label = this._label;

    this.fail(
      label == null
        ? "Expected to be a valid string"
        : `Expected ${label} to be a valid string`,
    );
  }
}

const ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

/**
 * using Luhn Algorithm
 */
function isCreditCard(code: string): boolean {
  code = code.replace(/[- ]/g, ""); // just in case

  const luhnArr = [
    [0, 2, 4, 6, 8, 1, 3, 5, 7, 9],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  ];

  const digits = code
    .split("") // splitting digits
    .map((digit) => +digit); // parsing digits into number type

  const sum = digits.reduce(
    (sum, digit, index) => sum + luhnArr[(digits.length - index) & 1][digit],
    0,
  );

  return sum % 10 === 0 && sum > 0;
}
