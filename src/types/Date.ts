import AnyType from "./Any";

export default class DateType extends AnyType<Date, PossibleDate> {
  public max(max: PossibleDate | (() => PossibleDate)): this {
    const getMax = getDate(max);

    return this.pipe((value) => {
      const date = getMax();

      if (value <= date) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to be before or same as ${date}`
          : `Expected ${label} to be before or same as ${date}`,
      );
    });
  }

  public min(min: PossibleDate | (() => PossibleDate)): this {
    const getMin = getDate(min);

    return this.pipe((value) => {
      const date = getMin();

      if (value >= date) return value;

      const label = this._label;

      this.fail(
        label == null
          ? `Expected to be after or same as ${date}`
          : `Expected ${label} to be after or same as ${date}`,
      );
    });
  }

  protected initialValidator(value: unknown): Date {
    if (typeof value === "string" || typeof value === "number")
      value = new Date(value);

    if (value instanceof Date && value.toString() !== "Invalid Date")
      return value;

    const label = this._label;

    this.fail(
      label == null
        ? "Expected to be a valid date"
        : `Expected ${label} to be a valid date`,
    );
  }
}

function getDate(value: PossibleDate | (() => PossibleDate)): () => Date {
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);

    return () => date;
  }

  if (typeof value === "function") {
    return () => {
      const date = value();

      if (typeof date === "string" || typeof date === "number")
        return new Date(date);

      return date;
    };
  }

  return () => value;
}

export type PossibleDate = Date | string | number;
