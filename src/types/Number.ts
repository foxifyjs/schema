import AnyType from "./Any";

export default class NumberType extends AnyType<number> {
  public integer(integer = true): this {
    if (integer) {
      return this.pipe((value) => {
        if (Number.isInteger(value)) return value;

        const label = this._label;

        this.fail(
          label == null
            ? "Expected to be an integer"
            : `Expected ${label} to be an integer`,
        );
      });
    }

    return this.pipe((value) => {
      if (!Number.isInteger(value)) return value;

      const label = this._label;

      this.fail(
        label == null
          ? "Expected to be a floating point"
          : `Expected ${label} to be a floating point`,
      );
    });
  }

  public max(max: number): this {
    return this.pipe((value) => {
      if (value <= max) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to be less than ${max}`
          : `Expected ${label} to be less than ${max}`,
      );
    });
  }

  public min(min: number): this {
    return this.pipe((value) => {
      if (value >= min) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to be greater than ${min}`
          : `Expected ${label} to be greater than ${min}`,
      );
    });
  }

  public multiple(multiplier: number): this {
    return this.pipe((value) => {
      if (value % multiplier === 0) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to be multiple of ${multiplier}`
          : `Expected ${label} to be multiple of ${multiplier}`,
      );
    });
  }

  public port(): this {
    return this.pipe((value) => {
      if (value >= 0 && value <= 65535) return value;

      const label = this._label;

      this.fail(
        label == null
          ? "Expected to be a valid port (0 - 65535)"
          : `Expected ${label} to be a valid port (0 - 65535)`,
      );
    });
  }

  public positive(positive = true): this {
    if (positive) {
      return this.pipe((value) => {
        if (value >= 0) return value;

        const label = this._label;

        this.fail(
          label == null
            ? "Expected to be a positive number"
            : `Expected ${label} to be a positive number`,
        );
      });
    }

    return this.pipe((value) => {
      if (value < 0) return value;

      const label = this._label;

      this.fail(
        label == null
          ? "Expected to be a negative number"
          : `Expected ${label} to be a negative number`,
      );
    });
  }

  public precision(precision: number): this {
    return this.pipe((value) => {
      if ((`${value}`.split(".")[1] || "").length <= precision) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to have at most ${precision} decimal places`
          : `Expected ${label} to have at most ${precision} decimal places`,
      );
    });
  }

  protected initialValidator(value: unknown): number {
    if (typeof value === "number") return value;

    const label = this._label;

    this.fail(
      label == null
        ? "Expected to be a valid number"
        : `Expected ${label} to be a valid number`,
    );
  }
}
